import type { ProcessResult } from './types.ts';

export function computeReduction(sourceSize: number, resultSize: number): number {
  if (sourceSize <= 0) return 0;
  return Math.max(0, Math.round((1 - resultSize / sourceSize) * 100));
}

export function resultToHtml(r: ProcessResult): string {
  const saving = r.reduction > 0 ? ` (توفير ${r.reduction}٪)` : '';
  return `<dl class="result-stats">
    <div><dt>الحجم قبل</dt><dd>${formatBytes(r.sourceSize)}</dd></div>
    <div><dt>الحجم بعد</dt><dd>${formatBytes(r.resultSize)}</dd></div>
    <div><dt>الأبعاد</dt><dd>${r.width} × ${r.height} بكسل</dd></div>
    <div><dt>الصيغة</dt><dd>${r.format}</dd></div>
  </dl><p class="result-stats__saving">${saving}</p>`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
