/**
 * Generic tool controller. Owns the DOM contract shared by every calculator:
 * form -> process -> result. Tool-specific math lives in the tool module and
 * is passed in as `handlers`.
 *
 * DOM contract (must match the tool pages' form exactly):
 *   .tool-form, input[data-upload-input], [data-tool],
 *   [data-action="process"], [data-action="reset"],
 *   .tool-result, [data-status], [data-alerts],
 *   .field--invalid, [data-tool-payload]
 */

export interface ToolHandlers {
  process(inputs: Record<string, unknown>, payload: unknown): Promise<ToolOutput>;
}

export interface ToolOutput {
  message?: string;
  status: 'error' | 'success' | 'warning' | 'info';
  html: string;
}

export interface ToolApp {
  init(): void;
  destroy(): void;
}

export function toolApp(root: HTMLElement, handlers: ToolHandlers): ToolApp {
  const form = root.querySelector('.tool-form') as HTMLFormElement | null;
  const result = root.querySelector('.tool-result');
  const alerts = root.querySelector('[data-alerts]') as HTMLElement | null;
  const status = root.querySelector('[data-status]') as HTMLElement | null;
  const uploadInput = root.querySelector<HTMLInputElement>('input[data-upload-input]');

  const payloadEl = root.querySelector('[data-tool-payload]');
  let payload: unknown = null;
  if (payloadEl) {
    try {
      payload = JSON.parse(payloadEl.textContent ?? 'null');
    } catch {
      payload = null;
    }
  }

  function setStatus(kind: ToolOutput['status'], text: string) {
    if (!status) return;
    status.textContent = text;
    status.dataset.statusKind = kind;
  }

  function showAlerts(errors: string[]) {
    if (!alerts) return;
    alerts.innerHTML = errors.map((e) => `<div class="status status--error">${e}</div>`).join('');
    alerts.hidden = errors.length === 0;
  }

  function setBusy(busy: boolean) {
    root.dataset.busy = String(busy);
  }

  function collectInputs(): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    if (!form) return values;
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }
    return values;
  }

  async function process() {
    if (!form) return;
    setBusy(true);
    try {
      const inputs = collectInputs();
      const output = await handlers.process(inputs, payload);
      if (output.status === 'error') {
        showAlerts([output.message ?? 'حدث خطأ غير متوقع.']);
      } else {
        showAlerts([]);
        setStatus(output.status, output.message ?? '');
        if (result) result.innerHTML = output.html;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
      showAlerts([message]);
      setStatus('error', message);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    form?.reset();
    showAlerts([]);
    if (result) result.innerHTML = '';
    if (status) status.textContent = '';
    if (uploadInput) uploadInput.value = '';
  }

  function init() {
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      process();
    });
    root.querySelectorAll<HTMLElement>('[data-action="process"]').forEach((el) =>
      el.addEventListener('click', () => process()),
    );
    root.querySelectorAll<HTMLElement>('[data-action="reset"]').forEach((el) =>
      el.addEventListener('click', () => reset()),
    );
  }

  function destroy() {
    form?.removeEventListener('submit', () => process());
  }

  return { init, destroy };
}
