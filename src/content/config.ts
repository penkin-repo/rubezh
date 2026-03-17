import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    category: z.string(),
    location: z.string(),
    images: z.array(image()),
    order: z.number().optional().default(0),
  })
});

export const collections = {
  projects
};
