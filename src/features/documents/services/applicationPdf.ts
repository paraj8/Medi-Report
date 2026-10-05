import jsPDF from 'jspdf';
import { MONTHS } from '@/lib/options';

export interface ApplicationReportData {
  month: string;
  year: string;
  successful: number;
  unsuccessful: number;
}

export interface ApplicationParagraph {
  text: string;
  indent?: number;
  gapAfter?: number;
  align?: 'left' | 'right' | 'center';
}

const legacyMonthNames: Record<string, string> = {
  January: 'tuojh',
  February: 'Qjojh',
  March: 'ekpZ',
  April: 'vizSy',
  May: 'ebZ',
  June: 'twu',
  July: 'tqykbZ',
  August: 'vxLr',
  September: 'flracj',
  October: 'vDVwcj',
  November: 'uoEcj',
  December: 'fnlEcj',
};

export function getLegacyMonthName(month: string): string {
  const legacyMonth = legacyMonthNames[month];
  if (!legacyMonth || !MONTHS.includes(month)) {
    throw new Error(`Unsupported report month: ${month}`);
  }
  return legacyMonth;
}

export function formatApplicationCounts(data: ApplicationReportData) {
  return {
    month: getLegacyMonthName(data.month),
    year: data.year,
    successful: String(data.successful).padStart(2, '0'),
    unsuccessful: String(data.unsuccessful).padStart(2, '0'),
  };
}

export async function downloadApplicationPdf(
  fontFileName: string,
  paragraphs: ApplicationParagraph[],
  fileName: string,
): Promise<void> {
  const fontData = await loadApplicationFont(fontFileName);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const family = `application-${fontFileName.replace(/\.ttf$/i, '')}`;
  doc.addFileToVFS(fontFileName, toBase64(fontData));
  doc.addFont(fontFileName, family, 'normal');
  doc.setFont(family, 'normal');
  doc.setFontSize(18);
  doc.setTextColor(25, 25, 25);

  const marginX = 35;
  const rightEdge = doc.internal.pageSize.getWidth() - marginX;
  const maxWidth = rightEdge - marginX;
  let y = 50;
  const lineHeight = 7;

  for (const paragraph of paragraphs) {
    const x = marginX + (paragraph.indent ?? 0);
    const width = rightEdge - x;
    const lines = doc.splitTextToSize(paragraph.text, width);
    doc.text(lines, paragraph.align === 'right' ? rightEdge : x, y, {
      align: paragraph.align ?? 'left',
      maxWidth,
    });
    y += lines.length * lineHeight + (paragraph.gapAfter ?? 5);
  }

  doc.save(fileName);
}

export async function printApplication(
  fontFileName: string,
  paragraphs: ApplicationParagraph[],
): Promise<void> {
  const printWindow = window.open(window.location.href, '_blank');
  if (!printWindow) {
    throw new Error(
      'The print window could not be opened. Please allow pop-ups for this site and try again.',
    );
  }

  try {
    printWindow.document.open();
    const fontData = await loadApplicationFont(fontFileName);
    const fontBase64 = toBase64(fontData);
    const content = paragraphs.map((paragraph) => {
      const indent = paragraph.indent ?? 0;
      const gapAfter = paragraph.gapAfter ?? 5;
      const align = paragraph.align ?? 'left';
      return `<p style="width: calc(100% - ${indent}mm); margin: 0 0 ${gapAfter}mm ${indent}mm; text-align: ${align};">${escapeHtml(paragraph.text)}</p>`;
    }).join('\n');

    printWindow.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application</title>
  <style>
    @font-face {
      font-family: "ApplicationKrutiDev";
      src: url("data:font/ttf;base64,${fontBase64}") format("truetype");
      font-weight: normal;
      font-style: normal;
    }
    @page {
      size: A4 portrait;
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
    }
    body {
      color: #191919;
      font-family: "ApplicationKrutiDev";
      font-size: 18pt;
      font-weight: normal;
    }
    main {
      box-sizing: border-box;
      width: 210mm;
      min-height: 297mm;
      padding: 42mm 35mm 25mm;
    }
    p {
      font: inherit;
      line-height: 7mm;
      white-space: pre-wrap;
      overflow-wrap: break-word;
    }
    @media screen {
      body { width: 210mm; min-height: 297mm; }
    }
  </style>
</head>
<body>
  <main>${content}</main>
  <script>
    window.onafterprint = function () { window.close(); };
    document.fonts.ready.then(function () {
      window.focus();
      window.setTimeout(function () { window.print(); }, 100);
    });
  </script>
</body>
</html>`);
    printWindow.document.close();

    await new Promise<void>((resolve) => {
      printWindow.addEventListener('afterprint', () => {
        printWindow.close();
        resolve();
      }, { once: true });
    });
  } catch (error) {
    printWindow.close();
    throw error;
  }
}

async function loadApplicationFont(fontFileName: string): Promise<Uint8Array> {
  const response = await fetch(`/fonts/${fontFileName}`);
  const contentType = response.headers.get('content-type') ?? '';
  if (!response.ok || contentType.includes('text/html')) {
    throw missingFontError(fontFileName);
  }

  const fontData = new Uint8Array(await response.arrayBuffer());
  const signature = String.fromCharCode(...fontData.subarray(0, 4));
  if (signature !== '\u0000\u0001\u0000\u0000' && signature !== 'true') {
    throw missingFontError(fontFileName);
  }
  return fontData;
}

function missingFontError(fontFileName: string): Error {
  return new Error(
    `A valid TrueType font is required. Add ${fontFileName} to public/fonts/ and try again.`,
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}
