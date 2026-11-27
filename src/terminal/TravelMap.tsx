import React, { useMemo, useState } from "react";

import { NAMES, Place, Status, WORLD, placesOf } from "./travel";

// The world as a grid of country ids in the Equal Earth projection, built by
// scripts/world-grid.mjs. -1 is sea.
const { cols: COLS, rows: ROWS } = WORLD;
const BASE: number[][] = WORLD.runs.map((runs) => {
  const row = new Array(COLS).fill(-1);
  for (let i = 0; i < runs.length; i += 3) {
    row.fill(runs[i + 2], runs[i], runs[i] + runs[i + 1]);
  }
  return row;
});

// How far (in cells) a pointer may miss a lit country and still pick it, so
// islands and tiny states can be hit on a phone.
const REACH = 2;

// How far (in cells) a tiny country's marker may move from its centre to
// avoid hiding a neighbour.
const MARKER_REACH = 2;

interface TravelMapProps {
  lived: string[];
  visited: string[];
  touch: boolean;
}

/** A dot-matrix world map: where I've lived, where I've been. */
const TravelMap: React.FC<TravelMapProps> = ({ lived, visited, touch }) => {
  const places: Map<number, Place> = useMemo(
    () => placesOf({ lived, visited }),
    [lived, visited]
  );

  // Countries too small for a cell of their own get one near their centre,
  // but only when they're on the map, so they don't punch holes in others.
  const grid = useMemo(() => {
    const g = BASE.map((row) => [...row]);
    const cellCount = new Map<number, number>();
    for (const id of g.flat()) cellCount.set(id, (cellCount.get(id) ?? 0) + 1);
    for (const [c, r, id] of WORLD.markers) {
      if (!places.has(id)) continue;
      // The nearest cell whose owner can spare it: sea, a country that isn't
      // lit, or a lit one with other cells left. Cells of lit countries cost
      // a little extra, so a marker would rather sit in the sea beside them.
      let best: [number, number] | null = null;
      let bestScore = Infinity;
      for (let dr = -MARKER_REACH; dr <= MARKER_REACH; dr++) {
        for (let dc = -MARKER_REACH; dc <= MARKER_REACH; dc++) {
          const owner = g[r + dr]?.[c + dc];
          if (owner === undefined) continue;
          const lit = places.has(owner);
          if (lit && (cellCount.get(owner) ?? 0) <= 1) continue;
          const score = Math.hypot(dr, dc) + (lit ? 0.75 : 0);
          if (score < bestScore) [best, bestScore] = [[r + dr, c + dc], score];
        }
      }
      if (!best) continue;
      const [br, bc] = best;
      const owner = g[br][bc];
      cellCount.set(owner, (cellCount.get(owner) ?? 0) - 1);
      g[br][bc] = id;
      cellCount.set(id, (cellCount.get(id) ?? 0) + 1);
    }
    return g;
  }, [places]);

  const [hover, setHover] = useState<number | null>(null);

  /** The country under a pointer, or the nearest lit one within reach. */
  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * COLS;
    const y = ((e.clientY - box.top) / box.height) * ROWS;
    const c = Math.floor(x);
    const r = Math.floor(y);
    const here = grid[r]?.[c] ?? -1;
    if (places.has(here)) return here;
    let best = here >= 0 ? here : null;
    let bestD = Infinity;
    for (let dr = -REACH; dr <= REACH; dr++) {
      for (let dc = -REACH; dc <= REACH; dc++) {
        const id = grid[r + dr]?.[c + dc] ?? -1;
        const d = Math.hypot(c + dc + 0.5 - x, r + dr + 0.5 - y);
        if (places.has(id) && d < bestD && d <= REACH + 0.5) {
          best = id;
          bestD = d;
        }
      }
    }
    return best;
  };

  // One rect per land cell, grouped by country so a hover lights it all up.
  const countries = useMemo(() => {
    const cells = new Map<number, React.ReactNode[]>();
    grid.forEach((row, r) =>
      row.forEach((id, c) => {
        if (id < 0) return;
        if (!cells.has(id)) cells.set(id, []);
        cells.get(id)!.push(
          <rect key={`${c},${r}`} x={c + 0.1} y={r + 0.1} width={0.8} height={0.8} />
        );
      })
    );
    return [...cells.entries()];
  }, [grid]);

  const livedCount = [...places.values()].filter((p) => p.status === "lived").length;
  const visitedCount = places.size - livedCount;
  const shown = hover !== null ? places.get(hover) : undefined;
  const sorted = (status: Status) =>
    [...places.entries()]
      .filter(([, p]) => p.status === status)
      .map(([id]) => NAMES[id])
      .sort();

  return (
    <figure className="travel">
      <svg
        className="travel-map"
        viewBox={`0 0 ${COLS} ${ROWS}`}
        aria-hidden="true"
        onPointerMove={(e) => setHover(pick(e))}
        onPointerDown={(e) => setHover(pick(e))}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setHover(null);
        }}
      >
        {countries.map(([id, rects]) => (
          <g
            key={id}
            className={[
              places.get(id)?.status ?? "land",
              id === hover && "on",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {rects}
          </g>
        ))}
      </svg>

      <figcaption>
        <div className="travel-info" aria-live="polite">
          {hover !== null ? (
            <>
              <span className="accent">›</span> <span className="b">{NAMES[hover]}</span>
              {shown ? (
                <span className="dim">
                  {" "}
                  · {shown.status}
                  {shown.note && ` · ${shown.note}`}
                </span>
              ) : (
                <span className="dim"> · not yet</span>
              )}
            </>
          ) : (
            <span className="dim">
              {touch ? "tap" : "hover"} a country
            </span>
          )}
        </div>
        <div className="travel-legend">
          <span>{places.size} countries and territories</span>
          <span>
            <span className="swatch lived">■</span> lived · {livedCount}
          </span>
          <span>
            <span className="swatch visited">■</span> visited · {visitedCount}
          </span>
          <span>
            <span className="swatch land">■</span> not yet
          </span>
        </div>
      </figcaption>

      <div className="sr-only">
        <p>Lived in: {sorted("lived").join(", ")}.</p>
        <p>Visited: {sorted("visited").join(", ")}.</p>
      </div>
    </figure>
  );
};

export default TravelMap;
