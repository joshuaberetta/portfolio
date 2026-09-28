import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { parse } from "yaml";

const ASSETS_DIR = path.resolve(import.meta.dirname, "assets");

// Keys in content.yaml whose values name a file inside assets/.
const ASSET_KEYS = new Set(["image", "file"]);

/**
 * Describe why an asset can't be used, or return null if it's fine.
 *
 * Compares against the real directory listing rather than using existsSync,
 * so a case mismatch is caught on macOS too. It would still 404 on the
 * case-sensitive filesystem GitHub Pages is built on.
 */
function assetProblem(name: string): string | null {
  const full = path.join(ASSETS_DIR, name);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir))
    return `directory ${path.relative(ASSETS_DIR, dir)}/ does not exist`;
  const siblings = fs.readdirSync(dir);
  const base = path.basename(full);
  if (siblings.includes(base)) return null;
  const caseMatch = siblings.find(
    (s) => s.toLowerCase() === base.toLowerCase()
  );
  return caseMatch
    ? `name differs by case, the file on disk is '${caseMatch}'`
    : "file not found";
}

/**
 * Load content.yaml as a JS module. File names under `image`/`file` keys are
 * swapped for imports, so Vite bundles the assets and the site gets their
 * final URLs. `file` entries also get a `fileName` for the download name.
 */
function yamlContent(): Plugin {
  return {
    name: "yaml-content",
    transform(source, id) {
      if (!id.endsWith(".yaml")) return null;

      const imports: string[] = [];
      const problems: string[] = [];
      const walk = (node: unknown): unknown => {
        if (Array.isArray(node)) return node.map(walk);
        if (node === null || typeof node !== "object") return node;
        const out: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(node)) {
          if (ASSET_KEYS.has(key) && typeof value === "string") {
            const problem = assetProblem(value);
            if (problem) problems.push(`  assets/${value}: ${problem}`);
            imports.push(JSON.stringify(path.join(ASSETS_DIR, value)));
            out[key] = `__asset_${imports.length - 1}__`;
            if (key === "file") out.fileName = path.basename(value);
          } else {
            out[key] = walk(value);
          }
        }
        return out;
      };
      const content = walk(parse(source));

      if (problems.length) {
        this.error(
          `${path.basename(id)} names assets that can't be found:\n${problems.join("\n")}`
        );
      }

      const body = JSON.stringify(content, null, 2).replace(
        /"__asset_(\d+)__"/g,
        "asset$1"
      );
      return {
        code:
          imports.map((p, i) => `import asset${i} from ${p};`).join("\n") +
          `\nexport default ${body};\n`,
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), yamlContent()],
  // keep CRA's output folder so the Pages workflow is unchanged
  build: { outDir: "build" },
});
