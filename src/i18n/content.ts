/**
 * Content collections by language. Entry ids look like "en/protetika": the
 * locale folder, then the key (file name) shared by every translation.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { locales, localePath, type Alternates, type Locale } from './locales';

export type Service = CollectionEntry<'usluge'> & { key: string; locale: Locale; url: string };
export type Post = CollectionEntry<'blog'> & { key: string; locale: Locale; url: string };

const split = (id: string) => {
  const [locale, key] = id.split('/') as [Locale, string];
  return { locale, key };
};

function withUrl<T extends CollectionEntry<'usluge'> | CollectionEntry<'blog'>>(entry: T) {
  const { locale, key } = split(entry.id);
  return { ...entry, key, locale, url: localePath(locale, entry.data.slug ?? key) };
}

export async function getServices(locale: Locale): Promise<Service[]> {
  return (await getCollection('usluge'))
    .filter((e) => split(e.id).locale === locale)
    .map(withUrl)
    .sort((a, b) => a.data.order - b.data.order) as Service[];
}

export async function getPosts(locale: Locale): Promise<Post[]> {
  return (await getCollection('blog'))
    .filter((e) => split(e.id).locale === locale)
    .map(withUrl)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()) as Post[];
}

/** Every service and post in every language, for building the routes. */
export async function getAllEntries() {
  const services = (await getCollection('usluge')).map(withUrl) as Service[];
  const posts = (await getCollection('blog')).map(withUrl) as Post[];
  return { services, posts };
}

/** The same service or post in each language, keyed by locale. */
export function entryAlternates(all: (Service | Post)[], key: string): Alternates {
  return Object.fromEntries(
    locales.map((l) => [l, all.find((e) => e.key === key && e.locale === l)?.url]).filter(([, url]) => url),
  );
}

/** Words → minutes, at about 200 words a minute. */
export const readingMinutes = (body?: string) => Math.max(1, Math.ceil((body ?? '').split(/\s+/).length / 200));
