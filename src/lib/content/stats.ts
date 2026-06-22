import { client } from '../../sanity/client';

export interface StatItem {
    value: number;
    suffix: string;
    label: string;
}

/** Дефолтные значения = текущий хардкод StatsBar (локальный бэкап). */
const FALLBACK_STATS: StatItem[] = [
    { value: 11, suffix: '+', label: 'лет работы' },
    { value: 200, suffix: '+', label: 'объектов' },
    { value: 60, suffix: '+', label: 'единиц техники' },
    { value: 130, suffix: '+', label: 'специалистов' },
];

const STATS_QUERY = `*[_type == "stats" && _id == "stats"][0]{
  items[]{ value, suffix, label }
}`;

interface SanityStats {
    items?: { value?: number; suffix?: string; label?: string }[];
}

export async function getStats(): Promise<StatItem[]> {
    try {
        const doc = await client.fetch<SanityStats | null>(STATS_QUERY);
        const items = doc?.items?.filter((i) => typeof i.value === 'number' && i.label);
        if (items && items.length > 0) {
            return items.map((i) => ({
                value: i.value as number,
                suffix: i.suffix ?? '',
                label: i.label as string,
            }));
        }
    } catch (err) {
        console.warn(
            '[getStats] Sanity недоступен — используем локальный бэкап:',
            err instanceof Error ? err.message : err,
        );
    }
    return FALLBACK_STATS;
}
