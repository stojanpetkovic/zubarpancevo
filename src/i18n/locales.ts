/**
 * Languages and localized addresses.
 *
 * Serbian is the default and keeps the root URLs the site has always had.
 * English and German live under /en/ and /de/, with translated slugs, so
 * every page has its own address in each language. hreflang links in the
 * head tie the three versions together for search engines.
 */

export const locales = ['sr', 'en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sr';

export const localeMeta: Record<Locale, { label: string; short: string; htmlLang: string; ogLocale: string; hreflang: string; dateLocale: string }> = {
  sr: { label: 'Srpski', short: 'SR', htmlLang: 'sr-Latn', ogLocale: 'sr_RS', hreflang: 'sr', dateLocale: 'sr-Latn-RS' },
  en: { label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US', hreflang: 'en', dateLocale: 'en-GB' },
  de: { label: 'Deutsch', short: 'DE', htmlLang: 'de', ogLocale: 'de_DE', hreflang: 'de', dateLocale: 'de-DE' },
};

/** The fixed pages and their slug in each language ('' is the home page). */
export const pages = {
  home: { sr: '', en: '', de: '' },
  about: { sr: 'o-nama', en: 'about-us', de: 'ueber-uns' },
  contact: { sr: 'kontakt', en: 'contact', de: 'kontakt' },
  services: { sr: 'usluge', en: 'services', de: 'leistungen' },
  blog: { sr: 'blog', en: 'blog', de: 'blog' },
  thanks: { sr: 'hvala', en: 'thank-you', de: 'danke' },
  privacy: { sr: 'politika-privatnosti', en: 'privacy-policy', de: 'datenschutz' },
} as const satisfies Record<string, Record<Locale, string>>;
export type PageKey = keyof typeof pages;

/** Builds a site path for a slug in a language, always with a trailing slash. */
export function localePath(locale: Locale, slug = ''): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${prefix}/${slug ? `${slug}/` : ''}`;
}

export function pagePath(locale: Locale, page: PageKey): string {
  return localePath(locale, pages[page][locale]);
}

/** The language of a URL, from its first path segment. */
export function localeFromUrl(url: URL): Locale {
  const first = url.pathname.split('/')[1];
  return (locales as readonly string[]).includes(first) && first !== defaultLocale ? (first as Locale) : defaultLocale;
}

/** Same page in every language, for hreflang links and the language switcher. */
export type Alternates = Partial<Record<Locale, string>>;

export function pageAlternates(page: PageKey): Alternates {
  return Object.fromEntries(locales.map((l) => [l, pagePath(l, page)]));
}
