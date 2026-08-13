/**
 * Navigation links, bilingual (Arabic + English).
 */
import type { L10n } from '../lib/i18n';

export type NavItem = { label: L10n; href: string };

export const NAV = {
  main: [
    { label: { ar: 'الرئيسية', en: 'Home' }, href: '/' },
    { label: { ar: 'الأدوات', en: 'Tools' }, href: '/tools/' },
    { label: { ar: 'الأدلة', en: 'Guides' }, href: '/guides/' },
    { label: { ar: 'من نحن', en: 'About' }, href: '/about/' },
    { label: { ar: 'تواصل معنا', en: 'Contact' }, href: '/contact/' },
  ] as NavItem[],
  footer: [
    { label: { ar: 'كيف تُعالج الملفات', en: 'How files are processed' }, href: '/how-files-are-processed/' },
    { label: { ar: 'سياسة الخصوصية', en: 'Privacy policy' }, href: '/privacy/' },
    { label: { ar: 'سياسة الكوكيز', en: 'Cookies policy' }, href: '/cookies/' },
    { label: { ar: 'شروط الاستخدام', en: 'Terms of use' }, href: '/terms/' },
    { label: { ar: 'إخلاء المسؤولية', en: 'Disclaimer' }, href: '/disclaimer/' },
    { label: { ar: 'الإفصاح عن الإعلانات', en: 'Advertising disclosure' }, href: '/advertising-disclosure/' },
  ] as NavItem[],
} as const;
