import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
    name: 'rubezh',
    title: 'Рубеж — CMS',
    basePath: '/studio',

    projectId: 'oa7cd1k7',
    dataset: 'production',

    i18n: {
        locales: [
            {
                id: 'ru-RU',
                title: 'Русский',
                weekInfo: {
                    firstDay: 1,
                    weekend: [6, 7],
                    minimalDays: 4,
                },
            },
        ],
    },

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Контент')
                    .items([
                        S.listItem()
                            .title('🏠 Главный экран')
                            .id('hero')
                            .child(
                                S.document()
                                    .schemaType('hero')
                                    .documentId('hero')
                            ),
                        S.listItem()
                            .title('🧭 Шапка сайта')
                            .id('header')
                            .child(
                                S.document()
                                    .schemaType('header')
                                    .documentId('header')
                            ),
                        S.listItem()
                            .title('📇 Контакты и реквизиты')
                            .id('site')
                            .child(
                                S.document()
                                    .schemaType('site')
                                    .documentId('site')
                            ),
                        S.listItem()
                            .title('📊 Цифры на главном экране')
                            .id('stats')
                            .child(
                                S.document()
                                    .schemaType('stats')
                                    .documentId('stats')
                            ),
                        S.listItem()
                            .title('⭐ Преимущества')
                            .id('advantages')
                            .child(
                                S.document()
                                    .schemaType('advantages')
                                    .documentId('advantages')
                            ),
                        S.divider(),
                        S.documentTypeListItem('equipment').title('🚜 Спецтехника'),
                        S.documentTypeListItem('project').title('🏗 Проекты'),
                        S.documentTypeListItem('service').title('🛠 Услуги'),
                        S.documentTypeListItem('vacancy').title('💼 Вакансии'),
                    ]),
        }),
    ],

    schema: {
        types: schemaTypes,
    },
});
