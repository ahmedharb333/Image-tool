import { documentToMarkdown, baseName, kindOf } from '../document/toMarkdown';

/**
 * Controller for the document -> Markdown tool. Separate from the image
 * toolApp because the output is text (a Markdown editor + copy/download),
 * not an image. Localized strings are read from the root's data-* attributes
 * so this stays locale-agnostic.
 */
export function initDocTool(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('.doc-form');
  const input = root.querySelector<HTMLInputElement>('[data-upload-input]');
  const output = root.querySelector<HTMLTextAreaElement>('[data-md-output]');
  const outputWrap = root.querySelector<HTMLElement>('[data-output-wrap]');
  const status = root.querySelector<HTMLElement>('[data-status]');
  const alerts = root.querySelector<HTMLElement>('[data-alerts]');
  const copyBtn = root.querySelector<HTMLButtonElement>('[data-action="copy"]');
  const downloadBtn = root.querySelector<HTMLElement>('[data-action="download"]');
  const dropTitle = root.querySelector<HTMLElement>('.dropzone__title');
  if (!form || !input || !output) return;

  const msg = (k: string) => root.dataset[k] ?? '';
  let currentName = 'document';

  function setStatus(text: string) {
    if (status) status.textContent = text;
  }
  function showError(text: string) {
    if (!alerts) return;
    alerts.innerHTML = text ? `<div class="status status--error">${text}</div>` : '';
    alerts.hidden = !text;
  }

  input.addEventListener('change', () => {
    const f = input.files && input.files[0];
    if (f && dropTitle) dropTitle.textContent = `✓ ${f.name}`;
    showError('');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');
    const file = input.files && input.files[0];
    if (!file) { showError(msg('errNoFile')); return; }
    if (!kindOf(file.name)) { showError(msg('errUnsupported')); return; }

    currentName = baseName(file.name);
    setStatus(msg('working'));
    root.dataset.busy = 'true';
    try {
      const { markdown, note } = await documentToMarkdown(file);
      output.value = markdown;
      if (outputWrap) outputWrap.hidden = false;
      const noteText = note === 'pdf-besteffort' ? msg('notePdf')
        : note === 'rtf-basic' ? msg('noteRtf') : '';
      setStatus(noteText ? `${msg('done')} — ${noteText}` : msg('done'));
      outputWrap?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      const detail = err instanceof Error ? err.message : '';
      showError(`${msg('errFail')}${detail ? ' ' + detail : ''}`);
      setStatus('');
    } finally {
      root.dataset.busy = 'false';
    }
  });

  copyBtn?.addEventListener('click', async () => {
    if (!output.value) return;
    try {
      await navigator.clipboard.writeText(output.value);
      copyBtn.textContent = msg('copied');
      setTimeout(() => { copyBtn.textContent = msg('copy'); }, 1500);
    } catch {
      // Fallback: select the text so the user can copy manually.
      output.focus();
      output.select();
    }
  });

  downloadBtn?.addEventListener('click', () => {
    if (!output.value) return;
    const blob = new Blob([output.value], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentName}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
