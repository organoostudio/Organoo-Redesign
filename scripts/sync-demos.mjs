// Pulls the concept demo sites from the separate Dummy-Project repository into
// public/demos/<slug>/ so they are served on the main domain
// (e.g. organoostudio.com/demos/lumetric/). Runs automatically before
// `npm run build` and `npm run dev` (see package.json "prebuild"/"predev").
//
// The demos stay in their own repo; nothing here is committed (public/demos is
// git-ignored). To publish a demo change: push to Dummy-Project, then redeploy
// this site (or trigger the Cloudflare Pages deploy hook).
//
// Env overrides:
//   DEMOS_REPO   git URL of the demos repo (default: organoostudio/Dummy-Project)
//   DEMOS_REF    branch or tag to deploy (default: main)
//   DEMOS_SKIP=1 skip syncing (keeps whatever is already in public/demos)
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dest = join(root, 'public', 'demos');
const repo = process.env.DEMOS_REPO || 'https://github.com/organoostudio/Dummy-Project.git';
const ref = process.env.DEMOS_REF || 'main';

if (process.env.DEMOS_SKIP === '1') {
  console.log('[demos] DEMOS_SKIP=1, leaving public/demos as is');
  process.exit(0);
}

const tmp = mkdtempSync(join(tmpdir(), 'organoo-demos-'));
try {
  // Shallow, blob-less clone + sparse checkout: preview/ (screenshots, videos)
  // is never downloaded, which keeps the build fast.
  const git = (...a) => execFileSync('git', a, { stdio: 'pipe', cwd: tmp });
  execFileSync('git', ['clone', '--depth', '1', '--filter=blob:none', '--no-checkout', '--branch', ref, repo, tmp], { stdio: 'pipe' });
  git('sparse-checkout', 'set', '--no-cone', '/*', '!/*/preview/');
  git('checkout', ref);
} catch (err) {
  rmSync(tmp, { recursive: true, force: true });
  const kept = existsSync(dest) ? ' Keeping the existing public/demos.' : ' The /demos/ links will 404 until the next successful sync.';
  console.warn(`[demos] Could not clone ${repo} (${String(err.stderr || err.message).trim().split('\n').pop()}).${kept}`);
  process.exit(0); // never fail the site build because of the demos
}

rmSync(dest, { recursive: true, force: true });
const synced = [];
for (const name of readdirSync(tmp).sort()) {
  const m = name.match(/^\d{2}-(.+)$/); // "01-lumetric" -> "lumetric"
  if (!m || !statSync(join(tmp, name)).isDirectory() || !existsSync(join(tmp, name, 'index.html'))) continue;
  const from = join(tmp, name);
  cpSync(from, join(dest, m[1]), {
    recursive: true,
    // portfolio material (screenshots, mockups, videos) is not part of the live demo
    filter: (src) => !src.startsWith(join(from, 'preview')) && !src.split(sep).includes('.git'),
  });
  synced.push(m[1]);
}
rmSync(tmp, { recursive: true, force: true });
console.log(`[demos] Synced ${synced.length} demos into public/demos: ${synced.join(', ')}`);
