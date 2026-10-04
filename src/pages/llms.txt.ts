/**
 * /llms.txt: a Markdown summary of the practice and its pages for language
 * models (https://llmstxt.org). One H1, a short summary, the facts patients
 * ask about, then links to every service and article in each language.
 * Built from the same config and content as the pages, so it never drifts.
 */
import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { getPosts, getServices } from '../i18n/content';
import { locales, localeMeta, pagePath, type Locale } from '../i18n/locales';
import { useT } from '../i18n/ui';

const abs = (path: string) => new URL(path, site.url).href;

async function section(locale: Locale) {
  const t = useT(locale);
  const services = await getServices(locale);
  const posts = await getPosts(locale);
  const lines = [
    `## ${localeMeta[locale].label}`,
    '',
    `- [${t.nav.home}](${abs(pagePath(locale, 'home'))}): ${t.meta.homeDescription}`,
    `- [${t.nav.about}](${abs(pagePath(locale, 'about'))}): ${t.meta.aboutDescription}`,
    `- [${t.nav.contact}](${abs(pagePath(locale, 'contact'))}): ${t.meta.contactDescription(locale === 'sr' ? site.phone : site.phoneDisplayIntl, site.street, site.city)}`,
    `- [${t.nav.allServices}](${abs(pagePath(locale, 'services'))}): ${t.meta.servicesDescription}`,
    '',
    `### ${t.nav.services}`,
    '',
    ...services.map((s) => `- [${s.data.title}](${abs(s.url)}): ${s.data.description}`),
    '',
    `### ${t.nav.blog}`,
    '',
    ...posts.map((p) => `- [${p.data.title}](${abs(p.url)}): ${p.data.description}`),
    '',
  ];
  return lines.join('\n');
}

export const GET: APIRoute = async () => {
  const hours = site.hours
    .filter((h) => h.opens)
    .map((h) => `${h.days.length > 1 ? `${h.days[0]}–${h.days[h.days.length - 1]}` : h.days[0]} ${h.opens}–${h.closes}`)
    .join(', ');

  const body = [
    `# ${site.name}`,
    '',
    `> Dental practice in ${site.city}, Serbia (${site.alternateName}), open since 2020: implants, prosthodontics, fillings and root canals, gum treatment, children's dentistry, oral surgery, orthodontics, cosmetic dentistry and aesthetic medicine. The site is in Serbian, English and German.`,
    '',
    `- Address: ${site.street}, ${site.postalCode} ${site.city}, Serbia ([map](${site.mapsUrl}))`,
    `- Phone: ${site.phoneDisplayIntl}`,
    `- Email: ${site.email}`,
    `- Opening hours: ${hours}; Sunday closed`,
    `- Patient rating: ${site.rating.value.replace(',', '.')}/5 from ${site.rating.count} ratings on [${site.rating.source}](${site.rating.url})`,
    `- Booking: [contact page with the appointment form](${abs(pagePath('en', 'contact'))})`,
    '',
    ...(await Promise.all(locales.map(section))),
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
