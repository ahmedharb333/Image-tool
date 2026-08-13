/**
 * Central site configuration.
 * Edit brand, domain, contact, colors and dates here only.
 */

export type Locale = 'ar';

export const LOCALES: Locale[] = ['ar'];
export const DEFAULT_LOCALE: Locale = 'ar';

export const SITE = {
  /** Live domain. */
  url: 'https://tools.worldly.pro',
  /** Brand name (display). */
  brandName: { ar: 'أدوات الصور' },
  /** Short brand tagline. */
  tagline: { ar: 'أدوات معالجة الصور داخل متصفحك' },
  /** Owner / editorial placeholder. Kept empty until real info is provided. */
  owner: {
    name: { ar: '' },
    email: 'contact@worldly.pro',
    emailDisplay: { ar: 'بريد إلكتروني' },
  },
  /** Editorial placeholder — no invented people. */
  reviewerPlaceholder: {
    ar: 'المراجِع: سيُذكر اسم المراجِع المعتمد هنا',
  },
  /** Default last-reviewed date (ISO). Update as content is reviewed. */
  lastReviewedDefault: '2026-08-10',
  /** Contact route handling: mailto-based (no server backend). */
  contact: {
    useMailto: true,
    mailtoSubject: { ar: 'رسالة من موقع أدوات الصور' },
  },
} as const;

export const LOGO = {
  /** Rendered as text (no image assets). */
  text: { ar: 'أدوات الصور' },
  /** Arabic-English combined lockup used in footer. */
  lockup: { ar: 'أدوات الصور — Image Tools' },
} as const;

export const THEME = {
  /** Brand colors (kept in sync with styles/tokens.css). */
  primary: '#12305C',
  accent: '#0E8A6D',
  background: '#FFFFFF',
  altBackground: '#F6F8FB',
  text: '#16233A',
} as const;
