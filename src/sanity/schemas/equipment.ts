import { defineField, defineType } from 'sanity';
import { CompressedImageInput } from '../components/CompressedImageInput';

/**
 * Единица спецтехники. Имена полей совпадают с локальной коллекцией `equipment`
 * (src/content/equipment/catalog.md → items[]), чтобы fallback давал ту же форму.
 */
export const equipmentSchema = defineType({
    name: 'equipment',
    title: '🚜 Спецтехника',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Название',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Категория',
            type: 'string',
            options: {
                list: [
                    'Самосвалы',
                    'Спецтехника',
                    'Экскаваторы',
                    'Бульдозеры',
                    'Катки',
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'specs',
            title: 'Характеристики (одна строка)',
            type: 'string',
            description: 'Например: «30 т, 20 куб, 10 ед.»',
        }),
        defineField({
            name: 'image',
            title: 'Фото',
            type: 'image',
            options: { hotspot: true },
            components: { input: CompressedImageInput },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: 'Порядок в каталоге',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'featured',
            title: 'Показывать на главной',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'featuredOrder',
            title: 'Порядок на главной',
            type: 'number',
            initialValue: 0,
            hidden: ({ document }) => !document?.featured,
        }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'category', media: 'image' },
    },
});
