# План миграции на Sanity CMS — ООО «Рубеж»

**Дата создания:** 08.04.2026  
**Текущий статус:** Частичная интеграция (Hero + Header)  
**Цель:** Полный переход с Astro Content Collections на Sanity CMS

---

## 📊 Текущее состояние

### ✅ Уже на Sanity
- **Hero** (`src/components/home/Hero.astro`)
- **Header** (`src/components/layout/Header.astro`)

### 📁 На Astro Content Collections
- **Projects** — `src/content/projects/*.md` (фотогалерея проектов)
- **Equipment** — `src/content/equipment/catalog.md` (каталог спецтехники)
- **Services** — `src/content/services/*.md` (виды деятельности)
- **Site** — `src/content/site/contacts.md` (контакты компании)
- **Vacancies** — `src/content/vacancies/*.md` (вакансии)

---

## 🎯 Стратегия миграции

### Принципы
1. **Постепенность** — миграция по одной коллекции за раз
2. **Обратная совместимость** — старые данные работают до полной миграции
3. **Тестирование** — каждый этап проверяется перед следующим
4. **Rollback план** — возможность отката на предыдущую версию

### Приоритеты
**Высокий приоритет:**
- Site (контакты) — используется в 10+ компонентах
- Equipment (техника) — ключевой контент для бизнеса

**Средний приоритет:**
- Projects (проекты) — портфолио компании
- Vacancies (вакансии) — часто обновляемый контент

**Низкий приоритет:**
- Services (услуги) — редко меняется

---

## 📋 Этапы миграции

### Этап 0: Подготовка (1-2 дня)

**Задачи:**
- [ ] Создать резервную копию проекта
- [ ] Документировать текущую структуру Content Collections
- [ ] Проверить версию Sanity и зависимостей
- [ ] Настроить staging окружение для тестирования

**Файлы для анализа:**
- `src/content/config.ts` — схемы всех коллекций
- `sanity.config.ts` — текущая конфигурация Sanity
- `src/sanity/schemas/` — существующие схемы

---

### Этап 1: Site (Контакты) — 2-3 дня

**Приоритет:** 🔴 Высокий  
**Сложность:** ⭐⭐ Средняя  
**Зависимости:** 10+ компонентов

#### 1.1 Создание Sanity Schema

**Файл:** `src/sanity/schemas/site.ts`

```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'site',
  title: 'Настройки сайта',
  type: 'document',
  fields: [
    {
      name: 'companyName',
      title: 'Название компании',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'mainPhoneDisplay',
      title: 'Основной телефон (отображение)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'mainPhoneHref',
      title: 'Основной телефон (ссылка)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'officeEmail',
      title: 'Email офиса',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'hrEmail',
      title: 'Email HR',
      type: 'string',
      validation: Rule => Rule.email()
    },
    {
      name: 'hrPhone',
      title: 'Телефон HR',
      type: 'string'
    },
    {
      name: 'address',
      title: 'Адрес',
      type: 'text'
    },
    {
      name: 'workSchedule',
      title: 'График работы',
      type: 'string'
    },
    {
      name: 'vkUrl',
      title: 'ВКонтакте',
      type: 'url'
    },
    {
      name: 'hhUrl',
      title: 'HeadHunter',
      type: 'url'
    },
    {
      name: 'avitoUrl',
      title: 'Avito',
      type: 'url'
    },
    {
      name: 'mapUrl',
      title: 'Яндекс.Карты',
      type: 'url'
    },
    {
      name: 'requisites',
      title: 'Реквизиты',
      type: 'object',
      fields: [
        { name: 'inn', title: 'ИНН', type: 'string' },
        { name: 'kpp', title: 'КПП', type: 'string' },
        { name: 'ogrn', title: 'ОГРН', type: 'string' },
        { name: 'legalAddress', title: 'Юридический адрес', type: 'text' }
      ]
    }
  ]
})
```

#### 1.2 Миграция данных

**Создать скрипт:** `scripts/migrate-site-to-sanity.ts`

```typescript
import { client } from '../src/sanity/client'
import fs from 'fs'
import matter from 'gray-matter'

async function migrateSiteData() {
  const mdContent = fs.readFileSync('src/content/site/contacts.md', 'utf-8')
  const { data } = matter(mdContent)
  
  const siteDoc = {
    _type: 'site',
    _id: 'site-settings',
    ...data
  }
  
  await client.createOrReplace(siteDoc)
  console.log('✅ Site data migrated to Sanity')
}

migrateSiteData()
```

#### 1.3 Обновление компонентов

**Компоненты для обновления:**
- `src/components/layout/Footer.astro`
- `src/components/home/Contacts.astro`
- `src/components/home/ContactForm.astro`
- `src/pages/kontakty.astro`
- `src/pages/vakansii.astro`
- `src/components/vacancies/VacancyAccordion.astro`
- `src/pages/privacy.astro`
- `src/pages/arenda-spetstehniki.astro`

**Было:**
```astro
const [contactsEntry] = (await getCollection('site')).sort((a, b) =>
  a.id.localeCompare(b.id)
);
const contacts = contactsEntry.data;
```

**Стало:**
```astro
import { client } from '../sanity/client';

const contacts = await client.fetch(`*[_type == "site" && _id == "site-settings"][0]`);
```

#### 1.4 Тестирование

- [ ] Проверить все страницы с контактами
- [ ] Проверить формы (fallback телефоны)
- [ ] Проверить Footer на всех страницах
- [ ] Проверить Privacy page
- [ ] Проверить работу в dev и production режимах

---

### Этап 2: Equipment (Техника) — 3-4 дня

**Приоритет:** 🔴 Высокий  
**Сложность:** ⭐⭐⭐ Высокая  
**Зависимости:** Fleet.astro, arenda-spetstehniki.astro, EquipmentCard.astro

#### 2.1 Создание Sanity Schema

**Файл:** `src/sanity/schemas/equipment.ts`

```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'equipment',
  title: 'Спецтехника',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Категория',
      type: 'string',
      options: {
        list: [
          { title: 'Самосвалы', value: 'Самосвалы' },
          { title: 'Экскаваторы', value: 'Экскаваторы' },
          { title: 'Бульдозеры', value: 'Бульдозеры' },
          { title: 'Катки', value: 'Катки' },
          { title: 'Асфальтоукладчики', value: 'Асфальтоукладчики' },
          { title: 'Погрузчики', value: 'Погрузчики' },
          { title: 'Краны', value: 'Краны' },
          { title: 'Прочее', value: 'Прочее' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'specs',
      title: 'Характеристики',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'image',
      title: 'Изображение',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'featured',
      title: 'Показывать на главной',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'featuredOrder',
      title: 'Порядок на главной',
      type: 'number',
      hidden: ({ document }) => !document?.featured
    },
    {
      name: 'order',
      title: 'Порядок в каталоге',
      type: 'number',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'image'
    },
    prepare({ title, category, media }) {
      return {
        title,
        subtitle: category,
        media
      }
    }
  }
})
```

#### 2.2 Миграция данных

**Скрипт:** `scripts/migrate-equipment-to-sanity.ts`

```typescript
import { client } from '../src/sanity/client'
import { getCollection } from 'astro:content'

async function migrateEquipment() {
  const equipmentCollection = await getCollection('equipment')
  const items = equipmentCollection.flatMap(entry => entry.data.items)
  
  for (const item of items) {
    const doc = {
      _type: 'equipment',
      title: item.title,
      category: item.category,
      specs: item.specs,
      // Загрузка изображения в Sanity Assets
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: await uploadImageToSanity(item.image)
        }
      },
      featured: item.featured || false,
      featuredOrder: item.featuredOrder || 999,
      order: item.order
    }
    
    await client.create(doc)
  }
  
  console.log(\`✅ Migrated \${items.length} equipment items\`)
}
```

#### 2.3 Обновление компонентов

**Компоненты:**
- `src/components/home/Fleet.astro`
- `src/pages/arenda-spetstehniki.astro`
- `src/components/equipment/EquipmentCard.astro`

**Было:**
```astro
const equipmentCollection = await getCollection('equipment');
const fleet = equipmentCollection
  .flatMap(entry => entry.data.items)
  .filter(item => item.featured)
  .sort((a, b) => a.featuredOrder - b.featuredOrder);
```

**Стало:**
```astro
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

const fleet = await client.fetch(\`
  *[_type == "equipment" && featured == true] | order(featuredOrder asc) {
    title,
    category,
    specs,
    "imageUrl": image.asset->url,
    order
  }
\`);
```

#### 2.4 Тестирование

- [ ] Проверить Fleet слайдер на главной
- [ ] Проверить каталог техники на странице аренды
- [ ] Проверить фильтрацию по категориям
- [ ] Проверить модальное окно заявки
- [ ] Проверить изображения (оптимизация, lazy loading)

---

### Этап 3: Projects (Проекты) — 2-3 дня

**Приоритет:** 🟡 Средний  
**Сложность:** ⭐⭐⭐ Высокая (PhotoSwipe галереи)  
**Зависимости:** Projects.astro, proekty.astro

#### 3.1 Создание Sanity Schema

**Файл:** `src/sanity/schemas/project.ts`

```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Проекты',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название проекта',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Категория',
      type: 'string',
      options: {
        list: [
          { title: 'Дорожное строительство', value: 'Дорожное строительство' },
          { title: 'Благоустройство', value: 'Благоустройство' },
          { title: 'Земляные работы', value: 'Земляные работы' },
          { title: 'Инженерные сети', value: 'Инженерные сети' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Описание',
      type: 'text'
    },
    {
      name: 'coverImage',
      title: 'Обложка',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    },
    {
      name: 'gallery',
      title: 'Галерея',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          {
            name: 'caption',
            title: 'Подпись',
            type: 'string'
          }
        ]
      }]
    },
    {
      name: 'order',
      title: 'Порядок',
      type: 'number',
      validation: Rule => Rule.required()
    },
    {
      name: 'featured',
      title: 'Показывать на главной',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'coverImage'
    }
  }
})
```

#### 3.2 Миграция данных

**Особенности:**
- Множественные изображения в галерее
- Сохранение порядка фотографий
- Миграция метаданных (подписи к фото)

#### 3.3 Обновление компонентов

**Компоненты:**
- `src/components/home/Projects.astro`
- `src/pages/proekty.astro`

**Интеграция с PhotoSwipe:**
```astro
const projects = await client.fetch(\`
  *[_type == "project"] | order(order asc) {
    title,
    category,
    description,
    "coverUrl": coverImage.asset->url,
    "gallery": gallery[]{
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      caption
    }
  }
\`);
```

---

### Этап 4: Vacancies (Вакансии) — 1-2 дня

**Приоритет:** 🟡 Средний  
**Сложность:** ⭐ Низкая  
**Зависимости:** VacancyAccordion.astro, vakansii.astro

#### 4.1 Создание Sanity Schema

**Файл:** `src/sanity/schemas/vacancy.ts`

```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'vacancy',
  title: 'Вакансии',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Должность',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Описание',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'object',
          name: 'list',
          fields: [
            {
              name: 'items',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ]
        }
      ]
    },
    {
      name: 'order',
      title: 'Порядок',
      type: 'number',
      validation: Rule => Rule.required()
    },
    {
      name: 'isActive',
      title: 'Активна',
      type: 'boolean',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order'
    },
    prepare({ title, order }) {
      return {
        title,
        subtitle: \`Порядок: \${order}\`
      }
    }
  }
})
```

#### 4.2 Обновление компонентов

**Компоненты:**
- `src/components/vacancies/VacancyAccordion.astro`
- `src/pages/vakansii.astro`

**Portable Text рендеринг:**
```astro
import { PortableText } from '@portabletext/react'

const vacancies = await client.fetch(\`
  *[_type == "vacancy" && isActive == true] | order(order asc)
\`);
```

---

### Этап 5: Services (Услуги) — 1 день

**Приоритет:** 🟢 Низкий  
**Сложность:** ⭐ Низкая  
**Зависимости:** ServicesSection.astro

#### 5.1 Создание Sanity Schema

**Файл:** `src/sanity/schemas/service.ts`

```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Услуги',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Описание',
      type: 'text'
    },
    {
      name: 'icon',
      title: 'Иконка',
      type: 'string',
      description: 'Название иконки из Lucide (например: truck, hammer)'
    },
    {
      name: 'image',
      title: 'Изображение',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'order',
      title: 'Порядок',
      type: 'number',
      validation: Rule => Rule.required()
    }
  ]
})
```

---

## 🛠 Технические детали

### Обновление зависимостей

```json
{
  "dependencies": {
    "@sanity/client": "^6.x",
    "@sanity/image-url": "^1.x",
    "@portabletext/react": "^3.x",
    "sanity": "^3.x"
  }
}
```

### Создание утилит

**Файл:** `src/sanity/utils.ts`

```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export function getImageUrl(source: any, width?: number, height?: number) {
  let url = builder.image(source).auto('format').quality(85)
  
  if (width) url = url.width(width)
  if (height) url = url.height(height)
  
  return url.url()
}
```

### Кеширование

**Astro config:**
```javascript
export default defineConfig({
  integrations: [
    sanity({
      projectId: 'your-project-id',
      dataset: 'production',
      useCdn: true, // Включить CDN для production
      apiVersion: '2024-01-01'
    })
  ]
})
```

---

## ⚠️ Риски и митигация

### Риск 1: Потеря данных при миграции
**Митигация:**
- Резервное копирование перед каждым этапом
- Миграция в staging окружение
- Проверка данных после миграции

### Риск 2: Производительность (SSR vs SSG)
**Митигация:**
- Использовать Sanity CDN
- Настроить кеширование в Astro
- Рассмотреть ISR (Incremental Static Regeneration)

### Риск 3: Изменение структуры данных
**Митигация:**
- Создать адаптеры для обратной совместимости
- Постепенная миграция компонентов
- Документировать breaking changes

### Риск 4: Сложность для контент-менеджера
**Митигация:**
- Создать понятные названия полей
- Добавить описания и подсказки
- Провести обучение работе с Sanity Studio

---

## 📅 Временная оценка

| Этап | Время | Зависимости |
|------|-------|-------------|
| **0. Подготовка** | 1-2 дня | — |
| **1. Site (Контакты)** | 2-3 дня | Этап 0 |
| **2. Equipment (Техника)** | 3-4 дня | Этап 1 |
| **3. Projects (Проекты)** | 2-3 дня | Этап 2 |
| **4. Vacancies (Вакансии)** | 1-2 дня | Этап 1 |
| **5. Services (Услуги)** | 1 день | Этап 1 |
| **Тестирование и оптимизация** | 2-3 дня | Все этапы |

**Общее время:** 12-18 рабочих дней (2.5-4 недели)

---

## ✅ Чек-лист перед стартом

- [ ] Создана резервная копия проекта
- [ ] Настроен Sanity Studio
- [ ] Создан staging dataset в Sanity
- [ ] Проверены права доступа к Sanity
- [ ] Установлены все зависимости
- [ ] Создан план отката (rollback)
- [ ] Команда ознакомлена с планом

---

## 📚 Полезные ресурсы

- [Sanity Documentation](https://www.sanity.io/docs)
- [Astro + Sanity Integration](https://docs.astro.build/en/guides/cms/sanity/)
- [Sanity Image URL Builder](https://www.sanity.io/docs/image-url)
- [Portable Text](https://www.sanity.io/docs/presenting-block-text)

---

**Последнее обновление:** 08.04.2026  
**Автор:** Cascade AI  
**Статус:** План готов к реализации
