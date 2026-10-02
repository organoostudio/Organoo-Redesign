# Organoo Journal — publishing playbook

This folder is the blog at **organoostudio.com/blog/**. Every `*.md` file here (except this README and
files starting with `_`) is one article; `scripts/blog.mjs` turns it into a fast static page at
`/blog/<file-name>/` with schema, RSS, sitemap and `llms.txt` entries. No CMS, no JavaScript on blog pages.

The posting routine follows this file. A person can follow it too.

## Cadence

- **2 new articles a week** (Tuesday and Friday, 09:00 WIB). Consistency beats volume: two genuinely
  useful 1,500–2,500-word guides a week is roughly 100 articles a year, enough to build topical authority
  without thin content.
- **Refresh instead of writing new** on the first Friday of each month once there are 8+ articles:
  pick the article whose facts, prices or platform features have aged the most, update it, set `updated:`.

## Pick the topic

1. Take the first unchecked line in [`_topics.md`](./_topics.md). When fewer than 6 remain, research and
   add 10 more (see "Topic research").
2. Search the keyword (WebSearch) and read the top results before writing: note the search intent
   (guide, comparison, price, definition), the questions in "People also ask", and what every top result
   misses. The article must answer the intent better and add something the others lack.
3. Skip a topic if it overlaps an existing article — update that article instead.

### Topic research

Organoo sells: UI/UX design, website development, performance ads (Meta, Google, Amazon, Shopee/Tokopedia
marketplace ads), graphic design & branding, video editing. Audience: business owners and marketers,
mostly in Indonesia, reading in English. Favour:

- long-tail, specific queries a young domain can win (`how much does a company profile website cost in indonesia`,
  `meta ads vs google ads for restaurants`, `what to include in a brand guideline`);
- questions people ask AI assistants ("what is…", "how do I…", "X vs Y", "best way to…");
- clusters: several articles around each service, linking to each other.

Write each new line in `_topics.md` as `- [ ] primary keyword — working title — intent`.

## Write the article

Full English, plain and confident, for a smart business owner (not a designer or marketer). Short
paragraphs (2–4 sentences), active voice, no filler intros ("In today's digital world…"), no hype.

**Structure (in this order):**

1. Front matter (below). `summary` is a 40–60-word direct answer to the title's question — it shows in
   a "Quick answer" box and is what answer engines quote. Make it self-contained.
2. Opening paragraph: restate the answer in one or two sentences with the primary keyword in the first
   100 words, then say what the reader will get.
3. 5–8 `##` sections. Phrase most as the questions people actually search. Start each section with a
   one- or two-sentence answer, then the detail. Use `###` for sub-points.
4. At least one table (comparison, prices, checklist) or numbered step list — both rank as snippets.
5. A short "how we approach it at Organoo" angle where it truly applies: practical process, what to ask an
   agency, mistakes to avoid. Never invent clients, metrics, quotes or testimonials. Approved real facts:
   11× ROAS for Dasindo, 1,200+ conversions for Batu Panorama, +97.8% leads. Use nothing else as a claim.
6. `## Frequently asked questions` with 3–5 `### Question?` entries, each answered in 2–4 sentences
   (this becomes FAQPage schema).
7. A one-paragraph conclusion with a soft call to action (the page already adds a contact box).

**Facts and sources.** Any number, price, statistic or platform rule needs a source link to an
authoritative page (official docs such as Google, Meta, Shopee, or a reputable study) or must be clearly
labelled as an estimate with a date ("as of October 2026, typical Jakarta agency prices range…"). Prices in
IDR with the USD equivalent in brackets when useful.

**Links.** 2–4 internal links to other `/blog/<slug>/` articles where relevant (check the files exist),
plus one link to the matching service: `/#service-uiux`, `/#service-web`, `/#service-ads`,
`/#service-graphic`, `/#service-video`, or `/#contact`. At least one external source. Descriptive anchor
text, never "click here".

**Length.** 1,500–2,500 words of substance. Longer only when the topic needs it.

## Front matter

```
---
title: How Much Does a Website Cost in Indonesia in 2026?      # ≤ 65 chars, keyword near the start
description: Website prices in Indonesia explained — …          # 110–160 chars, a reason to click
summary: A company profile website in Indonesia typically …     # 40–60 words, the direct answer
date: 2026-10-06                                                # publish date, YYYY-MM-DD (WIB)
updated: 2026-10-06                                             # change when refreshed
category: Website                                               # Website · UI/UX · Ads · Design · Video · Marketing
keyword: website cost in indonesia                              # the one primary keyword
tags: web design, pricing, indonesia                            # 2–5
word: Budget                                                    # 1–2 words for the card art if there is no cover
coverAlt: Laptop on a desk showing a website wireframe          # describe the photo
coverCredit: Jane Doe                                           # photographer
coverCreditUrl: https://unsplash.com/photos/abc123              # the photo's page
coverSource: Unsplash                                           # Unsplash or Pexels
---
```

The file name is the URL slug: 3–6 lowercase words with the core keyword (`website-cost-indonesia.md`).
Never rename a published file — it changes the URL. Optional: `seoTitle:` to override the `<title>`,
`draft: true` to keep it unpublished, `cover: none` to use the brand art instead of a photo.

## Cover image

Use a free-license stock photo, never an AI image of real people or a photo with visible brand logos.

1. Find one: WebFetch `https://unsplash.com/s/photos/<query>?license=free` (skip anything marked
   Unsplash+), or `https://www.pexels.com/search/<query>/`. Pick a calm, uncluttered, relevant photo that
   reads well when cropped to 1200×630 and that is different from recent covers.
2. Compress it into the three sizes the site uses:
   `node scripts/blog-cover.mjs <slug> "https://unsplash.com/photos/<id>/download?force=true"`
   (Pexels: `https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?w=2400`). Add a gravity
   (`north`, `south`…) as a third argument if the subject gets cropped.
3. Fill `coverAlt`, `coverCredit`, `coverCreditUrl`, `coverSource`. Unsplash and Pexels licences do not
   require credit, but we credit the photographer anyway.

Budget: ≤ 110 KB for the 1200 px WebP, ≤ 45 KB for the 640 px WebP — the script enforces it. If the
photo cannot be downloaded, publish without it (the brand card art is used) and add the cover next run.

## Publish

```
npm run blog:check            # must show 0 errors; read the warnings
DEMOS_SKIP=1 npm run build    # builds dist/; open dist/blog/<slug>/index.html to eyeball it
git add content/blog public/blog && git commit -m "Journal: <title>" && git push origin main
node scripts/blog-ping.mjs /blog/<slug>/   # IndexNow ping (Bing, ChatGPT search, Copilot)
```

Cloudflare deploys `main` in 1–2 minutes. Then confirm `https://organoostudio.com/blog/<slug>/` loads
and tick the topic in `_topics.md` as `- [x] … → /blog/<slug>/ (YYYY-MM-DD)` (commit that with the post).
