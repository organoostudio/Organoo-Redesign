import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production URL used for canonical links and the sitemap.
// Override at build time with SITE_URL (e.g. the Cloudflare Pages URL) if needed.
const site = process.env.SITE_URL || 'https://organoostudio.com';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
