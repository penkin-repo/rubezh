import { client } from '../../sanity/client';

export interface AdvantageItem {
    title: string;
    description: string;
    icon: string;
    /** true → карточка на 2 колонки (lg:col-span-2). */
    wide: boolean;
}

export interface AdvantagesData {
    heading: string;
    subtitle: string;
    items: AdvantageItem[];
}

/** Локальный бэкап = текущий хардкод Advantages.astro. */
const FALLBACK: AdvantagesData = {
    heading: 'Преимущества работы с нами',
    subtitle:
        'Надёжность, подкреплённая собственными ресурсами, техникой и многолетним опытом.',
    items: [
        {
            title: 'Свой автопарк',
            description:
                '60+ тяжелых машин (от бульдозеров до установок ГНБ) всегда в боевой готовности. Мы не зависим от чужой техники.',
            icon: 'lucide:tractor',
            wide: true,
        },
        {
            title: 'Своя логистика',
            description:
                'Сами доставляем песок, щебень и асфальт нашими 3-х и 4-х осными самосвалами. Никаких простоев из-за сторонних перевозчиков.',
            icon: 'lucide:truck',
            wide: false,
        },
        {
            title: 'Соблюдение сроков',
            description:
                'Контролируем каждый этап работ лично. Вы работаете напрямую с исполнителем, а не с цепочкой субподрядчиков.',
            icon: 'lucide:timer',
            wide: false,
        },
        {
            title: 'Команда профессионалов',
            description:
                '130+ штатных сотрудников, в их числе инженеры, геодезисты и механизаторы с актуальными допуcками к сложным работам.',
            icon: 'lucide:hard-hat',
            wide: true,
        },
        {
            title: 'Решение сложных задач',
            description:
                'Беремся за нетиповые проекты и гидротехнические сооружения, от которых отказываются другие.',
            icon: 'lucide:cog',
            wide: true,
        },
        {
            title: 'Гарантия качества',
            description:
                'Несем юридическую ответственность за результат. Соблюдаем СП и СНиПы на всех этапах — от песчаной подушки до финишного покрытия.',
            icon: 'lucide:shield-check',
            wide: false,
        },
    ],
};

const ADVANTAGES_QUERY = `*[_type == "advantages" && _id == "advantages"][0]{
  heading,
  subtitle,
  items[]{ title, description, icon, wide }
}`;

interface SanityAdvantages {
    heading?: string;
    subtitle?: string;
    items?: { title?: string; description?: string; icon?: string; wide?: boolean }[];
}

export async function getAdvantages(): Promise<AdvantagesData> {
    try {
        const doc = await client.fetch<SanityAdvantages | null>(ADVANTAGES_QUERY);
        const items = doc?.items?.filter((i) => i.title && i.description);
        if (doc && items && items.length > 0) {
            return {
                heading: doc.heading ?? FALLBACK.heading,
                subtitle: doc.subtitle ?? FALLBACK.subtitle,
                items: items.map((i) => ({
                    title: i.title as string,
                    description: i.description as string,
                    icon: i.icon ?? 'lucide:cog',
                    wide: i.wide ?? false,
                })),
            };
        }
    } catch (err) {
        console.warn(
            '[getAdvantages] Sanity недоступен — используем локальный бэкап:',
            err instanceof Error ? err.message : err,
        );
    }
    return FALLBACK;
}
