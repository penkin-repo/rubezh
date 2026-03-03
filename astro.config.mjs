// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
// import keystatic from '@keystatic/astro'; // SSR only — disabled for static GitHub Pages build
import icon from 'astro-icon';
// https://astro.build/config
// https://github.com/penkin-repo/rubezh
// SSG режим (статическая генерация) — адаптер не нужен для dev и статики
// node adapter добавить при необходимости деплоя на Node.js сервер

export default defineConfig({
  output: 'static',
  base: '/rubezh',
  site: 'https://penkin-repo.github.io',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), markdoc(), icon()],
});