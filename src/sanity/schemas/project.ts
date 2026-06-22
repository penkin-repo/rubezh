import { defineField, defineType } from 'sanity';
import { CompressedImageInput } from '../components/CompressedImageInput';

/**
 * Проект (объект из портфолио). Поля совпадают с локальной коллекцией `projects2`
 * (src/content/projects2/*.md). Галерея — массив картинок (первая = обложка).
 */
export const projectSchema = defineType({
    name: 'project',
    title: '🏗 Проекты',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Название проекта',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'year',
            title: 'Год',
            type: 'number',
            validation: (Rule) => Rule.required().min(2000).max(2100),
        }),
        defineField({
            name: 'works',
            title: 'Виды работ',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'client',
            title: 'Заказчик',
            type: 'string',
        }),
        defineField({
            name: 'cost',
            title: 'Стоимость выполненных работ',
            type: 'string',
            description: 'Необязательно. Например: «350 450 755 руб.»',
        }),
        defineField({
            name: 'order',
            title: 'Порядок внутри года',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'gallery',
            title: 'Галерея (первое фото — обложка)',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    components: { input: CompressedImageInput },
                },
            ],
        }),
    ],
    preview: {
        select: { title: 'title', year: 'year', media: 'gallery.0' },
        prepare({ title, year, media }) {
            return { title, subtitle: year ? `${year} г.` : '', media };
        },
    },
});
