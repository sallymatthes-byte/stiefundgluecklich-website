// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://stiefundgluecklich.de',
  output: 'server',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const excludedPaths = [
          '/gone/',
          '/tiktok-demo/',
          '/login/',
          '/admin/',
          '/members/',
          '/livecalls/',
          '/auth/',
          '/api/',
          '/1zu1-angebot/',
          '/1zu1-bewerbung/ergebnis/'
        ];

        return !excludedPaths.some((path) => page.startsWith(`https://stiefundgluecklich.de${path}`));
      }
    })
  ]
});
