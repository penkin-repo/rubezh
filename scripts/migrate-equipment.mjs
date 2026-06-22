/**
 * Миграция спецтехники из локальной коллекции в Sanity.
 * Запуск: node scripts/migrate-equipment.mjs
 *
 * - Читает src/content/equipment/catalog.md (items[]).
 * - Сжимает картинки (sharp, webp q80, <=1920px) и грузит в Sanity.
 * - Дубликаты картинок грузятся один раз.
 * - Документы создаются с детерминированным _id (повторный запуск безопасен).
 */
import { readFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import matter from 'gray-matter';
import { makeWriteClient, uploadCompressedImage, slugify } from './lib/migrate-utils.mjs';

const client = makeWriteClient();

const CATALOG = resolve(process.cwd(), 'src/content/equipment/catalog.md');
const { data } = matter(readFileSync(CATALOG, 'utf-8'));
const items = data.items ?? [];

async function migrate() {
    console.log(`🚜 Миграция техники: ${items.length} позиций\n`);
    const imageCache = new Map();
    let count = 0;

    for (const item of items) {
        // image: путь относительно файла каталога (src/content/equipment/)
        const absImage = join(dirname(CATALOG), item.image);
        const assetId = await uploadCompressedImage(client, absImage, imageCache);

        const id = `equipment.${item.order}-${slugify(item.title)}`;
        await client.createOrReplace({
            _id: id,
            _type: 'equipment',
            title: item.title,
            category: item.category,
            specs: item.specs ?? '',
            order: item.order ?? 0,
            featured: item.featured ?? false,
            featuredOrder: item.featuredOrder ?? 0,
            image: {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId },
            },
        });
        count++;
        console.log(`✅ ${item.title}`);
    }

    console.log(`\n🎉 Готово: ${count} позиций техники. Опубликуй их в студии (Publish).`);
}

migrate().catch((err) => {
    console.error('❌ Ошибка миграции:', err.message);
    process.exit(1);
});
