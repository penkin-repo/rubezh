import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { client } from '../../sanity/client';
import type { SmartImageSource } from './types';

export interface EquipmentItem {
    title: string;
    specs: string;
    category: string;
    image: SmartImageSource;
    order: number;
    featured: boolean;
    featuredOrder: number;
}

const EQUIPMENT_QUERY = `*[_type == "equipment"] | order(order asc){
  title,
  specs,
  category,
  order,
  featured,
  featuredOrder,
  "imageUrl": image.asset->url,
  "imageW": image.asset->metadata.dimensions.width,
  "imageH": image.asset->metadata.dimensions.height
}`;

interface SanityEquipment {
    title: string;
    specs?: string;
    category: string;
    order?: number;
    featured?: boolean;
    featuredOrder?: number;
    imageUrl?: string;
    imageW?: number;
    imageH?: number;
}

async function getLocalEquipment(): Promise<EquipmentItem[]> {
    const collection = await getCollection('equipment');
    return collection
        .flatMap((entry) => entry.data.items)
        .map((item) => ({
            title: item.title,
            specs: item.specs,
            category: item.category,
            order: item.order,
            featured: item.featured,
            featuredOrder: item.featuredOrder,
            image: { kind: 'local' as const, data: item.image as ImageMetadata },
        }))
        .sort((a, b) => a.order - b.order);
}

/** Вся техника: Sanity → fallback на локальную коллекцию. */
export async function getEquipment(): Promise<EquipmentItem[]> {
    try {
        const docs = await client.fetch<SanityEquipment[]>(EQUIPMENT_QUERY);
        if (Array.isArray(docs) && docs.length > 0) {
            return docs
                .filter((d) => d.imageUrl && d.imageW && d.imageH)
                .map((d) => ({
                    title: d.title,
                    specs: d.specs ?? '',
                    category: d.category,
                    order: d.order ?? 0,
                    featured: d.featured ?? false,
                    featuredOrder: d.featuredOrder ?? 0,
                    image: {
                        kind: 'remote' as const,
                        src: d.imageUrl as string,
                        width: d.imageW as number,
                        height: d.imageH as number,
                    },
                }));
        }
    } catch (err) {
        console.warn(
            '[getEquipment] Sanity недоступен — используем локальный бэкап:',
            err instanceof Error ? err.message : err,
        );
    }
    return getLocalEquipment();
}

/** Техника для слайдера на главной (featured, отсортировано, максимум N). */
export async function getFeaturedEquipment(limit = 10): Promise<EquipmentItem[]> {
    const all = await getEquipment();
    return all
        .filter((item) => item.featured)
        .sort((a, b) => a.featuredOrder - b.featuredOrder)
        .slice(0, limit);
}
