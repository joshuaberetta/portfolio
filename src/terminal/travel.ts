// Places from a section's `map` in content.yaml, shared by the /travel map
// and the `/travel list` command.
import WORLD from "./world-grid.json";
import { Section } from "../shared/siteContent";

export { WORLD };
export const NAMES: readonly string[] = WORLD.names;
export const CONTINENTS: readonly string[] = WORLD.continents;

export type Status = "lived" | "visited";

export interface Place {
  status: Status;
  /** Cities or regions, from "Country (note)" in content.yaml. */
  note?: string;
}

/** "Sweden (Stockholm)" → ["Sweden", "Stockholm"] */
function splitPlace(entry: string): [string, string | undefined] {
  const m = entry.match(/^(.*?)\s*\((.+)\)\s*$/);
  return m ? [m[1], m[2]] : [entry.trim(), undefined];
}

/** Places by country id. Lived wins over visited for a country in both. */
export function placesOf(map: NonNullable<Section["map"]>): Map<number, Place> {
  const out = new Map<number, Place>();
  for (const [status, list] of [["visited", map.visited], ["lived", map.lived]] as const) {
    for (const entry of list ?? []) {
      const [name, note] = splitPlace(entry);
      const id = NAMES.indexOf(name);
      if (id >= 0) out.set(id, { status, note });
    }
  }
  return out;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Every place as markdown, grouped by continent, biggest group first. */
export function travelList(map: NonNullable<Section["map"]>): string {
  const places = placesOf(map);
  const groups = new Map<string, number[]>();
  for (const id of places.keys()) {
    const continent = CONTINENTS[id];
    groups.set(continent, [...(groups.get(continent) ?? []), id]);
  }
  const lived = [...places.values()].filter((p) => p.status === "lived").length;
  const out = [
    `**${places.size} countries and territories · ${plural(groups.size, "continent", "continents")}**`,
    `*lived in ${lived}, visited ${places.size - lived}*`,
  ];
  const sorted = [...groups.entries()].sort(
    ([a, x], [b, y]) => y.length - x.length || a.localeCompare(b)
  );
  for (const [continent, ids] of sorted) {
    out.push("", `**${continent}** · ${ids.length}`);
    for (const id of ids.sort((a, b) => NAMES[a].localeCompare(NAMES[b]))) {
      const { status, note } = places.get(id)!;
      out.push(
        `- ${NAMES[id]}${status === "lived" ? " · *lived*" : ""}${note ? ` · ${note}` : ""}`
      );
    }
  }
  return out.join("\n");
}
