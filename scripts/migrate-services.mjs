/**
 * Миграция услуг из локальной коллекции в Sanity.
 * Запуск: node scripts/migrate-services.mjs
 *
 * - Читает src/content/services/*.md (frontmatter + markdown-тело).
 * - Сжимает фото (sharp, webp q80, <=1920px) и грузит в Sanity.
 * - Тело конвертируется markdown → Portable Text.
 * - VK-видео НЕ мигрируется (по требованию — захардкожено в коде/локальном .md).
 * - Документы создаются с детерминированным _id из имени файла (повторный запуск безопасен).
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import matter from 'gray-matter';
import {
    makeWriteClient,
    uploadCompressedImage,
    mdToPortableText,
} from './lib/migrate-utils.mjs';

const client = makeWriteClient();
const CONTENT_DIR = resolve(process.cwd(), 'src/content/services');

async function migrate() {
    const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
    console.log(`🛠  Миграция услуг: ${files.length} файлов\n`);

    const imageCache = new Map();
    let count = 0;

    for (const file of files) {
        const slug = file.replace(/\.md$/, '');
        const parsed = matter(readFileSync(join(CONTENT_DIR, file), 'utf-8'));
        const data = parsed.data;

        // image: путь относительно файла услуги (src/content/services/)
        const absImage = join(dirname(join(CONTENT_DIR, file)), data.image);
        const assetId = await uploadCompressedImage(client, absImage, imageCache);

        await client.createOrReplace({
            _id: `service.${slug}`,
            _type: 'service',
            title: data.title,
            slug: { _type: 'slug', current: slug },
            desc: data.desc ?? '',
            size: data.size ?? 'normal',
            hideModalImage: data.hideModalImage ?? false,
            order: data.order ?? 0,
            image: {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId },
            },
            body: mdToPortableText(parsed.content.trim()),
        });
        count++;
        console.log(`✅ ${data.title}`);
    }

    console.log(`\n🎉 Готово: ${count} услуг. Опубликуй их в студии (Publish).`);
    console.log('   Примечание: VK-видео в услугах НЕ хранится в Sanity (захардкожено по slug).');
}

migrate().catch((err) => {
    console.error('❌ Ошибка миграции:', err.message);
    process.exit(1);
});
