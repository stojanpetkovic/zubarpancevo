import { site } from '../config/site';
import { localeMeta, pagePath, type Locale } from '../i18n/locales';

/*
 * schema.org structured data. The practice is described once, as a Dentist
 * (a LocalBusiness and MedicalOrganization subtype), under a stable @id;
 * pages, services, posts, people and breadcrumbs point at that @id instead
 * of repeating the address and hours. Every page also gets a WebPage node
 * tying its breadcrumb, language and image to the site.
 */

export const dentistId = `${site.url}/#dentist`;
const websiteId = `${site.url}/#website`;
export const personId = (id: string) => `${site.url}/#${id}`;
const abs = (path: string) => new URL(path, site.url).href;

export function dentistSchema(opts: {
  imageUrl: string;
  locale: Locale;
  description: string;
  catalogName: string;
  services: { name: string; url: string }[];
  staff: { id: string; name: string; honorificPrefix?: string; jobTitle: string }[];
}) {
  return {
    '@type': 'Dentist',
    '@id': dentistId,
    name: site.name,
    alternateName: site.alternateName,
    description: opts.description,
    url: `${site.url}/`,
    logo: { '@type': 'ImageObject', url: `${site.url}/logo-512.jpg`, width: 512, height: 512 },
    image: opts.imageUrl,
    telephone: site.phoneE164,
    email: site.email,
    foundingDate: site.foundingDate,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      addressLocality: site.city,
      addressRegion: site.region,
      postalCode: site.postalCode,
      addressCountry: site.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude },
    hasMap: site.mapsUrl,
    areaServed: [
      { '@type': 'City', name: 'Pančevo' },
      { '@type': 'AdministrativeArea', name: site.region },
      { '@type': 'City', name: 'Beograd' },
    ],
    openingHoursSpecification: site.hours
      .filter((h) => h.opens)
      .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'reservations',
      telephone: site.phoneE164,
      email: site.email,
      url: abs(pagePath(opts.locale, 'contact')),
    },
    potentialAction: {
      '@type': 'ReserveAction',
      target: { '@type': 'EntryPoint', urlTemplate: abs(pagePath(opts.locale, 'contact')), inLanguage: localeMeta[opts.locale].htmlLang },
    },
    isAcceptingNewPatients: true,
    medicalSpecialty: ['Dentistry', 'Surgical', 'Pediatric'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: opts.catalogName,
      itemListElement: opts.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'MedicalProcedure', '@id': `${abs(s.url)}#usluga`, name: s.name, url: abs(s.url) },
      })),
    },
    employee: opts.staff.map((p) => ({ '@id': personId(p.id) })),
    // Profiles that carry the same name, address and phone: Google, social accounts and doktor.rs.
    sameAs: [site.googleProfile, ...Object.values(site.social).filter(Boolean), site.rating.url],
  };
}

export function personSchema(p: { id: string; name: string; honorificPrefix?: string; jobTitle: string; url: string; image: string }) {
  return {
    '@type': 'Person',
    '@id': personId(p.id),
    name: p.name,
    honorificPrefix: p.honorificPrefix,
    jobTitle: p.jobTitle,
    url: p.url,
    image: p.image,
    worksFor: { '@id': dentistId },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${site.url}/`,
    name: site.name,
    alternateName: site.alternateName,
    inLanguage: ['sr-Latn', 'en', 'de'],
    publisher: { '@id': dentistId },
  };
}

export type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'MedicalWebPage';

export function webPageSchema(opts: {
  url: string;
  name: string;
  description: string;
  locale: Locale;
  type: PageType;
  imageUrl: string;
  breadcrumbId?: string;
}) {
  return {
    '@type': opts.type,
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: localeMeta[opts.locale].htmlLang,
    isPartOf: { '@id': websiteId },
    about: { '@id': dentistId },
    primaryImageOfPage: { '@type': 'ImageObject', url: opts.imageUrl },
    ...(opts.breadcrumbId ? { breadcrumb: { '@id': opts.breadcrumbId } } : {}),
  };
}

export type Crumb = { name: string; path: string };

/** The breadcrumb's @id is the current page (last crumb) plus #breadcrumb. */
export const breadcrumbId = (crumbs: Crumb[]) => `${abs(crumbs[crumbs.length - 1].path)}#breadcrumb`;

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(crumbs),
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string; imageUrl: string }) {
  return {
    '@type': 'MedicalProcedure',
    '@id': `${abs(opts.path)}#usluga`,
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    image: opts.imageUrl,
    mainEntityOfPage: { '@id': `${abs(opts.path)}#webpage` },
    provider: { '@id': dentistId },
  };
}

export function postSchema(opts: {
  title: string;
  description: string;
  path: string;
  imageUrl: string;
  date: Date;
  updated?: Date;
  locale: Locale;
  section?: string;
  /** Team member id (config/team.ts). */
  author: string;
}) {
  return {
    '@type': 'BlogPosting',
    '@id': `${abs(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    url: abs(opts.path),
    mainEntityOfPage: { '@id': `${abs(opts.path)}#webpage` },
    image: opts.imageUrl,
    datePublished: opts.date.toISOString(),
    dateModified: (opts.updated ?? opts.date).toISOString(),
    inLanguage: localeMeta[opts.locale].htmlLang,
    ...(opts.section ? { articleSection: opts.section } : {}),
    author: { '@id': personId(opts.author) },
    publisher: { '@id': dentistId },
  };
}
