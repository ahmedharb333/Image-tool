/**
 * Lazy-loader registry. Explicit static imports (no dynamic import strings)
 * keep Vite/Rollup code-splitting working for the `npm run build` output.
 */
export const toolRegistry: Record<string, () => Promise<{ initTool(root: HTMLElement): unknown }>> = {
  'compress-image': () => import('./sampleTool').then((m) => ({ initTool: m.initSampleTool })),
};
