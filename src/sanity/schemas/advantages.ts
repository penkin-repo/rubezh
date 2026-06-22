import { defineField, defineType } from 'sanity';

/** Список иконок (Lucide), доступных редактору. Значение = имя иконки astro-icon. */
const ICON_OPTIONS = [
    { title: 'Трактор', value: 'lucide:tractor' },
    { title: 'Грузовик', value: 'lucide:truck' },
    { title: 'Таймер / сроки', value: 'lucide:timer' },
    { title: 'Каска / команда', value: 'lucide:hard-hat' },
    { title: 'Шестерёнка', value: 'lucide:cog' },
    { title: 'Щит с галочкой', value: 'lucide:shield-check' },
    { title: 'Награда', value: 'lucide:award' },
    { title: 'Карта / геолокация', value: 'lucide:map-pin' },
    { title: 'Рукопожатие', value: 'lucide:handshake' },
    { title: 'Часы', value: 'lucide:clock' },
];

/**
 * Блок «Преимущества работы с нами» (Advantages). Синглтон (_id = 'advantages').
 */
export const advantagesSchema = defineType({
    name: 'advantages',
    title: '⭐ Преимущества',
    type: 'document',
    fields: [
        defineField({
            name: 'heading',
            title: 'Заголовок блока',
            type: 'string',
            initialValue: 'Преимущества работы с нами',
        }),
        defineField({
            name: 'subtitle',
            title: 'Подзаголовок (справа от заголовка)',
            type: 'text',
            rows: 2,
            initialValue:
                'Надёжность, подкреплённая собственными ресурсами, техникой и многолетним опытом.',
        }),
        defineField({
            name: 'items',
            title: 'Преимущества',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'advantage',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Заголовок',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'description',
                            title: 'Описание',
                            type: 'text',
                            rows: 3,
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'icon',
                            title: 'Иконка',
                            type: 'string',
                            options: { list: ICON_OPTIONS },
                            initialValue: 'lucide:cog',
                        }),
                        defineField({
                            name: 'wide',
                            title: 'Широкая карточка (на 2 колонки)',
                            type: 'boolean',
                            initialValue: false,
                        }),
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'description' },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: { title: 'heading' },
    },
});
