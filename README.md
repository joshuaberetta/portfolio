# Portfolio

Source for [joshuaberetta.com](https://joshuaberetta.com), my personal portfolio site.

Built with React, TypeScript and MUI, bundled with Vite. Hosted on GitHub Pages.

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

The profile, research and footer links live in [`src/content.yaml`](src/content.yaml). Edit that file; no code changes are needed.

- Put images and PDFs in `assets/`, then refer to them by file name in an `image:` or `file:` field. Spaces in names are fine.
- To add a research item, add another entry under `research.items` with a `title`, an optional `detail` line, the PDF `file` and the `button` text.
- The build fails if a named file is missing or its capitalisation doesn't match the file on disk, so a broken link never gets deployed.

With `npm run dev` running, changes to `content.yaml` show up in the browser straight away.

## Project layout

- `src/pages/`: page components. Only the contact page is routed at the moment (see `src/App.tsx`).
- `src/components/`: nav bar, footer, markdown renderer and SVG logos.
- `src/content.yaml`: profile, research and footer links (see above).
- `src/shared/content.tsx`: portfolio entries and the unused About page text.
- `assets/`: profile picture and research PDFs referenced from `content.yaml`.
- `src/shared/colours.tsx`: the colour palette.
- `index.html`: the HTML entry point.
- `public/`: static assets and `CNAME`.

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages. You can also start it by hand from the Actions tab. The custom domain comes from `public/CNAME`.
