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

## Project layout

- `src/pages/`: page components. Only the contact page is routed at the moment (see `src/App.tsx`).
- `src/components/`: nav bar, footer, markdown renderer and SVG logos.
- `src/shared/content.tsx`: all site text, links and portfolio entries.
- `src/shared/colours.tsx`: the colour palette.
- `index.html`: the HTML entry point.
- `public/`: static assets and `CNAME`.

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages. You can also start it by hand from the Actions tab. The custom domain comes from `public/CNAME`.
