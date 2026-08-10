import { DEFAULT_LOCALE, type Locale } from '../config/site.ts';

/**
 * Build a localized path. Arabic (default) is served at root.
 * English (`/en/...`) is future work; the branch is typed but unused.
 */
export function localizedPath(locale: Locale, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return p;
  return `/en${p}`;
}
