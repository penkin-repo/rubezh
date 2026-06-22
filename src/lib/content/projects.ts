import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { client } from '../../sanity/client';
import { getProjectImages } from '../../utils/project-images';
import type { SmartImageSource } from './types';

/** Одна картинка проекта: источник для миниатюры + готовый полноразмер для PhotoSwipe. */
export interface ProjectImage {
    /** Источник для <SmartImage> (адаптивная миниатюра). */
    source: SmartImageSource;
    /** Оптимизированный полноразмер (в dist/, раздаётся с Timeweb) для лайтбокса. */
    full: { src: string; width: number; height: number };
}

export interface ProjectData {
    year: number;
    title: string;
    works: string;
    client: string;
    cost?: string;
    order: number;
    images: ProjectImage[];
}

const FULL_MAX_WIDTH = 1600;

/** Оптимизирует картинку на этапе сборки и возвращает путь + размеры для лайтбокса. */
async function toFull(source: SmartImageSource): Promise<ProjectImage['full']> {
    const ow = source.kind === 'local' ? source.data.width : source.width;
    const oh = source.kind === 'local' ? source.data.height : source.height;
    const w = Math.min(ow, FULL_MAX_WIDTH);
    const h = Math.round((oh * w) / ow);
    const img = await getImage({
        src: source.kind === 'local' ? source.data : source.src,
        width: w,
        height: h,
        format: 'webp',
        quality: 80,
    });
    return { src: img.src, width: w, height: h };
}

async function buildImages(sources: SmartImageSource[]): Promise<ProjectImage[]> {
    return Promise.all(
        sources.map(async (source) => ({ source, full: await toFull(source) })),
    );
}

// ── Локальный бэкап ───────────────────────────────────────────────────────────
const allWorkImages = import.meta.glob<{ default: ImageMetadata }>(
    '/src/assets/works/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}',
    { eager: true },
);

async function getLocalProjects(): Promise<ProjectData[]> {
    const collection = await getCollection('projects2');
    const sorted = collection.sort((a, b) => {
        if (a.data.year !== b.data.year) return b.data.year - a.data.year;
        return a.data.order - b.data.order;
    });

    return Promise.all(
        sorted.map(async (p) => {
            const metas = getProjectImages(allWorkImages, p.data.imageFolder);
            const sources: SmartImageSource[] = metas.map((data) => ({
                kind: 'local',
                data,
            }));
            return {
                year: p.data.year,
                title: p.data.title,
                works: p.data.works,
                client: p.data.client,
                cost: p.data.cost,
                order: p.data.order,
                images: await buildImages(sources),
            };
        }),
    );
}

// ── Sanity ──────────────────────────────────────────────────────────────────--
const PROJECTS_QUERY = `*[_type == "project"] | order(year desc, order asc){
  year,
  title,
  works,
  client,
  cost,
  order,
  "images": gallery[]{
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
}`;

interface SanityProject {
    year: number;
    title: string;
    works?: string;
    client?: string;
    cost?: string;
    order?: number;
    images?: { url?: string; width?: number; height?: number }[];
}

/** Все проекты (отсортированы: год убыв., затем order). Sanity → fallback на локальные .md. */
export async function getProjects(): Promise<ProjectData[]> {
    try {
        const docs = await client.fetch<SanityProject[]>(PROJECTS_QUERY);
        if (Array.isArray(docs) && docs.length > 0) {
            return Promise.all(
                docs.map(async (d) => {
                    const sources: SmartImageSource[] = (d.images ?? [])
                        .filter((im) => im.url && im.width && im.height)
                        .map((im) => ({
                            kind: 'remote',
                            src: im.url as string,
                            width: im.width as number,
                            height: im.height as number,
                        }));
                    return {
                        year: d.year,
                        title: d.title,
                        works: d.works ?? '',
                        client: d.client ?? '',
                        cost: d.cost,
                        order: d.order ?? 0,
                        images: await buildImages(sources),
                    };
                }),
            );
        }
    } catch (err) {
        console.warn(
            '[getProjects] Sanity недоступен — используем локальный бэкап:',
            err instanceof Error ? err.message : err,
        );
    }
    return getLocalProjects();
}

/** Группировка проектов по годам (для вкладок). Возвращает [year, projects][] по убыванию года. */
export function groupByYear(projects: ProjectData[]): [number, ProjectData[]][] {
    const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);
    return years.map((year) => [year, projects.filter((p) => p.year === year)]);
}
