// Quality gate for journal articles: run `npm run blog:check` before publishing.
// Errors fail (exit 1); warnings are printed. Rules mirror content/blog/README.md.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPosts } from './blog.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const posts = loadPosts(root, { includeDrafts: true });
let errors = 0, warnings = 0;
const seen = new Map();

for (const p of posts) {
  const err = m => { errors++; console.log(`  ✗ ${m}`); }, warn = m => { warnings++; console.log(`  ! ${m}`); };
  console.log(`${p.file}${p.meta.draft === 'true' ? ' (draft)' : ''} — ${p.words} words`);
  for (const k of ['title', 'description', 'summary', 'date', 'category', 'keyword']) if (!p.meta[k]) err(`front matter needs "${k}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) err('file name must be a lowercase-hyphen slug');
  if (p.slug.split('-').length > 8) warn('slug is long — keep it to the core keyword (≤ 6 words)');
  for (const k of ['date', 'updated']) if (p.meta[k] && !/^\d{4}-\d{2}-\d{2}$/.test(p.meta[k])) err(`${k} must be YYYY-MM-DD`);
  if (p.title && p.title.length > 65) err(`title is ${p.title.length} chars (max 65 so it is not cut in results)`);
  if (p.description && (p.description.length < 110 || p.description.length > 160)) err(`description is ${p.description.length} chars (110–160)`);
  if (p.summary) { const w = p.summary.split(/\s+/).length; if (w < 25 || w > 70) err(`summary is ${w} words (25–70: a direct, quotable answer)`); }
  if (/^#\s/m.test(p.body)) err('body must not contain an H1 (#) — the title is the H1');
  if (p.words < 1200) err(`only ${p.words} words — aim for 1,500–2,500 of real substance`);
  if (p.heads.filter(h => h.lvl === 2).length < 4) err('needs at least 4 H2 sections');
  if (p.faq.length < 3) err('needs a "## Frequently asked questions" section with ≥ 3 "### question?" entries');
  const kw = (p.keyword || '').toLowerCase();
  if (kw && !p.title.toLowerCase().includes(kw.split(' ').slice(0, 3).join(' '))) warn(`title does not contain the keyword "${p.keyword}"`);
  if (kw && !p.body.split(/\s+/).slice(0, 120).join(' ').toLowerCase().includes(kw)) warn(`keyword "${p.keyword}" not in the first 120 words`);
  const links = [...p.body.matchAll(/\]\(([^)\s]+)\)/g)].map(m => m[1]);
  if (links.filter(u => u.startsWith('/')).length < 2) err('needs ≥ 2 internal links (other /blog/ articles, /services/<slug>/ or /contact/)');
  if (links.filter(u => /^https?:\/\//.test(u)).length < 1) warn('no external source cited — link at least one authoritative source');
  for (const u of links.filter(u => u.startsWith('/blog/') && !u.startsWith('/blog/img/'))) {
    const s = u.replace(/^\/blog\/|\/(#.*)?$/g, '');
    if (s && !posts.some(x => x.slug === s)) err(`internal link to a missing article: ${u}`);
  }
  if (/!\[\]\(/.test(p.body)) err('every image needs alt text');
  if (/\[(placeholder|TODO|TBD)[^\]]*\]/i.test(p.body)) err('contains a [placeholder]/TODO');
  const cover = existsSync(join(root, 'public', 'blog', 'img', `${p.slug}-1200.webp`));
  if (cover && !p.coverAlt) err('cover image needs coverAlt');
  if (cover && !p.coverCredit) warn('cover has no coverCredit — credit the photographer');
  if (!cover && p.meta.cover !== 'none') warn('no cover yet — run scripts/blog-cover.mjs, or set cover: none');
  for (const [k, v] of [['slug', p.slug], ['title', p.title?.toLowerCase()]]) {
    if (seen.has(k + v)) err(`duplicate ${k} with ${seen.get(k + v)}`); else seen.set(k + v, p.file);
  }
}
console.log(`\n${posts.length} articles · ${errors} errors · ${warnings} warnings`);
process.exit(errors ? 1 : 0);
