// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import icon from 'astro-icon';

export default defineConfig({
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), icon()],
});