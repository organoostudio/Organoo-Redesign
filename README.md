# Organoo Studio — organoostudio.com

The company-profile website for Organoo Studio, a digital agency from Jakarta. A static, single-page site (hash-routed pages) with cinematic scroll scenes, deployed on Cloudflare.

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
public/         copied as-is to the site root (images, favicon, og.jpg, robots, sitemap, _headers)
scripts/
  build.mjs       assembles dist/index.html and copies public/ — no dependencies
  sync-demos.mjs  pulls the nine concept demos from organoostudio/Dummy-Project into public/demos/
archive/prototypes/   earlier design rounds (not deployed)
```

Pages: Home · Work (+ case studies) · Services (+ 5 service pages) · About · Journal · Contact. Concept demos are served at `/demos/<slug>/`.

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
