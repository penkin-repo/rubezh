import { getCollection, render } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { toHTML } from '@portabletext/to-html';
import { client } from '../../sanity/client';
import type { SmartImageSource } from './types';

/**
 * VK-видео НЕ хранится в Sanity (по требованию — не меняем через CMS).
 * Здесь захардкожено по slug услуги. Для локального fallback берётся из frontmatter .md.
 */
const SERVICE_VIDEOS: Record<string, string> = {
    blagoustroystvo: 'https://vk.com/video_ext.php?oid=-64387052&id=456266313&hd=4',
};

export interface ServiceItem {
    id: string;
    title: string;
    desc: string;
    size: 'large' | 'normal';
    hideModalImage: boolean;
    videoEmbedUrl?: string;
    image: SmartImageSource;
    /** HTML тела (из Sanity Portable Text). Взаимоисключающе с Content. */
    bodyHtml?: string;
    /** Astro-компонент тела (из локального .md). Взаимоисключающе с bodyHtml. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Content?: any;
}

const SERVICES_QUERY = `*[_type == "service"] | order(order asc){
  "id": slug.current,
  title,
  desc,
  size,
  hideModalImage,
  order,
  body,
  "imageUrl": image.asset->url,
  "imageW": image.asset->metadata.dimensions.width,
  "imageH": image.asset->metadata.dimensions.height
}`;

interface SanityService {
    id?: string;
    title: string;
    desc?: string;
    size?: 'large' | 'normal';
    hideModalImage?: boolean;
    order?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any[];
    imageUrl?: string;
    imageW?: number;
    imageH?: number;
}

async function getLocalServices(): Promise<ServiceItem[]> {
    const raw = await getCollection('services');
    return Promise.all(
        raw
            .sort((a, b) => a.data.order - b.data.order)
            .map(async (entry) => {
                const { Content } = await render(entry);
                return {
                    id: entry.id,
                    title: entry.data.title,
                    desc: entry.data.desc,
                    size: entry.data.size,
                    hideModalImage: entry.data.hideModalImage,
                    videoEmbedUrl: entry.data.videoEmbedUrl,
                    image: { kind: 'local' as const, data: entry.data.image as ImageMetadata },
                    Content,
                };
            }),
    );
}

export async function getServices(): Promise<ServiceItem[]> {
    try {
        const docs = await client.fetch<SanityService[]>(SERVICES_QUERY);
        if (Array.isArray(docs) && docs.length > 0) {
            return docs
                .filter((d) => d.imageUrl && d.imageW && d.imageH)
                .map((d) => {
                    const id = d.id ?? '';
                    return {
                        id,
                        title: d.title,
                        desc: d.desc ?? '',
                        size: d.size ?? 'normal',
                        hideModalImage: d.hideModalImage ?? false,
                        videoEmbedUrl: SERVICE_VIDEOS[id],
                        image: {
                            kind: 'remote' as const,
                            src: d.imageUrl as string,
                            width: d.imageW as number,
                            height: d.imageH as number,
                        },
                        bodyHtml: d.body ? toHTML(d.body) : '',
                    };
                });
        }
    } catch (err) {
        console.warn(
            '[getServices] Sanity недоступен — используем локальный бэкап:',
            err instanceof Error ? err.message : err,
        );
    }
    return getLocalServices();
}
