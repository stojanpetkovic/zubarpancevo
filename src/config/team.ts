import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/locales';
import { useT } from '../i18n/ui';
import drMilos from '../assets/tim/dr-milos-eric.jpg';
import olga from '../assets/tim/dr-sci-olga-milosevic.jpg';
import marina from '../assets/tim/marina-eric.jpg';

/**
 * The practice team. Shown on the homepage and the about page, and published
 * as Person structured data there. Photos and names live here; role, bio and
 * tags per language are in i18n/ui.ts (team.members). Bios state only what the
 * practice has published itself; extend them with the client's own words.
 */
const people = [
  {
    id: 'milos',
    img: drMilos,
    name: { sr: 'dr Miloš Erić', en: 'Dr Miloš Erić', de: 'Dr. Miloš Erić' },
    plainName: 'Miloš Erić',
    honorificPrefix: 'dr',
    icon: 'award',
  },
  {
    id: 'olga',
    img: olga,
    name: { sr: 'dr sci. Olga Milošević', en: 'Dr Olga Milošević, PhD', de: 'Dr. sc. Olga Milošević' },
    plainName: 'Olga Milošević',
    honorificPrefix: 'dr sci.',
    icon: 'microscope',
  },
  {
    id: 'marina',
    img: marina,
    name: { sr: 'Marina Erić', en: 'Marina Erić', de: 'Marina Erić' },
    plainName: 'Marina Erić',
    honorificPrefix: undefined,
    icon: 'heart',
  },
] as const;

export type TeamMember = {
  id: string;
  img: ImageMetadata;
  name: string;
  plainName: string;
  honorificPrefix?: string;
  icon: string;
  role: string;
  alt: string;
  bio: string;
  tags: readonly string[];
};

export function getTeam(locale: Locale): TeamMember[] {
  const text = useT(locale).team.members;
  return people.map((p) => ({ ...p, name: p.name[locale], ...text[p.id] }));
}
