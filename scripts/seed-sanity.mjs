/**
 * Скрипт начального заполнения Sanity данными.
 * Запуск: node scripts/seed-sanity.mjs
 *
 * Читает SANITY_TOKEN из .env автоматически.
 * Повторный запуск безопасен: createOrReplace перезаписывает документы.
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ── Читаем .env вручную ───────────────────────────────────────────────────────
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
    }
}

const token = process.env.SANITY_TOKEN;
if (!token) {
    console.error('\n❌ SANITY_TOKEN не найден в .env\n');
    process.exit(1);
}

const client = createClient({
    projectId: 'oa7cd1k7',
    dataset: 'production',
    apiVersion: '2025-03-05',
    useCdn: false,
    token,
});

// ── Hero ──────────────────────────────────────────────────────────────────────
const hero = {
    _id: 'hero',
    _type: 'hero',
    titleLine1: 'Строительство дорог',
    titleLine2: 'и аренда спецтехники',
    subtitle: 'в Архангельске от надёжного подрядчика',
    description: 'Выполняем полный комплекс работ в Архангельской области. Собственный парк из 60+ единиц техники.',
    primaryBtnLabel: 'Заказать технику',
    primaryBtnHref: '/arenda-spetstehniki',
};

// ── Stats (Цифры на главном экране) ───────────────────────────────────────────
const stats = {
    _id: 'stats',
    _type: 'stats',
    items: [
        { _key: 'st1', value: 11, suffix: '+', label: 'лет работы' },
        { _key: 'st2', value: 200, suffix: '+', label: 'объектов' },
        { _key: 'st3', value: 60, suffix: '+', label: 'единиц техники' },
        { _key: 'st4', value: 130, suffix: '+', label: 'специалистов' },
    ],
};

// ── Advantages (Преимущества) ─────────────────────────────────────────────────
const advantages = {
    _id: 'advantages',
    _type: 'advantages',
    heading: 'Преимущества работы с нами',
    subtitle: 'Надёжность, подкреплённая собственными ресурсами, техникой и многолетним опытом.',
    items: [
        { _key: 'ad1', title: 'Свой автопарк', description: '60+ тяжелых машин (от бульдозеров до установок ГНБ) всегда в боевой готовности. Мы не зависим от чужой техники.', icon: 'lucide:tractor', wide: true },
        { _key: 'ad2', title: 'Своя логистика', description: 'Сами доставляем песок, щебень и асфальт нашими 3-х и 4-х осными самосвалами. Никаких простоев из-за сторонних перевозчиков.', icon: 'lucide:truck', wide: false },
        { _key: 'ad3', title: 'Соблюдение сроков', description: 'Контролируем каждый этап работ лично. Вы работаете напрямую с исполнителем, а не с цепочкой субподрядчиков.', icon: 'lucide:timer', wide: false },
        { _key: 'ad4', title: 'Команда профессионалов', description: '130+ штатных сотрудников, в их числе инженеры, геодезисты и механизаторы с актуальными допуcками к сложным работам.', icon: 'lucide:hard-hat', wide: true },
        { _key: 'ad5', title: 'Решение сложных задач', description: 'Беремся за нетиповые проекты и гидротехнические сооружения, от которых отказываются другие.', icon: 'lucide:cog', wide: true },
        { _key: 'ad6', title: 'Гарантия качества', description: 'Несем юридическую ответственность за результат. Соблюдаем СП и СНиПы на всех этапах — от песчаной подушки до финишного покрытия.', icon: 'lucide:shield-check', wide: false },
    ],
};

// ── Header ────────────────────────────────────────────────────────────────────
const header = {
    _id: 'header',
    _type: 'header',
    phone: '8-911-879-31-34',
    phoneHref: '+79118793134',
    officeEmail: 'amdofis@mail.ru',
    ctaLabel: 'Заказать звонок',
    ctaHref: '#contact-form',
    navItems: [
        {
            _key: 'nav-about',
            label: 'О компании',
            href: '/o-kompanii',
            dropdown: [
                { _key: 'sub-about', label: 'О нас', href: '/o-kompanii' },
                { _key: 'sub-vacancies', label: 'Вакансии', href: '/vakansii' },
            ],
        },
        {
            _key: 'nav-projects',
            label: 'Наши работы',
            href: '/proekty',
            dropdown: [],
        },
        {
            _key: 'nav-equipment',
            label: 'Аренда спецтехники',
            href: '/arenda-spetstehniki',
            dropdown: [],
        },
        {
            _key: 'nav-contacts',
            label: 'Контакты',
            href: '/kontakty',
            dropdown: [],
        },
    ],
};

// ── Site (Контакты и реквизиты) ───────────────────────────────────────────────
// Значения взяты из src/content/site/contacts.md (локальный бэкап).
const site = {
    _id: 'site',
    _type: 'site',
    companyName: 'ООО «Рубеж»',
    mainPhoneDisplay: '8-911-879-31-34',
    mainPhoneHref: '+79118793134',
    officeEmail: 'amdofis@mail.ru',
    hrPhoneDisplay: '8-921-077-24-66',
    hrPhoneHref: '+79210772466',
    hrEmail: 'rubezh.poisk@mail.ru',
    addressShort: 'Архангельск, ул. Дачная, 61к1',
    addressFull: 'г. Архангельск, ул. Дачная, д. 61, к. 1',
    vkUrl: 'https://vk.com/club236228420',
    avitoUrl: 'https://www.avito.ru/profile/items/active/all?s=4',
    hhUrl: 'https://severodvinsk.hh.ru/employer/vacancies',
    inn: '2901259316',
    kpp: '290101001',
    ogrn: '1152901005630',
    workWeekdays: 'Пн — Пт: 09:00 — 17:00',
    workWeekend: 'Сб — Вс: выходные',
    mapEmbedUrl:
        'https://yandex.ru/map-widget/v1/?ll=40.598800%2C64.548900&z=16&pt=40.598800%2C64.548900,pmwtm1~&text=%D0%A3%D0%BB%D0%B8%D1%86%D0%B0%20%D0%94%D0%B0%D1%87%D0%BD%D0%B0%D1%8F%2061%D0%BA1%2C%20%D0%90%D1%80%D1%85%D0%B0%D0%BD%D0%B3%D0%B5%D0%BB%D1%8C%D1%81%D0%BA',
};

async function seed() {
    console.log('🌱 Заполняем Sanity начальными данными...\n');
    try {
        await client.createOrReplace(hero);
        console.log('✅ Hero секция создана');

        await client.createOrReplace(header);
        console.log('✅ Header создан (с пунктами навигации)');

        await client.createOrReplace(site);
        console.log('✅ Контакты и реквизиты (site) созданы');

        await client.createOrReplace(stats);
        console.log('✅ Цифры на главном экране (stats) созданы');

        await client.createOrReplace(advantages);
        console.log('✅ Преимущества (advantages) созданы\n');

        console.log('🎉 Готово! Открой студию — документы уже там.');
        console.log('   Нажми Publish на каждом документе чтобы опубликовать.\n');
    } catch (err) {
        console.error('❌ Ошибка:', err.message);
        process.exit(1);
    }
}

seed();
