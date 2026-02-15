import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsletters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletters' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    subject: z.string(),
    sentToList: z.string(),
    campaignId: z.string().optional(),
  }),
});

export const collections = { newsletters };
