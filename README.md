# ООО «Рубеж» — сайт компании

Корпоративный сайт с каталогом техники, портфолио проектов, услугами и вакансиями. Статическая сборка (SSG) на **Astro 5**, контент — **Sanity CMS** с мягким fallback на локальные Markdown-коллекции, стили — **Tailwind CSS 4**.

## Стек

- **Astro 5** + **React 19** для Sanity Studio
- **Tailwind CSS 4** через `@tailwindcss/vite`
- **Sanity CMS** (`/studio`) — основной источник контента
- **astro-icon** + **Lucide** иконки
- **Swiper** слайдеры, **PhotoSwipe** галерея
- **browser-image-compression** — сжатие картинок перед загрузкой в Sanity
- **@portabletext/to-html** — рендер Portable Text из Sanity

## Содержание в Sanity

| Документ | `_id` | Описание |
| --- | --- | --- |
| Главный экран | `hero` | Баннер, слоган, CTA, фоновое видео |
| Шапка сайта | `header` | Телефон, email, CTA, пункты меню |
| Контакты | `site` | Адреса, телефоны, соцсети, реквизиты, карта |
| Цифры | `stats` | Показатели на главном экране |
| Преимущества | `advantages` | Список преимуществ с иконками Lucide |
| Спецтехника | — | Каталог карточек техники |
| Проекты | — | Портфолио с галереей фото |
| Услуги | — | Заголовок, иконка, текст (Portable Text) |
| Вакансии | — | Заголовок, порядок, описание |

## Архитектура контента

- Адаптеры в `src/lib/content/` (`contacts.ts`, `equipment.ts`, `projects.ts`, `services.ts`, `stats.ts`, `advantages.ts`, `vacancies.ts`) сначала читают Sanity, при ошибке/пустоте — `getCollection` локальных Markdown.
- Локальные коллекции — в `src/content/` — остаются бэкапом и хранятся в Git.
- Картинки Sanity оптимизируются Astro на сборке (`image.domains: ['cdn.sanity.io']`) и раздаются с хостинга Timeweb, а не с CDN Sanity.
- Компонент `src/components/ui/SmartImage.astro` рендерит и локальные `ImageMetadata`, и удалённые URL.

## Команды

```bash
pnpm install      # зависимости
pnpm dev          # http://localhost:4321
pnpm build        # ./dist/
pnpm preview      # локальный просмотр сборки
```

## Работа со Studio и миграциями

1. **Studio** доступно по адресу `/studio` в dev-сборке или на проде.
2. **Первичное заполнение** Sanity:
   ```bash
   node scripts/seed-sanity.mjs
   ```
   После запуска открыть `/studio` и нажать **Publish** на каждом документе.
3. **Миграция существующих .md в Sanity**:
   ```bash
   node scripts/migrate-equipment.mjs
   node scripts/migrate-projects.mjs
   node scripts/migrate-services.mjs
   node scripts/migrate-vacancies.mjs
   ```
   Для миграции нужен `SANITY_TOKEN` в `.env`.
4. Картинки при загрузке через Studio сжимаются до WebP, ≤1920px, качество 80% (`src/sanity/components/CompressedImageInput.tsx`).

## Деплой

- GitVerse — основной remote (`gitverse`).
- GitHub (`origin`) — зеркало.
- Push в `main` на GitVerse запускает `.github/workflows/deploy.yml`: сборка `pnpm build` и выгрузка `./dist/` на Timeweb по FTP.
- Workflow срабатывает только если `github.server_url` содержит `gitverse`.

## Структура

```text
src/
├── components/        # Astro-компоненты страниц и UI
├── layouts/           # Базовый шаблон
├── lib/content/       # Адаптеры контента (Sanity → fallback → Markdown)
├── content/           # Локальные Markdown-коллекции
├── pages/             # Astro-страницы
├── sanity/            # Конфиг Studio, схемы, клиент, компоненты
├── scripts/           # seed + миграции
└── utils/             # Утилиты (например, работа с фото проектов)
```
