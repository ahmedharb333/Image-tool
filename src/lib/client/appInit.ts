import { toolRegistry } from './registry';

/**
 * Boots every tool island on the page. Tools are opt-in via `data-tool`.
 */
export function initApp(): void {
  document.querySelectorAll<HTMLElement>('[data-tool]').forEach((root) => {
    const slug = root.dataset.tool;
    if (!slug) return;
    const loader = toolRegistry[slug];
    if (!loader) {
      console.warn(`[image-tools] unknown tool slug: ${slug}`);
      return;
    }
    loader()
      .then((mod) => {
        // initTool builds the tool controller; it must be started with init()
        // to attach the form/submit/reset handlers.
        const app = mod.initTool(root) as { init?: () => void };
        app?.init?.();
      })
      .catch((err) => console.error(`[image-tools] failed to init ${slug}`, err));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initApp());
} else {
  initApp();
}
