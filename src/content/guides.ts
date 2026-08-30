import type { L10n } from '../lib/i18n';

export interface GuideEntry {
  slug: string;
  title: L10n;
  description: L10n;
  /** Body blocks. A block starting with "## " renders as an H2 heading;
   * otherwise it is a paragraph (may contain inline HTML). English optional. */
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
      ar: 'دليل عملي شامل لتقليل حجم الصور مع الحفاظ على وضوحها — الصيغ، إعدادات الجودة، والأخطاء الشائعة.',
      en: 'A complete, practical guide to shrinking image file size while keeping them sharp — formats, quality settings, and common mistakes.',
    },
    body: {
      ar: [
        'الصور الكبيرة تبطئ صفحات الويب، وتستهلك باقة الإنترنت، وتملأ مساحة التخزين على هاتفك. لكن ضغط الصورة بطريقة خاطئة يفسد وضوحها ويترك تشويهًا مرئيًا. في هذا الدليل نشرح كيف تقلّص الحجم بذكاء مع الحفاظ على جودة تكاد لا تُميَّز عن الأصل.',
        '## ما معنى ضغط الصورة؟',
        'ضغط الصورة هو تقليل عدد البايتات اللازمة لتخزينها. تعتمد أدوات الضغط على أن العين البشرية لا تلاحظ كل التفاصيل الدقيقة، فتزيل المعلومات الأقل أهمية بصريًا. النتيجة ملف أصغر بكثير بفرق بصري بسيط أو معدوم عند الإعدادات الصحيحة.',
        'هناك نوعان: الضغط <strong>مع فقدان</strong> (lossy) مثل JPG وWebP، حيث تُحذف بعض البيانات نهائيًا مقابل حجم أصغر؛ والضغط <strong>بدون فقدان</strong> (lossless) مثل PNG وWebP-lossless، حيث يُعاد ترتيب البيانات دون حذف أي تفصيلة، فيكون التصغير أقل لكن الجودة مطابقة تمامًا.',
        '## اختيار الصيغة المناسبة',
        'للصور الفوتوغرافية والمشاهد المعقدة، تعطي <strong>WebP</strong> أفضل توازن: حجم أصغر من JPG بنحو 25–35٪ عند الجودة نفسها، وتدعمها كل المتصفحات الحديثة. تبقى <strong>JPG</strong> خيارًا آمنًا ومتوافقًا مع كل شيء تقريبًا. أما <strong>PNG</strong> فالأفضل للرسومات والشعارات والصور ذات الخلفية الشفافة أو النصوص الحادة، وليست مثالية للصور الفوتوغرافية لأن حجمها يكبر بسرعة.',
        '## ضبط مستوى الجودة',
        'مؤشر الجودة يتحكم في مقدار البيانات المحفوظة. القاعدة العملية: جودة بين <strong>70٪ و85٪</strong> تعطي أفضل توازن بين الحجم والوضوح لمعظم الصور. أقل من 60٪ يبدأ التشويش بالظهور حول الحواف والتدرجات، وفوق 90٪ يكبر الحجم دون تحسّن ملحوظ للعين. جرّب قيمة وسطى أولًا ثم اخفضها تدريجيًا حتى تلاحظ أول أثر للتشويه، ثم ارجع خطوة للخلف.',
        '## استهداف حجم محدد',
        'إذا كان الموقع أو النموذج يطلب حدًا أقصى للحجم (مثلًا 500 كيلوبايت)، استخدم خيار الحد الأقصى للحجم في أداة الضغط بدل تخمين الجودة يدويًا. تضبط الأداة الجودة تلقائيًا للوصول إلى الهدف مع الحفاظ على أفضل وضوح ممكن ضمنه.',
        '## خطوات عملية للحصول على أفضل نتيجة',
        'ابدأ دائمًا من أعلى نسخة دقة متوفرة لديك، لأن الضغط لا يستعيد التفاصيل المفقودة. حوّل إلى WebP إن لم يكن هناك سبب للتوافق يمنع ذلك. اضبط الجودة عند 80٪ كنقطة انطلاق، وعاين النتيجة على شاشة بحجمها الفعلي لا مكبّرة. إن احتجت حجمًا أصغر، صغّر الأبعاد أولًا (تغيير الحجم) ثم اضغط — فهذا غالبًا أفعل من خفض الجودة وحده.',
        '## أخطاء شائعة تجنّبها',
        'إعادة ضغط صورة JPG عدة مرات تراكم التشويه في كل مرة؛ احتفظ دائمًا بنسخة أصلية. ولا تكبّر صورة صغيرة ثم تضغطها ظنًّا أنك تحسّنها — التكبير يضيف بكسلات فارغة فقط. وأخيرًا لا تستخدم PNG لصورة فوتوغرافية بحجة "الجودة الأعلى"، فستحصل على ملف ضخم دون فائدة بصرية.',
        'كل المعالجة في هذا الموقع تتم بالكامل داخل متصفحك عبر واجهات Canvas: لا يُرفع أي ملف إلى أي خادم، وتُزال الصورة من الذاكرة فور انتهاء المعالجة، فتبقى صورك خاصة تمامًا.',
      ],
      en: [
        'Large images slow down web pages, eat mobile data, and fill up storage on your phone. But compressing an image the wrong way ruins its sharpness and leaves visible artefacts. This guide explains how to cut file size intelligently while keeping quality that is nearly indistinguishable from the original.',
        '## What image compression actually means',
        'Compressing an image means reducing the number of bytes needed to store it. Compression tools rely on the fact that the human eye does not notice every fine detail, so they discard the visually least-important information. The result is a much smaller file with little or no visible difference at the right settings.',
        'There are two kinds: <strong>lossy</strong> compression (JPG, WebP) permanently drops some data in exchange for a smaller size; and <strong>lossless</strong> compression (PNG, WebP-lossless) reorganises the data without deleting any detail, so the size reduction is smaller but the quality is identical.',
        '## Choosing the right format',
        'For photographs and complex scenes, <strong>WebP</strong> gives the best balance: about 25–35% smaller than JPG at the same quality, and supported by every modern browser. <strong>JPG</strong> remains a safe, universally compatible choice. <strong>PNG</strong> is best for graphics, logos, images with transparency, or sharp text — it is not ideal for photos because the file grows quickly.',
        '## Setting the quality level',
        'The quality slider controls how much data is kept. The practical rule: a quality between <strong>70% and 85%</strong> gives the best size-to-clarity balance for most images. Below 60%, artefacts start to appear around edges and gradients; above 90%, the file grows with no visible gain. Try a middle value first, then lower it gradually until you notice the first sign of distortion, and step back once.',
        '## Targeting a specific file size',
        'If a website or form requires a maximum size (say 500 KB), use the max-size option in the compressor instead of guessing quality by hand. The tool adjusts quality automatically to hit your target while keeping the best possible clarity within it.',
        '## A practical workflow for the best result',
        'Always start from the highest-resolution copy you have, because compression cannot bring back lost detail. Convert to WebP unless a compatibility reason prevents it. Set quality to 80% as a starting point, and preview the result at actual size, not zoomed in. If you need it even smaller, reduce the dimensions first (resize) and then compress — this is usually more effective than lowering quality alone.',
        '## Common mistakes to avoid',
        'Re-compressing a JPG repeatedly stacks artefacts each time; always keep an original copy. Do not upscale a small image and then compress it thinking you are improving it — upscaling only adds empty pixels. And do not use PNG for a photograph to get "higher quality" — you will get a huge file with no visible benefit.',
        'All processing on this site happens entirely inside your browser via the Canvas APIs: no file is uploaded to any server, and the image is removed from memory as soon as processing finishes, so your images stay completely private.',
      ],
    },
    faq: [
      {
        q: { ar: 'هل رفع صورة على هذا الموقع آمن؟', en: 'Is it safe to use an image on this site?' },
        a: {
          ar: 'نعم. جميع المعالجة تحدث محليًا داخل متصفحك باستخدام واجهات Canvas، ولا يُرسل الملف إلى أي خادم في أي مرحلة.',
          en: 'Yes. All processing happens locally in your browser using the Canvas APIs, and the file is never sent to any server at any stage.',
        },
      },
      {
        q: { ar: 'ما الصيغة الأفضل للضغط؟', en: 'Which format is best for compression?' },
        a: {
          ar: 'WebP تقدم أصغر حجم مع جودة بصرية ممتازة وتدعمها المتصفحات الحديثة. JPG بديل متوافق مع كل شيء، وPNG للرسومات والشفافية.',
          en: 'WebP gives the smallest size with excellent visual quality and is supported by modern browsers. JPG is a universally compatible alternative, and PNG suits graphics and transparency.',
        },
      },
      {
        q: { ar: 'كم أخفض الجودة قبل أن يظهر التشويه؟', en: 'How far can I lower quality before artefacts show?' },
        a: {
          ar: 'معظم الصور تتحمل جودة حتى 70٪ دون فرق ملحوظ. تحت 60٪ يبدأ التشويش حول الحواف والتدرجات بالظهور، خاصةً في المناطق الملساء مثل السماء.',
          en: 'Most images tolerate quality down to about 70% with no noticeable difference. Below 60%, artefacts begin to show around edges and gradients, especially in smooth areas like skies.',
        },
      },
      {
        q: { ar: 'لماذا لم يصغر حجم صورتي كثيرًا؟', en: 'Why did my image barely get smaller?' },
        a: {
          ar: 'قد تكون الصورة مضغوطة أصلًا، أو بصيغة PNG لمحتوى فوتوغرافي. جرّب التحويل إلى WebP أو تصغير الأبعاد أولًا ثم الضغط.',
          en: 'The image may already be compressed, or it may be a PNG holding photographic content. Try converting to WebP, or reduce the dimensions first and then compress.',
        },
      },
    ],
    related: ['resize-image', 'convert-image'],
    lastUpdated: '2026-08-29',
  },
  {
    slug: 'resize-image',
    title: { ar: 'كيف تغيّر أبعاد الصور', en: 'How to resize images' },
    description: {
      ar: 'دليل كامل لتغيير حجم الصور للويب ووسائل التواصل دون فقدان الوضوح — بالبكسل، بالنسبة، وبالحد الأقصى للأبعاد.',
      en: 'A complete guide to resizing images for the web and social media without losing sharpness — by pixels, by percentage, and by maximum dimension.',
    },
    body: {
      ar: [
        'تغيير حجم الصورة من أكثر المهام شيوعًا: صورة الكاميرا الحديثة قد تتجاوز 6000 بكسل عرضًا، وهو أكبر بكثير مما يحتاجه منشور أو موقع. تصغير الأبعاد يقلّل الحجم بشكل كبير ويسرّع التحميل، لكن الطريقة الخاطئة تشوّه الصورة أو تجعلها ضبابية.',
        '## ما الفرق بين تغيير الحجم والضغط؟',
        'تغيير الحجم يعدّل عدد البكسلات (الأبعاد الفعلية)، بينما الضغط يقلّل البايتات دون تغيير الأبعاد. غالبًا يُستخدمان معًا: صغّر الأبعاد لما تحتاجه فعلًا، ثم اضغط الناتج. البدء بتغيير الحجم يعطي عادةً أكبر توفير في الحجم.',
        '## بالبكسل أم بالنسبة أم بالحد الأقصى؟',
        'التصغير <strong>بالبكسل</strong> مناسب حين تعرف الأبعاد المطلوبة بدقة (مثلًا 1200×800). أدخل قيمة واحدة فقط — العرض أو الارتفاع — ودع الأخرى تُحسب تلقائيًا للحفاظ على النسبة. التصغير <strong>بالنسبة المئوية</strong> عملي حين تريد "نصف الحجم" دون حساب أرقام. أما <strong>الحد الأقصى للأبعاد</strong> فيضبط أطول ضلع عند قيمة معيّنة، وهو مثالي للصور الطويلة أو البانورامية التي يختلف اتجاهها.',
        '## الحفاظ على نسبة الأبعاد',
        'نسبة الأبعاد هي العلاقة بين العرض والارتفاع. إن غيّرت أحدهما دون الآخر بنسبة مختلفة، تُشدّ الصورة أو تُعصر ويبدو الأشخاص أنحف أو أعرض. لذلك أبقِ قفل النسبة مفعّلًا إلا إذا كنت تقصد التشويه عمدًا لغرض تصميمي محدد.',
        '## حدود التكبير',
        'التصغير آمن لأنه يحذف بكسلات زائدة. أما التكبير فيضيف بكسلات جديدة يخمّنها البرنامج، فلا يضيف تفاصيل حقيقية وتبدو النتيجة ضبابية أو "بلاستيكية". القاعدة: ابدأ دائمًا من مصدر عالي الدقة، ولا تعتمد على التكبير لإنقاذ صورة صغيرة.',
        '## أبعاد شائعة مفيدة',
        'لصور المدونات والمقالات، عرض 1200–1600 بكسل يكفي لمعظم الشاشات. لصور المنتجات، 1000–1500 بكسل مربعة خيار جيد. لصور وسائل التواصل، راجع المقاس الذي توصي به المنصة قبل النشر لتجنّب القص التلقائي. تذكّر أن الشاشات عالية الكثافة قد تحتاج ضعف الأبعاد الظاهرة للحدة القصوى.',
        '## خطوات عملية',
        'حدّد الاستخدام النهائي أولًا (موقع، طباعة، منصة)، ثم اختر الأبعاد المناسبة له. أدخل بُعدًا واحدًا مع قفل النسبة، عاين الناتج، ثم اضغط الصورة لتقليل الحجم أكثر. احتفظ دائمًا بالأصل عالي الدقة لأي استخدام مستقبلي.',
        'تتم كل هذه العمليات داخل متصفحك مباشرة — لا يُرفع ملفك إلى أي خادم، وتبقى صورك خاصة بالكامل.',
      ],
      en: [
        'Resizing is one of the most common image tasks: a modern camera photo can exceed 6000 pixels wide — far larger than a post or a web page needs. Reducing the dimensions cuts the file size dramatically and speeds up loading, but the wrong method distorts the image or makes it blurry.',
        '## Resizing vs compression',
        'Resizing changes the number of pixels (the actual dimensions), while compression reduces bytes without changing dimensions. They are often used together: shrink the dimensions to what you actually need, then compress the result. Starting with a resize usually gives the biggest size saving.',
        '## By pixels, by percentage, or by maximum?',
        'Resizing <strong>by pixels</strong> suits you when you know the exact dimensions required (say 1200×800). Enter only one value — width or height — and let the other be computed automatically to preserve the ratio. Resizing <strong>by percentage</strong> is handy when you just want "half size" without doing maths. The <strong>maximum dimension</strong> option caps the longest side at a set value, which is ideal for tall or panoramic images whose orientation varies.',
        '## Preserving the aspect ratio',
        'The aspect ratio is the relationship between width and height. If you change one without the other by a different amount, the image stretches or squashes and people look thinner or wider. Keep the ratio lock on unless you deliberately intend to distort for a specific design purpose.',
        '## The limits of upscaling',
        'Scaling down is safe because it removes surplus pixels. Scaling up adds new pixels that the software guesses, so it adds no real detail and the result looks blurry or "plastic". The rule: always start from a high-resolution source, and never rely on upscaling to rescue a small image.',
        '## Useful common dimensions',
        'For blog and article images, 1200–1600 pixels wide is enough for most screens. For product images, 1000–1500 pixels square is a good choice. For social media, check the size the platform recommends before posting to avoid automatic cropping. Remember that high-density screens may need roughly double the displayed dimensions for maximum sharpness.',
        '## A practical workflow',
        'Decide the final use first (website, print, a platform), then pick the dimensions that fit it. Enter one dimension with the ratio locked, preview the result, then compress the image to reduce the size further. Always keep the high-resolution original for any future use.',
        'All of these operations happen directly inside your browser — your file is never uploaded to any server, and your images stay completely private.',
      ],
    },
    faq: [
      {
        q: { ar: 'هل يقلل تغيير الحجم من الجودة؟', en: 'Does resizing reduce quality?' },
        a: {
          ar: 'التصغير يحذف بكسلات فعلية وقد يبدو أكثر حدة؛ التكبير يضيف بكسلات مخمَّنة فيبدو ضبابيًا. ابدأ دائمًا من مصدر عالي الدقة.',
          en: 'Scaling down removes real pixels and can look sharper; scaling up invents guessed pixels, so it looks blurry. Always start from a high-resolution source.',
        },
      },
      {
        q: { ar: 'هل أحتاج إلى الحفاظ على نسبة الأبعاد؟', en: 'Do I need to keep the aspect ratio?' },
        a: {
          ar: 'نعم عادةً. تغيير الأبعاد دون الحفاظ على النسبة يشوّه الصورة إلا إذا كان القصد ذلك عمدًا.',
          en: 'Usually yes. Changing dimensions without preserving the ratio distorts the image unless that is intentional.',
        },
      },
      {
        q: { ar: 'ما أفضل عرض لصور المقالات؟', en: 'What is the best width for article images?' },
        a: {
          ar: 'عرض بين 1200 و1600 بكسل يكفي لمعظم الشاشات ويحافظ على توازن جيد بين الوضوح وحجم الملف.',
          en: 'A width between 1200 and 1600 pixels is enough for most screens and keeps a good balance between clarity and file size.',
        },
      },
      {
        q: { ar: 'كيف أصغّر صورة طويلة أو بانورامية؟', en: 'How do I shrink a tall or panoramic image?' },
        a: {
          ar: 'استخدم خيار "الحد الأقصى للأبعاد" لضبط أطول ضلع عند قيمة محددة، فيُحسب الضلع الآخر تلقائيًا مهما كان اتجاه الصورة.',
          en: 'Use the "maximum dimension" option to cap the longest side at a set value; the other side is computed automatically whatever the image orientation.',
        },
      },
    ],
    related: ['compress-image', 'crop-image'],
    lastUpdated: '2026-08-29',
  },
  {
    slug: 'convert-image',
    title: { ar: 'التحويل بين JPG وPNG وWebP', en: 'Converting between JPG, PNG and WebP' },
    description: {
      ar: 'متى تختار كل صيغة وكيف تحوّل صورك دون فقدان الجودة، مع شرح الشفافية ودعم المتصفحات.',
      en: 'When to choose each format and how to convert your images without losing quality, with transparency and browser support explained.',
    },
    body: {
      ar: [
        'صيغة الصورة تحدّد حجمها وجودتها وأين يمكن استخدامها. اختيار الصيغة الخطأ يعني ملفات أكبر من اللازم أو فقدان الشفافية أو مشاكل توافق. هذا الدليل يوضّح الفروق ويساعدك على التحويل بثقة.',
        '## نظرة سريعة على الصيغ الثلاث',
        '<strong>JPG</strong> ممتاز للصور الفوتوغرافية بفضل ضغطه الفعّال للألوان المتدرّجة، لكنه لا يدعم الشفافية ويفقد بعض البيانات في كل حفظ. <strong>PNG</strong> بلا فقدان ويدعم الشفافية والحواف الحادة، فهو الأنسب للشعارات والرسومات ولقطات الشاشة، لكن حجمه يكبر مع الصور الفوتوغرافية. <strong>WebP</strong> صيغة حديثة تجمع مزايا الاثنين: ضغط قوي مع أو بدون فقدان، ودعم للشفافية، وحجم أصغر عادةً.',
        '## متى تختار كل صيغة؟',
        'إن كانت صورة فوتوغرافية للويب وتريد أصغر حجم، اختر WebP. إن كنت تحتاج توافقًا مع أنظمة قديمة جدًا أو تطبيقات لا تدعم WebP، فـ JPG أكثر أمانًا. إن كان المحتوى رسمًا أو شعارًا أو يحوي شفافية أو نصًا حادًا، فـ PNG أو WebP-lossless هما الخيار.',
        '## التعامل مع الشفافية',
        'JPG لا يدعم الشفافية إطلاقًا. عند التحويل من PNG (بخلفية شفافة) إلى JPG، تُملأ المناطق الشفافة بلون تختاره — الأبيض افتراضيًا. لذلك راجع خيار لون الخلفية قبل التحويل حتى لا تفاجأ بحواف بيضاء حول عنصر كان شفافًا. إن كنت تحتاج الحفاظ على الشفافية، ابقَ على PNG أو WebP.',
        '## الجودة عند التحويل',
        'التحويل إلى صيغة بلا فقدان (PNG) لا يقلّل الجودة لكنه لا يصغّر الحجم كثيرًا. التحويل إلى صيغة مع فقدان (JPG أو WebP) يتيح لك ضبط الجودة؛ ابدأ من 80–85٪ وعاين النتيجة. تجنّب تحويل JPG إلى JPG مرارًا لأن كل جولة تراكم تشويهًا.',
        '## دعم المتصفحات والأجهزة',
        'تدعم كل المتصفحات الحديثة WebP اليوم، وكذلك أنظمة الهواتف الحديثة. تبقى بعض البرامج القديمة أو أدوات معيّنة لا تفتح WebP بسهولة، لذا إن كنت سترسل الصورة لجهة لا تعرف أدواتها، فـ JPG أضمن. للاستخدام على موقعك الخاص، WebP آمن تمامًا.',
        '## خطوات عملية',
        'حدّد وجهة الصورة (موقعك، منصة، إرسال لشخص)، اختر الصيغة المناسبة لتلك الوجهة، اضبط الجودة إن كانت الصيغة تدعمها، وراجع خيار الخلفية إن كان هناك شفافية. عاين الناتج قبل الاعتماد عليه.',
        'كل التحويلات تجري داخل متصفحك — لا يُرفع الملف إلى أي خادم، فلا تقلق بشأن خصوصية صورك.',
      ],
      en: [
        'An image format determines its size, its quality, and where it can be used. Choosing the wrong one means files larger than necessary, lost transparency, or compatibility problems. This guide explains the differences and helps you convert with confidence.',
        '## A quick look at the three formats',
        '<strong>JPG</strong> is excellent for photographs thanks to its efficient compression of graduated colour, but it does not support transparency and loses some data with every save. <strong>PNG</strong> is lossless and supports transparency and sharp edges, making it best for logos, graphics and screenshots — though the file grows with photographs. <strong>WebP</strong> is a modern format that combines both strengths: strong compression with or without loss, transparency support, and usually a smaller size.',
        '## When to choose each format',
        'If it is a photograph for the web and you want the smallest size, choose WebP. If you need compatibility with very old systems or apps that do not support WebP, JPG is safer. If the content is a graphic, a logo, or contains transparency or sharp text, PNG or WebP-lossless is the choice.',
        '## Handling transparency',
        'JPG does not support transparency at all. When converting from PNG (with a transparent background) to JPG, transparent areas are filled with a colour you choose — white by default. So check the background-colour option before converting, so you are not surprised by white edges around an element that used to be transparent. If you need to keep transparency, stay with PNG or WebP.',
        '## Quality when converting',
        'Converting to a lossless format (PNG) does not reduce quality but does not shrink the size much. Converting to a lossy format (JPG or WebP) lets you set the quality; start at 80–85% and preview the result. Avoid converting JPG to JPG repeatedly, because each round stacks up artefacts.',
        '## Browser and device support',
        'Every modern browser supports WebP today, as do current phone systems. Some older programs or particular tools still do not open WebP easily, so if you are sending the image to someone whose tools you do not know, JPG is safer. For use on your own website, WebP is completely safe.',
        '## A practical workflow',
        'Decide the destination of the image (your site, a platform, sending to a person), choose the format that fits that destination, set the quality if the format supports it, and check the background option if there is transparency. Preview the result before relying on it.',
        'All conversions run inside your browser — the file is never uploaded to any server, so you never have to worry about the privacy of your images.',
      ],
    },
    faq: [
      {
        q: {
          ar: 'هل يمكن التحويل من PNG إلى JPG دون فقدان الشفافية؟',
          en: 'Can I convert PNG to JPG without losing transparency?',
        },
        a: {
          ar: 'JPG لا يدعم الشفافية أصلًا. عند التحويل تُملأ المناطق الشفافة بلون الخلفية الذي تختاره. للحفاظ على الشفافية ابقَ على PNG أو WebP.',
          en: 'JPG does not support transparency at all. On conversion, transparent areas are filled with the background colour you choose. To keep transparency, stay with PNG or WebP.',
        },
      },
      {
        q: { ar: 'ما أفضل صيغة للويب؟', en: 'Which is the best format for the web?' },
        a: {
          ar: 'WebP عادةً: حجم أصغر مع جودة ممتازة ودعم من كل المتصفحات الحديثة. JPG خيار جيد ومتوافق للصور الفوتوغرافية.',
          en: 'Usually WebP: a smaller size with excellent quality and support from every modern browser. JPG is a good, compatible choice for photographs.',
        },
      },
      {
        q: { ar: 'هل التحويل إلى PNG يحسّن جودة صورة JPG؟', en: 'Does converting to PNG improve a JPG’s quality?' },
        a: {
          ar: 'لا. التحويل لا يستعيد التفاصيل التي فقدها JPG أصلًا؛ سيحفظ PNG الصورة كما هي لكن بحجم أكبر بكثير دون تحسّن بصري.',
          en: 'No. Converting cannot bring back detail the JPG already lost; PNG will store the image as-is but at a much larger size with no visual improvement.',
        },
      },
      {
        q: { ar: 'لماذا ظهرت خلفية بيضاء بعد التحويل؟', en: 'Why did a white background appear after conversion?' },
        a: {
          ar: 'لأنك حوّلت إلى JPG الذي لا يدعم الشفافية، فامتلأت المناطق الشفافة بلون الخلفية. اختر لونًا مناسبًا أو حوّل إلى WebP/PNG بدلًا من ذلك.',
          en: 'Because you converted to JPG, which does not support transparency, so transparent areas were filled with the background colour. Pick a suitable colour, or convert to WebP/PNG instead.',
        },
      },
    ],
    related: ['compress-image', 'resize-image'],
    lastUpdated: '2026-08-29',
  },
  {
    slug: 'crop-image',
    title: { ar: 'قص الصور: الأساسيات والنسب الثابتة', en: 'Cropping images: basics and fixed ratios' },
    description: {
      ar: 'كيف تقصّ الصور بحرية أو بنسب جاهزة مثل 1:1 و16:9، مع التدوير ونصائح للتأطير.',
      en: 'How to crop images freely or to ready-made ratios like 1:1 and 16:9, with rotation and framing tips.',
    },
    body: {
      ar: [
        'القص أداة بسيطة لكنها قوية: تزيل الأجزاء غير الضرورية من حواف الصورة لتحسين التأطير أو لتجهيزها لنسبة تتطلبها منصة معيّنة. وخلافًا لتغيير الحجم، لا يمسّ القص دقة الجزء المتبقي.',
        '## ماذا يفعل القص بالضبط؟',
        'القص يقتطع مستطيلًا من داخل الصورة ويتخلّص من كل ما خارجه. البكسلات المتبقية تحتفظ بدقتها الأصلية تمامًا، لذا لا يقلّل القص الجودة — بل قد يحسّن التركيز البصري بإزالة عناصر مشتّتة عند الأطراف.',
        '## النسب الثابتة ولماذا تهمّ',
        'كل منصة تفضّل نسبًا معيّنة: <strong>1:1</strong> المربّعة لصور الملفات الشخصية وبعض منشورات التواصل، <strong>16:9</strong> العريضة للعروض والصور المصغّرة للفيديو، <strong>4:3</strong> و<strong>3:2</strong> شائعتان في التصوير. تفعيل قفل النسبة يضمن أن يبقى القص متوافقًا مع الوجهة دون قص إضافي تلقائي لاحقًا.',
        '## التدوير قبل القص',
        'أحيانًا تكون الصورة مائلة أو بالاتجاه الخطأ. أداة القص تتيح التدوير بمقدار 90 أو 180 أو 270 درجة قبل الاقتطاع، لتصحيح الاتجاه ثم اختيار الإطار المناسب في خطوة واحدة.',
        '## نصائح للتأطير الجيد',
        'اترك مساحة تنفّس حول الموضوع الرئيسي بدل قصّه بإحكام شديد. ضع نقطة الاهتمام قرب أحد أثلاث الصورة لا في المنتصف تمامًا للحصول على تكوين أكثر توازنًا. وعند التجهيز لصورة ملف شخصي دائرية، تذكّر أن الزوايا ستُقصّ، فأبقِ الوجه في المركز.',
        '## القص أم تغيير الحجم؟',
        'القص يزيل أجزاءً من الصورة لتغيير التأطير أو النسبة، بينما تغيير الحجم يضبط الأبعاد الكاملة دون إزالة محتوى. غالبًا تستخدمهما معًا: اقصّ للحصول على التأطير والنسبة الصحيحين، ثم غيّر الحجم واضغط للوصول إلى أبعاد وحجم الملف المطلوبين.',
        '## خطوات عملية',
        'اختر النسبة المناسبة للوجهة (أو "حر" للقص اليدوي)، دوّر الصورة إن لزم، اضبط منطقة القص، ثم عاين الناتج. بعد القص يمكنك تغيير الحجم أو الضغط لإنهاء التجهيز.',
        'كل ذلك يتم داخل متصفحك مباشرة — لا يُخزَّن أي شيء ولا يُرفع ملفك إلى أي خادم.',
      ],
      en: [
        'Cropping is a simple but powerful tool: it removes unnecessary parts from the edges of an image to improve framing or to prepare it for a ratio a particular platform requires. Unlike resizing, cropping never touches the resolution of the part that remains.',
        '## What cropping actually does',
        'Cropping cuts a rectangle from inside the image and discards everything outside it. The remaining pixels keep their original resolution exactly, so cropping does not reduce quality — it can even improve the visual focus by removing distracting elements at the edges.',
        '## Fixed ratios and why they matter',
        'Every platform favours particular ratios: <strong>1:1</strong> square for profile pictures and some social posts, <strong>16:9</strong> wide for presentations and video thumbnails, <strong>4:3</strong> and <strong>3:2</strong> common in photography. Enabling the ratio lock guarantees the crop stays compatible with the destination, with no extra automatic cropping later.',
        '## Rotating before you crop',
        'Sometimes an image is tilted or in the wrong orientation. The crop tool lets you rotate by 90, 180 or 270 degrees before cutting, so you can fix the orientation and then choose the right frame in a single step.',
        '## Tips for good framing',
        'Leave some breathing room around the main subject rather than cropping it too tightly. Place the point of interest near one of the image thirds rather than dead centre for a more balanced composition. And when preparing a circular profile picture, remember the corners will be clipped, so keep the face centred.',
        '## Crop or resize?',
        'Cropping removes parts of the image to change framing or ratio, while resizing adjusts the whole dimensions without removing content. You often use both together: crop to get the right framing and ratio, then resize and compress to reach the required dimensions and file size.',
        '## A practical workflow',
        'Choose the ratio that fits the destination (or "free" for manual cropping), rotate the image if needed, set the crop area, then preview the result. After cropping you can resize or compress to finish preparing the image.',
        'All of this happens directly inside your browser — nothing is stored and your file is never uploaded to any server.',
      ],
    },
    faq: [
      {
        q: { ar: 'هل القص يقلل جودة الصورة؟', en: 'Does cropping reduce image quality?' },
        a: {
          ar: 'لا. القص يحذف البكسلات خارج المنطقة المحددة فقط، والبكسلات المتبقية تحتفظ بدقتها الأصلية كاملة.',
          en: 'No. Cropping only removes the pixels outside the selected area; the remaining pixels keep their full original resolution.',
        },
      },
      {
        q: { ar: 'ما الفرق بين القص وتغيير الحجم؟', en: 'What is the difference between cropping and resizing?' },
        a: {
          ar: 'القص يزيل أجزاءً من الصورة لتغيير التأطير أو النسبة، بينما تغيير الحجم يضبط الأبعاد الكاملة. يمكن استخدامهما معًا.',
          en: 'Cropping removes parts of the image to change framing or ratio, while resizing adjusts the whole dimensions. They can be used together.',
        },
      },
      {
        q: { ar: 'ما النسبة المناسبة لصورة الملف الشخصي؟', en: 'Which ratio suits a profile picture?' },
        a: {
          ar: 'استخدم النسبة المربّعة 1:1 وأبقِ الوجه في المركز، لأن كثيرًا من المنصات تعرض صورة الملف داخل دائرة تقصّ الزوايا.',
          en: 'Use the square 1:1 ratio and keep the face centred, since many platforms display the profile picture inside a circle that clips the corners.',
        },
      },
      {
        q: { ar: 'كيف أصحّح صورة مائلة أو مقلوبة؟', en: 'How do I fix a tilted or upside-down image?' },
        a: {
          ar: 'استخدم خيار التدوير في أداة القص (90 أو 180 أو 270 درجة) لتصحيح الاتجاه قبل ضبط منطقة القص.',
          en: 'Use the rotation option in the crop tool (90, 180 or 270 degrees) to fix the orientation before setting the crop area.',
        },
      },
    ],
    related: ['resize-image', 'convert-image'],
    lastUpdated: '2026-08-29',
  },
  {
    slug: 'document-to-markdown',
    title: {
      ar: 'كيف تحوّل المستندات إلى Markdown',
      en: 'How to convert documents to Markdown',
    },
    description: {
      ar: 'دليل عملي لتحويل ملفات Word وHTML وPDF إلى صيغة Markdown نظيفة داخل متصفحك، مع نصائح لأفضل نتيجة.',
      en: 'A practical guide to turning Word, HTML and PDF files into clean Markdown inside your browser, with tips for the best result.',
    },
    body: {
      ar: [
        'صيغة Markdown أصبحت اللغة الأساسية للكتابة على الويب: تستخدمها منصات التوثيق، ومولّدات المواقع الثابتة، ومحررات الملاحظات، ومنصات مثل GitHub. تحويل مستنداتك القديمة (Word أو HTML أو PDF) إلى Markdown يجعلها أخفّ وأسهل في التحرير والنشر وإدارة الإصدارات.',
        '## ما هي صيغة Markdown ولماذا تحوّل إليها؟',
        'Markdown صيغة نصية بسيطة تستخدم رموزًا خفيفة للتنسيق: <code>#</code> للعناوين، و<code>-</code> للقوائم، والنجوم للخط العريض والمائل. الملف الناتج نص عادي يمكن فتحه في أي محرر، ولا يعتمد على برنامج معيّن، ويعمل بسلاسة مع أنظمة التحكم في الإصدارات مثل Git.',
        '## الصيغ المدعومة وأيها الأفضل',
        '<strong>Word (DOCX)</strong> هو المصدر الأفضل، لأنه يحمل بنية واضحة: عناوين وقوائم وخط عريض وروابط، فتُترجم مباشرةً إلى Markdown دقيق. <strong>HTML</strong> يُحوَّل أيضًا بنظافة إلى Markdown. أما <strong>PDF</strong> فهو الأصعب لأنه صُمّم للطباعة لا للبنية، فلا يحمل معلومات العناوين، وتكون النتيجة نصًا خامًا يحتاج مراجعة. <strong>RTF وTXT</strong> نصوص بسيطة تُنقل كما هي.',
        '## كيف تجري التحويل',
        'ارفع مستندك في أداة تحويل المستندات إلى Markdown، واضغط زر التحويل. يظهر الناتج في محرر يمكنك تعديله مباشرةً، مع معاينة حيّة ترى فيها الشكل النهائي. انسخ الناتج أو نزّله كملف <code>.md</code> جاهز للاستخدام. كل ذلك يتم داخل متصفحك دون رفع الملف إلى أي خادم.',
        '## نصائح لأفضل نتيجة',
        'استخدم Word بدل PDF متى أمكن للحفاظ على بنية العناوين. راجع الجداول والقوائم المعقدة بعد التحويل، فقد تحتاج تعديلًا يدويًا. وإن كان مصدرك صفحة ويب، فالتحويل من HTML أنظف من نسخ النص ولصقه. بعد التحويل، استخدم المعاينة للتأكد من أن العناوين والروابط ظهرت كما تريد.',
        '## الخصوصية',
        'تحويل المستندات إلى Markdown في هذا الموقع يتم بالكامل داخل متصفحك عبر جافاسكربت؛ لا يُرفع ملفك ولا يُخزَّن. هذا يجعله مناسبًا للمستندات الحساسة التي لا تريد رفعها إلى خدمات خارجية.',
      ],
      en: [
        'Markdown has become the default language for writing on the web: documentation platforms, static-site generators, note editors, and platforms like GitHub all use it. Converting your older documents (Word, HTML or PDF) to Markdown makes them lighter and easier to edit, publish and version-control.',
        '## What is Markdown, and why convert to it?',
        'Markdown is a simple text format that uses light symbols for formatting: <code>#</code> for headings, <code>-</code> for lists, and asterisks for bold and italics. The resulting file is plain text you can open in any editor, it does not depend on a particular program, and it works smoothly with version-control systems like Git.',
        '## Supported formats and which is best',
        '<strong>Word (DOCX)</strong> is the best source, because it carries a clear structure: headings, lists, bold and links, which translate directly into accurate Markdown. <strong>HTML</strong> also converts cleanly to Markdown. <strong>PDF</strong> is the hardest, since it was designed for printing rather than structure — it carries no heading information, so the result is raw text that needs review. <strong>RTF and TXT</strong> are simple text carried across as-is.',
        '## How to run the conversion',
        'Upload your document into the document → Markdown tool and press convert. The result appears in an editor you can adjust directly, with a live preview that shows the final look. Copy the output or download it as a <code>.md</code> file, ready to use. All of it happens inside your browser without uploading the file to any server.',
        '## Tips for the best result',
        'Use Word rather than PDF when you can, to preserve the heading structure. Review complex tables and lists after converting, as they may need a manual touch. If your source is a web page, converting from HTML is cleaner than copying and pasting the text. After converting, use the preview to confirm that headings and links came out the way you want.',
        '## Privacy',
        'Converting documents to Markdown on this site happens entirely inside your browser with JavaScript; your file is never uploaded or stored. That makes it suitable for sensitive documents you would rather not upload to external services.',
      ],
    },
    faq: [
      {
        q: { ar: 'هل يُرفع مستندي إلى خادم؟', en: 'Is my document uploaded to a server?' },
        a: {
          ar: 'لا. يتم التحويل بالكامل داخل متصفحك، ولا يُرسل ملفك إلى أي خادم في أي مرحلة.',
          en: 'No. The conversion happens entirely inside your browser, and your file is never sent to any server at any stage.',
        },
      },
      {
        q: { ar: 'ما أفضل صيغة مصدر للحصول على Markdown نظيف؟', en: 'Which source format gives the cleanest Markdown?' },
        a: {
          ar: 'مستند Word (DOCX)، لأنه يحمل بنية العناوين والقوائم والروابط التي تُترجم مباشرةً إلى Markdown دقيق.',
          en: 'A Word document (DOCX), because it carries the heading, list and link structure that translates directly into accurate Markdown.',
        },
      },
      {
        q: { ar: 'لماذا نتيجة ملف PDF أقل دقة؟', en: 'Why is the PDF result less accurate?' },
        a: {
          ar: 'لأن PDF صُمّم للطباعة لا للبنية، فلا يحمل معلومات العناوين. يُستخرج النص بأفضل جهد وقد يحتاج مراجعة يدوية.',
          en: 'Because PDF is designed for printing, not structure, so it carries no heading information. Text is extracted on a best-effort basis and may need manual review.',
        },
      },
      {
        q: { ar: 'هل يمكنني تعديل الناتج قبل التنزيل؟', en: 'Can I edit the result before downloading?' },
        a: {
          ar: 'نعم. الناتج يظهر في محرر قابل للتعديل مع معاينة حيّة، ويمكنك ضبطه ثم نسخه أو تنزيله كملف .md.',
          en: 'Yes. The result appears in an editable editor with a live preview; you can adjust it, then copy it or download it as a .md file.',
        },
      },
    ],
    related: [],
    lastUpdated: '2026-08-30',
  },
];
