# RepSmasher

A simple fitness tracker built with React and Vite.

## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

## Production build / GitHub Pages

The project uses the `gh-pages` branch for deployment. Build and publish with:

```bash
npm run deploy
```

This command runs the build for you and publishes the contents of `dist/` to the
`gh-pages` branch of `https://github.com/joshbrodeur/RepSmasher.git`. The site
will be available at `https://joshbrodeur.github.io/RepSmasher/`.

For any production deployment, serve the generated output from the `dist/`
directory (or the committed `docs/` folder) instead of the raw source files.
If you temporarily serve unbuilt `.jsx` files, configure your HTTP server to
respond with `text/javascript` for those files or rename/transpile the entry
file to use a `.js` extension.
