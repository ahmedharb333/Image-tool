/**
 * Convert a document File to Markdown — entirely in the browser, no uploads.
 *
 *   DOCX  -> mammoth (DOCX->HTML) -> turndown (HTML->Markdown)
 *   HTML  -> turndown
 *   RTF   -> lightweight strip to text
 *   TXT   -> passthrough
 *   MD    -> passthrough
 *   PDF   -> pdf.js text extraction (best-effort; PDFs carry no real structure)
 *
 * Heavy libraries are imported dynamically so they only load when this tool is
 * actually used.
 */

export interface MarkdownResult {
  markdown: string;
  /** Optional caveat shown to the user (e.g. PDF best-effort). */
  note?: string;
}

export type DocKind = 'docx' | 'html' | 'rtf' | 'txt' | 'md' | 'pdf';

const EXT_TO_KIND: Record<string, DocKind> = {
  docx: 'docx',
  doc: 'docx', // best-effort; true legacy .doc may fail
  htm: 'html',
  html: 'html',
  rtf: 'rtf',
  txt: 'txt',
  text: 'txt',
  md: 'md',
  markdown: 'md',
  pdf: 'pdf',
};

export function kindOf(fileName: string): DocKind | null {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_KIND[ext] ?? null;
}

/** Base file name without its extension. */
export function baseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '') || 'document';
}

async function htmlToMarkdown(html: string): Promise<string> {
  const TurndownService = (await import('turndown')).default;
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
  });
  return td.turndown(html).replace(/\n{3,}/g, '\n\n').trim();
}

async function docxToMarkdown(buffer: ArrayBuffer): Promise<string> {
  const mammoth = (await import('mammoth')) as unknown as {
    convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<{ value: string }>;
  };
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
  return htmlToMarkdown(html);
}

function rtfToText(rtf: string): string {
  return rtf
    .replace(/\\par[d]?/g, '\n')
    .replace(/\\'[0-9a-fA-F]{2}/g, '')
    .replace(/\\[a-zA-Z]+-?\d* ?/g, '')
    .replace(/[{}]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function pdfToMarkdown(buffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  // Point pdf.js at its worker (bundled by Vite).
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  (pdfjs as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc = workerUrl;

  const doc = await (pdfjs as unknown as {
    getDocument(src: { data: ArrayBuffer }): { promise: Promise<any> };
  }).getDocument({ data: buffer }).promise;

  const parts: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getContent?.() ?? await page.getTextContent();
    // Rebuild lines from text items using their vertical position.
    const items = content.items as Array<{ str: string; transform: number[] }>;
    let lastY: number | null = null;
    let line = '';
    const lines: string[] = [];
    for (const it of items) {
      const y = it.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        lines.push(line.trimEnd());
        line = '';
      }
      line += it.str;
      lastY = y;
    }
    if (line.trim()) lines.push(line.trimEnd());
    parts.push(lines.join('\n'));
  }
  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

export async function documentToMarkdown(file: File): Promise<MarkdownResult> {
  const kind = kindOf(file.name);
  if (!kind) {
    throw new Error('صيغة غير مدعومة. المدعوم: DOCX وHTML وRTF وTXT وMD وPDF.');
  }

  const buffer = await file.arrayBuffer();
  const decodeText = () => new TextDecoder('utf-8').decode(buffer);

  switch (kind) {
    case 'docx':
      return { markdown: await docxToMarkdown(buffer) };
    case 'html':
      return { markdown: await htmlToMarkdown(decodeText()) };
    case 'rtf':
      return {
        markdown: rtfToText(decodeText()),
        note: 'rtf-basic',
      };
    case 'txt':
      return { markdown: decodeText().replace(/\r\n?/g, '\n').trim() };
    case 'md':
      return { markdown: decodeText().replace(/\r\n?/g, '\n').trim() };
    case 'pdf':
      return {
        markdown: await pdfToMarkdown(buffer),
        note: 'pdf-besteffort',
      };
  }
}
