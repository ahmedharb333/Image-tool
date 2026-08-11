import { toolApp, type ToolApp } from './toolApp';

/**
 * Scaffold demo tool. Replaced by the real compress-image engine in Task 10/11.
 */
export function initSampleTool(root: HTMLElement): ToolApp {
  return toolApp(root, {
    async process(inputs) {
      return {
        status: 'success',
        message: 'أداة تجريبية',
        html: `<p class="result-stats">استلمت المدخلات: ${JSON.stringify(inputs)}</p>`,
      };
    },
  });
}
