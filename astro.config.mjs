// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import icon from 'astro-icon';

export default defineConfig({
  output: 'static',
  // base: '/rubezh',
  adapter: vercel(),
  // site: 'https://penkin-repo.github.io',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), markdoc(), keystatic(), icon()],
});