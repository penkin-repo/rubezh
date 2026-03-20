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
    primaryBtnHref: '/equipment',
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
            href: '/about',
            dropdown: [
                { _key: 'sub-about', label: 'О нас', href: '/about' },
                { _key: 'sub-vacancies', label: 'Вакансии', href: '/about/vacancies' },
            ],
        },
        {
            _key: 'nav-projects',
            label: 'Наши работы',
            href: '/projects',
            dropdown: [],
        },
        {
            _key: 'nav-equipment',
            label: 'Аренда спецтехники',
            href: '/equipment',
            dropdown: [],
        },
        {
            _key: 'nav-contacts',
            label: 'Контакты',
            href: '/contacts',
            dropdown: [],
        },
    ],
};

async function seed() {
    console.log('🌱 Заполняем Sanity начальными данными...\n');
    try {
        await client.createOrReplace(hero);
        console.log('✅ Hero секция создана');

        await client.createOrReplace(header);
        console.log('✅ Header создан (с пунктами навигации)\n');

        console.log('🎉 Готово! Открой студию — документы уже там.');
        console.log('   Нажми Publish на каждом документе чтобы опубликовать.\n');
    } catch (err) {
        console.error('❌ Ошибка:', err.message);
        process.exit(1);
    }
}

seed();
