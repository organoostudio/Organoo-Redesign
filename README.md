# Organoo Redesign

Website redesign for [organoostudio.com](https://organoostudio.com) — Organoo Studio, a digital agency in Malang, East Java — built as a static [Astro](https://astro.build) site and deployed on Cloudflare Pages.

Brand: black `#0A0A0A`, white `#FFFFFF`, emerald `#2AA36B`. Type: Manrope + Instrument Serif.

## What's here

| Path | What it is |
| --- | --- |
| `/` | The live site — the **Motion** direction, wrapped in an Astro layout that owns the `<head>` (SEO, canonical, Open Graph, sitemap). |
| `/previews/` | A gallery linking to all four prototypes. |
| `/previews/motion/` | **Motion** — enhanced motion layer: scroll-scrubbed hero video, gradient-blur nav, curtain footer wordmark. Current direction. |
| `/previews/home/` | **Home** — the home page on its own, hero-focused. |
| `/previews/website/` | **Website** — option 1 baseline, all pages. |
| `/previews/growth-lab/` | **Growth Lab** — option 2, alternate palette (reference). |

Portfolio demo sites (nine dummy client websites) live in [`dummy-projects/`](dummy-projects/). They are not part of the Astro build.

The four prototypes live under `public/previews/` as self-contained static sites. The Astro home page (`src/pages/index.astro`) reads the Motion prototype at build time and lifts its markup, styles and script into the shared layout.

## Project structure

```
astro.config.mjs        # static output, site URL, sitemap
src/
  layouts/BaseLayout.astro   # <head>: title, description, canonical, OG, fonts, sitemap
  pages/
    index.astro              # live site (built from the Motion prototype)
    previews/index.astro     # prototype gallery
public/
  previews/{motion,home,website,growth-lab}/   # the four prototypes + their assets
```

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # serve the built site locally
```

Requires Node 18+.

## Deploy — Cloudflare Pages

The site is a plain static build, so no adapter is needed. Connect this repo to
Cloudflare Pages (Workers & Pages → Create → Pages → Connect to Git) with:

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | set env var `NODE_VERSION` = `20` |

Every push to `main` then builds and deploys automatically. Set a custom domain
(organoostudio.com) from the Pages project's **Custom domains** tab, and set the
`SITE_URL` environment variable to the production URL so canonical links and the
sitemap match.

## Next steps

- Split the Motion SPA's hash routes (`#about`, `#services`, `#work`, …) into real
  Astro pages so each has its own URL and meta for SEO.
- Replace the placeholder hero video (currently a non-licensed clip) with licensed
  HD/4K stock footage before launch.
- Add an Indonesian (`/id/`) locale.

## Media note

The hero video is a placeholder from a non-licensed source. Replace it with
licensed footage before this goes public.
