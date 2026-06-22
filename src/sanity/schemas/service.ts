import { defineField, defineType } from 'sanity';
import { CompressedImageInput } from '../components/CompressedImageInput';

/**
 * Услуга («Основные виды деятельности»). Поля совпадают с локальной коллекцией `services`.
 * ВАЖНО: VK-видео НЕ редактируется здесь (захардкожено в коде по слагу) — оно специфично
 * и не должно меняться через CMS.
 */
export const serviceSchema = defineType({
    name: 'service',
    title: '🛠 Услуги',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Название услуги',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Идентификатор (slug)',
            type: 'slug',
            description: 'Используется для привязки видео и резервной копии. Меняйте осторожно.',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'desc',
            title: 'Краткое описание (на карточке)',
            type: 'text',
            rows: 2,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Фото карточки',
            type: 'image',
            options: { hotspot: true },
            components: { input: CompressedImageInput },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'body',
            title: 'Подробный текст (в модальном окне)',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'size',
            title: 'Размер карточки',
            type: 'string',
            options: {
                list: [
                    { title: 'Обычная', value: 'normal' },
                    { title: 'Большая (на 2 колонки)', value: 'large' },
                ],
                layout: 'radio',
            },
            initialValue: 'normal',
        }),
        defineField({
            name: 'hideModalImage',
            title: 'Скрывать фото в модальном окне',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'order',
            title: 'Порядок',
            type: 'number',
            initialValue: 0,
        }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'desc', media: 'image' },
    },
});
