import { defineField, defineType } from 'sanity';

/**
 * Единый документ-синглтон с контактными данными сайта.
 * Поля сгруппированы по вкладкам, чтобы клиент менял всё в одном месте.
 * ВАЖНО: имена полей 1:1 совпадают с локальной коллекцией `site`
 * (src/content/site/contacts.md), чтобы fallback возвращал идентичную форму.
 */
export const siteSchema = defineType({
    name: 'site',
    title: '📇 Контакты и реквизиты',
    type: 'document',
    groups: [
        { name: 'main', title: 'Основное', default: true },
        { name: 'phones', title: 'Телефоны' },
        { name: 'emails', title: 'Email' },
        { name: 'address', title: 'Адрес и карта' },
        { name: 'social', title: 'Соцсети и площадки' },
        { name: 'requisites', title: 'Реквизиты' },
        { name: 'schedule', title: 'График работы' },
    ],
    fields: [
        defineField({
            name: 'companyName',
            title: 'Название компании',
            type: 'string',
            group: 'main',
            initialValue: 'ООО «Рубеж»',
            validation: (Rule) => Rule.required(),
        }),

        // ── Телефоны ───────────────────────────────────────────────
        defineField({
            name: 'mainPhoneDisplay',
            title: 'Основной телефон — отображение',
            description: 'Как видит посетитель, например: 8-911-879-31-34',
            type: 'string',
            group: 'phones',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'mainPhoneHref',
            title: 'Основной телефон — ссылка (tel)',
            description: 'Без пробелов, например: +79118793134',
            type: 'string',
            group: 'phones',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'hrPhoneDisplay',
            title: 'Телефон HR — отображение',
            type: 'string',
            group: 'phones',
        }),
        defineField({
            name: 'hrPhoneHref',
            title: 'Телефон HR — ссылка (tel)',
            type: 'string',
            group: 'phones',
        }),

        // ── Email ──────────────────────────────────────────────────
        defineField({
            name: 'officeEmail',
            title: 'Email офиса',
            type: 'string',
            group: 'emails',
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: 'hrEmail',
            title: 'Email HR',
            type: 'string',
            group: 'emails',
            validation: (Rule) => Rule.email(),
        }),

        // ── Адрес и карта ──────────────────────────────────────────
        defineField({
            name: 'addressShort',
            title: 'Адрес — краткий',
            type: 'string',
            group: 'address',
        }),
        defineField({
            name: 'addressFull',
            title: 'Адрес — полный',
            type: 'string',
            group: 'address',
        }),
        defineField({
            name: 'mapEmbedUrl',
            title: 'Ссылка на виджет Яндекс.Карт (iframe src)',
            type: 'url',
            group: 'address',
        }),

        // ── Соцсети и площадки ─────────────────────────────────────
        defineField({
            name: 'vkUrl',
            title: 'ВКонтакте',
            type: 'url',
            group: 'social',
        }),
        defineField({
            name: 'avitoUrl',
            title: 'Avito',
            type: 'url',
            group: 'social',
        }),
        defineField({
            name: 'hhUrl',
            title: 'HeadHunter',
            type: 'url',
            group: 'social',
        }),

        // ── Реквизиты ──────────────────────────────────────────────
        defineField({ name: 'inn', title: 'ИНН', type: 'string', group: 'requisites' }),
        defineField({ name: 'kpp', title: 'КПП', type: 'string', group: 'requisites' }),
        defineField({ name: 'ogrn', title: 'ОГРН', type: 'string', group: 'requisites' }),

        // ── График работы ──────────────────────────────────────────
        defineField({
            name: 'workWeekdays',
            title: 'Будни',
            type: 'string',
            group: 'schedule',
            initialValue: 'Пн — Пт: 09:00 — 17:00',
        }),
        defineField({
            name: 'workWeekend',
            title: 'Выходные',
            type: 'string',
            group: 'schedule',
            initialValue: 'Сб — Вс: выходные',
        }),
    ],
    preview: {
        select: { title: 'companyName', subtitle: 'mainPhoneDisplay' },
    },
});
