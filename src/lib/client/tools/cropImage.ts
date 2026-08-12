import { toolApp, type ToolApp } from '../toolApp.ts';
import { validateImageFile, baseNameOf } from '../../file.ts';
import { LIMITS } from '../../../config/limits.ts';
import { cropImage, resultToHtml, type OutputFormat } from '../../processing/index.ts';

const RATIOS: Record<string, number | undefined> = {
  free: undefined,
  '1:1': 1,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
};

export function initTool(root: HTMLElement): ToolApp {
  return toolApp(root, {
    async process(inputs, payload) {
      const file = inputs['file'] as File | undefined;
      const fmt = (inputs['format'] as OutputFormat | undefined) ?? 'webp';
      const quality = (Number(inputs['quality']) || 85) / 100;
      const formats = (payload as any)?.formats ?? ['jpg', 'jpeg', 'png', 'webp'];
      const maxSize = (payload as any)?.maxSize ?? LIMITS.maxFileSize;

      if (!file) return { status: 'error', message: 'اختر صورة أولاً.', html: '' };

      const w = Number(inputs['w']);
      const h = Number(inputs['h']);
      if (!(w > 0) || !(h > 0)) return { status: 'error', message: 'أدخل عرض وارتفاع القص.', html: '' };

      const buffer = await file.arrayBuffer();
      const check = validateImageFile(formats, file.name, file.size, maxSize, buffer);
      if (!check.valid) return { status: 'error', message: check.errors.join(' '), html: '' };

      const lockRatio = Boolean(inputs['lockRatio']);
      const ratioKey = (inputs['ratio'] as string) ?? 'free';
      const baseRatio = lockRatio ? RATIOS[ratioKey] : undefined;

      const result = await cropImage(new Blob([buffer]), {
        x: Number(inputs['x']) || 0,
        y: Number(inputs['y']) || 0,
        w,
        h,
        lockRatio,
        baseRatio,
        rotate: Number(inputs['rotate']) || 0,
        format: fmt,
        quality,
        backgroundColor: fmt === 'jpg' ? '#ffffff' : null,
      });

      const link = URL.createObjectURL(result.blob);
      return {
        status: 'success',
        message: 'تمت العملية بنجاح.',
        html: `${resultToHtml(result)}<p><a class="btn btn--accent" href="${link}" download="${baseNameOf(file.name)}-cropped.${result.format}">تحميل الصورة</a></p>`,
      };
    },
  });
}
