import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { MediationRecord } from '@/types';
import {
  formatDateDMY,
  formatMediationDatesStacked,
} from './format';

export interface ReportFilters {
  month: string;
  year: string;
}

export function generateMediationReport(
  records: MediationRecord[],
  filters: ReportFilters,
): void {
  // =========================================================
  // PDF DOCUMENT
  // =========================================================

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // A4 landscape = 297 × 210 mm
  const margin = 12;
  const usableWidth = pageWidth - margin * 2;

  // =========================================================
  // COLORS
  // =========================================================

  const borderColor: [number, number, number] = [51, 51, 51];
  const headerColor: [number, number, number] = [236, 238, 242];
  const textColor: [number, number, number] = [30, 30, 30];

  // =========================================================
  // LETTERHEAD
  // =========================================================

  doc.setTextColor(...textColor);

  // Left side
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);

  doc.text('To,', margin, 20);

  doc.text(
    'The Chairman D.L.S.A Sahibganj.',
    margin,
    25,
  );

  // Right side statement heading
  const statementTitle = 'Statement of';

  const statementPeriod = `${filters.month || 'All Months'} ${
    filters.year || ''
  }.`.trim();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);

  // Keep both lines aligned to the same right edge
  doc.text(
    statementTitle,
    pageWidth - margin,
    20,
    {
      align: 'right',
    },
  );

  doc.text(
    statementPeriod,
    pageWidth - margin,
    25,
    {
      align: 'right',
    },
  );

  // =========================================================
  // TABLE HEADER
  // =========================================================

  const head = [
    [
      'S.No.',
      'Mediation\nCase No.',
      'Name of Court',
      'Case No.',
      'Reff. Date',
      '1st Party',
      '2nd Party',
      'Date of Mediation',
      'Decision',
      'Remu.',
    ],
  ];

  // =========================================================
  // TABLE BODY
  // =========================================================

  const body = records.map((r, i) => {
    const stackedDates = formatMediationDatesStacked(
      r.mediationDates,
    );

    const remu = Number(r.remu);

    return [
      String(i + 1),

      `${r.mediationCasePart}/${r.mediationCaseYear}`,

      r.nameOfCourt,

      `${r.caseNoPrefix}\n${r.caseNoNumber}${r.caseNoSuffix || ''}/${r.caseNoYear}`,

      r.reffDate
        ? formatDateDMY(r.reffDate)
        : '—',

      r.firstParty,

      r.secondParty,

      stackedDates.join('\n'),

      r.decision,

      Number.isFinite(remu)
        ? `${remu.toLocaleString('en-IN')}.00/-`
        : '0.00/-',
    ];
  });

  // =========================================================
  // TOTALS
  // =========================================================

  const successful = records.filter(
    (r) => r.decision === 'Successful',
  ).length;

  const unsuccessful = records.filter(
    (r) => r.decision === 'Unsuccessful',
  ).length;

  const remuSum = records.reduce((sum, r) => {
    const value = Number(r.remu);

    return (
      sum +
      (Number.isFinite(value) ? value : 0)
    );
  }, 0);

  // =========================================================
  // TABLE
  // =========================================================

  autoTable(doc, {
    head,
    body,

    // More space between letterhead and table
    startY: 28,

    margin: {
      left: margin,
      right: margin,
    },

    tableWidth: usableWidth,

    theme: 'grid',

    styles: {
      font: 'helvetica',

      // Increased from 8 → 9
      fontSize: 9,

      // Slightly more comfortable spacing
      cellPadding: 2.1,

      textColor,
      lineColor: borderColor,
      lineWidth: 0.2,

      valign: 'middle',
      overflow: 'linebreak',

      cellWidth: 'wrap',
    },

    headStyles: {
      fillColor: headerColor,
      textColor,

      fontStyle: 'bold',

      // Increased from 7.5 → 8.5
      fontSize: 8.5,

      halign: 'left',
      valign: 'middle',

      lineColor: borderColor,
      lineWidth: 0.2,

      cellPadding: 2.3,
    },

    columnStyles: {
      // Total = 273 mm
      // A4 landscape = 297 mm
      // Margins = 12 + 12
      // Usable width = 273 mm

      0: {
        halign: 'center',
        cellWidth: 12,
      },

      1: {
        halign: 'left',
        cellWidth: 20,
      },

      2: {
        halign: 'left',
        cellWidth: 42,
      },

      3: {
        halign: 'left',
        cellWidth: 30,
      },

      4: {
        halign: 'left',
        cellWidth: 22,
      },

      5: {
        halign: 'left',
        cellWidth: 42,
      },

      6: {
        halign: 'left',
        cellWidth: 42,
      },

      7: {
        halign: 'left',
        cellWidth: 22,
      },

      8: {
        halign: 'left',
        cellWidth: 23,
      },

      9: {
        halign: 'right',
        cellWidth: 20,
      },
    },

    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },

    didParseCell: (data) => {
      // ---------------------------------------------
      // Bold important columns
      // ---------------------------------------------

      if (
        data.section === 'body' &&
        (
          data.column.index === 0 ||
          data.column.index === 1
        )
      ) {
        data.cell.styles.fontStyle = 'bold';
      }

      if (
        data.section === 'body' &&
        data.column.index === 9
      ) {
        data.cell.styles.fontStyle = 'bold';
      }

      // ---------------------------------------------
      // Header alignment
      // ---------------------------------------------

      // S.No. → center
        if (data.column.index === 0) {
          data.cell.styles.halign = 'center';
        }

        // Remu. → right
        else if (data.column.index === 9) {
          data.cell.styles.halign = 'right';
        }

        // Everything else → left
        else {
          data.cell.styles.halign = 'left';
        }
      },
            
  });

  // =========================================================
  // GET TABLE END POSITION
  // =========================================================

  const lastAutoTable = (
    doc as unknown as {
      lastAutoTable?: {
        finalY: number;
      };
    }
  ).lastAutoTable;

  const tableEndY =
    lastAutoTable?.finalY ?? 28;

  // =========================================================
  // TOTALS FOOTER
  // =========================================================

  const totalsY = tableEndY + 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...textColor);

  const successText = `Success = ${successful}`;

  const unsuccessText =
    `Unsuccess = ${unsuccessful}`;

  const totalText =
    `Total = ${remuSum.toLocaleString('en-IN')}.00/-`;

  // ---------------------------------------------
  // Success + Unsuccess centered
  // ---------------------------------------------

  const successWidth =
    doc.getTextWidth(successText);

  const unsuccessWidth =
    doc.getTextWidth(unsuccessText);

  const gap = 24;

  const combinedWidth =
    successWidth +
    gap +
    unsuccessWidth;

  const centerStart =
    pageWidth / 2 -
    combinedWidth / 2;

  doc.text(
    successText,
    centerStart,
    totalsY,
  );

  doc.text(
    unsuccessText,
    centerStart +
      successWidth +
      gap,
    totalsY,
  );

  // ---------------------------------------------
  // Total aligned right
  // ---------------------------------------------

  doc.text(
    totalText,
    pageWidth - margin,
    totalsY,
    {
      align: 'right',
    },
  );

// =========================================================
// SIGNATURE
// =========================================================

let signatureY = totalsY + 18;

if (signatureY > pageHeight - 15) {
  doc.addPage();
  signatureY = 30;
}

const signatureCenterX = pageWidth - margin - 18;

doc.setFont('helvetica', 'bold');
doc.setFontSize(11);

doc.text(
  'Mediator',
  signatureCenterX,
  signatureY,
  {
    align: 'center',
  },
);

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);

doc.text(
  'Rabindra Nath Mandal',
  signatureCenterX,
  signatureY + 5,
  {
    align: 'center',
  },
);

doc.text(
  'Civil Court, Rajmahal',
  signatureCenterX,
  signatureY + 10,
  {
    align: 'center',
  },
);

  // =========================================================
  // SAVE PDF
  // =========================================================

  const monthLabel = filters.month
    ? filters.month.slice(0, 3)
    : 'All';

  const yearLabel =
    filters.year || 'All';

  doc.save(
    `mediation_${monthLabel}_${yearLabel}.pdf`,
  );
}