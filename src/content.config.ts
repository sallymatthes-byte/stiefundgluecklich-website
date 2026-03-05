import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum([
      'rolle-identitaet',
      'partnerschaft',
      'ex-und-system',
      'kinder-bindung'
    ]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    podcastEpisode: z.string().optional(),
    podcastTitle: z.string().optional(),
    podcastDescription: z.string().optional(),
    readingTime: z.string().optional(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
