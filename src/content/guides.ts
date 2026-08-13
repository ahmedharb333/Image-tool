import type { L10n } from '../lib/i18n';

export interface GuideEntry {
  slug: string;
  title: L10n;
  description: L10n;
  /** Body paragraphs. English is optional; falls back to Arabic. */
  body: { ar: string[]; en?: string[] };
  faq: { q: L10n; a: L10n }[];
  related: string[];
  lastUpdated: string;
}

export const GUIDES: GuideEntry[] = [
  {
    slug: 'compress-image',
    title: {
      ar: 'كيف تضغط الصور دون فقدان الجودة',
      en: 'How to compress images without losing quality',
    },
    description: {
      ar: 'دليل عملي لتقليل حجم الصور مع الحفاظ على مظهرها.',
      en: 'A practical guide to shrinking image file size while keeping them looking good.',
    },
    body: {
      ar: [
        'ضغط الصورة يعني تقليل كمية البيانات اللازمة لتمثيلها دون تغيير مرئي كبير. أكثر الصيغ ضغطًا للعرض على الويب هي WebP وJPG.',
        'كلما خفّضت الجودة، صغر الحجم وزادت احتمالية ظهور تشويش. استخدم جودة تتراوح بين 70% و85% كتوازن جيد.',
        'في هذا الموقع تُعالج الصور بالكامل داخل متصفحك: لا يُرفع أي ملف إلى أي خادم، لذا تبقى صورك خاصة تمامًا.',
      ],
      en: [
        'Compressing an image means reducing the amount of data needed to represent it without a large visible change. The most efficient formats for the web are WebP and JPG.',
        'The lower the quality, the smaller the file — but the more likely you are to see artefacts. A quality between 70% and 85% is usually a good balance.',
        'On this site images are processed entirely inside your browser: no file is uploaded to any server, so your images stay completely private.',
      ],
    },
    faq: [
      {
        q: { ar: 'هل رفع صورة على هذا الموقع آمن؟', en: 'Is it safe to use an image on this site?' },
        a: {
          ar: 'نعم. جميع المعالجة تحدث محليًا داخل متصفحك باستخدام واجهات Canvas، ولا يُرسل الملف إلى أي خادم.',
          en: 'Yes. All processing happens locally in your browser using the Canvas APIs, and the file is never sent to any server.',
        },
      },
      {
        q: { ar: 'ما الصيغة الأفضل للضغط؟', en: 'Which format is best for compression?' },
        a: {
          ar: 'WebP تقدم أصغر حجم مع جودة بصرية ممتازة، ويدعمها جميع المتصفحات الحديثة.',
          en: 'WebP gives the smallest size with excellent visual quality, and all modern browsers support it.',
        },
      },
    ],
    related: ['resize-image', 'convert-image'],
    lastUpdated: '2026-08-10',
  },
  {
    slug: 'resize-image',
    title: { ar: 'كيف تغيّر أبعاد الصور', en: 'How to resize images' },
    description: {
      ar: 'أساسيات تغيير حجم الصور للويب ووسائل التواصل دون فقدان الوضوح.',
      en: 'The basics of resizing images for the web and social media without losing sharpness.',
    },
    body: {
      ar: [
        'تغيير حجم الصورة يعني ضبط أبعادها بالبكسل أو بالنسبة المئوية. من أكثر الاستخدامات شيوعًا تجهيز الصور للرفع على مواقع التواصل أو تقليل أبعاد الصور الكبيرة جدًا.',
        'عند التصغير بالبكسل، ابدأ بعرض أو ارتفاع واحد فقط ليُحسب الآخر تلقائيًا مع الحفاظ على نسبة الأبعاد. إدخال قيمتين معًا قد يمدد الصورة أو يعصرها.',
        'خيار "الحد الأقصى للأبعاد" يضبط أطول ضلع في الصورة عند قيمة محددة — مثالي للصور البانورامية أو الطويلة.',
      ],
      en: [
        'Resizing an image means adjusting its dimensions in pixels or by percentage. Common uses are preparing images for social media or shrinking overly large photos.',
        'When scaling down by pixels, set only one of width or height and let the other be computed automatically to preserve the aspect ratio. Entering both can stretch or squash the image.',
        'The “max dimension” option caps the longest side of the image at a set value — ideal for panoramic or very tall images.',
      ],
    },
    faq: [
      {
        q: { ar: 'هل يقلل تغيير الحجم من الجودة؟', en: 'Does resizing reduce quality?' },
        a: {
          ar: 'التصغير يحذف بكسلات فعلية وقد يبدو أكثر حدة؛ التكبير يضيف بكسلات جديدة دون معلومات إضافية فيبدو ضبابيًا. من الأفضل البدء من مصدر عالي الدقة.',
          en: 'Scaling down removes real pixels and can look sharper; scaling up invents new pixels without adding detail, so it looks blurry. Always start from a high-resolution source.',
        },
      },
      {
        q: { ar: 'هل أحتاج إلى الحفاظ على نسبة الأبعاد؟', en: 'Do I need to keep the aspect ratio?' },
        a: {
          ar: 'نعم عادةً. تغيير الأبعاد دون الحفاظ على النسبة يشوه الصورة إلا إذا كان القصد هو ذلك عمدًا.',
          en: 'Usually yes. Changing dimensions without preserving the ratio distorts the image unless that is intentional.',
        },
      },
    ],
    related: ['compress-image', 'crop-image'],
    lastUpdated: '2026-08-10',
  },
  {
    slug: 'convert-image',
    title: { ar: 'التحويل بين JPG وPNG وWebP', en: 'Converting between JPG, PNG and WebP' },
    description: {
      ar: 'متى تختار كل صيغة وكيف تحوّل صورك دون فقدان الجودة.',
      en: 'When to choose each format and how to convert your images without losing quality.',
    },
    body: {
      ar: [
        'الصيغة المناسبة تعتمد على المحتوى: JPG ممتاز للصور الفوتوغرافية، PNG يحافظ على الشفافية والتفاصيل الدقيقة، وWebP يجمع بين الجودة والحجم الصغير.',
        'عند التحويل إلى JPG تُفقد الشفافية؛ تتحول المناطق الشفافة إلى لون تختاره (مثل الأبيض). راجع خيار الخلفية قبل التحويل.',
        'جميع التحويلات تتم داخل متصفحك — لا يُرفع الملف إلى أي خادم، فلا تقلق بشأن خصوصية صورك.',
      ],
      en: [
        'The right format depends on the content: JPG is great for photographs, PNG preserves transparency and fine detail, and WebP combines quality with a small size.',
        'Converting to JPG drops transparency; transparent areas become a colour you pick (such as white). Check the background option before converting.',
        'All conversions happen inside your browser — the file is never uploaded to any server, so you never have to worry about the privacy of your images.',
      ],
    },
    faq: [
      {
        q: {
          ar: 'هل يمكن التحويل من PNG إلى JPG دون فقدان الشفافية؟',
          en: 'Can I convert PNG to JPG without losing transparency?',
        },
        a: {
          ar: 'JPG لا يدعم الشفافية أصلًا. عند التحويل تُعبأ المناطق الشفافة بلون الخلفية الذي تختاره.',
          en: 'JPG does not support transparency at all. On conversion, transparent areas are filled with the background colour you choose.',
        },
      },
      {
        q: { ar: 'ما أفضل صيغة للويب؟', en: 'Which is the best format for the web?' },
        a: {
          ar: 'WebP تقدم حجمًا أصغر مع جودة ممتازة ويدعمها جميع المتصفحات الحديثة؛ JPG خيار جيد للصور الفوتوغرافية.',
          en: 'WebP offers a smaller size with excellent quality and is supported by all modern browsers; JPG is a good choice for photographs.',
        },
      },
    ],
    related: ['compress-image', 'resize-image'],
    lastUpdated: '2026-08-10',
  },
  {
    slug: 'crop-image',
    title: { ar: 'قص الصور: الأساسيات والنسب الثابتة', en: 'Cropping images: basics and fixed ratios' },
    description: {
      ar: 'كيف تقصّ الصور بحرية أو بنسب جاهزة مثل 1:1 و16:9.',
      en: 'How to crop images freely or to ready-made ratios like 1:1 and 16:9.',
    },
    body: {
      ar: [
        'القص يزيل أجزاء من حواف الصورة مع إبقاء الدقة الداخلية كما هي — مثالي لتحسين التأطير أو تهيئة الصورة لنسبة محددة.',
        'النسب الثابتة (مثل 1:1 لصورة الملف الشخصي أو 16:9 للعرض) تضمن أبعادًا متوافقة مع المنصات. فعّل "قفل نسبة الأبعاد" واختر النسبة.',
        'يمكنك أيضًا تدوير الصورة 90 أو 180 أو 270 درجة أثناء القص لتصحيح الاتجاه قبل الحفظ.',
      ],
      en: [
        'Cropping removes parts of the edges of an image while keeping the internal resolution unchanged — ideal for improving framing or preparing an image for a specific ratio.',
        'Fixed ratios (like 1:1 for a profile picture or 16:9 for presentations) guarantee dimensions that fit platforms. Enable “lock aspect ratio” and pick the ratio.',
        'You can also rotate the image 90, 180 or 270 degrees while cropping to fix its orientation before saving.',
      ],
    },
    faq: [
      {
        q: { ar: 'هل القص يقلل جودة الصورة؟', en: 'Does cropping reduce image quality?' },
        a: {
          ar: 'لا. القص يحذف وحدات البكسل خارج المنطقة المحددة فقط، والبكسلات المتبقية تحتفظ بدقتها الأصلية.',
          en: 'No. Cropping only removes the pixels outside the selected area; the remaining pixels keep their original resolution.',
        },
      },
      {
        q: { ar: 'ما الفرق بين القص وتغيير الحجم؟', en: 'What is the difference between cropping and resizing?' },
        a: {
          ar: 'القص يزيل أجزاء من الصورة، بينما تغيير الحجم يضبط الأبعاد الكاملة. يمكن استخدامهما معًا.',
          en: 'Cropping removes parts of the image, while resizing adjusts the whole dimensions. They can be used together.',
        },
      },
    ],
    related: ['resize-image', 'convert-image'],
    lastUpdated: '2026-08-10',
  },
];
