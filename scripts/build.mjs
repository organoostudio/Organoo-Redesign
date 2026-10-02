// Builds the static site into ./dist — no dependencies, just Node 18+.
//   src/head.html + src/style.css + src/shell.html + src/{data,engine,pages}.js  ->  dist/index.html
//   public/**  ->  dist/**   (images, favicon, robots, headers, and /demos synced by sync-demos.mjs)
//   content/blog/*.md  ->  dist/blog/**, sitemap.xml, llms.txt   (see scripts/blog.mjs)
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBlog } from './blog.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const src = f => readFileSync(join(root, 'src', f), 'utf8');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
if (existsSync(join(root, 'public'))) cpSync(join(root, 'public'), dist, { recursive: true });

const blog = buildBlog(root, dist);
const js = `const BLOG_POSTS = ${JSON.stringify(blog)};\n` + ['data.js', 'engine.js', 'pages.js'].map(src).join('\n');
const html = `${src('head.html')}<style>
${src('style.css')}
</style>
</head>
<body>
${src('shell.html')}
<noscript><p style="padding:120px 24px;text-align:center;font-family:system-ui">Organoo Studio — please enable JavaScript to view this site, or email organoostudio@gmail.com.</p></noscript>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script>
(() => {
${js}
boot();
})();
</script>
</body>
</html>
`;
writeFileSync(join(dist, 'index.html'), html);
console.log(`[build] dist/index.html ${(html.length / 1024).toFixed(0)} KB · blog: ${blog.length ? blog.length + '+ posts' : 'no posts yet'}`);
