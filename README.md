# node-sisp-docs

Documentation site for [@akira-io/sisp](https://github.com/akira-io/node-sisp), built with Astro. The site mirrors the `docs` tree of the local node-sisp package and publishes it as a searchable documentation site.

## How the mirror works

The Markdown under `_docs_src` is a copy of `docs` from the node-sisp repository. `scripts/sync-docs.mjs` transforms it into Astro content under `src/content/docs`:

- adds frontmatter from the first heading and numeric prefix,
- removes the original page heading and manual navigation footers,
- rewrites internal Markdown links to site routes,
- skips source index pages and superpowers planning files so navigation stays focused on guides and examples.

The generated `src/content/docs` tree is committed so the site can build without the package checkout present.

## Refreshing the docs

```sh
rsync -a --delete --exclude superpowers /Users/kid/Packages/Node/node-sisp/docs/ _docs_src/
npm run sync
```

To pull from a checkout elsewhere, set `NODE_SISP_DOCS`:

```sh
NODE_SISP_DOCS=/path/to/node-sisp/docs npm run sync
```

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist
```

## Deployment

Deploy as a static Astro build with `npm run build` and `dist` as output.
