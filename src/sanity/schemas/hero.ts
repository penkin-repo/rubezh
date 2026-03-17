import { defineField, defineType } from 'sanity';

export const heroSchema = defineType({
    name: 'hero',
    title: '🏠 Hero секция',
    type: 'document',
    fields: [
        defineField({
            name: 'titleLine1',
            title: 'Заголовок — строка 1',
            type: 'string',
            initialValue: 'Дорожно-строительная организация',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'titleLine2',
            title: 'Заголовок — строка 2',
            type: 'string',
            initialValue: 'и аренда спецтехники',
        }),
        defineField({
            name: 'subtitle',
            title: 'Подзаголовок (после заголовка)',
            type: 'string',
            initialValue: 'в Архангельске от надёжного подрядчика',
        }),
        defineField({
            name: 'description',
            title: 'Описание (под кнопками)',
            type: 'text',
            rows: 3,
            initialValue: 'Выполняем полный комплекс работ в Архангельской области. Собственный парк из 60+ единиц техники.',
        }),
        defineField({
            name: 'primaryBtnLabel',
            title: 'Кнопка 1 — текст',
            type: 'string',
            initialValue: 'Заказать технику',
        }),
        defineField({
            name: 'primaryBtnHref',
            title: 'Кнопка 1 — ссылка',
            type: 'string',
            initialValue: '/equipment',
        }),
        defineField({
            name: 'secondaryBtnLabel',
            title: 'Кнопка 2 — текст',
            type: 'string',
            initialValue: 'Рассчитать смету',
        }),
        defineField({
            name: 'secondaryBtnHref',
            title: 'Кнопка 2 — ссылка',
            type: 'string',
            initialValue: '/contacts',
        }),
    ],
    preview: {
        select: { title: 'titleLine1' },
        prepare({ title }) {
            return { title: `Hero: ${title}` };
        },
    },
});
