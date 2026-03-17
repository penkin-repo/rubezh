import { defineField, defineType } from 'sanity';

export const headerSchema = defineType({
    name: 'header',
    title: '🧭 Шапка сайта',
    type: 'document',
    fields: [
        defineField({
            name: 'phone',
            title: 'Телефон (отображается в шапке)',
            description: 'Без форматирования, напр.: 8-911-879-31-34',
            type: 'string',
            initialValue: '8-911-879-31-34',
        }),
        defineField({
            name: 'phoneHref',
            title: 'Телефон — href (для ссылки tel:)',
            description: 'Международный формат: +79118793134',
            type: 'string',
            initialValue: '+79118793134',
        }),
        defineField({
            name: 'ctaLabel',
            title: 'CTA кнопка — текст',
            type: 'string',
            initialValue: 'Заказать звонок',
        }),
        defineField({
            name: 'ctaHref',
            title: 'CTA кнопка — ссылка',
            type: 'string',
            initialValue: '#contact-form',
        }),
        defineField({
            name: 'navItems',
            title: 'Пункты навигации',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'navItem',
                    title: 'Пункт меню',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Название пункта',
                            type: 'string',
                        }),
                        defineField({
                            name: 'href',
                            title: 'Ссылка',
                            type: 'string',
                        }),
                        defineField({
                            name: 'dropdown',
                            title: 'Подменю (оставьте пустым если не нужно)',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    name: 'dropdownItem',
                                    fields: [
                                        defineField({ name: 'label', title: 'Название подпункта', type: 'string' }),
                                        defineField({ name: 'href', title: 'Ссылка подпункта', type: 'string' }),
                                    ],
                                    preview: {
                                        select: { title: 'label' },
                                    },
                                },
                            ],
                        }),
                    ],
                    preview: {
                        select: { title: 'label', subtitle: 'href' },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: { title: 'phone' },
        prepare({ title }) {
            return { title: `Header: ${title}` };
        },
    },
});
