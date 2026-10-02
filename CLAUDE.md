# Organoo Studio website — working rules

This repo **is** the live site **organoostudio.com**.

## How revisions go live

1. Edit the code **in this repo** (`organoostudio/Organoo-Redesign`) — the source of truth.
   Never treat an artifact/prototype copy as the source; changes there do not reach the live site.
2. Build and check locally: `DEMOS_SKIP=1 npm run build`, then serve `dist/` and look at the result.
3. Commit and **push to `main`**.
4. Cloudflare (Worker `organoo-redesign`, Workers Builds) builds `npm run build` and deploys
   `npx wrangler deploy` automatically — the live site updates in about 1–2 minutes.
5. After deploying, verify on https://organoostudio.com/ and tell the owner it is live.

If the owner asks to **preview first**, push to a separate branch instead of `main`
(Cloudflare creates a Worker Preview URL), and merge to `main` only after approval.

## Where things are

- `src/` — the site: `head.html`, `style.css`, `shell.html`, `data.js` (services, cases, demos, posts, team),
  `engine.js` (router, loader, scroll engine), `pages.js` (all pages + home scenes).
- `public/` — copied to the site root (images in `public/img/`).
- `scripts/build.mjs` builds `dist/`; `scripts/sync-demos.mjs` pulls the concept demos from
  `organoostudio/Dummy-Project` into `/demos/<slug>/` at build time.
- `wrangler.jsonc` — `name` must stay `organoo-redesign` (must match the Cloudflare Worker name).
- `archive/prototypes/` — old design rounds, not deployed.

## Content rules

- Only use real numbers and client facts (e.g. 11× ROAS Dasindo, 1,200+ conversions Batu Panorama,
  +97.8% leads). Never invent metrics, clients or testimonials — use `[placeholder]` brackets instead.
- Brand: Plus Jakarta Sans + IBM Plex Mono; ink `#0B0D0C`, emerald `#1FAE5E`, mint `#96E1B9`.
- The owner does not want overlays/labels in the screen corners (no HUD).
