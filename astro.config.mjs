// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Addresses the WordPress site exposed that have no page of their own here:
// theme demo entries (service/, doctor/) and archive pages. Each points to the
// closest real page so links and search results do not end on a 404.
// public/.htaccess repeats them as real 301s for Apache hosting.
const oldWordPressUrls = {
  '/service/oralna-hirurgija-sa-implantologijom-prf/': '/oralna-hirurgija-sa-implantologijom-prf/',
  '/service/teeth-whitening/': '/estetska-stomatologija/',
  '/service/laser-treatment/': '/usluge/',
  '/doctor/dr-charlie-smith/': '/o-nama/',
  '/doctor/dr-clare-mitchell/': '/o-nama/',
  '/doctor/dr-anne-middleton/': '/o-nama/',
  '/category/uncategorized/': '/blog/',
  '/author/admin/': '/blog/',
  '/author/lazar/': '/blog/',
};

const notInSitemap = ['/hvala/', '/en/thank-you/', '/de/danke/', ...Object.keys(oldWordPressUrls)];

export default defineConfig({
  site: 'https://zubarpancevo.com',
  trailingSlash: 'always',
  // Keep the space between text and an inline link on the next line.
  compressHTML: false,
  redirects: oldWordPressUrls,
  build: { inlineStylesheets: 'always' },
  // Self-hosted at build time; latin-ext carries č, ć, š, ž and đ.
  fonts: [
    {
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta',
      provider: fontProviders.google(),
      weights: [600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Manrope',
      cssVariable: '--font-manrope',
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => !notInSitemap.some((path) => page.endsWith(path)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
