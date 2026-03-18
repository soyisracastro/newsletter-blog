import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsletters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletters' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    sentToList: z.string(),
  }),
});

const ebooks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ebooks' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    chapter: z.number(),
    bookSlug: z.string(),
    isFree: z.boolean(),
  }),
});

export const collections = { newsletters, ebooks };
