// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://rubezh-arh.ru',
  image: {
    // Разрешаем Astro оптимизировать удалённые картинки из Sanity на этапе сборки.
    // Готовые файлы кладутся в dist/ и раздаются с Timeweb — трафик Sanity тратится только при сборке.
    domains: ['cdn.sanity.io'],
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), icon()],
});