import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    category: z.string(),
    location: z.string().optional(),
    description: z.string(),
    images: z.array(image()),
    order: z.number().optional().default(0),
  })
});

const equipment = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/equipment" }),
  schema: ({ image }) => z.object({
    items: z.array(
      z.object({
        title: z.string(),
        category: z.string(),
        specs: z.string(),
        image: image(),
        order: z.number().optional().default(0),
        featured: z.boolean().optional().default(false),
        featuredOrder: z.number().optional().default(0),
      })
    ),
  })
});

const services = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/services" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    desc: z.string(),
    image: image(),
    videoEmbedUrl: z.string().optional(),
    hideModalImage: z.boolean().optional().default(false),
    order: z.number().optional().default(0),
    size: z.enum(['large', 'normal']).optional().default('normal'),
  })
});

const site = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/site" }),
  schema: z.object({
    companyName: z.string(),
    mainPhoneDisplay: z.string(),
    mainPhoneHref: z.string(),
    officeEmail: z.string().email(),
    hrPhoneDisplay: z.string(),
    hrPhoneHref: z.string(),
    hrEmail: z.string().email(),
    addressShort: z.string(),
    addressFull: z.string(),
    vkUrl: z.string().url(),
    avitoUrl: z.string().url(),
    hhUrl: z.string().url(),
    inn: z.string(),
    kpp: z.string(),
    ogrn: z.string(),
    workWeekdays: z.string(),
    workWeekend: z.string(),
    mapEmbedUrl: z.string().url(),
  })
});

export const collections = {
  projects,
  equipment,
  services,
  site,
};
