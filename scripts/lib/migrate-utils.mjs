/**
 * Общие утилиты для скриптов миграции контента в Sanity.
 * - Чтение токена из .env
 * - Создание клиента с правами записи
 * - Сжатие картинок через sharp ДО загрузки (защита бесплатного тарифа по хранилищу)
 * - Дедупликация загрузок (один и тот же файл грузится один раз)
 */
import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

/** Загружает переменные из .env в process.env (без зависимостей). */
export function loadEnv() {
    const envPath = resolve(process.cwd(), '.env');
    if (!existsSync(envPath)) return;
    for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const val = trimmed.slice(eq + 1).trim();
        if (!process.env[key]) process.env[key] = val;
    }
}

/** Клиент Sanity с токеном записи. Завершает процесс, если токена нет. */
export function makeWriteClient() {
    loadEnv();
    const token = process.env.SANITY_TOKEN;
    if (!token) {
        console.error('\n❌ SANITY_TOKEN не найден в .env\n');
        process.exit(1);
    }
    return createClient({
        projectId: 'oa7cd1k7',
        dataset: 'production',
        apiVersion: '2025-03-05',
        useCdn: false,
        token,
    });
}

/** Параметры сжатия: то же, что планируем для клиентских загрузок. */
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

/**
 * Сжимает картинку (resize <= 1920px, webp q80) и грузит в Sanity.
 * Дедуплицирует по абсолютному пути через переданный cache (Map).
 * @returns {Promise<string>} assetId загруженного ассета
 */
export async function uploadCompressedImage(client, absPath, cache) {
    if (cache.has(absPath)) return cache.get(absPath);
    if (!existsSync(absPath)) {
        throw new Error(`Файл не найден: ${absPath}`);
    }

    const original = readFileSync(absPath);
    const compressed = await sharp(original)
        .rotate() // учесть EXIF-ориентацию
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

    const filename = absPath.split(/[\\/]/).pop().replace(/\.[^.]+$/, '') + '.webp';
    const asset = await client.assets.upload('image', compressed, { filename });

    const kb = (compressed.length / 1024).toFixed(0);
    const origKb = (original.length / 1024).toFixed(0);
    console.log(`   🖼  ${filename}: ${origKb} КБ → ${kb} КБ`);

    cache.set(absPath, asset._id);
    return asset._id;
}

/** Транслитерация + slug для стабильных _id документов. */
export function slugify(str) {
    const map = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
        и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
        с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh',
        щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
    };
    return str
        .toLowerCase()
        .split('')
        .map((ch) => (map[ch] !== undefined ? map[ch] : ch))
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ── Markdown → Portable Text ──────────────────────────────────────────────────
const key = () => randomUUID().slice(0, 10);

/** Разбивает строку на span'ы, выделяя **жирный**. */
function parseInline(text) {
    const parts = text.split('**');
    const spans = [];
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === '') continue;
        spans.push({
            _type: 'span',
            _key: key(),
            text: parts[i],
            marks: i % 2 === 1 ? ['strong'] : [],
        });
    }
    if (spans.length === 0) spans.push({ _type: 'span', _key: key(), text: '', marks: [] });
    return spans;
}

function block(text, style = 'normal', extra = {}) {
    return {
        _type: 'block',
        _key: key(),
        style,
        markDefs: [],
        children: parseInline(text),
        ...extra,
    };
}

/**
 * Минимальный конвертер Markdown → Portable Text.
 * Поддерживает: абзацы (со склейкой soft-переносов), заголовки ##/###,
 * маркированные списки (- ), inline **жирный**.
 */
export function mdToPortableText(md) {
    const lines = md.replace(/\r/g, '').split('\n');
    const blocks = [];
    let para = [];
    const flush = () => {
        if (para.length) {
            blocks.push(block(para.join(' ')));
            para = [];
        }
    };
    for (const raw of lines) {
        const t = raw.trim();
        if (t === '') {
            flush();
            continue;
        }
        if (t.startsWith('### ')) {
            flush();
            blocks.push(block(t.slice(4), 'h3'));
            continue;
        }
        if (t.startsWith('## ')) {
            flush();
            blocks.push(block(t.slice(3), 'h2'));
            continue;
        }
        if (t.startsWith('- ')) {
            flush();
            blocks.push(block(t.slice(2), 'normal', { listItem: 'bullet', level: 1 }));
            continue;
        }
        para.push(t);
    }
    flush();
    return blocks;
}
