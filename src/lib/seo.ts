import { SITE } from '../config/site.ts';

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  lastReviewed?: string;
}

/** Absolute URL for a path on the site (Arabic is the only locale). */
export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${p}`;
}

export function buildTitle(mainTitle: string): string {
  const brand = SITE.brandName.ar;
  return mainTitle === brand ? `${brand} — ${SITE.tagline.ar}` : `${mainTitle} | ${brand}`;
}

export function metaRobots(noindex: boolean): string {
  return noindex ? 'noindex, nofollow' : 'index, follow';
}

/* ---------------- JSON-LD builders ---------------- */

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.brandName.ar,
    url: absoluteUrl('/'),
    inLanguage: 'ar',
    description: SITE.tagline.ar,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webApplicationJsonLd(meta: SeoMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.title,
    url: absoluteUrl(meta.path),
    description: meta.description,
    applicationCategory: 'MultimediaApplication',
    inLanguage: 'ar',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
