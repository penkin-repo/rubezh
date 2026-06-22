import { defineField, defineType } from 'sanity';

/**
 * Блок статистики на главном экране (StatsBar). Синглтон (_id = 'stats').
 */
export const statsSchema = defineType({
    name: 'stats',
    title: '📊 Цифры на главном экране',
    type: 'document',
    fields: [
        defineField({
            name: 'items',
            title: 'Показатели',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'stat',
                    fields: [
                        defineField({
                            name: 'value',
                            title: 'Число',
                            type: 'number',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'suffix',
                            title: 'Суффикс (например «+»)',
                            type: 'string',
                            initialValue: '+',
                        }),
                        defineField({
                            name: 'label',
                            title: 'Подпись',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                    preview: {
                        select: { value: 'value', suffix: 'suffix', label: 'label' },
                        prepare({ value, suffix, label }) {
                            return { title: `${value ?? ''}${suffix ?? ''} ${label ?? ''}` };
                        },
                    },
                },
            ],
            validation: (Rule) => Rule.max(6),
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Цифры на главном экране' };
        },
    },
});
