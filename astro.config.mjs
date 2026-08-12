// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/config/site.ts';

export default defineConfig({
  site: SITE.url,
  output: 'static',
  build: {
    format: 'directory',
  },
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
