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
                            .title('🏠 Hero секция')
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
                    ]),
        }),
    ],

    schema: {
        types: schemaTypes,
    },
});
