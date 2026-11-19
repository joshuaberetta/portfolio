# Portfolio

Source for [joshuaberetta.com](https://joshuaberetta.com), my personal portfolio site.

A single page styled as a terminal app running in tmux: pick a section from the slash-command menu (arrows, number keys, typing or tapping) and its text streams in. Built with React and TypeScript, bundled with Vite. Hosted on GitHub Pages.

## Running locally

Requires Node 22.22 or later.

```sh
npm install
npm run dev
```

The dev server runs at [http://localhost:5173](http://localhost:5173) and reloads on save.

To build a production bundle into `build/`:

```sh
npm run build
npm run preview  # serve the build locally
```

`npm run build` type-checks with `tsc` before bundling.

## Editing content

Everything on the page lives in [`src/content.yaml`](src/content.yaml). Edit that file; no code changes are needed.

- Each entry under `sections` becomes a `/command` in the menu. `body` is light markdown: `**bold**`, `*italic*`, `` `code` ``, `[text](url)`, `- ` bullets and blank-line paragraph breaks.
- Downloads go under a section's `files`, each with a `file` in `assets/` and a `label`.
- A section's `map` draws a dot-matrix world map under its body (used by `/travel`): `lived` and `visited` are country names, and `"Country (note)"` adds a note shown on hover. A name the map doesn't know fails the build and suggests close matches. `/travel list` lists them by continent, with counts.
- `intro` is the question typed in on first load and which section answers it. A link like `/#research` opens that section instead.
- Put images and PDFs in `assets/` and refer to them by file name in an `image:` or `file:` field. Spaces in names are fine.
- The build fails if a named file is missing or its capitalisation doesn't match the file on disk, so a broken link never gets deployed.

With `npm run dev` running, changes to `content.yaml` show up in the browser straight away.

## Project layout

- `src/terminal/`: the terminal page: `Tmux.tsx` (pane layout, `ctrl+b` keys, theme and status bar), `Pane.tsx` (one session: menu, keyboard and streaming), `PixelAvatar.tsx` (pixelates the profile photo on a canvas), `Response.tsx`, `Spinner.tsx`, `StatusBar.tsx` and the markdown parser.
- `src/terminal/TravelMap.tsx`: the `/travel` map. It draws `src/terminal/world-grid.json`, a coarse grid of countries in the Equal Earth projection with each country's continent, made by `node scripts/world-grid.mjs` from Natural Earth and `world-countries` data, with the UK split into England, Scotland, Wales and Northern Ireland (`scripts/uk-nations.json`). `src/terminal/travel.ts` reads the places and builds `/travel list`. Rerun that only to change the grid size.
- `src/terminal/shell.ts`: the hidden shell commands (`help`, `ls`, `cat`, `sudo`, `vim`, `neofetch`…). Add one by adding an entry to `COMMANDS`.
- `src/terminal/themes.ts`: theme names for `/theme`; their colours are CSS variables in `src/index.css`.
- `src/content.yaml`: all site text (see above).
- `src/index.css`: styles and the colour palette (CSS variables at the top).
- `assets/`: profile picture and research PDFs referenced from `content.yaml`.
- `index.html`: the HTML entry point.
- `public/`: static assets and `CNAME`.

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages. You can also start it by hand from the Actions tab. The custom domain comes from `public/CNAME`.
