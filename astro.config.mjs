// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

// NOTE: the site URL is hardcoded here because src/config/site.ts does not
// exist until Task 2. Task 14 swaps this literal for the SITE import.
export default defineConfig({
  site: 'https://image-tools.example.com',
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
