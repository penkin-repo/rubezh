# Project Status: RUBEZH — ООО «Рубеж» Корпоративный сайт

**Last Updated:** 2026-03-17 09:15 (UTC+03:00)
**Current Phase:** Фаза 6 — Разработка на Astro + Sanity CMS 🚧

## 🚀 Active Context
* **Current Task:** Все блоки главной сделаны. Создана страница `/kontakty` (Яндекс Карты, данные, форма), навигация сайта переведена на транслит-пути: `/o-kompanii`, `/vakansii`, `/proekty`, `/arenda-spetstehniki`, `/kontakty` для лучшей индексации в Яндексе.
* **Next Step:** Каталог спецтехники (`/arenda-spetstehniki`) + Sanity схемы (projects, vacancies)

## 🛠 Tech Stack & Versions
* **Astro:** (установлен, см. package.json)
* **Sanity:** `sanity` + `@sanity/client`
* **Tailwind CSS:** v4 (через @tailwindcss/vite)
* **pnpm:** менеджер пакетов
* **TypeScript:** yes

## 🐛 Known Bugs / Issues
* [ ] [Low] В `src/sanity/schemas/` добавлены только `hero` и `header` — нужно перенести/добавить `equipment`, `projects`, `vacancies` и singletons для внутренних страниц

## 📝 Recent Changes (Changelog)

### Миграция на Sanity (завершено)
* [2026-03-05/06] Удалён Keystatic, установлен Sanity CMS
* [2026-03-05/06] Настроен роут `/studio` для встроенной Sanity Studio в Astro (hybrid output)
* [2026-03-05/06] Созданы схемы `hero.ts` и `header.ts`, компоненты `Hero.astro` и `Header.astro` переведены на использование `@sanity/client`
* [2026-03-05/06] Написан и выполнен скрипт миграции `seed-sanity.mjs` для переноса статического контента из кода в Sanity

### Основные фичи и UI
* [2026-03-17] Проекты переведены на Astro Content Collections (`src/content/projects/*.md`). Убраны все моки и упоминания Keystatic. Скрытые фото галереи PhotoSwipe теперь оптимизируются компонентом `<Image>`.
* [2026-03-17] Создана полноценная отдельная страница `/proekty` с выводом всех проектов из MD-файлов в виде фотогалереи (PhotoSwipe).
* [2026-03-17] Создан переиспользуемый компонент `PageHeader.astro` для унификации шапок внутренних страниц (тёмный фон + сетка).
* [2026-03-17] Добавлено модальное окно `ServiceModal.astro` для карточек услуг (тег dialog, формат статьи, нативный тег video вместо iframe).
* [2026-03-17] Перевод всех роутов навигации в транслит (например, `/contacts` -> `/kontakty`, `/projects` -> `/proekty`).
* [2026-03-17] Страница `/kontakty` обновлена: добавлен `PageHeader`, карта переведена на lazy load, реквизиты сделаны кнопкой скачивания.

### Подготовительные фазы (до старта кода)
* [2026-03-02] Инициализирован проект Astro JS + Keystatic + Tailwind CSS + pnpm
* [2026-03-02] Заполнен `MASTER-PROMPT.MD` — краткий контекст проекта
* [2026-03-02] Заполнен `PROJECT_LOG_HOW.md` — полная инструкция по ведению проекта

### Фаза 1: Анализ и подготовка ✅
* [До 2026-03-02] Шаг 1.1 — Анализ конкурентов (Deep Research): `start/Шаг 1-1 Анализ шаг 1-1.md`
* [До 2026-03-02] Шаг 1.2 — Определение целевой аудитории: `start/1-2 шаг Определение целевой аудитории ООО Рубеж.md`
* [До 2026-03-02] Шаг 1.3 — УТП компании: `start/1-3 шаг Уникальное торговое предложение.md`

### Фаза 2: SEO-стратегия ✅
* [До 2026-03-02] Шаг 2.1 — Семантическое ядро: `start/Шаг 2.1 Семантическое ядро Deep Research.md`
* [До 2026-03-02] Шаг 2.2 — SEO мета-теги для страниц: `start/Шаг 2.2 SEO мета-теги для страниц.md`
* [До 2026-03-02] Шаг 2.3 — SEO-структура URL: `start/Шаг 2-3 SEO-структура URL.md`

### Фаза 3: Структура и архитектура ✅
* [До 2026-03-02] Шаг 3.1 — Карта сайта и навигация: `start/Шаг 3.1 Карта сайта и навигация.md`
* [До 2026-03-02] Шаг 3.2 — Wireframe главной: `start/Шаг 3-2 Wireframe главной страницы.md`
* [До 2026-03-02] Шаг 3.3 — Wireframe остальных страниц: `start/Шаг 3.3 Wireframe остальных страниц.md`

### Фаза 4: Контент и копирайтинг ✅
* [До 2026-03-02] Шаг 4.1 — Тексты главной: `start/Шаг 4.1 Тексты для главной страницы.md`
* [До 2026-03-02] Шаг 4.2 — Текст «О компании»: `start/Шаг 4.2 Текст для страницы О компании.md`
* [До 2026-03-02] Шаг 4.3 — Контент «Вакансии»: `start/Шаг 4.3 Контент для раздела Вакансии.md`
* [До 2026-03-02] Шаг 4.4 — Каталог техники: `start/Шаг 4.4 Контент для каталога спецтехники.md`
* [До 2026-03-02] Шаг 4.5/4.6 — «Проекты» и «Контакты»: `start/Шаг 4.5 4.6 Страница Проекты.md`

### Фаза 6: Разработка на Astro + Sanity CMS 🚧
* [2026-03-02] `PROJECT_LOG_HOW.md` дополнен правилами написания кода (Astro-компоненты, запрет React на страницах, Astro Image с widths/sizes, Impact/Inter шрифты)
* [2026-03-02] `astro.config.mjs` — убран `@astrojs/node` adapter (не установлен), mode=static для dev
* [2026-03-02] `src/styles/global.css` — CSS-переменные шрифтов (Impact/Inter), базовые стили Tailwind v4
* [2026-03-02] `src/layouts/BaseLayout.astro` — базовый layout с SEO-тегами, `lang="ru"`, подключение global.css
* [2026-03-02] `src/components/layout/Header.astro` — Header с dropdown «О нас»/«Вакансии» (CSS hover, без JS на десктопе), мобильный аккордеон, логотип через Astro Image
* [2026-03-02] `src/components/home/Hero.astro` — Hero-блок по референсу клиента: bg-фото (Astro Image, widths=[640,1024,1440,1920]), hex-бейдж УТП, Impact-заголовок в 2 строки, 2 CTA кнопки, блок статистики, left/right декоративные изображения с параллакс-скроллом
* [2026-03-02] `src/pages/index.astro` — заменён шаблонный на реальный: BaseLayout + Header + Hero

## 📂 Key Files Map
* `start/Техническое задание №1.md` — Первичное ТЗ клиента
* `start/Техническое задание №2.md` — Расширенное ТЗ (тексты, вся техника, реквизиты)
* `start/plan.md` — Полный план разработки (Фазы 1–7 с промтами)
* `sanity.config.ts` — Конфигурация Sanity Studio (embedded)
* `astro.config.mjs` — Конфигурация Astro (SSG + hybrid роут для Studio, Tailwind v4)
* `src/styles/global.css` — Глобальные стили (Impact/Inter переменные, базовые настройки)
* `src/layouts/BaseLayout.astro` — Базовый layout (SEO, lang=ru, global.css)
* `src/components/layout/Header.astro` — Header + dropdown меню
* `src/components/home/Hero.astro` — Hero-секция главной страницы
* `src/pages/index.astro` — Главная страница
* `PROJECT_LOG_HOW.md` — Инструкция по ведению проекта (правила кода)
