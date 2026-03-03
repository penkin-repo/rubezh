# Project Status: RUBEZH — ООО «Рубеж» Корпоративный сайт

**Last Updated:** 2026-03-03 01:15 (UTC+03:00)
**Current Phase:** Фаза 6 — Шаг 6.9: Главная страница ЗАВЕРШЕНА ✅

## 🚀 Active Context
* **Current Task:** Все блоки главной сделаны: Hero, Services, Advantages, Fleet (Swiper), Projects (lightbox), ContactForm (Google Sheets), Contacts (Яндекс.Карта), Footer
* **Next Step:** Внутренние страницы (/about, /equipment, /projects, /contacts) + Keystatic коллекции

## 🛠 Tech Stack & Versions
* **Astro:** (установлен, см. package.json)
* **Keystatic:** @keystatic/core + @keystatic/astro
* **Tailwind CSS:** v4 (через @tailwindcss/vite)
* **pnpm:** менеджер пакетов
* **TypeScript:** yes

## 🐛 Known Bugs / Issues
* [ ] [Low] `keystatic.config.ts` содержит только коллекцию `equipment` — нужно добавить `projects`, `vacancies` и singletons

## 📝 Recent Changes (Changelog)

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

### Фаза 6: Разработка на Astro + Keystatic 🚧
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
* `keystatic.config.ts` — Конфигурация CMS (пока только `equipment`)
* `astro.config.mjs` — Конфигурация Astro (SSG, Tailwind v4, React только для Keystatic)
* `src/styles/global.css` — Глобальные стили (Impact/Inter переменные, базовые настройки)
* `src/layouts/BaseLayout.astro` — Базовый layout (SEO, lang=ru, global.css)
* `src/components/layout/Header.astro` — Header + dropdown меню
* `src/components/home/Hero.astro` — Hero-секция главной страницы
* `src/pages/index.astro` — Главная страница
* `PROJECT_LOG_HOW.md` — Инструкция по ведению проекта (правила кода)
