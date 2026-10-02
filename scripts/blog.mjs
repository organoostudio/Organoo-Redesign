// The Organoo journal (blog) — static, zero-dependency, built from content/blog/*.md.
//   content/blog/<slug>.md   ->  dist/blog/<slug>/index.html   (one light HTML page per article, no JS)
//   all posts                ->  dist/blog/index.html (+ /blog/page/N/), /blog/rss.xml, sitemap.xml, llms.txt
// Covers live in public/blog/img/<slug>-{640,1200}.webp + <slug>-og.jpg, made by scripts/blog-cover.mjs.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const SITE = 'https://organoostudio.com';
const PER_PAGE = 12;
const GLOWS = [[30, 110, .7], [80, 110, .6], [20, 100, .55], [50, 120, .6], [90, 40, .5], [10, 20, .5], [60, 0, .5]]
  .map(([x, y, a]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(31,174,94,${a}), transparent 62%)`);

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = h => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
export const slugify = s => strip(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fmtDate = d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const jsonLd = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

/* ---------- front matter: `key: value` lines between --- fences ---------- */
export function parseFile(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('missing --- front matter ---');
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^(["'])(.*)\1$/, '$2').trim();
  }
  return { meta, body: m[2] };
}

/* ---------- markdown (the subset articles use) ---------- */
function inline(s) {
  const keep = [];
  const hold = h => `\u0000${keep.push(h) - 1}\u0000`;
  s = s.replace(/`([^`]+)`/g, (_, c) => hold(`<code>${esc(c)}</code>`));
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => hold(`<img src="${u}" alt="${a}" loading="lazy" decoding="async">`));
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const ext = /^https?:\/\//.test(u) && !u.startsWith(SITE);
    return `<a href="${u}"${ext ? ' rel="noopener" target="_blank"' : ''}>${t}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^\w*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[i]);
}

export function markdown(src) {
  const lines = src.replace(/\r/g, '').split('\n');
  const out = [], heads = [];
  const ids = new Set();
  let i = 0;
  const isBlockStart = l => /^(#{1,6}\s|```|>|\s*[-*]\s|\s*\d+[.)]\s|\||---\s*$)/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (l.startsWith('```')) {
      const buf = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++; out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); continue;
    }
    const h = l.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (h) {
      const lvl = h[1].length, html = inline(h[2]);
      let id = slugify(html) || 'section', n = 2;
      while (ids.has(id)) id = `${slugify(html)}-${n++}`;
      ids.add(id); heads.push({ lvl, id, text: strip(html), html });
      out.push(`<h${lvl} id="${id}">${html}</h${lvl}>`); i++; continue;
    }
    if (/^---\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (l.startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${markdown(buf.join('\n')).html}</blockquote>`); continue;
    }
    if (l.startsWith('|') && /^\|?\s*:?-+/.test(lines[i + 1] || '')) {
      const row = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
      const head = row(l); i += 2;
      const body = [];
      while (i < lines.length && lines[i].startsWith('|')) body.push(row(lines[i++]));
      out.push(`<div class="tbl"><table><thead><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${body.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    const li = l.match(/^\s*([-*]|\d+[.)])\s+/);
    if (li) {
      const ordered = /\d/.test(li[1]), items = [];
      while (i < lines.length && /^\s*([-*]|\d+[.)])\s+/.test(lines[i])) {
        let item = lines[i++].replace(/^\s*([-*]|\d+[.)])\s+/, '');
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+[.)])\s+/.test(lines[i])) item += ' ' + lines[i++].trim();
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`); continue;
    }
    const buf = [l]; i++;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) buf.push(lines[i++]);
    const p = buf.join(' ').trim();
    out.push(/^!\[[^\]]*\]\([^)]+\)$/.test(p) ? `<figure>${inline(p)}</figure>` : `<p>${inline(p)}</p>`);
  }
  return { html: out.join('\n'), heads };
}

/* FAQ = the H3 questions under an H2 named "FAQ" / "Frequently asked questions" -> FAQPage schema */
function extractFaq(html) {
  const sec = html.match(/<h2 id="[^"]*">(?:FAQ|Frequently asked questions|FAQs)[^<]*<\/h2>([\s\S]*?)(?=<h2 |$)/i);
  if (!sec) return [];
  return [...sec[1].matchAll(/<h3 id="[^"]*">([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3 |$)/g)]
    .map(m => ({ q: strip(m[1]), a: strip(m[2]) })).filter(f => f.q && f.a);
}

/* ---------- load ---------- */
export function loadPosts(root, { includeDrafts = false } = {}) {
  const dir = join(root, 'content', 'blog');
  if (!existsSync(dir)) return [];
  const posts = [];
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_') || f === 'README.md') continue;
    const slug = f.slice(0, -3);
    const { meta, body } = parseFile(readFileSync(join(dir, f), 'utf8'));
    if (meta.draft === 'true' && !includeDrafts) continue;
    const { html, heads } = markdown(body);
    const words = strip(html).split(' ').filter(Boolean).length;
    const img = n => existsSync(join(root, 'public', 'blog', 'img', n)) ? `/blog/img/${n}` : null;
    posts.push({
      slug, file: f, body, html, heads, words,
      title: meta.title, description: meta.description, summary: meta.summary || '',
      date: meta.date, updated: meta.updated || meta.date,
      category: meta.category || 'Guides', keyword: meta.keyword || '',
      tags: (meta.tags || '').split(',').map(s => s.trim()).filter(Boolean),
      word: meta.word || meta.category || 'Journal',
      cover: meta.cover !== 'none' && img(`${slug}-1200.webp`) ? { sm: img(`${slug}-640.webp`), lg: img(`${slug}-1200.webp`), og: img(`${slug}-og.jpg`) } : null,
      coverAlt: meta.coverAlt || '', coverCredit: meta.coverCredit || '', coverCreditUrl: meta.coverCreditUrl || '', coverSource: meta.coverSource || '',
      minutes: Math.max(1, Math.round(words / 220)),
      faq: extractFaq(html), meta
    });
  }
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.slug.localeCompare(b.slug));
  posts.forEach((p, i) => { p.glow = GLOWS[i % GLOWS.length]; p.url = `/blog/${p.slug}/`; });
  return posts;
}

/* ---------- templates ---------- */
const CSS = `:root{color-scheme:dark;--ink:#0B0D0C;--deep:#050706;--panel:#0F1311;--line:rgba(255,255,255,.09);--line2:rgba(255,255,255,.17);--text:#EEF3F0;--soft:#C4CDC7;--muted:#8B948E;--em:#1FAE5E;--emi:#03150B;--mint:#96E1B9;--gut:clamp(18px,5vw,64px);--sans:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--ink);color:var(--text);font:16px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
a{color:inherit}img{max-width:100%;height:auto;display:block}::selection{background:var(--em);color:var(--emi)}:focus-visible{outline:2px solid var(--em);outline-offset:3px;border-radius:6px}
.top{display:flex;align-items:center;gap:6px;padding:16px var(--gut);border-bottom:1px solid var(--line)}
.top .logo{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:-.03em;text-decoration:none;margin-right:auto}.top .logo span{color:var(--em)}
.top .logo img{width:30px;height:30px}
.top nav a{padding:8px 12px;font-size:14px;color:var(--soft);text-decoration:none;border-radius:999px}.top nav a:hover,.top nav a[aria-current]{color:#fff;background:rgba(255,255,255,.06)}
.top .go{margin-left:6px;padding:9px 16px;border-radius:999px;background:var(--em);color:var(--emi);font-weight:700;font-size:13.5px;text-decoration:none}
@media(max-width:720px){.top nav a:not(.j){display:none}.top .go{display:none}}
.wrap{max-width:1180px;margin:0 auto;padding:0 var(--gut)}
.crumbs{display:flex;flex-wrap:wrap;gap:8px;font:12px/1.4 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}.crumbs a{text-decoration:none}.crumbs a:hover{color:var(--em)}
.hero{padding:clamp(48px,9vh,110px) 0 clamp(28px,5vh,56px)}
.hero h1{font-size:clamp(36px,6vw,76px);line-height:1.02;letter-spacing:-.05em;margin:18px 0 0;font-weight:800;max-width:20ch}.hero h1 em{font-style:normal;color:var(--em)}
.lead{font-size:clamp(17px,1.6vw,20px);color:var(--soft);max-width:60ch;margin:18px 0 0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;padding-bottom:64px}
.card{display:flex;flex-direction:column;border-radius:20px;overflow:hidden;background:var(--panel);border:1px solid var(--line);text-decoration:none;transition:border-color .3s,transform .4s}
.card:hover{border-color:var(--line2);transform:translateY(-3px)}
.art{position:relative;aspect-ratio:1200/630;display:grid;place-items:center;overflow:hidden;background:var(--deep)}
.art::before{content:"";position:absolute;inset:0;background:var(--glow)}.art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.art b{position:relative;font-size:clamp(28px,3vw,42px);font-weight:800;letter-spacing:-.05em;text-align:center;padding:0 20px;line-height:.95}
.card .m{padding:18px 20px 22px}.k{display:flex;justify-content:space-between;gap:12px;font:11px/1.4 var(--mono);color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
.card h2,.card h3{font-size:19px;letter-spacing:-.02em;line-height:1.25;margin:10px 0 0;font-weight:700}.card p{color:var(--muted);font-size:14.5px;margin:8px 0 0}
.pager{display:flex;justify-content:center;gap:10px;padding-bottom:80px}.pager a{padding:10px 18px;border:1px solid var(--line2);border-radius:999px;text-decoration:none;font-size:14px}
.pager a:hover{border-color:var(--em);color:var(--em)}
.post-hero{padding:clamp(40px,8vh,96px) 0 28px;max-width:860px;margin:0 auto}
.post-hero h1{font-size:clamp(32px,4.6vw,58px);line-height:1.06;letter-spacing:-.045em;margin:18px 0 0;font-weight:800}
.by{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:20px;font-size:14px;color:var(--muted)}
.cover{max-width:1080px;margin:8px auto 0;border-radius:22px;overflow:hidden;border:1px solid var(--line)}.cover.art{aspect-ratio:2.4/1}.cover.art b{font-size:clamp(44px,8vw,110px)}
.credit{max-width:1080px;margin:8px auto 0;font-size:12px;color:var(--muted);text-align:right}.credit a{color:var(--soft)}
.answer{max-width:760px;margin:40px auto 0;padding:20px 24px;border-radius:16px;background:rgba(31,174,94,.08);border:1px solid rgba(31,174,94,.35);font-size:17px;color:var(--text)}
.answer b{display:block;font:12px/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mint);margin-bottom:6px}
.toc{max-width:760px;margin:28px auto 0;padding:18px 24px;border:1px solid var(--line);border-radius:16px;font-size:15px}.toc summary{cursor:pointer;font-weight:700}
.toc ol{margin:12px 0 0;padding-left:20px;color:var(--soft)}.toc a{text-decoration:none}.toc a:hover{color:var(--em)}
.prose{max-width:760px;margin:0 auto;padding:12px 0 40px;font-size:18px;line-height:1.75;color:var(--soft)}
.prose h2{font-size:clamp(25px,2.6vw,32px);line-height:1.2;letter-spacing:-.03em;color:#fff;margin:2.2em 0 .6em;scroll-margin-top:24px}
.prose h3{font-size:21px;line-height:1.3;letter-spacing:-.02em;color:#fff;margin:1.8em 0 .5em;scroll-margin-top:24px}.prose h4{color:#fff;margin:1.5em 0 .4em}
.prose p,.prose ul,.prose ol,.prose blockquote,.prose figure,.prose pre,.prose .tbl{margin:0 0 1.15em}.prose li{margin:.35em 0}.prose strong{color:#fff}
.prose a{color:var(--mint);text-underline-offset:3px}.prose a:hover{color:var(--em)}
.prose blockquote{border-left:3px solid var(--em);padding:4px 0 4px 20px;color:var(--text)}.prose hr{border:0;border-top:1px solid var(--line);margin:2.5em 0}
.prose code{font:.88em var(--mono);background:var(--panel);padding:2px 6px;border-radius:6px}.prose pre{overflow:auto;background:var(--panel);padding:16px;border-radius:12px}.prose pre code{padding:0;background:none}
.prose figure img{border-radius:14px}.tbl{overflow-x:auto;border:1px solid var(--line);border-radius:14px}
.prose table{width:100%;border-collapse:collapse;font-size:15.5px;line-height:1.5}.prose th,.prose td{min-width:130px;padding:12px 14px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
.prose th{color:#fff;background:var(--panel)}.prose tr:last-child td{border-bottom:0}
.cta{max-width:760px;margin:0 auto 64px;padding:28px;border-radius:20px;background:var(--panel);border:1px solid var(--line)}.cta h2{margin:0;font-size:24px;letter-spacing:-.03em}
.cta p{color:var(--soft);margin:8px 0 18px}.btn{display:inline-block;padding:12px 20px;border-radius:999px;background:var(--em);color:var(--emi);font-weight:700;text-decoration:none}
.more{border-top:1px solid var(--line);padding-top:48px}.more>h2{font-size:clamp(26px,3vw,40px);letter-spacing:-.04em;margin:0 0 24px}
.foot{border-top:1px solid var(--line);padding:28px var(--gut);display:flex;flex-wrap:wrap;gap:10px 24px;justify-content:space-between;font-size:13px;color:var(--muted)}.foot a{text-decoration:none}.foot a:hover{color:var(--em)}`;

function page({ title, description, path, ogType = 'website', image, ld = [], head = '', body }) {
  const img = image ? SITE + image : `${SITE}/og.jpg`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${path}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#0B0D0C">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Organoo Studio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="application/rss+xml" title="Organoo Studio Journal" href="${SITE}/blog/rss.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${head}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap">
<style>${CSS}</style>
${ld.map(jsonLd).join('\n')}
</head>
<body>
<header class="top"><a class="logo" href="/" aria-label="Organoo Studio home"><img src="/favicon.svg" alt="" width="30" height="30">organoo <span>studio</span></a>
<nav aria-label="Main"><a href="/#work">Work</a><a href="/#services">Services</a><a href="/#about">About</a><a class="j" href="/blog/"${path.startsWith('/blog/') ? ' aria-current="page"' : ''}>Journal</a><a href="/#contact">Contact</a></nav>
<a class="go" href="/#contact">Start a project</a></header>
${body}
<footer class="foot"><span>© ${new Date().getUTCFullYear()} Organoo Studio · Digital agency in Jakarta, Indonesia</span><span><a href="/blog/rss.xml">RSS</a> · <a href="mailto:organoostudio@gmail.com">organoostudio@gmail.com</a> · <a href="https://www.instagram.com/organoo.studio/" rel="noopener">Instagram</a> · <a href="https://www.linkedin.com/company/organoo-studio" rel="noopener">LinkedIn</a></span></footer>
</body>
</html>
`;
}

const ORG = { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Organoo Studio', url: `${SITE}/`, logo: { '@type': 'ImageObject', url: `${SITE}/apple-touch-icon.png` }, sameAs: ['https://www.instagram.com/organoo.studio/', 'https://www.linkedin.com/company/organoo-studio'] };

function art(p, size, eager) {
  if (!p.cover) return `<div class="art" style="--glow:${p.glow}"><b>${esc(p.word)}</b></div>`;
  const src = size === 'lg' ? p.cover.lg : p.cover.sm;
  return `<div class="art"><img src="${src}" srcset="${p.cover.sm} 640w, ${p.cover.lg} 1200w" sizes="${size === 'lg' ? '(max-width:1100px) 100vw, 1080px' : '(max-width:700px) 100vw, 380px'}" width="1200" height="630" alt="${esc(p.coverAlt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></div>`;
}
const card = (p, eager = false, h = 'h2') => `<a class="card" href="${p.url}">${art(p, 'sm', eager)}<div class="m"><div class="k"><span>${esc(p.category)}</span><span>${p.minutes} min read</span></div><${h}>${esc(p.title)}</${h}><p>${esc(p.description)}</p></div></a>`;

function renderIndex(posts, n, pages) {
  const path = n === 1 ? '/blog/' : `/blog/page/${n}/`;
  const list = posts.slice((n - 1) * PER_PAGE, n * PER_PAGE);
  const title = n === 1 ? 'Journal — Website, Ads, Design & Video Guides | Organoo Studio' : `Journal — Page ${n} | Organoo Studio`;
  const description = 'Practical guides on websites, UI/UX, performance ads, branding and video for business owners in Indonesia and beyond — from the team at Organoo Studio, Jakarta.';
  const pager = pages > 1 ? `<nav class="pager" aria-label="Pagination">${n > 1 ? `<a href="${n === 2 ? '/blog/' : `/blog/page/${n - 1}/`}" rel="prev">← Newer</a>` : ''}${n < pages ? `<a href="/blog/page/${n + 1}/" rel="next">Older →</a>` : ''}</nav>` : '';
  return page({
    title, description, path,
    ld: [{ '@context': 'https://schema.org', '@type': 'Blog', '@id': `${SITE}/blog/#blog`, name: 'Organoo Studio Journal', url: `${SITE}/blog/`, description, inLanguage: 'en', publisher: ORG,
      blogPost: list.map(p => ({ '@type': 'BlogPosting', headline: p.title, url: SITE + p.url, datePublished: p.date, dateModified: p.updated })) }],
    body: `<main class="wrap"><section class="hero"><div class="crumbs"><a href="/">Home</a><span>/</span><span>Journal</span>${n > 1 ? `<span>/</span><span>Page ${n}</span>` : ''}</div>
<h1>Notes on <em>growth</em></h1><p class="lead">Practical guides on websites, ads, design and video — written for business owners, not designers.</p></section>
${list.length ? `<div class="grid">${list.map((p, i) => card(p, n === 1 && i === 0)).join('')}</div>` : '<p class="lead" style="padding-bottom:80px">The first articles are on their way.</p>'}
${pager}</main>`
  });
}

function renderPost(p, posts) {
  const related = [...posts.filter(x => x !== p && x.category === p.category), ...posts.filter(x => x !== p && x.category !== p.category)].slice(0, 3);
  const h2s = p.heads.filter(h => h.lvl === 2);
  const title = p.meta.seoTitle || `${p.title} | Organoo Studio`;
  const image = p.cover ? (p.cover.og || p.cover.lg) : null;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${SITE}${p.url}#article`, headline: p.title, description: p.description,
      ...(image ? { image: [SITE + image] } : {}), datePublished: p.date, dateModified: p.updated, inLanguage: 'en',
      author: ORG, publisher: ORG, mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + p.url }, articleSection: p.category,
      keywords: [p.keyword, ...p.tags].filter(Boolean).join(', '), wordCount: p.words, isPartOf: { '@id': `${SITE}/blog/#blog` } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE}/blog/` },
      { '@type': 'ListItem', position: 3, name: p.title, item: SITE + p.url }] },
    ...(p.faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : [])
  ];
  const head = `<meta property="article:published_time" content="${p.date}">\n<meta property="article:modified_time" content="${p.updated}">\n<meta property="article:section" content="${esc(p.category)}">\n${p.tags.map(t => `<meta property="article:tag" content="${esc(t)}">\n`).join('')}${p.cover ? `<link rel="preload" as="image" href="${p.cover.lg}" imagesrcset="${p.cover.sm} 640w, ${p.cover.lg} 1200w" imagesizes="(max-width:1100px) 100vw, 1080px" fetchpriority="high">\n` : ''}`;
  const credit = p.cover && p.coverCredit ? `<p class="credit">Photo: ${p.coverCreditUrl ? `<a href="${esc(p.coverCreditUrl)}" rel="noopener nofollow">${esc(p.coverCredit)}</a>` : esc(p.coverCredit)}${p.coverSource ? ` on ${esc(p.coverSource)}` : ''}</p>` : '';
  return page({
    title, description: p.description, path: p.url, ogType: 'article', image, ld, head,
    body: `<main class="wrap"><article>
<header class="post-hero"><div class="crumbs"><a href="/">Home</a><span>/</span><a href="/blog/">Journal</a><span>/</span><span>${esc(p.category)}</span></div>
<h1>${esc(p.title)}</h1>
<div class="by"><span>By Organoo Studio</span><span>Published <time datetime="${p.date}">${fmtDate(p.date)}</time></span>${p.updated !== p.date ? `<span>Updated <time datetime="${p.updated}">${fmtDate(p.updated)}</time></span>` : ''}<span>${p.minutes} min read</span></div></header>
${p.cover ? `<div class="cover">${art(p, 'lg', true)}</div>${credit}` : `<div class="cover art" style="--glow:${p.glow}"><b>${esc(p.word)}</b></div>`}
${p.summary ? `<div class="answer"><b>Quick answer</b>${esc(p.summary)}</div>` : ''}
${h2s.length >= 3 ? `<details class="toc" open><summary>In this article</summary><ol>${h2s.map(h => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></details>` : ''}
<div class="prose">
${p.html}
</div></article>
<aside class="cta"><h2>Want this done for your business?</h2><p>Organoo Studio designs websites, runs ads and creates content for growing brands. Tell us what you're building and we'll come back with a clear, free plan.</p><a class="btn" href="/#contact">Start a project</a></aside>
${related.length ? `<section class="more"><h2>Keep reading</h2><div class="grid">${related.map(r => card(r, false, 'h3')).join('')}</div></section>` : ''}
</main>`
  });
}

const xml = s => esc(s).replace(/'/g, '&apos;');
function rss(posts) {
  const items = posts.slice(0, 30).map(p => `<item><title>${xml(p.title)}</title><link>${SITE}${p.url}</link><guid isPermaLink="true">${SITE}${p.url}</guid><pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate><category>${xml(p.category)}</category><description>${xml(p.description)}</description></item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Organoo Studio Journal</title><link>${SITE}/blog/</link><description>Practical guides on websites, ads, design and video for growing businesses.</description><language>en</language>
<atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel></rss>
`;
}

function sitemap(posts) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [[`${SITE}/`, today], [`${SITE}/blog/`, posts[0]?.updated || today], ...posts.map(p => [SITE + p.url, p.updated])];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `  <url><loc>${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}
</urlset>
`;
}

// llms.txt — a plain map of the site for AI answer engines (https://llmstxt.org)
function llms(posts) {
  return `# Organoo Studio

> Organoo Studio is a digital agency from Jakarta, Indonesia, for UI/UX and web design, website development, performance marketing (Meta, Google, Amazon and marketplace ads), graphic design and video editing.

- Website: ${SITE}/
- Contact: organoostudio@gmail.com
- Services: UI/UX design, website development, performance ads, graphic design and branding, video editing

## Journal

${posts.map(p => `- [${p.title}](${SITE}${p.url}): ${p.summary || p.description}`).join('\n')}
`;
}

/* ---------- build entry ---------- */
export function buildBlog(root, dist) {
  const posts = loadPosts(root);
  const out = (rel, s) => { const f = join(dist, rel); mkdirSync(join(f, '..'), { recursive: true }); writeFileSync(f, s); };
  const pages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  for (let n = 1; n <= pages; n++) out(n === 1 ? 'blog/index.html' : `blog/page/${n}/index.html`, renderIndex(posts, n, pages));
  for (const p of posts) out(`blog/${p.slug}/index.html`, renderPost(p, posts));
  out('blog/rss.xml', rss(posts));
  out('sitemap.xml', sitemap(posts));
  out('llms.txt', llms(posts));
  // the slim list the home page's Journal strip reads
  return posts.slice(0, 6).map(p => ({ slug: p.slug, url: p.url, title: p.title, cat: p.category, time: `${p.minutes} min read`, word: esc(p.word), glow: p.glow, cover: p.cover ? p.cover.sm : null, alt: p.coverAlt }));
}
