import { pagePath, type Locale } from '../i18n/locales';

/**
 * Everything the site says about the practice, in one place: header, footer,
 * contact page, structured data and the forms all read from here. NAP
 * (name, address, phone) must stay identical to the Google Business Profile.
 */
export const site = {
  name: 'Erić Dental Centar',
  alternateName: 'Zubar Pančevo',
  url: 'https://zubarpancevo.com',
  phone: '062 407 908',
  phoneDisplayIntl: '+381 62 407 908',
  phoneE164: '+38162407908',
  email: 'ericdentalcentar013@gmail.com',
  street: 'Oslobođenja 23',
  city: 'Pančevo',
  /** The practice's own postal code; 26000 is Pančevo as a city. Matches the Google profile. */
  postalCode: '26101',
  region: 'Južnobanatski okrug',
  country: 'RS',
  foundingDate: '2020-10-01',
  /** Front door of Oslobođenja 23 (OpenStreetMap node 8302942806). */
  geo: { latitude: 44.8767658, longitude: 20.65395 },
  /**
   * Google Business Profile, by its Knowledge Graph id (from the profile's
   * share link). The strongest link between the site and the map listing.
   */
  googleProfile: 'https://www.google.com/search?kgmid=/g/11jt3mp0d_',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Eri%C4%87+Dental+Centar%2C+Oslobo%C4%91enja+23%2C+Pan%C4%8Devo',
  mapsEmbed:
    'https://maps.google.com/maps?q=Oslobo%C4%91enja%2023%2C%2026101%20Pan%C4%8Devo&z=16&output=embed',
  /** Profiles shown in the footer and listed in the structured data. Leave a link empty to hide that icon. */
  social: {
    facebook: 'https://www.facebook.com/ericdentalcentar1/',
    instagram: 'https://www.instagram.com/ericdentalcentar/',
    tiktok: '',
    linkedin: 'https://www.linkedin.com/company/eri%C4%87-dental-centar/',
  },
  /** Working hours, as shown on the site and in the structured data. Labels come from i18n/ui.ts. */
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '19:00' },
    { days: ['Saturday'], opens: '10:00', closes: '15:00' },
    { days: ['Sunday'], opens: null, closes: null },
  ],
  /**
   * Public patient rating, shown with its source. Checked on doktor.rs
   * 2026-10-03 ("Ocena: 5 (broj ocena: 31)"); update both numbers together.
   * Deliberately not in the structured data: Google ignores review markup a
   * business publishes about itself.
   */
  rating: {
    value: '5,0',
    count: 31,
    source: 'doktor.rs',
    url: 'https://www.doktor.rs/mapa/Pancevo/Eric-Dental-Centar/5ce40b3df3',
  },
  /**
   * Lead admin key (stojanpetkovic.com/admin → Sites, domain zubarpancevo.com).
   * Forms and visit tracking stay off until it is filled in.
   */
  leadsSiteKey: '855c12fc4e319fc1f537cc172a261178',
  /**
   * Google Analytics 4. Loads only after the visitor accepts the cookie
   * notice (components/ConsentBanner.astro); empty turns it off entirely.
   */
  googleAnalyticsId: 'G-EGHJWQ8424',
  /** Google Search Console ownership check (HTML tag method). */
  googleSiteVerification: 'SfZa6cumn08TQ7T7xaDewxzhoaqjLpwjv6Mz8zZ5ZhI',
} as const;

export const telHref = `tel:${site.phoneE164}`;

/**
 * Link to the booking form on the contact page in a language. With a service
 * key, the form opens with that service already selected
 * (see components/BookingForm.astro).
 */
export const bookingHref = (locale: Locale, service?: string) =>
  `${pagePath(locale, 'contact')}${service ? `?usluga=${service}` : ''}#zakazivanje`;
