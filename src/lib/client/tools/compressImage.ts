import { toolApp, type ToolApp } from '../toolApp.ts';
import { validateImageFile, baseNameOf } from '../../file.ts';
import { LIMITS } from '../../../config/limits.ts';
import { compressImage, resultToHtml, type OutputFormat } from '../../processing/index.ts';

export function initTool(root: HTMLElement): ToolApp {
  return toolApp(root, {
    async process(inputs, payload) {
      const file = inputs['file'] as File | undefined;
      const fmt = (inputs['format'] as OutputFormat | undefined) ?? 'webp';
      const quality = (Number(inputs['quality']) || 82) / 100;
      const formats = (payload as any)?.formats ?? ['jpg', 'jpeg', 'png', 'webp'];
      const maxSize = (payload as any)?.maxSize ?? LIMITS.maxFileSize;

      if (!file) return { status: 'error', message: 'اختر صورة أولاً.', html: '' };

      const buffer = await file.arrayBuffer();
      const check = validateImageFile(formats, file.name, file.size, maxSize, buffer);
      if (!check.valid) return { status: 'error', message: check.errors.join(' '), html: '' };

      const targetKb = Number(inputs['targetSize']);
      const result = await compressImage(new Blob([buffer]), {
        format: fmt,
        quality,
        backgroundColor: fmt === 'jpg' ? '#ffffff' : null,
        targetFileSize: targetKb > 0 ? targetKb * 1024 : null,
      });

      const link = URL.createObjectURL(result.blob);
      return {
        status: 'success',
        message: 'تمت العملية بنجاح.',
        html: `${resultToHtml(result)}<p><a class="btn btn--accent" href="${link}" download="${baseNameOf(file.name)}-compressed.${result.format}">تحميل الصورة</a></p>`,
      };
    },
  });
}
