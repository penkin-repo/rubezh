/**
 * Миграция проектов (портфолио) из локальной коллекции в Sanity.
 * Запуск: node scripts/migrate-projects.mjs
 *
 * - Читает все src/content/projects2/*.md (frontmatter: year, title, works, client, cost, order, imageFolder).
 * - Находит фото в src/assets/works/{imageFolder}/ (натуральная сортировка по имени).
 * - Сжимает (sharp, webp q80, <=1920px) и грузит в Sanity, дубликаты — один раз.
 * - Документы создаются с детерминированным _id из имени файла (повторный запуск безопасен).
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, join, basename } from 'path';
import matter from 'gray-matter';
import { makeWriteClient, uploadCompressedImage, slugify } from './lib/migrate-utils.mjs';

const client = makeWriteClient();

const CONTENT_DIR = resolve(process.cwd(), 'src/content/projects2');
const WORKS_DIR = resolve(process.cwd(), 'src/assets/works');
const IMAGE_RE = /\.(png|jpe?g|webp)$/i;

/** Список картинок папки проекта, отсортированный натурально (1,2,10). */
function listProjectImages(imageFolder) {
    const dir = join(WORKS_DIR, imageFolder);
    let files;
    try {
        files = readdirSync(dir);
    } catch {
        return [];
    }
    return files
        .filter((f) => IMAGE_RE.test(f))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((f) => join(dir, f));
}

async function migrate() {
    const mdFiles = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
    console.log(`🏗  Миграция проектов: ${mdFiles.length} файлов\n`);

    const imageCache = new Map();
    let count = 0;

    for (const file of mdFiles) {
        const { data } = matter(readFileSync(join(CONTENT_DIR, file), 'utf-8'));
        const imagePaths = listProjectImages(data.imageFolder);

        const gallery = [];
        for (const absPath of imagePaths) {
            const assetId = await uploadCompressedImage(client, absPath, imageCache);
            gallery.push({
                _type: 'image',
                _key: slugify(basename(absPath)) || `img-${gallery.length}`,
                asset: { _type: 'reference', _ref: assetId },
            });
        }

        const id = `project.${slugify(file.replace(/\.md$/, ''))}`;
        await client.createOrReplace({
            _id: id,
            _type: 'project',
            year: data.year,
            title: data.title,
            works: data.works ?? '',
            client: data.client ?? '',
            cost: data.cost,
            order: data.order ?? 0,
            gallery,
        });
        count++;
        console.log(`✅ [${data.year}] ${data.title} — ${gallery.length} фото`);
    }

    console.log(`\n🎉 Готово: ${count} проектов. Опубликуй их в студии (Publish).`);
}

migrate().catch((err) => {
    console.error('❌ Ошибка миграции:', err.message);
    process.exit(1);
});
