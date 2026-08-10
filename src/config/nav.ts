/**
 * Navigation links. All values are Arabic-only for now.
 */
import type { Locale } from './site';

export type NavItem = { label: Record<Locale, string>; href: string };

export const NAV = {
  main: [
    { label: { ar: 'الرئيسية' }, href: '/' },
    { label: { ar: 'الأدوات' }, href: '/tools/' },
    { label: { ar: 'الأدلة' }, href: '/guides/' },
    { label: { ar: 'من نحن' }, href: '/about/' },
    { label: { ar: 'تواصل معنا' }, href: '/contact/' },
  ] as NavItem[],
  footer: [
    { label: { ar: 'كيف تُعالج الملفات' }, href: '/how-files-are-processed/' },
    { label: { ar: 'سياسة الخصوصية' }, href: '/privacy/' },
    { label: { ar: 'سياسة الكوكيز' }, href: '/cookies/' },
    { label: { ar: 'شروط الاستخدام' }, href: '/terms/' },
    { label: { ar: 'إخلاء المسؤولية' }, href: '/disclaimer/' },
    { label: { ar: 'الإفصاح عن الإعلانات' }, href: '/advertising-disclosure/' },
  ] as NavItem[],
} as const;
