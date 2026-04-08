// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://stiefundgluecklich.de',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      filter: (page) => ![
        'https://stiefundgluecklich.de/gone/',
        'https://stiefundgluecklich.de/tiktok-demo/'
      ].includes(page)
    })
  ]
});