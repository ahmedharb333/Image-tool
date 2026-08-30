/**
 * Bilingual UI strings (Arabic + English). Access with `tr(UI.x, locale)`.
 * Content data (tools, guides, pages) lives in their own config/content files;
 * this file holds interface chrome and tool-form labels only.
 */
import type { L10n } from '../lib/i18n';

export const UI = {
  // Chrome
  skipToContent: { ar: 'تخطَّ إلى المحتوى الرئيسي', en: 'Skip to main content' },
  mainNavAria: { ar: 'التنقل الرئيسي', en: 'Main navigation' },
  footerQuickLinks: { ar: 'روابط سريعة', en: 'Quick links' },
  footerLegal: { ar: 'الصفحات القانونية', en: 'Legal pages' },
  rightsReserved: {
    ar: 'جميع الحقوق محفوظة. تتم معالجة جميع الصور محليًا داخل متصفحك.',
    en: 'All rights reserved. Every image is processed locally in your browser.',
  },
  consentToggleLabel: { ar: 'الموافقة على ملفات تعريف الارتباط', en: 'Cookie consent' },
  switchToEnglish: { ar: 'English', en: 'English' },
  switchToArabic: { ar: 'العربية', en: 'العربية' },
  langSwitchAria: { ar: 'تغيير اللغة', en: 'Change language' },

  // Home
  heroBadge: {
    ar: '🔒 يعمل بالكامل داخل متصفحك — لا رفع للملفات',
    en: '🔒 Runs entirely in your browser — no uploads',
  },
  heroTitle: { ar: 'أدوات مجانية داخل متصفحك', en: 'Free tools that run in your browser' },
  heroText: {
    ar: 'أدوات للصور والمستندات — ضغط وتحويل واقتصاص الصور، وتحويل المستندات إلى Markdown — بالكامل محليًا دون رفع أي ملف إلى أي خادم.',
    en: 'Tools for images and documents — compress, convert and crop images, and turn documents into Markdown — fully local, without uploading any file to any server.',
  },
  startNow: { ar: 'ابدأ الآن', en: 'Start now' },
  sectionTools: { ar: 'الأدوات', en: 'Tools' },
  sectionHow: { ar: 'كيف تعمل؟', en: 'How it works' },
  sectionGuides: { ar: 'الأدلة', en: 'Guides' },
  toolCta: { ar: 'جرّب الآن ←', en: 'Try it →' },
  step1Strong: { ar: 'اختر ملفًا', en: 'Choose a file' },
  step1Rest: { ar: 'من جهازك', en: 'from your device' },
  step2Strong: { ar: 'عدّل الإعدادات', en: 'Adjust the settings' },
  step2Rest: { ar: 'حسب الأداة', en: 'for the tool' },
  step3Strong: { ar: 'حمّل الناتج', en: 'Download the result' },
  step3Rest: { ar: '— ولا يغادر ملفك جهازك أبدًا', en: '— and your file never leaves your device' },

  // Tools index
  toolsIndexTitle: { ar: 'الأدوات', en: 'Tools' },
  toolsIndexDesc: {
    ar: 'جميع الأدوات المحلية للصور والمستندات في مكان واحد.',
    en: 'All local image and document tools in one place.',
  },
  catAll: { ar: 'الكل', en: 'All' },
  catCompress: { ar: 'الضغط', en: 'Compress' },
  catResize: { ar: 'تغيير الحجم', en: 'Resize' },
  catConvert: { ar: 'التحويل', en: 'Convert' },
  catCrop: { ar: 'القص', en: 'Crop' },
  catDocument: { ar: 'المستندات', en: 'Documents' },
  toolsSearchPlaceholder: { ar: 'ابحث عن أداة…', en: 'Search for a tool…' },
  toolsSearchAria: { ar: 'البحث في الأدوات', en: 'Search tools' },

  // Guides
  guidesIndexDesc: {
    ar: 'أدلة عملية خطوة بخطوة لاستخدام أدوات الصور بأفضل شكل.',
    en: 'Step-by-step practical guides to get the most out of the image tools.',
  },
  guidesIndexMetaDesc: {
    ar: 'أدلة عملية لضغط الصور وتغيير حجمها وتحويلها وقصّها داخل المتصفح.',
    en: 'Practical guides for compressing, resizing, converting and cropping images in the browser.',
  },
  guideLastUpdated: { ar: 'آخر تحديث', en: 'Last updated' },
  guideFaqHeading: { ar: 'أسئلة شائعة', en: 'Frequently asked questions' },
  tryTheTool: { ar: 'جرّب الأداة', en: 'Try the tool' },

  // Document -> Markdown tool
  docDropTitle: { ar: 'اسحب مستندًا هنا أو اضغط للاختيار', en: 'Drag a document here or click to choose' },
  docDropHint: { ar: 'DOCX أو HTML أو RTF أو TXT أو MD أو PDF', en: 'DOCX, HTML, RTF, TXT, MD or PDF' },
  docConvert: { ar: 'حوّل إلى Markdown', en: 'Convert to Markdown' },
  docOutputLabel: { ar: 'الناتج (Markdown)', en: 'Result (Markdown)' },
  docCopy: { ar: 'نسخ', en: 'Copy' },
  docCopied: { ar: 'تم النسخ ✓', en: 'Copied ✓' },
  docDownload: { ar: 'تحميل .md', en: 'Download .md' },
  docWorking: { ar: 'جارٍ التحويل…', en: 'Converting…' },
  docDone: { ar: 'تم التحويل بنجاح.', en: 'Converted successfully.' },
  docErrNoFile: { ar: 'اختر ملفًا أولاً.', en: 'Choose a file first.' },
  docErrUnsupported: { ar: 'صيغة غير مدعومة. المدعوم: DOCX وHTML وRTF وTXT وMD وPDF.', en: 'Unsupported format. Supported: DOCX, HTML, RTF, TXT, MD and PDF.' },
  docErrFail: { ar: 'تعذّر تحويل الملف.', en: 'Could not convert the file.' },
  docNotePdf: { ar: 'قد تختلف النتائج مع ملفات PDF لأنها لا تحمل بنية نصية واضحة.', en: 'Results may vary for PDFs, since they carry no clear text structure.' },
  docNoteRtf: { ar: 'تحويل مبسّط لملفات RTF.', en: 'Basic conversion for RTF files.' },
  docTabMarkdown: { ar: 'Markdown', en: 'Markdown' },
  docTabPreview: { ar: 'معاينة', en: 'Preview' },
  docClear: { ar: 'مسح', en: 'Clear' },
  docWords: { ar: 'كلمة', en: 'words' },
  docChars: { ar: 'حرف', en: 'chars' },
  docDropActive: { ar: 'أفلت الملف للتحويل', en: 'Drop the file to convert' },

  // Contact
  contactTitle: { ar: 'تواصل معنا', en: 'Contact us' },
  contactMetaDesc: { ar: 'تواصل مع فريق أدوات الصور.', en: 'Get in touch with the Image Tools team.' },
  contactIntro: { ar: 'يسعدنا استقبال أسئلتك وملاحظاتك.', en: 'We would be glad to hear your questions and feedback.' },
  contactEmailAt: { ar: 'راسِلنا مباشرةً على:', en: 'Email us directly at:' },
  contactSubject: { ar: 'الموضوع', en: 'Subject' },
  contactMessage: { ar: 'الرسالة', en: 'Message' },
  contactSend: { ar: 'إرسال عبر البريد', en: 'Send by email' },
  contactNoEmail: { ar: 'بريد التواصل: سيُحدَّث عنوان البريد الإلكتروني هنا.', en: 'Contact email: the email address will be added here.' },
  contactPrivacyHeading: { ar: 'خصوصية مراسلاتك', en: 'Your message privacy' },
  contactPrivacyText: {
    ar: 'لا نخزن رسائلك على أي خادم؛ يُفتح النموذج عميل البريد على جهازك مباشرةً.',
    en: 'We do not store your messages on any server; the form opens your email client directly on your device.',
  },

  // Tool common
  breadcrumbAria: { ar: 'مسار التنقل', en: 'Breadcrumb' },
  crumbHome: { ar: 'الرئيسية', en: 'Home' },
  crumbTools: { ar: 'الأدوات', en: 'Tools' },
  dropTitle: { ar: 'اسحب صورة هنا أو اضغط للاختيار', en: 'Drag an image here or click to choose' },
  outputFormat: { ar: 'الصيغة الناتجة', en: 'Output format' },
  optWebp: { ar: 'WebP (موصى به)', en: 'WebP (recommended)' },
  optJpg: { ar: 'JPG', en: 'JPG' },
  optPng: { ar: 'PNG (بدون فقدان)', en: 'PNG (lossless)' },
  qualityPrefix: { ar: 'الجودة: ', en: 'Quality: ' },
  qualitySuffix: { ar: '٪', en: '%' },
  reset: { ar: 'إعادة تعيين', en: 'Reset' },

  // Compress
  compressMaxSize: { ar: 'الحد الأقصى للحجم (اختياري، بالكيلوبايت)', en: 'Max size (optional, KB)' },
  compressMaxSizePlaceholder: { ar: 'مثال: 500', en: 'e.g. 500' },
  compressProcess: { ar: 'ضغط الصورة', en: 'Compress image' },

  // Resize
  resizeMode: { ar: 'نوع التحجيم', en: 'Resize mode' },
  resizeByPixel: { ar: 'بالبكسل', en: 'By pixels' },
  resizeByPercent: { ar: 'بالنسبة المئوية', en: 'By percentage' },
  resizeByMax: { ar: 'الحد الأقصى للأبعاد', en: 'Max dimension' },
  resizeWidth: { ar: 'العرض (بكسل)', en: 'Width (px)' },
  resizeHeight: { ar: 'الارتفاع (بكسل)', en: 'Height (px)' },
  resizePercent: { ar: 'النسبة المئوية', en: 'Percentage' },
  resizeLongEdge: { ar: 'أطول ضلع (بكسل)', en: 'Longest edge (px)' },
  resizeProcess: { ar: 'تغيير الحجم', en: 'Resize' },

  // Convert
  convertWhiteBg: { ar: 'خلفية بيضاء (للشفافية في JPG)', en: 'White background (for transparency in JPG)' },
  convertProcess: { ar: 'تحويل الصورة', en: 'Convert image' },

  // Crop
  cropX: { ar: 'س (يسار)', en: 'X (left)' },
  cropY: { ar: 'ص (أعلى)', en: 'Y (top)' },
  cropW: { ar: 'العرض', en: 'Width' },
  cropH: { ar: 'الارتفاع', en: 'Height' },
  cropRatio: { ar: 'نسبة الأبعاد', en: 'Aspect ratio' },
  cropFree: { ar: 'حر', en: 'Free' },
  cropLockRatio: { ar: 'قفل نسبة الأبعاد', en: 'Lock aspect ratio' },
  cropRotate: { ar: 'تدوير', en: 'Rotate' },
  cropProcess: { ar: 'قص الصورة', en: 'Crop image' },
} satisfies Record<string, L10n>;
