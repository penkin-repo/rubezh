import type { ImageMetadata } from 'astro';

/**
 * Извлекает изображения проекта из результата import.meta.glob,
 * фильтруя по папке imageFolder (например "2025/kampus").
 * Сортирует по имени файла (натуральный порядок: 1, 2, 3...).
 */
export function getProjectImages(
  allImages: Record<string, { default: ImageMetadata }>,
  folder: string
): ImageMetadata[] {
  const prefix = `/src/assets/works/${folder}/`;
  return Object.entries(allImages)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, mod]) => mod.default);
}
