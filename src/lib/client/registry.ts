/**
 * Lazy-loader registry. Explicit static imports (no dynamic import strings)
 * keep Vite/Rollup code-splitting working for the `npm run build` output.
 */
export const toolRegistry: Record<string, () => Promise<{ initTool(root: HTMLElement): unknown }>> = {
  'compress-image': () => import('./tools/compressImage'),
  'resize-image': () => import('./tools/resizeImage'),
  'convert-image': () => import('./tools/convertImage'),
  'crop-image': () => import('./tools/cropImage'),
};
