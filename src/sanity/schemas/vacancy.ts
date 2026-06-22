import { defineField, defineType } from 'sanity';

/**
 * Вакансия. Поля совпадают с локальной коллекцией `vacancies`.
 * Тело — Portable Text (требования/условия).
 */
export const vacancySchema = defineType({
    name: 'vacancy',
    title: '💼 Вакансии',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Название вакансии',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Идентификатор (slug)',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'body',
            title: 'Описание (требования, условия)',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'order',
            title: 'Порядок',
            type: 'number',
            initialValue: 0,
        }),
    ],
    preview: {
        select: { title: 'title' },
    },
});
