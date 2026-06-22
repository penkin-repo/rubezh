import { getCollection } from 'astro:content';
import { client } from '../../sanity/client';

/**
 * Форма контактных данных. Совпадает с frontmatter локальной коллекции `site`
 * (src/content/site/contacts.md) — поэтому Sanity и fallback возвращают одно и то же.
 */
export interface Contacts {
    companyName: string;
    mainPhoneDisplay: string;
    mainPhoneHref: string;
    officeEmail: string;
    hrPhoneDisplay: string;
    hrPhoneHref: string;
    hrEmail: string;
    addressShort: string;
    addressFull: string;
    vkUrl: string;
    avitoUrl: string;
    hhUrl: string;
    inn: string;
    kpp: string;
    ogrn: string;
    workWeekdays: string;
    workWeekend: string;
    mapEmbedUrl: string;
}

const SITE_QUERY = `*[_type == "site" && _id == "site"][0]{
  companyName,
  mainPhoneDisplay,
  mainPhoneHref,
  officeEmail,
  hrPhoneDisplay,
  hrPhoneHref,
  hrEmail,
  addressShort,
  addressFull,
  vkUrl,
  avitoUrl,
  hhUrl,
  inn,
  kpp,
  ogrn,
  workWeekdays,
  workWeekend,
  mapEmbedUrl
}`;

/** Данные из локальной коллекции — неприкосновенный бэкап в Git. */
async function getLocalContacts(): Promise<Contacts> {
    const [entry] = (await getCollection('site')).sort((a, b) =>
        a.id.localeCompare(b.id),
    );
    return entry.data as Contacts;
}

/**
 * Контакты сайта. Сначала пробуем Sanity, при любой ошибке/пустоте —
 * мягко откатываемся на локальные .md, чтобы сборка никогда не падала.
 */
export async function getContacts(): Promise<Contacts> {
    try {
        const data = await client.fetch<Partial<Contacts> | null>(SITE_QUERY);
        if (data && data.mainPhoneDisplay && data.mainPhoneHref) {
            // Подмешиваем локальные значения как страховку для пустых полей.
            const local = await getLocalContacts();
            return { ...local, ...stripEmpty(data) };
        }
    } catch (err) {
        console.warn(
            '[getContacts] Sanity недоступен — используем локальный бэкап:',
            err instanceof Error ? err.message : err,
        );
    }
    return getLocalContacts();
}

/** Убирает null/undefined/'' чтобы они не затирали локальный fallback. */
function stripEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const out: Partial<T> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v !== null && v !== undefined && v !== '') {
            out[k as keyof T] = v as T[keyof T];
        }
    }
    return out;
}
