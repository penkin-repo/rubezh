# ИНСТРУКЦИЯ ПО ВЕДЕНИЮ ПРОЕКТА RUBEZH (PROJECT LOGGER HOW)

Ты — ответственный разработчик корпоративного сайта для ООО «Рубеж».
Твоя ПЕРВООЧЕРЕДНАЯ задача перед написанием любого кода — поддерживать актуальность файла `PROJECT_LOG.md` в корне проекта.

В каждом ответе ты должен выполнять два действия:
1. **В НАЧАЛЕ:** Сверяешься с `PROJECT_LOG.md` — какой текущий этап, что в работе, какие баги.
2. **В КОНЦЕ:** Если были изменения в коде, структуре или планах — генерируешь обновлённый блок в `PROJECT_LOG.md`.

---

## 🧭 Контекст проекта

**Клиент:** ООО «Рубеж» — дорожно-строительная компания, г. Архангельск  
**Тип сайта:** Корпоративный сайт с каталогом техники и формой заявок  
**Стек:** Astro JS + Sanity CMS + pnpm + Tailwind CSS  
**Корень проекта:** `c:\DEV\2026\RUBEZH\`

---

## 🏢 О клиенте (из ТЗ)

- Основана в 2015 году, 11+ лет на рынке
- 200+ выполненных объектов / 60+ единиц спецтехники / 130+ сотрудников
- Собственный автопарк: самосвалы, экскаваторы, бульдозеры, катки, асфальтоукладчики и др.
- **Адрес:** г. Архангельск, ул. Дачная 61к1
- **Телефон:** 8-911-879-31-34 (Главный бухгалтер)
- **Email (офис):** amdofis@mail.ru
- **Email (HR):** rubezh.poisk@mail.ru / тел. 8-921-077-24-66
- **ВКонтакте:** https://vk.com/id865770117
- **ИНН:** 2901259316 | **КПП:** 290101001 | **ОГРН:** 1152901005630
- **Юр. адрес:** 163057, Арх. обл, г. Архангельск, ул. Дачная, д. 61, к. 1

---

## 📋 Страницы сайта (из ТЗ)

| # | Страница | Примечание |
|---|----------|-----------|
| 1 | **Главная** | Hero, преимущества, виды деятельности, цифры, превью проектов, превью техники, форма |
| 2 | **О компании** | История, автопарк, команда, ценности. Подраздел «Вакансии» при наведении |
| 3 | **Вакансии** | 5 вакансий, HR-контакты, ссылки на Avito и HH |
| 4 | **Проекты** | Фотогалерея с фильтрацией по типам работ |
| 5 | **Аренда спецтехники** | Каталог по категориям, форма заявки (ФИО, телефон, комментарий) |
| 6 | **Контакты** | Карта Яндекс, контакты по отделам, реквизиты, соцсети |

---

## ⚙️ Технический стек

- **Фреймворк:** Astro JS (SSG — статическая генерация)
- **CMS:** Sanity (embedded studio `/studio`, API `sanity.io`)
- **Стили:** Tailwind CSS
- **Пакетный менеджер:** pnpm
- **Язык:** TypeScript
- **Карта:** Яндекс.Карты API
- **Форма:** отправка в Google Таблицы (Google Apps Script) или аналог (Formspree)
- **Галерея:** GLightbox или аналог для lightbox
- **Оптимизация изображений:** Astro Image

### Текущие зависимости (package.json):
- `astro` — основной фреймворк
- `sanity`, `@sanity/client` — CMS
- `tailwindcss` — стили (через Tailwind v4 / Vite plugin)
- `@tailwindcss/vite` — интеграция Tailwind с Astro/Vite

---

## 🗂 Sanity — Схемы

На момент переезда в `src/sanity/schemas/` уже готовы:
- `hero` (singleton главной страницы)
- `header` (singleton шапки сайта с навигацией)
- `equipment` — Спецтехника (title, description, content) (надо перенести)

**Нужно добавить:**
- `projects` — Проекты (название, slug, категория, год, описание, изображения)
- `vacancies` — Вакансии (название, описание, требования, условия, активна)
- Singletons: главная, о компании, контакты

---

## 📂 Структура проекта (АКТУАЛЬНАЯ)

```
RUBEZH/
├── src/
│   ├── assets/            — изображения, SVG, иконки
│   │   ├── fleet/         — фото техники для каталога
│   │   ├── services/      — фото для карточек услуг
│   │   ├── works/         — фото объектов/проектов
│   │   ├── hero.jpg / hero-2.jpg  — фоны Hero-секции (моб + десктоп)
│   │   └── logo-main.svg  — логотип компании
│   ├── components/        — все .astro компоненты (см. карту ниже)
│   ├── content/           — Astro Content Collections (данные сайта)
│   ├── layouts/           — BaseLayout.astro (единственный layout)
│   ├── pages/             — маршруты сайта
│   ├── scripts/           — клиентские скрипты (PhotoSwipe)
│   ├── styles/            — глобальные стили
│   └── utils/             — утилиты (маска телефона, анимации, throttle)
├── public/                — статика (favicon, fonts, robots.txt, og-image)
│   └── fonts/             — Impact, Inter (woff2/woff)
├── start/                 — ТЗ клиента, план, материалы (в .gitignore)
├── sanity.config.ts       — конфиг Sanity Studio
├── astro.config.mjs       — конфиг Astro (site URL, Vercel adapter, Tailwind, React, Icon)
├── package.json
├── PROJECT_LOG.md         — живой лог проекта (обновлять после каждого изменения!)
└── PROJECT_LOG_HOW.md     — ЭТОТ ФАЙЛ — точка входа, контекст всего проекта
```

---

## 🧩 Карта компонентов (АКТУАЛЬНАЯ)

### `src/components/home/` — секции главной страницы

| Компонент | Назначение | Источник данных |
|-----------|------------|----------------|
| `Hero.astro` | Баннер с фоновым фото, заголовок, CTA-кнопки. `getImage` API для AVIF/WebP | Хардкод + assets |
| `Services.astro` | Карточки видов деятельности (6 шт), клик → модальное окно | Content collection `services` |
| `ServiceModal.astro` | Модальное окно услуги (фото/VK видео + описание) | Props от Services |
| `Advantages.astro` | Секция преимуществ компании (цветные карточки с иконками) | Хардкод |
| `StatsBar.astro` | Полоска с цифрами (11+ лет, 200+ объектов и т.д.) | Хардкод |
| `Fleet.astro` | Слайдер техники (Swiper, 10 featured items, CSS marquee) | Content collection `equipment` |
| `Projects.astro` | **СТАРЫЙ** — сетка 2×2 проектов с PhotoSwipe галереей | Content collection `projects` |
| `Projects2.astro` | **НОВЫЙ** — проекты по годам (вкладки), фото слева + текст справа | Content collection `projects2` |
| `ContactForm.astro` | Форма обратной связи (ФИО, телефон, комментарий) → Google Sheets | Content collection `site` |
| `Contacts.astro` | Секция контактов с картой Яндекс | Content collection `site` |

### `src/components/about/` — страница «О компании»

| Компонент | Назначение |
|-----------|------------|
| `AboutHero.astro` | Верхний блок с фото и текстом о компании |
| `FeaturesSection.astro` | Блок «Наши преимущества» с фото команды и техники |
| `StatsSection.astro` | Блок с цифрами компании (анимированные счётчики) |
| `ServicesSection.astro` | Блок видов деятельности на странице «О компании» |
| `QuoteSection.astro` | Цитата / миссия компании |
| `Marquee.astro` | Бегущая строка (CSS-анимация, без Swiper) |

### `src/components/equipment/`

| Компонент | Назначение |
|-----------|------------|
| `EquipmentCard.astro` | Универсальная карточка техники. Props: `actionType` (`modal` \| `link`), `href`, `buttonLabel`. Используется и на главной (Fleet), и на /arenda-spetstehniki |

### `src/components/vacancies/`

| Компонент | Назначение |
|-----------|------------|
| `VacancyAccordion.astro` | Аккордеон вакансий. Читает `getCollection('vacancies')`, рендерит body через `.render().Content` |

### `src/components/layout/`

| Компонент | Назначение |
|-----------|------------|
| `Header.astro` | Шапка сайта: логотип, навигация, мобильное меню, кнопка CTA |
| `Footer.astro` | Подвал: контакты, навигация, соцсети, копирайт |

### `src/components/ui/` — переиспользуемые UI-блоки

| Компонент | Назначение |
|-----------|------------|
| `Button.astro` | Универсальная кнопка с вариантами стилей |
| `LeadForm.astro` | Форма заявки (используется в модалке аренды техники) |
| `PageHeader.astro` | Заголовок внутренней страницы (шапка с фоном) |

### `src/components/SanityStudio.tsx`
— React-компонент для Sanity Studio (роут `/studio`). Единственный React на проекте.

---

## 📦 Content Collections (АКТУАЛЬНАЯ)

Все коллекции определены в `src/content/config.ts`. Данные хранятся в markdown-файлах с frontmatter.

| Коллекция | Папка | Поля frontmatter | Используется в |
|-----------|-------|------------------|----------------|
| `projects` | `src/content/projects/` | `title`, `category`, `description`, `images[]`, `order` | `Projects.astro` (старый), `proekty.astro` |
| `projects2` | `src/content/projects2/` | `year`, `title`, `works`, `client`, `images[]`, `order` | `Projects2.astro` (новый), `proekty2.astro` |
| `equipment` | `src/content/equipment/` | `items[]` → `{title, category, specs, image, order, featured, featuredOrder}` | `Fleet.astro`, `arenda-spetstehniki.astro` |
| `services` | `src/content/services/` | `title`, `desc`, `image`, `videoEmbedUrl?`, `hideModalImage?`, `order`, `size` | `Services.astro`, `ServiceModal.astro` |
| `site` | `src/content/site/` | Контакты: телефоны, email, адрес, соцсети, реквизиты, расписание, mapEmbedUrl | Footer, Contacts, ContactForm, LeadForm, kontakty, vakansii, privacy |
| `vacancies` | `src/content/vacancies/` | `title`, `order` + markdown body (описание) | `VacancyAccordion.astro` |

---

## 🎨 Стили (АКТУАЛЬНАЯ)

### `src/styles/global.css` — главный файл стилей

| Секция | Что делает |
|--------|------------|
| `@import "tailwindcss"` | Подключение Tailwind v4 |
| `@font-face` (×4) | Подключение шрифтов: Impact (заголовки), Inter 400/500/600/700 (текст) из `public/fonts/` |
| `:root` | CSS-переменные: `--color-brand-dark` (#0257c0), `--color-brand-light` (#297fec), `--gradient-brand`, `--font-heading`, `--font-body`, `--hero-text-shadow` |
| `@theme` | Tailwind v4 директива — превращает переменные в utility-классы: `text-brand-dark`, `bg-brand-light`, `bg-adv-blue/green/violet/orange/teal`, `font-heading`, `font-body` |
| `.font-heading` / `.font-body` | Утилитарные классы для шрифтов |
| `.bg-grid-pattern` / `.bg-grid-pattern-white` | Фоновые сетки (паттерн) |
| `.hero-text-shadow` | Тень на заголовке Hero |
| `@keyframes fadeSlideUp` | Анимация появления Hero-контента (4 класса с разной задержкой) |

### `src/styles/photoswipe-custom.css` — кастомные стили PhotoSwipe
— Кастомизация lightbox-галереи: закруглённые кнопки, цвет фона, стили подписей.

### Бренд-цвета
| Переменная | Цвет | Tailwind-класс | Где используется |
|-----------|------|----------------|------------------|
| `--color-brand-dark` | `#0257c0` | `text-brand-dark`, `bg-brand-dark` | Кнопки, заголовки, акценты, активные вкладки |
| `--color-brand-light` | `#297fec` | `text-brand-light`, `bg-brand-light` | Hover-состояния, вторичные акценты |
| `--color-adv-*` | 5 цветов | `bg-adv-blue/green/violet/orange/teal` | Только в секции Advantages |

### Шрифты
| Шрифт | Переменная | Класс | Где |
|-------|-----------|-------|-----|
| **Impact** | `--font-heading` | `.font-heading` | h1, h2, h3, CTA-кнопки (UPPERCASE) |
| **Inter** | `--font-body` | `.font-body` (или `html` по умолчанию) | Весь остальной текст, формы, навигация |

---

## 🔧 Утилиты и скрипты (АКТУАЛЬНАЯ)

### `src/utils/`

| Файл | Назначение |
|------|------------|
| `phone-mask.ts` | Класс `PhoneMask` — маска телефона `8 (___) ___-__-__`. Сохраняет позицию курсора при редактировании. Также `formatPhoneNumber()` для одноразового форматирования. |
| `animate-counter.ts` | Анимация счётчиков (плавное увеличение числа от 0 до N). Используется в StatsBar и StatsSection. |
| `throttle.ts` | Утилита throttle для оптимизации обработчиков событий (scroll, resize). |

### `src/scripts/`

| Файл | Назначение |
|------|------------|
| `photoswipe-init.ts` | Инициализация PhotoSwipe Lightbox. Экспортирует `initPhotoSwipe(config)`. Статический импорт (не динамический — откачали из-за багов). Используется в Projects, Projects2, proekty, proekty2. |

---

## 📄 Страницы (АКТУАЛЬНАЯ)

| URL | Файл | Описание |
|-----|------|----------|
| `/` | `index.astro` | Главная: Hero → Services → Advantages → Fleet → **Projects2** → ContactForm → Contacts |
| `/o-kompanii` | `o-kompanii.astro` | О компании: AboutHero, Stats, Features, Services, Quote |
| `/vakansii` | `vakansii.astro` | Вакансии: VacancyAccordion |
| `/proekty` | `proekty.astro` | **Старые** проекты: сетка с PhotoSwipe (collection `projects`) |
| `/proekty2` | `proekty2.astro` | **Новые** проекты: по годам, фото+текст (collection `projects2`) |
| `/arenda-spetstehniki` | `arenda-spetstehniki.astro` | Новый hero (белый фон, текст слева + экскаватор справа), каталог техники: фильтры по категориям + поиск, модальная форма заявки. Старый PageHeader закомментирован. |
| `/kontakty` | `kontakty.astro` | Контакты: карта, телефоны, реквизиты |
| `/privacy` | `privacy.astro` | Политика конфиденциальности |
| `/studio` | `studio/[...slug].astro` | Sanity Studio (React) |
| `/404` | `404.astro` | Страница 404 |

---

## 🖼 Assets (АКТУАЛЬНАЯ)

| Папка | Содержимое |
|-------|------------|
| `src/assets/fleet/` | Фото техники для каталога (JPEG/PNG) |
| `src/assets/services/` | Фото для карточек услуг |
| `src/assets/works/` | Фото объектов/проектов (АРХРЕЧПОРТ, Купчино, ПРОМСТРОЙ, СЕВЕРАЛМАЗ) |
| `src/assets/hero.jpg` / `hero-2.jpg` | Фоны Hero-секции (мобильный / десктопный) |
| `src/assets/logo-main.svg` | Логотип ООО «Рубеж» |
| `public/fonts/` | Шрифты Impact и Inter (woff2/woff) |
| `public/robots.txt` | Правила индексации |

---

## 🏗 Layout

### `src/layouts/BaseLayout.astro`
— Единственный layout. Содержит:
- `<html>`, `<head>`, `<body>`
- Мета-теги: title, description, viewport, charset
- **Open Graph** + **Twitter Card** теги
- **Canonical URL** (из `Astro.url`)
- Preload для hero-изображения (LCP оптимизация)
- Подключение `global.css`
- Cookie-уведомление (скрипт)

---

## 📁 Папка `start/` — что там есть

Все исходные материалы проекта (ТЗ + результаты исследований шагов 1–4):

| Файл | Содержимое |
|------|-----------|
| `Техническое задание №1.md` | Первичное ТЗ клиента (страницы, референсы) |
| `Техническое задание №2.md` | Расширенное ТЗ (тексты, контакты, вся техника) |
| `plan.md` | Полный план разработки (Фазы 1–7 с промтами) |
| `Шаг 1-1 Анализ шаг 1-1.md` | Анализ конкурентов (Deep Research) |
| `1-2 шаг Определение целевой аудитории ООО Рубеж.md` | Целевая аудитория |
| `1-3 шаг Уникальное торговое предложение.md` | УТП компании, слоганы |
| `Шаг 2.1 Семантическое ядро Deep Research.md` | Семантическое ядро (SEO) |
| `Шаг 2.2 SEO мета-теги для страниц.md` | Title, Description, H1, OG-теги для всех страниц |
| `Шаг 2-3 SEO-структура URL.md` | URL-структура сайта (ЧПУ) |
| `Шаг 3.1 Карта сайта и навигация.md` | Детальная карта сайта |
| `Шаг 3-2 Wireframe главной страницы.md` | Wireframe главной |
| `Шаг 3.3 Wireframe остальных страниц.md` | Wireframe внутренних страниц |
| `Шаг 4.1 Тексты для главной страницы.md` | SEO-тексты главной |
| `Шаг 4.2 Текст для страницы О компании.md` | Контент страницы «О компании» |
| `Шаг 4.3 Контент для раздела Вакансии.md` | Контент страницы «Вакансии» |
| `Шаг 4.4 Контент для каталога спецтехники.md` | Описания техники для каталога |
| `Шаг 4.5 4.6 Страница Проекты.md` | Контент «Проекты» и «Контакты» |

> **Важно:** Всегда читай нужный файл из `start/` перед разработкой соответствующей страницы или компонента!

---

## 📋 Общий план разработки (Фазы)

| Фаза | Название | Статус |
|------|----------|--------|
| 1 | Анализ и подготовка | ✅ Готово |
| 2 | SEO-стратегия и семантическое ядро | ✅ Готово |
| 3 | Структура и архитектура сайта | ✅ Готово |
| 4 | Контент и копирайтинг | ✅ Готово |
| 5 | Дизайн и UI/UX | ⬜ В очереди |
| 6 | Разработка на Astro + Sanity CMS | ⬜ В очереди |
| 7 | Тестирование и запуск | ⬜ В очереди |

---

## 📝 Структура файла `PROJECT_LOG.md`

```markdown
# Project Status: RUBEZH — ООО «Рубеж» Корпоративный сайт

**Last Updated:** [YYYY-MM-DD HH:MM (UTC+03:00)]
**Current Phase:** Фаза N — [Название фазы]

## 🚀 Active Context
* **Current Task:** [Что делаем прямо сейчас]
* **Next Step:** [Что нужно сделать следующим]

## 🛠 Tech Stack & Versions
* **Astro:** [версия]
* **Sanity:** [версия]
* **Tailwind CSS:** [версия]
* **pnpm:** [версия]

## 🐛 Known Bugs / Issues
* [ ] [High/Medium/Low] Описание проблемы...
* [x] (Fixed) Исправленная проблема...

## 📝 Recent Changes (Changelog)
* [YYYY-MM-DD] Описание изменения...

## 📂 Key Files Map
* `src/pages/index.astro` — Главная страница
* `src/layouts/BaseLayout.astro` — Базовый layout
* `sanity.config.ts` — Конфигурация CMS
* `src/components/` — Компоненты
* `start/` — ТЗ и материалы от клиента
```

---

## 🤖 Правила работы для ИИ

1. **Всегда стартуй с чтения `PROJECT_LOG.md`** — там текущий контекст.
2. **Перед работой над страницей** — читай соответствующий файл из `start/`.
3. **После любых изменений** — обновляй `PROJECT_LOG.md` (changelog + active context).
4. **Ошибки и баги** — сразу записывай в секцию `Known Bugs / Issues`.
5. **Не изобретай контент** — весь текст, тексты, данные — из файлов в `start/`.
6. **Компоненты** — всё переиспользуемое выноси в `src/components/`.
7. **Стили** — только Tailwind CSS (без inline styles, без отдельных CSS-файлов на компонент).
8. **TypeScript** — весь код типизирован.
9. **SSG** — сайт полностью статический, никакого SSR без необходимости.
10. **Изображения** — через Astro Image component для оптимизации.

---

## 💻 Правила написания кода

### Компоненты — только Astro
- **Все компоненты** пишутся как `.astro` файлы — никакого React/Vue/Svelte на страницах сайта.
- **React используется ТОЛЬКО** внутри Sanity Studio (роут `/studio`), интегрированного в Astro проект. На самом сайте — только Astro.
- Каждая секция страницы = отдельный компонент в `src/components/`.
- **Актуальная структура компонентов описана в секции «Карта компонентов» выше.**

### Изображения — Astro Image
- **Всегда** используй `<Image />` из `astro:assets` (не тег `<img>`).
- Указывай **несколько densities или widths** для адаптивности:
  ```astro
  ---
  import { Image } from 'astro:assets';
  import heroImg from '../assets/hero.jpg';
  ---
  <Image
    src={heroImg}
    alt="Описание"
    widths={[640, 1024, 1440, 1920]}
    sizes="100vw"
    loading="eager"
    quality={85}
  />
  ```
- `loading="eager"` — для картинок выше fold (hero).
- `loading="lazy"` — для всего остального.
- `widths` + `sizes` — обязательно для всех не-иконок.

### Шрифты
- **Заголовки** (`h1`, `h2`, `h3`, кнопки CTA): шрифт **Impact** (font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif)
- **Основной текст** (`p`, `span`, `li`): шрифт **Inter**
- Шрифты пока подключены из системы. Позже будут перенесены в `public/fonts/` и подключены через `@font-face` в глобальных стилях.
- В Tailwind добавить кастомные font-family:
  ```css
  /* В глобальном CSS или tailwind.config */
  --font-heading: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  --font-body: Inter, system-ui, sans-serif;
  ```

### Стили
- **Только Tailwind CSS** — никаких `<style>` блоков внутри `.astro` компонентов (исключение: специфические анимации/эффекты, которые нельзя сделать через Tailwind утилиты).
- Вместо `style="..."` — всегда классы Tailwind.
- Глобальные CSS-переменные и базовые стили — в `src/styles/global.css`.

### Структура `.astro` компонента
```astro
---
// 1. Импорты
import { Image } from 'astro:assets';
import myImage from '../assets/image.jpg';

// 2. Props (TypeScript)
interface Props {
  title: string;
  subtitle?: string;
}
const { title, subtitle } = Astro.props;
---

<!-- 3. Разметка (только HTML + Astro компоненты, без JSX) -->
<section class="...tailwind классы...">
  <h1>{title}</h1>
  <Image src={myImage} alt={title} widths={[640, 1280]} sizes="100vw" />
</section>
```

### Запрещено
- ❌ `<script>` теги с бизнес-логикой внутри компонентов (кроме минимального JS для интерактива: меню, галерея)
- ❌ `useState`, `useEffect` и любой React в компонентах страниц
- ❌ Inline стили (`style="color: red"`)
- ❌ Хардкод текстов прямо в компоненте без Props — тексты должны приходить из `start/` material или Sanity CMS
- ❌ `<img>` тег — только `<Image />` из `astro:assets`

---

## 🎨 Что нравится клиенту (референсы)

- **https://nvk54.ru/o-kompanii/** — подача информации на главной
- **https://gkomega.com/work** — раздел вакансий, объекты
- **https://msk-nord.ru/nashi-raboty** — галерея работ, техника

## ❌ Что НЕ нравится клиенту

- Сухой нечитабельный текст (как на https://sbt-region.ru/company)
- Перегруженные страницы

---

## 🚗 Каталог спецтехники (из ТЗ)

### Самосвалы (3-осные)
- HOWO T5G — 30т, 20 куб, 6 ед.
- FAW J6 6X6 6Х4 — полный привод, 2 ед.
- КАМАЗ К3440 65222-53 — полный привод, 25т
- КАМАЗ Т2530 65115-А5 — 25т

### Самосвалы (4-осные)
- SCANIA P8X400 P440 — 30т, 20 куб, 2 ед.

### Спецтехника
- Водовозка FAW J6 6X4 — 10 куб
- Гудронатор FAW J6 6X4 — 8 куб
- Трал-Тонар RENAULT PREMIUM 6X4 — 25т / 40т
- КАМАЗ 44672G3-10 (топливозаправщик) — 11 куб
- КАМАЗ 658610 (КМУ) — вылет стрелы до 18м
- Автокран КС-55729-9К-31 — 32т, стрела 31м
- Автобетоносмеситель КАМАЗ 581471 — 6 куб

### Экскаваторы
- Колёсный: XCMG XE180ED
- Гусеничные: HYUNDAI HX220S / SHANTUI SE210-9 (×2) / LIUGONG CLG922E (×9) / HITACHI ZX200-5G

### Бульдозеры
- Komatsu D65PX-16 — 21т
- SHANTUI SD17B3XL — 20т
- CATERPILLAR D6R XL — 20т

### Катки
- Грунтовые: SHANTUI SR12P-5 (13.5т) / SR14P (14.5т) / HAMM 3114 (14т)
- Асфальтовые: XCMG XMR403 (4т) / XCMG XD83 (8.5т)

### Прочее
- Асфальтоукладчик XCMG RP505
- Установка ГНБ GOODENG GD360C-LS — тяга 36т
- Экскаватор-погрузчик JCB 3CX K14M2NM — 4 ед.

---

## 👷 Вакансии (из ТЗ)

1. Водитель на самосвал категории С
2. Монтажник НВК
3. Дорожный рабочий
4. Машинист гусеничного экскаватора
5. Машинист бульдозера

**HR-контакты:** rubezh.poisk@mail.ru / тел. 8-921-077-24-66  
**Avito:** https://www.avito.ru/profile/items/active/all?s=4  
**HH:** https://severodvinsk.hh.ru/employer/vacancies

---

## 📌 Форма заявки на аренду техники

**Поля:** ФИО, Номер телефона, Комментарий (срок аренды, адрес)  
**Куда:** Google Таблицы (через Apps Script) или Formspree/Getform

---

## 🗺 Карта сайта и URL-структура

```
/                    — Главная (Hero, Services, Advantages, Fleet, Projects2, ContactForm, Contacts)
/o-kompanii           — О компании (AboutHero, Stats, Features, Services, Quote)
/vakansii             — Вакансии (VacancyAccordion)
/proekty              — Проекты СТАРЫЕ (сетка с PhotoSwipe, collection projects)
/proekty2             — Проекты НОВЫЕ (по годам, collection projects2)
/arenda-spetstehniki  — Аренда спецтехники (новый hero: текст + экскаватор, каталог + поиск + фильтры + модальная форма)
/kontakty             — Контакты (карта, телефоны, реквизиты)
/privacy              — Политика конфиденциальности
/studio               — Sanity Studio (React)
```

---

## ⚡ Деплой

- **Платформа:** Vercel (автодеплой при push в `main`)
- **Адаптер:** `@astrojs/vercel`
- **GitHub Pages:** отключен (workflow удалён)
- **Домен:** настраивается в Vercel Dashboard
- **Сборка:** `astro build` (SSG)
- **Ошибка EPERM symlink при локальной сборке на Windows** — это баг Vercel-адаптера, на Vercel-сервере не воспроизводится
