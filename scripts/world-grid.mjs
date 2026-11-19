// Rasterise the world's countries onto a coarse grid in the Equal Earth
// projection, for the dot-matrix map in /travel. The output is committed, so
// this only needs running again to change the grid size:
//
//   node scripts/world-grid.mjs
//
// Writes src/terminal/world-grid.json:
//   names    country names, indexed by the ids below
//   runs     per row, flat [start column, length, country id, ...] triples
//   markers  [column, row, id] for countries too small to own a cell, placed
//            at their centroid so they can still be lit up and hovered
import fs from "node:fs";
import path from "node:path";
import { geoBounds, geoCentroid, geoContains, geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import topology from "world-atlas/countries-50m.json" with { type: "json" };

const COLS = 128;

// Natural Earth abbreviates some names to fit on a printed map.
const RENAME = {
  "Antigua and Barb.": "Antigua and Barbuda",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "Central African Rep.": "Central African Republic",
  "Dem. Rep. Congo": "DR Congo",
  "Dominican Rep.": "Dominican Republic",
  "Eq. Guinea": "Equatorial Guinea",
  "Falkland Is.": "Falkland Islands",
  "Fr. S. Antarctic Lands": "French Southern Lands",
  Macedonia: "North Macedonia",
  "N. Cyprus": "Northern Cyprus",
  "S. Geo. and the Is.": "South Georgia",
  "S. Sudan": "South Sudan",
  "Solomon Is.": "Solomon Islands",
  "St. Vin. and Gren.": "St. Vincent and the Grenadines",
  "United States of America": "United States",
  Vatican: "Vatican City",
  "W. Sahara": "Western Sahara",
  eSwatini: "Eswatini",
};

const countries = feature(topology, topology.objects.countries).features;
const names = countries.map((c) => RENAME[c.properties.name] ?? c.properties.name);

// Fit the whole sphere into a COLS-wide box, one unit per cell.
const projection = geoEqualEarth().fitWidth(COLS, { type: "Sphere" });
const [[, top], [, bottom]] = geoPath(projection).bounds({ type: "Sphere" });
const ROWS = Math.round(bottom - top);
projection.translate([projection.translate()[0], projection.translate()[1] - top]);

const bounds = countries.map((c) => geoBounds(c));
const inBox = (b, [lon, lat]) =>
  lat >= b[0][1] &&
  lat <= b[1][1] &&
  (b[0][0] <= b[1][0] ? lon >= b[0][0] && lon <= b[1][0] : lon >= b[0][0] || lon <= b[1][0]);

const grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(-1));
const owned = new Set();
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const p = projection.invert([c + 0.5, r + 0.5]);
    if (!p || !Number.isFinite(p[0])) continue;
    // invert() wraps points outside the sphere back onto it; drop those.
    const [x, y] = projection(p);
    if (Math.abs(x - c - 0.5) > 0.01 || Math.abs(y - r - 0.5) > 0.01) continue;
    const id = countries.findIndex((f, i) => inBox(bounds[i], p) && geoContains(f, p));
    if (id >= 0) {
      grid[r][c] = id;
      owned.add(id);
    }
  }
}

const runs = grid.map((row) => {
  const out = [];
  for (let c = 0; c < COLS; c++) {
    if (row[c] < 0) continue;
    const start = c;
    while (c + 1 < COLS && row[c + 1] === row[start]) c++;
    out.push(start, c - start + 1, row[start]);
  }
  return out;
});

const markers = [];
countries.forEach((f, id) => {
  if (owned.has(id)) return;
  const [x, y] = projection(geoCentroid(f));
  markers.push([Math.floor(x), Math.floor(y), id]);
});

const out = path.resolve(import.meta.dirname, "../src/terminal/world-grid.json");
fs.writeFileSync(out, JSON.stringify({ cols: COLS, rows: ROWS, names, runs, markers }) + "\n");
console.log(`${COLS}×${ROWS}, ${owned.size} countries with cells, ${markers.length} markers → ${path.relative(process.cwd(), out)}`);
