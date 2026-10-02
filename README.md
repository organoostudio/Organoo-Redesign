# Organoo Studio — organoostudio.com

The company-profile website for Organoo Studio, a digital agency from Jakarta. A static site with real, pre-rendered URLs for every page (History API routing on top) with cinematic scroll scenes, deployed on Cloudflare.

Brand: ink `#0B0D0C`, emerald `#1FAE5E`, mint `#96E1B9`, paper `#FFFFFF`. Type: Plus Jakarta Sans + IBM Plex Mono.

## Structure

```
src/
  head.html     <head>: title, SEO, Open Graph, fonts, structured data
  style.css     all styles
  shell.html    loader, nav, menu, cursor, SVG symbols
  data.js       services, case studies, concept demos, journal posts, team
  engine.js     router, page transitions, loader, smooth scroll, scene engine
  pages.js      every page + the home scroll scenes
content/blog/   Journal articles (Markdown) -> static pages at /blog/<slug>/ — see content/blog/README.md
public/         copied as-is to the site root (images, favicon, og.jpg, robots, _headers)
scripts/
  build.mjs       pre-renders every route to dist/<path>/index.html, writes hashed /assets/ CSS+JS, copies public/ — no dependencies
  blog.mjs        builds /blog/, article pages, RSS, sitemap.xml and llms.txt from content/blog/
  blog-cover.mjs  turns a stock photo into the compressed WebP/JPEG cover set
  blog-check.mjs  article quality gate (`npm run blog:check`)
  blog-ping.mjs   IndexNow ping for new URLs
  sync-demos.mjs  pulls the nine concept demos from organoostudio/Dummy-Project into public/demos/
archive/prototypes/   earlier design rounds (not deployed)
```

Pages: `/` · `/work/` (+ `/work/<slug>/` case studies) · `/services/` (+ 5 `/services/<slug>/` pages) · `/about/` · `/contact/`, and the Journal at `/blog/`. Concept demos are served at `/demos/<slug>/`.

## Build

```bash
npm run build      # runs sync-demos, then writes the site to ./dist
DEMOS_SKIP=1 npm run build   # build without re-cloning the demos
```

Node 18+ only — there are no npm packages to install.

## Deploy (Cloudflare)

**Cloudflare Pages** (Workers & Pages → Create → Pages → Connect to Git → this repo):

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION` = `20` |

Every push to `main` redeploys. Add `organoostudio.com` and `www.organoostudio.com` under the project's **Custom domains** tab once the domain uses Cloudflare nameservers.

If the project is created as a **Worker** instead (Import a repository), keep build command `npm run build` and deploy command `npx wrangler deploy` — `wrangler.jsonc` points it at `dist`.

## Content still to fill in

Text in `[brackets]` is placeholder: prices, years, live URLs, testimonials, team names/photos and the Video case study.
