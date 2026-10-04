import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Ids stay "locale/key" (the file path). Without this, the loader would use
// the `slug` field as the id, and translations would lose their shared key.
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

const faq = z.array(z.object({ q: z.string(), a: z.string() })).default([]);

/*
 * Content is stored per language: <collection>/<locale>/<key>.md. The file
 * name (key) is the same in every language and ties the translations
 * together; `slug` is the address in that language (the Serbian key when
 * absent, which keeps the WordPress URLs).
 */

/** Service pages: usluge/sr/protetika.md → /protetika/, usluge/en/protetika.md (slug: prosthodontics) → /en/prosthodontics/. */
const usluge = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/usluge', generateId }),
  schema: ({ image }) =>
    z.object({
      /** Address in this language; defaults to the file name. */
      slug: z.string().optional(),
      /** H1 and the name used in menus and cards. */
      title: z.string(),
      /** Short name for menus when the title is long. */
      menuTitle: z.string().optional(),
      /** <title>; about 50–60 characters, with "Pančevo" in it. */
      seoTitle: z.string(),
      /** Meta description; about 140–160 characters. */
      description: z.string(),
      /** One or two sentences under the H1 and on the service card. */
      lead: z.string(),
      image: image(),
      imageAlt: z.string(),
      /** Service illustration: a name from components/ServiceIcon.astro. */
      icon: z.enum(['implant', 'tooth-canal', 'bridge', 'gums', 'child-tooth', 'surgery', 'braces', 'sparkle-tooth', 'syringe']),
      order: z.number(),
      faq,
    }),
});

/** Blog posts keep the root-level URLs they had on WordPress: blog/sr/sta-je-karijes.md → /sta-je-karijes/. */
const blog = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/blog', generateId }),
  schema: ({ image }) =>
    z.object({
      slug: z.string().optional(),
      title: z.string(),
      seoTitle: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      image: image(),
      imageAlt: z.string(),
      /** Service keys (file names) this post links to at the end. */
      related: z.array(z.string()).default([]),
    }),
});

export const collections = { usluge, blog };
