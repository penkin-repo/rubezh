/**
 * Миграция вакансий из локальной коллекции в Sanity.
 * Запуск: node scripts/migrate-vacancies.mjs
 *
 * - Читает src/content/vacancies/*.md (frontmatter + markdown-тело).
 * - Тело конвертируется markdown → Portable Text.
 * - Картинок нет. Документы создаются с детерминированным _id (повторный запуск безопасен).
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import matter from 'gray-matter';
import { makeWriteClient, mdToPortableText } from './lib/migrate-utils.mjs';

const client = makeWriteClient();
const CONTENT_DIR = resolve(process.cwd(), 'src/content/vacancies');

async function migrate() {
    const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
    console.log(`💼 Миграция вакансий: ${files.length} файлов\n`);

    let count = 0;
    for (const file of files) {
        const slug = file.replace(/\.md$/, '');
        const parsed = matter(readFileSync(join(CONTENT_DIR, file), 'utf-8'));
        const data = parsed.data;

        await client.createOrReplace({
            _id: `vacancy.${slug}`,
            _type: 'vacancy',
            title: data.title,
            slug: { _type: 'slug', current: slug },
            order: data.order ?? 0,
            body: mdToPortableText(parsed.content.trim()),
        });
        count++;
        console.log(`✅ ${data.title}`);
    }

    console.log(`\n🎉 Готово: ${count} вакансий. Опубликуй их в студии (Publish).`);
}

migrate().catch((err) => {
    console.error('❌ Ошибка миграции:', err.message);
    process.exit(1);
});
