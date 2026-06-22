import type { ImageMetadata } from 'astro';

/**
 * Универсальный источник картинки для <SmartImage>.
 * - local  — импортированный ассет (ImageMetadata), используется как fallback из Git.
 * - remote — URL картинки из Sanity CDN; Astro оптимизирует её на этапе сборки
 *            и кладёт в dist/, поэтому посетители грузят файл с Timeweb, а не с Sanity.
 */
export type SmartImageSource =
    | { kind: 'local'; data: ImageMetadata }
    | { kind: 'remote'; src: string; width: number; height: number };
