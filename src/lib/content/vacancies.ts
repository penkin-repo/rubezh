import { getCollection, render } from 'astro:content';
import { toHTML } from '@portabletext/to-html';
import { client } from '../../sanity/client';

export interface VacancyItem {
    id: string;
    title: string;
    order: number;
    /** HTML тела (из Sanity Portable Text). Взаимоисключающе с Content. */
    bodyHtml?: string;
    /** Astro-компонент тела (из локального .md). Взаимоисключающе с bodyHtml. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Content?: any;
}

const VACANCIES_QUERY = `*[_type == "vacancy"] | order(order asc){
  "id": slug.current,
  title,
  order,
  body
}`;

interface SanityVacancy {
    id?: string;
    title: string;
    order?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any[];
}

async function getLocalVacancies(): Promise<VacancyItem[]> {
    const raw = await getCollection('vacancies');
    return Promise.all(
        raw
            .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id))
            .map(async (entry) => {
                const { Content } = await render(entry);
                return {
                    id: entry.id,
                    title: entry.data.title,
                    order: entry.data.order,
                    Content,
                };
            }),
    );
}

export async function getVacancies(): Promise<VacancyItem[]> {
    try {
        const docs = await client.fetch<SanityVacancy[]>(VACANCIES_QUERY);
        if (Array.isArray(docs) && docs.length > 0) {
            return docs.map((d, i) => ({
                id: d.id ?? `vacancy-${i}`,
                title: d.title,
                order: d.order ?? 0,
                bodyHtml: d.body ? toHTML(d.body) : '',
            }));
        }
    } catch (err) {
        console.warn(
            '[getVacancies] Sanity недоступен — используем локальный бэкап:',
            err instanceof Error ? err.message : err,
        );
    }
    return getLocalVacancies();
}
