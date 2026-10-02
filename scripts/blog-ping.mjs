// Tells Bing (and through it ChatGPT search / Copilot), Yandex, Seznam and Naver about new or updated
// URLs via IndexNow. Google reads sitemap.xml on its own.  Usage: node scripts/blog-ping.mjs /blog/<slug>/ [...]
import { execFileSync } from 'node:child_process';
import { SITE } from './blog.mjs';

const KEY = 'd0e89913d265cf39b611a26f7a121969'; // must match public/<KEY>.txt
const urls = process.argv.slice(2).map(u => (u.startsWith('http') ? u : SITE + u));
if (!urls.length) { console.error('usage: node scripts/blog-ping.mjs /blog/<slug>/ [...]'); process.exit(1); }
urls.push(`${SITE}/blog/`, `${SITE}/sitemap.xml`);
const body = JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls });
try {
  const code = execFileSync('curl', ['-sS', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '30', '-X', 'POST', 'https://api.indexnow.org/indexnow',
    '-H', 'Content-Type: application/json; charset=utf-8', '-d', body]).toString();
  console.log(`[indexnow] ${code} for ${urls.length} URLs${/^20[02]$/.test(code) ? '' : ' (not accepted — fine to skip, sitemap still works)'}`);
} catch (e) { console.log(`[indexnow] skipped: ${e.message.split('\n')[0]}`); }
