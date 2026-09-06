import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const common = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  // Drafts render in `astro dev` and are excluded from `astro build`.
  draft: z.boolean().default(false),
};

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    ...common,
    // Shown in the right-hand column of the work list, e.g. "2024–now".
    period: z.string().optional(),
    // Position in "Selected work"; lower comes first.
    order: z.number().int().default(99),
    repo: z.url().optional(),
    demo: z.url().optional(),
    paper: z.url().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    ...common,
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { work, writing };
