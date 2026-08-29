/**
 * Per-tool explanatory content shown below each tool. Usage-focused (how to
 * use this specific tool and its options) — distinct from the concept guides.
 * A block starting with "## " renders as an H2; otherwise a paragraph (inline
 * HTML allowed). English is optional and falls back to Arabic.
 */
export interface ToolContent {
  body: { ar: string[]; en?: string[] };
}

export const TOOL_CONTENT: Record<string, ToolContent> = {
  'compress-image': {
    body: {
      ar: [
        '## كيف تستخدم أداة ضغط الصور',
        'اختر صورة JPG أو PNG أو WebP من جهازك بالسحب أو بالضغط على منطقة الرفع. ثم حدّد الصيغة الناتجة، واضبط مؤشر الجودة، وإن أردت أدخل حدًا أقصى للحجم بالكيلوبايت. اضغط "ضغط الصورة" وحمّل الناتج مباشرةً.',
        '## ماذا يفعل كل خيار؟',
        '<strong>الصيغة الناتجة:</strong> WebP للأصغر حجمًا، JPG للتوافق الأوسع، PNG بلا فقدان للرسومات والشفافية. <strong>الجودة:</strong> نسبة مئوية تتحكم في مقدار البيانات المحفوظة؛ 80٪ نقطة انطلاق جيدة لمعظم الصور. <strong>الحد الأقصى للحجم:</strong> اختياري — إن ملأته تضبط الأداة الجودة تلقائيًا للوصول إلى الحجم المطلوب.',
        '## نصائح سريعة',
        'عاين الناتج بحجمه الفعلي لا مكبّرًا قبل الحفظ. إن احتجت حجمًا أصغر بكثير، صغّر الأبعاد أولًا بأداة تغيير الحجم ثم اضغط. واحتفظ دائمًا بالنسخة الأصلية، فالضغط لا يمكن التراجع عنه في الملف الناتج.',
        'تُعالَج صورتك بالكامل داخل متصفحك عبر واجهات Canvas؛ لا تُرفع إلى أي خادم وتبقى خاصة تمامًا.',
      ],
      en: [
        '## How to use the image compressor',
        'Choose a JPG, PNG or WebP image from your device by dragging it in or clicking the upload area. Then pick the output format, adjust the quality slider, and optionally enter a maximum size in kilobytes. Press "Compress image" and download the result directly.',
        '## What each option does',
        '<strong>Output format:</strong> WebP for the smallest size, JPG for the widest compatibility, PNG lossless for graphics and transparency. <strong>Quality:</strong> a percentage controlling how much data is kept; 80% is a good starting point for most images. <strong>Max size:</strong> optional — if you fill it in, the tool adjusts quality automatically to reach the size you want.',
        '## Quick tips',
        'Preview the result at actual size, not zoomed in, before saving. If you need it much smaller, reduce the dimensions first with the resize tool and then compress. Always keep the original copy, since compression cannot be undone on the output file.',
        'Your image is processed entirely inside your browser via the Canvas APIs; it is never uploaded to any server and stays completely private.',
      ],
    },
  },
  'resize-image': {
    body: {
      ar: [
        '## كيف تستخدم أداة تغيير حجم الصور',
        'ارفع صورتك، ثم اختر نوع التحجيم: بالبكسل، أو بالنسبة المئوية، أو بالحد الأقصى للأبعاد. أدخل القيمة المطلوبة، اختر الصيغة والجودة الناتجة، ثم اضغط "تغيير الحجم" وحمّل النتيجة.',
        '## ماذا يفعل كل خيار؟',
        '<strong>بالبكسل:</strong> أدخل العرض أو الارتفاع، ويُحسب الآخر تلقائيًا للحفاظ على النسبة. <strong>بالنسبة المئوية:</strong> اكتب نسبة مثل 50 لتصغير الصورة إلى نصف أبعادها. <strong>الحد الأقصى للأبعاد:</strong> اضبط أطول ضلع عند قيمة محددة، مفيد للصور الطويلة والبانورامية. الصيغة والجودة تحدّدان حجم الملف الناتج ووضوحه.',
        '## نصائح سريعة',
        'أبقِ نسبة الأبعاد كما هي إلا إذا قصدت التشويه عمدًا. تجنّب التكبير فوق أبعاد الأصل لأنه يضيف بكسلات مخمَّنة تبدو ضبابية. لأصغر حجم نهائي، غيّر الحجم أولًا ثم اضغط الناتج.',
        'كل المعالجة تتم محليًا في متصفحك؛ لا يُرفع ملفك إلى أي خادم.',
      ],
      en: [
        '## How to use the image resizer',
        'Upload your image, then choose the resize mode: by pixels, by percentage, or by maximum dimension. Enter the value you want, pick the output format and quality, then press "Resize" and download the result.',
        '## What each option does',
        '<strong>By pixels:</strong> enter the width or the height, and the other is computed automatically to preserve the ratio. <strong>By percentage:</strong> type a value like 50 to shrink the image to half its dimensions. <strong>Maximum dimension:</strong> cap the longest side at a set value, useful for tall and panoramic images. Format and quality determine the output file’s size and clarity.',
        '## Quick tips',
        'Keep the aspect ratio unless you intend to distort on purpose. Avoid enlarging beyond the original dimensions, because it adds guessed pixels that look blurry. For the smallest final size, resize first and then compress the result.',
        'All processing happens locally in your browser; your file is never uploaded to any server.',
      ],
    },
  },
  'convert-image': {
    body: {
      ar: [
        '## كيف تستخدم أداة تحويل الصيغة',
        'ارفع صورتك، اختر الصيغة الناتجة (JPG أو PNG أو WebP)، واضبط الجودة إن كانت الصيغة تدعمها. إن كنت تحوّل صورة شفافة إلى JPG، فعّل خيار الخلفية البيضاء لتحديد لون المناطق الشفافة، ثم اضغط "تحويل الصورة".',
        '## ماذا يفعل كل خيار؟',
        '<strong>الصيغة الناتجة:</strong> اختر حسب الوجهة — WebP للويب، JPG للتوافق، PNG للشفافية والرسومات. <strong>الجودة:</strong> متاحة للصيغ ذات الفقدان (JPG وWebP) للتحكم في التوازن بين الحجم والوضوح. <strong>خلفية بيضاء:</strong> تظهر عند التحويل إلى JPG لأنه لا يدعم الشفافية، فتُملأ المناطق الشفافة باللون المختار.',
        '## نصائح سريعة',
        'راجع خيار الخلفية قبل التحويل إلى JPG حتى لا تفاجأ بحواف بيضاء. تجنّب تحويل JPG إلى JPG مرارًا لأن كل جولة تراكم تشويهًا. للويب، WebP عادةً الخيار الأمثل حجمًا وجودة.',
        'تجري كل التحويلات داخل متصفحك مباشرة دون رفع أي ملف.',
      ],
      en: [
        '## How to use the format converter',
        'Upload your image, choose the output format (JPG, PNG or WebP), and set the quality if the format supports it. If you are converting a transparent image to JPG, enable the white-background option to set the colour of transparent areas, then press "Convert image".',
        '## What each option does',
        '<strong>Output format:</strong> choose by destination — WebP for the web, JPG for compatibility, PNG for transparency and graphics. <strong>Quality:</strong> available for lossy formats (JPG and WebP) to control the balance between size and clarity. <strong>White background:</strong> appears when converting to JPG, which does not support transparency, so transparent areas are filled with the chosen colour.',
        '## Quick tips',
        'Check the background option before converting to JPG so you are not surprised by white edges. Avoid converting JPG to JPG repeatedly, since each round stacks artefacts. For the web, WebP is usually the best choice for size and quality.',
        'All conversions run directly inside your browser without uploading any file.',
      ],
    },
  },
  'crop-image': {
    body: {
      ar: [
        '## كيف تستخدم أداة قص الصور',
        'ارفع صورتك، ثم اختر نسبة الأبعاد (حر أو نسبة ثابتة مثل 1:1 و16:9). أدخل إحداثيات القص وأبعاده، فعّل قفل النسبة إن أردت الحفاظ عليها، ودوّر الصورة إن لزم، ثم اضغط "قص الصورة".',
        '## ماذا يفعل كل خيار؟',
        '<strong>نسبة الأبعاد:</strong> "حر" لقص يدوي، أو نسبة جاهزة تناسب المنصة المستهدفة. <strong>قفل نسبة الأبعاد:</strong> يبقي العرض والارتفاع متناسبين أثناء الضبط. <strong>التدوير:</strong> 90 أو 180 أو 270 درجة لتصحيح الاتجاه قبل القص. <strong>الصيغة والجودة:</strong> تحدّدان الملف الناتج.',
        '## نصائح سريعة',
        'اترك مساحة حول الموضوع الرئيسي بدل قصّه بإحكام. لصور الملف الشخصي الدائرية أبقِ الوجه في المركز لأن الزوايا ستُقصّ. القص لا يقلّل جودة الجزء المتبقي، فاستخدمه بثقة لتحسين التأطير.',
        'يتم القص بالكامل داخل متصفحك؛ لا يُخزَّن أو يُرفع أي شيء.',
      ],
      en: [
        '## How to use the crop tool',
        'Upload your image, then choose the aspect ratio (free, or a fixed ratio like 1:1 and 16:9). Enter the crop coordinates and dimensions, enable ratio lock if you want to preserve it, rotate the image if needed, then press "Crop image".',
        '## What each option does',
        '<strong>Aspect ratio:</strong> "free" for manual cropping, or a ready-made ratio that suits the target platform. <strong>Lock aspect ratio:</strong> keeps width and height proportional while you adjust. <strong>Rotate:</strong> 90, 180 or 270 degrees to fix orientation before cropping. <strong>Format and quality:</strong> determine the output file.',
        '## Quick tips',
        'Leave room around the main subject rather than cropping it tightly. For circular profile pictures, keep the face centred because the corners are clipped. Cropping does not reduce the quality of the remaining part, so use it confidently to improve framing.',
        'Cropping happens entirely inside your browser; nothing is stored or uploaded.',
      ],
    },
  },
};
