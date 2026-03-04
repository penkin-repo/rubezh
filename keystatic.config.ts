import { config, fields, collection, singleton } from '@keystatic/core';


export default config({
    storage: {
        kind: 'cloud',
    },
    cloud: {
        project: 'afishi29/rubezh',
    },

    // ── Singletons ────────────────────────────────────────────────────────
    singletons: {
        hero: singleton({
            label: '🏠 Главная — Hero секция',
            path: 'src/content/hero/',
            schema: {
                titleLine1: fields.text({
                    label: 'Заголовок — строка 1',
                    defaultValue: 'Строительство дорог',
                }),
                titleLine2: fields.text({
                    label: 'Заголовок — строка 2',
                    defaultValue: 'и аренда спецтехники',
                }),
                subtitle: fields.text({
                    label: 'Подзаголовок (после заголовка)',
                    defaultValue: 'в Архангельске от надежного подрядчика',
                }),
                description: fields.text({
                    label: 'Описание (под кнопками)',
                    multiline: true,
                    defaultValue: 'Выполняем полный комплекс работ в Архангельской области. Собственный парк из 60+ единиц техники.',
                }),
                primaryBtnLabel: fields.text({ label: 'Кнопка 1 — текст', defaultValue: 'Заказать технику' }),
                primaryBtnHref: fields.text({ label: 'Кнопка 1 — ссылка', defaultValue: '/equipment' }),
                secondaryBtnLabel: fields.text({ label: 'Кнопка 2 — текст', defaultValue: 'Рассчитать смету' }),
                secondaryBtnHref: fields.text({ label: 'Кнопка 2 — ссылка', defaultValue: '/contacts' }),
            },
        }),

        header: singleton({
            label: '🧭 Шапка сайта (Header)',
            path: 'src/content/header/',
            schema: {
                phone: fields.text({
                    label: 'Телефон (отображается в шапке)',
                    description: 'Без форматирования, напр.: 8-911-879-31-34',
                    defaultValue: '8-911-879-31-34',
                }),
                phoneHref: fields.text({
                    label: 'Телефон — href (для ссылки tel:)',
                    description: 'Международный формат: +79118793134',
                    defaultValue: '+79118793134',
                }),
                ctaLabel: fields.text({
                    label: 'CTA кнопка — текст',
                    defaultValue: 'Заказать звонок',
                }),
                ctaHref: fields.text({
                    label: 'CTA кнопка — ссылка',
                    defaultValue: '#contact-form',
                }),
                navItems: fields.array(
                    fields.object({
                        label: fields.text({ label: 'Название пункта' }),
                        href: fields.text({ label: 'Ссылка' }),
                        dropdown: fields.array(
                            fields.object({
                                label: fields.text({ label: 'Название подпункта' }),
                                href: fields.text({ label: 'Ссылка подпункта' }),
                            }),
                            {
                                label: 'Подменю (оставьте пустым если не нужно)',
                                itemLabel: (props) => props.fields.label.value,
                            }
                        ),
                    }),
                    {
                        label: 'Пункты навигации',
                        itemLabel: (props) => props.fields.label.value,
                    }
                ),
            },
        }),
    },

    // ── Collections ───────────────────────────────────────────────────────
    collections: {
        equipment: collection({
            label: '🚛 Спецтехника',
            slugField: 'title',
            path: 'src/content/equipment/*/',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Название' } }),
                description: fields.text({ label: 'Краткое описание', multiline: true }),
                content: fields.markdoc({ label: 'Подробное описание' }),
            },
        }),
    },
});
