import { DEFAULT_LOCALE, type Locale } from '../config/site.ts';

/**
 * Build a localized path. Arabic (default) is served at root;
 * English is served under `/en/...`.
 */
export function localizedPath(locale: Locale, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return p;
  return `/en${p}`;
}

/** Given a path for one locale, return the matching path for another. */
export function pathForLocale(locale: Locale, otherPath: string): string {
  const stripped = otherPath.replace(/^\/en/, '') || '/';
  return localizedPath(locale, stripped);
}

/**
 * Sections that have English routes today. Until guides/legal/about/contact are
 * translated (later phases), English nav points those sections at the Arabic
 * pages so nothing 404s. Update as sections gain English routes.
 */
export function hasEnglishRoute(arPath: string): boolean {
  return arPath === '/' || arPath.startsWith('/tools/');
}

/** Nav href for a section link, respecting which sections exist in English. */
export function navHref(locale: Locale, href: string): string {
  if (locale === 'en' && !hasEnglishRoute(href)) return localizedPath('ar', href);
  return localizedPath(locale, href);
}

/** Safe target for the language switcher: never links to a missing page. */
export function switchLocalePath(target: Locale, currentPath: string): string {
  const arPath = currentPath.replace(/^\/en/, '') || '/';
  if (target === 'ar') return arPath;
  return hasEnglishRoute(arPath) ? localizedPath('en', arPath) : '/en/';
}

export const DIR: Record<Locale, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' };
export const LANG_ATTR: Record<Locale, string> = { ar: 'ar', en: 'en' };
export const OG_LOCALE: Record<Locale, string> = { ar: 'ar_AR', en: 'en_US' };

export function isRtl(locale: Locale): boolean {
  return DIR[locale] === 'rtl';
}

/**
 * A localized string: Arabic is always present; English is optional so that
 * content can be translated incrementally. `tr` falls back to Arabic when the
 * English value is missing or empty.
 */
export type L10n = { ar: string; en?: string };

export function tr(value: L10n, locale: Locale): string {
  if (locale === 'en' && value.en) return value.en;
  return value.ar;
}
