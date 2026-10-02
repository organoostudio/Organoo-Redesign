// Makes the compressed cover set for a journal article from a free-license stock photo.
//   node scripts/blog-cover.mjs <slug> <image-url-or-file> [gravity]
//   -> public/blog/img/<slug>-1200.webp  (1200×630, ≤ 110 KB)  article hero + large cards
//      public/blog/img/<slug>-640.webp   (640×336,  ≤ 45 KB)   cards, mobile
//      public/blog/img/<slug>-og.jpg     (1200×630, ≤ 140 KB)  social previews (WhatsApp/LinkedIn read JPEG best)
// gravity (crop anchor) defaults to center; e.g. north, south, east, west.
// Needs ImageMagick (`magick` or `convert`) and curl; both are in the default cloud image.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [slug, source, gravity = 'center'] = process.argv.slice(2);
if (!slug || !source) { console.error('usage: node scripts/blog-cover.mjs <slug> <image-url-or-file> [gravity]'); process.exit(1); }
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) { console.error(`bad slug "${slug}" — lowercase words joined by hyphens`); process.exit(1); }

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'public', 'blog', 'img');
mkdirSync(outDir, { recursive: true });

const im = (() => { for (const c of ['magick', 'convert']) { try { execFileSync(c, ['-version'], { stdio: 'ignore' }); return c; } catch {} } throw new Error('ImageMagick not found (need `magick` or `convert`)'); })();

let input = source;
if (/^https?:\/\//.test(source)) {
  input = join(mkdtempSync(join(tmpdir(), 'cover-')), 'src');
  execFileSync('curl', ['-fsSL', '--max-time', '90', '-o', input, source], { stdio: 'inherit' }); // curl follows the proxy env
} else if (!existsSync(source)) { console.error(`no such file: ${source}`); process.exit(1); }

function make(out, w, h, fmt, maxKB, qs) {
  for (const q of qs) {
    const args = [input, '-auto-orient', '-colorspace', 'sRGB', '-resize', `${w}x${h}^`, '-gravity', gravity, '-extent', `${w}x${h}`, '-strip', '-quality', String(q)];
    if (fmt === 'jpg') args.push('-sampling-factor', '4:2:0', '-interlace', 'JPEG');
    else args.push('-define', 'webp:method=6');
    execFileSync(im, [...args, out]);
    const kb = statSync(out).size / 1024;
    if (kb <= maxKB) return console.log(`[cover] ${out.slice(root.length)}  ${w}×${h}  q${q}  ${kb.toFixed(0)} KB`);
  }
  console.log(`[cover] ${out.slice(root.length)} is ${(statSync(out).size / 1024).toFixed(0)} KB at the lowest quality — pick a calmer photo if it looks rough`);
}

make(join(outDir, `${slug}-1200.webp`), 1200, 630, 'webp', 110, [74, 68, 62, 56, 50]);
make(join(outDir, `${slug}-640.webp`), 640, 336, 'webp', 45, [70, 64, 58, 52]);
make(join(outDir, `${slug}-og.jpg`), 1200, 630, 'jpg', 140, [74, 68, 62, 56]);
