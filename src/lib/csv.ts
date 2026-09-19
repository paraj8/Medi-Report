import type { MediationRecord } from '@/types';
import { formatDateDMY } from './format';

const HEADERS = [
  'Mediation Case No.',
  'Decision',
  'Case No.',
  'Reff. Date',
  'First Party',
  'Second Party',
  'Date(s) of Mediation',
  'Name of Court',
  'Remuneration',
  'Created At',
];

function escapeCsv(value: string): string {
  const needsQuote = /[",\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

function recordToRow(r: MediationRecord): string {
  const mediationCaseNo = `${r.mediationCasePart}/${r.mediationCaseYear}`;
  const caseNo = `${r.caseNoPrefix} ${r.caseNoNumber}/${r.caseNoYear}`;
  const remuLabel = `₹${Number(r.remu || 0).toLocaleString('en-IN')}/-`;
  const mediationDates = (r.mediationDates || []).map(formatDateDMY).join(', ');
  const reffDate = r.reffDate ? formatDateDMY(r.reffDate) : '';
  return [
    mediationCaseNo,
    r.decision,
    caseNo,
    reffDate,
    r.firstParty,
    r.secondParty,
    mediationDates,
    r.nameOfCourt,
    remuLabel,
    new Date(r.createdAt).toLocaleString('en-IN'),
  ]
    .map((v) => escapeCsv(String(v ?? '')))
    .join(',');
}

export function recordsToCsv(records: MediationRecord[]): string {
  const rows = records.map(recordToRow);
  return [HEADERS.join(','), ...rows].join('\n');
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
