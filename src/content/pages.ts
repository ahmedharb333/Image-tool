import type { L10n } from '../lib/i18n';

export interface StaticSection {
  heading?: L10n;
  /** Paragraph HTML (may include inline <a>/<code>). Rendered via set:html. */
  html?: L10n;
  /** Ordered-list items. */
  list?: L10n[];
}

export interface StaticPageEntry {
  slug: string;
  title: L10n;
  metaDesc: L10n;
  /** Optional subtitle shown under the h1 (used when not showing a date). */
  subtitle?: L10n;
  /** Show the "Last updated: <date>" line under the h1. */
  showLastUpdated?: boolean;
  sections: StaticSection[];
  /** Footnote line rendered in muted text at the end. */
  meta?: L10n;
}

const publisherTbd: L10n = { ar: 'سيُحدَّث اسم الناشر هنا.', en: 'The publisher name will be added here.' };
const legalFootnote: L10n = {
  ar: 'الجهة المسؤولة: سيُحدَّث الاسم القانوني هنا — النطاق القضائي: سيُحدَّد هنا.',
  en: 'Responsible entity: the legal name will be added here — Jurisdiction: to be specified here.',
};
const publisherFootnote: L10n = { ar: 'الناشر: سيُحدَّث اسم الناشر هنا.', en: 'Publisher: the publisher name will be added here.' };

export const PAGES: StaticPageEntry[] = [
  {
    slug: 'about',
    title: { ar: 'عن أدوات وردلي', en: 'About Worldly Tools' },
    metaDesc: {
      ar: 'أدوات مجانية للصور والمستندات داخل متصفحك',
      en: 'Free image and document tools that run inside your browser',
    },
    subtitle: {
      ar: 'أدوات مجانية للصور والمستندات داخل متصفحك',
      en: 'Free image and document tools that run inside your browser',
    },
    sections: [
      {
        html: {
          ar: '<p>أدوات وردلي موقع يقدم أدوات مجانية للصور والمستندات تعمل بالكامل داخل متصفحك — من ضغط الصور وتغيير حجمها وتحويلها واقتصاصها، إلى تحويل المستندات إلى صيغة Markdown. نهدف إلى أدوات سريعة تعالج ملفاتك محليًا دون رفعها إلى أي خادم.</p><p>تتم المعالجة بالكامل داخل متصفحك، ولا نُرسل أو نخزن أيًا من ملفاتك.</p>',
          en: '<p>Worldly Tools is a site that offers free image and document tools which run entirely inside your browser — from compressing, resizing, converting and cropping images, to turning documents into Markdown. We aim for fast tools that process your files locally without uploading them to any server.</p><p>All processing happens inside your browser, and we never send or store any of your files.</p>',
        },
      },
      {
        heading: { ar: 'الناشر', en: 'Publisher' },
        html: { ar: `<p>${publisherTbd.ar}</p>`, en: `<p>${publisherTbd.en}</p>` },
      },
    ],
    meta: {
      ar: 'المراجِع: سيُذكر اسم المراجِع المعتمد هنا — آخر مراجعة: 2026-08-10',
      en: 'Reviewer: an approved reviewer name will be listed here — Last reviewed: 2026-08-10',
    },
  },
  {
    slug: 'privacy',
    title: { ar: 'سياسة الخصوصية', en: 'Privacy policy' },
    metaDesc: { ar: 'كيف نتعامل مع صورك وبياناتك.', en: 'How we handle your images and your data.' },
    showLastUpdated: true,
    sections: [
      {
        heading: { ar: 'لا نرفع ولا نخزن صورك', en: 'We do not upload or store your images' },
        html: {
          ar: '<p>تُعالج جميع الصور بالكامل داخل متصفحك عبر واجهات Canvas. لا تُرسل ملفاتك إلى أي خادم ولا تُخزن في أي مكان، وتُزال من الذاكرة فور انتهاء المعالجة.</p>',
          en: '<p>All images are processed entirely inside your browser via the Canvas APIs. Your files are never sent to any server or stored anywhere, and they are removed from memory as soon as processing finishes.</p>',
        },
      },
      {
        heading: { ar: 'التخزين المحلي', en: 'Local storage' },
        html: {
          ar: '<p>نستخدم التخزين المحلي في متصفحك (localStorage) فقط لحفظ تفضيل الموافقة على ملفات تعريف الارتباط. لا نجمع أي بيانات شخصية.</p>',
          en: '<p>We use your browser’s local storage (localStorage) only to save your cookie-consent preference. We do not collect any personal data.</p>',
        },
      },
      {
        heading: { ar: 'التحليلات والإعلانات', en: 'Analytics and advertising' },
        html: {
          ar: '<p>قد يعرض هذا الموقع إعلانات Google AdSense. تُستخدم لذلك موافقتك عبر منصة إدارة الموافقة، ولا نشارك ملفاتك مع أي طرف. لا نستخدم حاليًا أدوات تحليل.</p>',
          en: '<p>This site may show Google AdSense ads. Your consent is collected through a consent-management platform, and we never share your files with any party. We do not currently use analytics tools.</p>',
        },
      },
      {
        heading: { ar: 'ملفات تعريف الارتباط', en: 'Cookies' },
        html: {
          ar: '<p>راجع صفحة <a href="/cookies/">سياسة الكوكيز</a> للتفاصيل.</p>',
          en: '<p>See the <a href="/en/cookies/">Cookies policy</a> page for details.</p>',
        },
      },
      {
        heading: { ar: 'الناشر', en: 'Publisher' },
        html: { ar: `<p>${publisherTbd.ar}</p>`, en: `<p>${publisherTbd.en}</p>` },
      },
    ],
    meta: legalFootnote,
  },
  {
    slug: 'terms',
    title: { ar: 'شروط الاستخدام', en: 'Terms of use' },
    metaDesc: { ar: 'شروط استخدام أدوات الصور.', en: 'The terms for using Image Tools.' },
    showLastUpdated: true,
    sections: [
      {
        heading: { ar: 'الاستخدام', en: 'Use' },
        html: {
          ar: '<p>استخدام أدوات الموقع مجاني ويخضع لهذه الشروط. بمسؤوليتك أن تستخدم الأدوات لأغراض مشروعة فقط.</p>',
          en: '<p>Use of the site’s tools is free and subject to these terms. It is your responsibility to use the tools for lawful purposes only.</p>',
        },
      },
      {
        heading: { ar: 'معالجة محلية', en: 'Local processing' },
        html: {
          ar: '<p>تُعالج جميع الملفات داخل متصفحك ولا تُرسل إلى أي خادم. لا نضمن نتائج محددة لأي ملف معين، إذ تعتمد النتائج على مدخلاتك ومتصفحك وجهازك.</p>',
          en: '<p>All files are processed inside your browser and are not sent to any server. We do not guarantee specific results for any given file, since results depend on your input, your browser and your device.</p>',
        },
      },
      {
        heading: { ar: 'لا ضمانات', en: 'No warranties' },
        html: {
          ar: '<p>نقدم الأدوات "كما هي" دون أي ضمانات صريحة أو ضمنية. لن نكون مسؤولين عن أي أضرار ناتجة عن استخدام الموقع أو عدم توفره.</p>',
          en: '<p>The tools are provided “as is” without any express or implied warranties. We will not be liable for any damages arising from use of the site or its unavailability.</p>',
        },
      },
      {
        heading: { ar: 'التعديلات', en: 'Changes' },
        html: {
          ar: '<p>قد نعدّل هذه الشروط من وقت لآخر، ويُعدّ استمرار استخدامك للموقع بعد التعديل قبولًا للشروط المحدّثة.</p>',
          en: '<p>We may amend these terms from time to time; continuing to use the site after a change constitutes acceptance of the updated terms.</p>',
        },
      },
    ],
    meta: legalFootnote,
  },
  {
    slug: 'cookies',
    title: { ar: 'سياسة الكوكيز', en: 'Cookies policy' },
    metaDesc: { ar: 'كيف يتعامل الموقع مع ملفات تعريف الارتباط.', en: 'How the site handles cookies.' },
    showLastUpdated: true,
    sections: [
      {
        heading: { ar: 'ما نستخدمه', en: 'What we use' },
        html: {
          ar: '<p>لا يستخدم الموقع ملفات تعريف الارتباط للتتبع. نستخدم التخزين المحلي في متصفحك (localStorage) لحفظ قرارك بشأن الموافقة تحت المفتاح <code>image-tools-consent</code> بقيمة <code>granted</code> أو <code>denied</code>. قد تضع إعلانات Google ملفات تعريف ارتباط بعد موافقتك.</p>',
          en: '<p>The site does not use cookies for tracking. We use your browser’s local storage (localStorage) to save your consent decision under the key <code>image-tools-consent</code> with a value of <code>granted</code> or <code>denied</code>. Google ads may set cookies after you consent.</p>',
        },
      },
      {
        heading: { ar: 'كيف تدير تفضيلاتك', en: 'How to manage your preferences' },
        html: {
          ar: '<p>يمكنك تغيير قرارك في أي وقت من زر الموافقة في الموقع، أو مسح بيانات الموقع من إعدادات متصفحك.</p>',
          en: '<p>You can change your decision at any time using the consent button on the site, or by clearing site data in your browser settings.</p>',
        },
      },
      {
        heading: { ar: 'التحديثات', en: 'Updates' },
        html: {
          ar: '<p>إذا تغيّرت طريقة استخدام الموقع لملفات تعريف الارتباط، ستُحدَّث هذه الصفحة.</p>',
          en: '<p>If the way the site uses cookies changes, this page will be updated.</p>',
        },
      },
    ],
    meta: publisherFootnote,
  },
  {
    slug: 'disclaimer',
    title: { ar: 'إخلاء المسؤولية', en: 'Disclaimer' },
    metaDesc: { ar: 'إخلاء مسؤولية أدوات الصور.', en: 'Image Tools disclaimer.' },
    showLastUpdated: true,
    sections: [
      {
        heading: { ar: 'النتائج', en: 'Results' },
        html: {
          ar: '<p>تعتمد نتائج الأدوات على مدخلاتك وعلى قدرات متصفحك وجهازك، وقد تختلف بين متصفح وآخر. تحقق دائمًا من الملف الناتج قبل استخدامه في أي إنتاج نهائي.</p>',
          en: '<p>Tool results depend on your input and on the capabilities of your browser and device, and may differ from one browser to another. Always check the output file before using it in any final production.</p>',
        },
      },
      {
        heading: { ar: 'الأدوات مجانية وداخل المتصفح', en: 'The tools are free and in-browser' },
        html: {
          ar: '<p>الأدوات متاحة مجانًا وتعمل محليًا. لا يقدم الموقع استشارات مهنية، ولا يُعدّ محتواه بديلًا عنها.</p>',
          en: '<p>The tools are available free of charge and run locally. The site does not provide professional advice, and its content is not a substitute for such advice.</p>',
        },
      },
      {
        heading: { ar: 'الاحتفاظ بنسخة احتياطية', en: 'Keep a backup' },
        html: {
          ar: '<p>احتفظ دائمًا بنسخة أصلية من ملفاتك قبل أي معالجة؛ الموقع لا يحتفظ بأي نسخ ولا يمكنه استعادتها.</p>',
          en: '<p>Always keep an original copy of your files before any processing; the site keeps no copies and cannot restore them.</p>',
        },
      },
    ],
    meta: publisherFootnote,
  },
  {
    slug: 'how-files-are-processed',
    title: { ar: 'كيف تُعالج الملفات', en: 'How files are processed' },
    metaDesc: {
      ar: 'شرح شفاف لكيفية معالجة صورك داخل متصفحك.',
      en: 'A transparent explanation of how your images are processed inside your browser.',
    },
    showLastUpdated: true,
    sections: [
      {
        heading: { ar: 'المعالجة المحلية', en: 'Local processing' },
        html: {
          ar: '<p>عند اختيارك لصورة، تُقرأ داخل متصفحك مباشرة وتُعالج عبر واجهات Canvas الخاصة بالمتصفح. لا يُرسل الملف إلى أي خادم ولا إلى أي جهة خارجية.</p>',
          en: '<p>When you choose an image, it is read directly inside your browser and processed via the browser’s Canvas APIs. The file is never sent to any server or third party.</p>',
        },
      },
      {
        heading: { ar: 'خطوات المعالجة', en: 'Processing steps' },
        list: [
          { ar: 'تختار ملفًا من جهازك.', en: 'You choose a file from your device.' },
          { ar: 'يتحقق الموقع من نوع الملف وحجمه وصلاحيته داخل متصفحك.', en: 'The site validates the file type, size and validity inside your browser.' },
          { ar: 'تُعالج الصورة (ضغط، تغيير حجم، تحويل أو قص) محليًا.', en: 'The image is processed (compress, resize, convert or crop) locally.' },
          { ar: 'تحمّل النتيجة مباشرة إلى جهازك.', en: 'You download the result directly to your device.' },
        ],
      },
      {
        heading: { ar: 'ماذا يحدث لملفاتك بعد ذلك؟', en: 'What happens to your files afterwards?' },
        html: {
          ar: '<p>لا يُخزن أي شيء. تُزال الصورة من ذاكرة المتصفح فور انتهاء المعالجة، ولا يحتفظ الموقع بأي نسخة من ملفاتك.</p>',
          en: '<p>Nothing is stored. The image is removed from browser memory as soon as processing finishes, and the site keeps no copy of your files.</p>',
        },
      },
    ],
    meta: publisherFootnote,
  },
  {
    slug: 'advertising-disclosure',
    title: { ar: 'الإفصاح عن الإعلانات', en: 'Advertising disclosure' },
    metaDesc: {
      ar: 'إفصاح واضح عن سياسة الإعلانات في الموقع.',
      en: 'A clear disclosure of the site’s advertising policy.',
    },
    showLastUpdated: true,
    sections: [
      {
        heading: { ar: 'الوضع الحالي', en: 'Current status' },
        html: {
          ar: '<p>قد يعرض هذا الموقع إعلانات Google AdSense. حتى تُعتمد الإعلانات وتُضاف وحداتها، قد لا تظهر أي إعلانات. يبقى أي إعلان مميزًا بوضوح عن المحتوى.</p>',
          en: '<p>This site may display Google AdSense ads. Until advertising is approved and its units are added, no ads may appear. Any ad remains clearly distinguished from the content.</p>',
        },
      },
      {
        heading: { ar: 'الإفصاح', en: 'Disclosure' },
        html: {
          ar: '<p>عند تفعيل الإعلانات، ستُذكر جهة العرض (Google AdSense)، ولن نعرض إعلانات مضللة أو محتوى ممولًا دون تمييزه بوضوح.</p>',
          en: '<p>When ads are active, the ad provider (Google AdSense) is named, and we will not show misleading ads or sponsored content without clearly labelling it.</p>',
        },
      },
    ],
    meta: publisherFootnote,
  },
];
