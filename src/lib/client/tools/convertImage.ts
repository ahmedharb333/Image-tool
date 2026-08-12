import { toolApp, type ToolApp } from '../toolApp.ts';
import { validateImageFile, baseNameOf } from '../../file.ts';
import { LIMITS } from '../../../config/limits.ts';
import { convertImage, resultToHtml, type OutputFormat } from '../../processing/index.ts';

export function initTool(root: HTMLElement): ToolApp {
  return toolApp(root, {
    async process(inputs, payload) {
      const file = inputs['file'] as File | undefined;
      const fmt = (inputs['format'] as OutputFormat | undefined) ?? 'webp';
      const quality = (Number(inputs['quality']) || 85) / 100;
      const formats = (payload as any)?.formats ?? ['jpg', 'jpeg', 'png', 'webp'];
      const maxSize = (payload as any)?.maxSize ?? LIMITS.maxFileSize;

      if (!file) return { status: 'error', message: 'اختر صورة أولاً.', html: '' };

      const buffer = await file.arrayBuffer();
      const check = validateImageFile(formats, file.name, file.size, maxSize, buffer);
      if (!check.valid) return { status: 'error', message: check.errors.join(' '), html: '' };

      const result = await convertImage(new Blob([buffer]), {
        format: fmt,
        quality,
        backgroundColor: fmt === 'jpg' && inputs['backgroundColor'] ? '#ffffff' : null,
      });

      const link = URL.createObjectURL(result.blob);
      return {
        status: 'success',
        message: 'تمت العملية بنجاح.',
        html: `${resultToHtml(result)}<p><a class="btn btn--accent" href="${link}" download="${baseNameOf(file.name)}-converted.${result.format}">تحميل الصورة</a></p>`,
      };
    },
  });
}
