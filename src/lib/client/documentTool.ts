import { documentToMarkdown, baseName, kindOf } from '../document/toMarkdown';

/**
 * Controller for the document -> Markdown tool. Output is text (a Markdown
 * editor + live preview + copy/download), so it's separate from the image
 * toolApp. Localized strings are read from the root's data-* attributes.
 */
export function initDocTool(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('.doc-form');
  const input = root.querySelector<HTMLInputElement>('[data-upload-input]');
  const dropzone = root.querySelector<HTMLElement>('[data-dropzone]');
  const output = root.querySelector<HTMLTextAreaElement>('[data-md-output]');
  const preview = root.querySelector<HTMLElement>('[data-md-preview]');
  const outputWrap = root.querySelector<HTMLElement>('[data-output-wrap]');
  const status = root.querySelector<HTMLElement>('[data-status]');
  const alerts = root.querySelector<HTMLElement>('[data-alerts]');
  const countEl = root.querySelector<HTMLElement>('[data-count]');
  const convertBtn = root.querySelector<HTMLButtonElement>('[data-action="process"]');
  const copyBtn = root.querySelector<HTMLButtonElement>('[data-action="copy"]');
  const downloadBtn = root.querySelector<HTMLElement>('[data-action="download"]');
  const clearBtn = root.querySelector<HTMLElement>('[data-action="clear"]');
  const dropTitle = root.querySelector<HTMLElement>('.dropzone__title');
  const tabs = [...root.querySelectorAll<HTMLElement>('.doc-tab')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  if (!form || !input || !output) return;

  const msg = (k: string) => root.dataset[k] ?? '';
  const dropTitleDefault = dropTitle?.textContent ?? '';
  let currentName = 'document';

  const setStatus = (text: string) => { if (status) status.textContent = text; };
  const showError = (text: string) => {
    if (!alerts) return;
    alerts.innerHTML = text ? `<div class="status status--error">${text}</div>` : '';
    alerts.hidden = !text;
  };

  function sanitize(html: string): string {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
      .replace(/ on[a-z]+="[^"]*"/gi, '');
  }

  async function renderPreview() {
    if (!preview) return;
    const { marked } = await import('marked');
    preview.innerHTML = sanitize(String(await marked.parse(output!.value || '')));
  }

  function updateCount() {
    if (!countEl) return;
    const text = output!.value;
    const words = (text.trim().match(/\S+/g) || []).length;
    countEl.textContent = `${words} ${msg('words')} · ${text.length} ${msg('chars')}`;
  }

  function switchTab(name: string) {
    tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
    panels.forEach((p) => { p.hidden = p.dataset.panel !== name; });
    if (name === 'preview') renderPreview();
  }
  tabs.forEach((t) => t.addEventListener('click', () => switchTab(t.dataset.tab || 'markdown')));

  function acceptFile(f: File | undefined) {
    if (f && dropTitle) dropTitle.textContent = `✓ ${f.name}`;
    showError('');
  }
  input.addEventListener('change', () => acceptFile(input.files?.[0]));

  // Drag & drop
  if (dropzone) {
    const activate = (on: boolean) => {
      dropzone.classList.toggle('is-dragover', on);
      if (dropTitle) dropTitle.textContent = on ? msg('dropActive') : (input.files?.[0] ? `✓ ${input.files[0].name}` : dropTitleDefault);
    };
    ['dragenter', 'dragover'].forEach((ev) =>
      dropzone.addEventListener(ev, (e) => { e.preventDefault(); activate(true); }));
    ['dragleave', 'dragend'].forEach((ev) =>
      dropzone.addEventListener(ev, (e) => { e.preventDefault(); activate(false); }));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      activate(false);
      const dt = (e as DragEvent).dataTransfer;
      if (dt && dt.files.length) {
        input.files = dt.files;
        acceptFile(dt.files[0]);
      }
    });
  }

  function setBusy(busy: boolean) {
    root.dataset.busy = String(busy);
    if (convertBtn) {
      convertBtn.disabled = busy;
      convertBtn.textContent = busy ? msg('working') : msg('convert');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');
    const file = input.files?.[0];
    if (!file) { showError(msg('errNoFile')); return; }
    if (!kindOf(file.name)) { showError(msg('errUnsupported')); return; }

    currentName = baseName(file.name);
    setBusy(true);
    try {
      const { markdown, note } = await documentToMarkdown(file);
      output.value = markdown;
      if (outputWrap) outputWrap.hidden = false;
      updateCount();
      switchTab('markdown');
      const noteText = note === 'pdf-besteffort' ? msg('notePdf') : note === 'rtf-basic' ? msg('noteRtf') : '';
      setStatus(noteText ? `${msg('done')} — ${noteText}` : msg('done'));
      outputWrap?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      const detail = err instanceof Error ? err.message : '';
      showError(`${msg('errFail')}${detail ? ' ' + detail : ''}`);
      setStatus('');
    } finally {
      setBusy(false);
    }
  });

  // Live: editing the Markdown updates count (and preview if visible)
  output.addEventListener('input', () => {
    updateCount();
    const previewVisible = panels.some((p) => p.dataset.panel === 'preview' && !p.hidden);
    if (previewVisible) renderPreview();
  });

  copyBtn?.addEventListener('click', async () => {
    if (!output.value) return;
    try {
      await navigator.clipboard.writeText(output.value);
      copyBtn.textContent = msg('copied');
      setTimeout(() => { copyBtn.textContent = msg('copy'); }, 1500);
    } catch {
      output.focus(); output.select();
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

  clearBtn?.addEventListener('click', () => {
    output.value = '';
    if (preview) preview.innerHTML = '';
    if (outputWrap) outputWrap.hidden = true;
    input.value = '';
    if (dropTitle) dropTitle.textContent = dropTitleDefault;
    setStatus('');
    showError('');
  });
}
