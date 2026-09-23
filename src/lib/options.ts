export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const YEARS = ['2024', '2025', '2026', '2027', '2028'];

export const DECISION_OPTIONS = ['Successful', 'Unsuccessful'];

export const CASE_NO_PREFIX_OPTIONS = [
  'Org. Suit. No.',
  'Org. Maint No.',
  'Org. (D) Suit. No.',
  'Org. (P) Suit No.',
  'A.B.P. No.',
  'CC no.',
  'G.R. Case No.',
  'Tinphar Ps. No',

];

export const COURT_OPTIONS = [
  'The Addl Pr. Judge Addl. Family Court Rajmahal',
  'The S.D.J.M Rajmahal Sahibganj',
  'The Sr. Civil Judge 1st Rajmahal Sahibganj',
  'The A.C.J.M. Rajmahal',
  'The dist. & Addl Session Judge-1 Rajmahal',
  'Miss Mansi J.M. 1st class Rajmahal Sahibganj',
];

export const REMU_OPTIONS = ['5000', '2500', '1000'];

export const OTHER = 'Other';

export function withOther(options: string[]): string[] {
  return [...options, OTHER];
}
