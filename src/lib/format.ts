import { MONTHS } from './options';

export function formatRupees(amount: number): string {
  if (Number.isNaN(amount)) return '₹0/-';
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${formatted}/-`;
}

export function monthNumber(monthName: string): number {
  const idx = MONTHS.indexOf(monthName);
  return idx >= 0 ? idx + 1 : 0;
}

export function monthShort(monthName: string): string {
  return monthName ? monthName.slice(0, 3) : '';
}

/** Format an ISO date string (yyyy-mm-dd) as dd-mm-yyyy for statement display. */
export function formatDateDMY(iso: string): string {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  return `${d}-${m}-${y}`;
}

/** Join an array of ISO date strings into a comma-separated display string (for CSV). */
export function formatMediationDates(dates: string[]): string {
  if (!dates || dates.length === 0) return '—';
  return dates.map(formatDateDMY).join(', ');
}

/** Format mediation dates as an array of display strings for stacked (vertical) rendering. */
export function formatMediationDatesStacked(dates: string[]): string[] {
  if (!dates || dates.length === 0) return ['—'];
  return dates.map(formatDateDMY);
}
