// Builds the static site into ./dist — no dependencies, just Node 18+.
//   src/style.css + src/{data,engine,pages}.js  ->  dist/assets/site.<hash>.{css,js}   (cached for a year)
//   src/head.html + src/shell.html + each route  ->  dist/<route>/index.html            (pre-rendered, own title/description/canonical)
//   public/**  ->  dist/**   (images, favicon, robots, headers, and /demos synced by sync-demos.mjs)
//   content/blog/*.md  ->  dist/blog/**, sitemap.xml, llms.txt   (see scripts/blog.mjs)
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { buildBlog, SITE, writeSiteIndexes } from './blog.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const src = f => readFileSync(join(root, 'src', f), 'utf8');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
if (existsSync(join(root, 'public'))) cpSync(join(root, 'public'), dist, { recursive: true });

const { posts, strip: blog } = buildBlog(root, dist);
const app = `const BLOG_POSTS = ${JSON.stringify(blog)};\n` + ['data.js', 'engine.js', 'pages.js'].map(src).join('\n');
const js = `(() => {\n${app}\nboot();\n})();\n`;
const css = src('style.css');

mkdirSync(join(dist, 'assets'), { recursive: true });
const asset = (ext, body) => {
  const name = `site.${createHash('sha256').update(body).digest('hex').slice(0, 10)}.${ext}`;
  writeFileSync(join(dist, 'assets', name), body);
  return `/assets/${name}`;
};
const cssUrl = asset('css', css), jsUrl = asset('js', js);

/* ---------- pre-render every route by running the page templates in a sandbox ---------- */
// Any browser API touched at load time resolves to a harmless stub; only the HTML-string templates matter here.
const stub = new Proxy(function () {}, {
  get: (t, k) => k === Symbol.toPrimitive ? () => '' : k === 'matches' ? false : stub,
  apply: () => stub, construct: () => stub
});
const ctx = vm.createContext(new Proxy({ innerWidth: 1440, innerHeight: 900, Math, JSON, Object, Array, String, Number, Date, Set, Map, performance, console, encodeURIComponent },
  { get: (t, k) => (k in t ? t[k] : k in globalThis ? globalThis[k] : stub), has: () => true }));
const R = vm.runInContext(`${app}\n({ PAGES, routeMeta, routePath, SERVICES, PROJECTS })`, ctx);

const routes = [{ page: 'home' }, { page: 'work' }, { page: 'services' }, { page: 'about' }, { page: 'contact' },
  ...R.SERVICES.map(s => ({ page: 'service', arg: s.slug })), ...R.PROJECTS.map(p => ({ page: 'case', arg: p.slug }))];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const head = src('head.html'), shell = src('shell.html');
const crumbs = (r, m) => {
  const items = [['Home', '/']];
  if (r.page === 'case') items.push(['Work', '/work/']);
  if (r.page === 'service') items.push(['Services', '/services/']);
  if (r.page !== 'home') items.push([m.title.split(/ [—|] /)[0], m.path]);
  return items.length < 2 ? '' : `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + p })) })}</script>\n`;
};
const serviceLd = (r, m) => r.page !== 'service' ? '' : `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Service',
  name: m.title.split(' | ')[0], description: m.description, url: SITE + m.path, areaServed: 'Indonesia', provider: { '@id': `${SITE}/#org` } }).replace(/</g, '\\u003c')}</script>\n`;

function htmlFor(r, { noindex = false } = {}) {
  const m = R.routeMeta(r), url = SITE + m.path;
  const h = head
    .replace(/<title>.*?<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(m.description)}">${noindex ? '\n<meta name="robots" content="noindex">' : ''}`)
    .replace(/<link rel="canonical" href="[^"]*">/, noindex ? '' : `<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, r.page === 'home' ? '$&' : `<meta property="og:title" content="${esc(m.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, r.page === 'home' ? '$&' : `<meta property="og:description" content="${esc(m.description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  return `${h}<link rel="alternate" type="application/rss+xml" title="Organoo Studio Journal" href="/blog/rss.xml">
<link rel="stylesheet" href="${cssUrl}">
${crumbs(r, m)}${serviceLd(r, m)}</head>
<body>
${shell.replace('<main id="app"></main>', `<main id="app">${R.PAGES[r.page](r.arg)}</main>`)}
<noscript><p style="padding:40px 24px;text-align:center;font-family:system-ui">Animations need JavaScript — the content above is all here. Questions? Email organoostudio@gmail.com.</p></noscript>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="${jsUrl}" defer></script>
</body>
</html>
`;
}

const pages = routes.map(r => {
  const m = R.routeMeta(r), out = join(dist, m.path, 'index.html');
  mkdirSync(join(out, '..'), { recursive: true });
  writeFileSync(out, htmlFor(r));
  return m;
});
writeFileSync(join(dist, '404.html'), htmlFor({ page: 'missing' }, { noindex: true }));
writeSiteIndexes(dist, posts, pages);

const home = readFileSync(join(dist, 'index.html'));
console.log(`[build] ${routes.length} pages + 404 · home ${(home.length / 1024).toFixed(0)} KB · css ${(css.length / 1024).toFixed(0)} KB · js ${(js.length / 1024).toFixed(0)} KB · blog: ${blog.length ? blog.length + '+ posts' : 'no posts yet'}`);
