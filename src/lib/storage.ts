import type { MediationRecord } from '@/types';
import { supab } from './supabaseClient';

const STORAGE_KEY = 'mediation_records_v2';

// ── Column ↔ field mapping ──────────────────────────────────────
// Supabase uses snake_case columns; the TS interface uses camelCase.

interface DbRow {
  id: string;
  mediation_case_part: string;
  mediation_case_year: string;
  name_of_court: string;
  case_no_prefix: string;
  case_no_number: string;
  case_no_suffix: string;
  case_no_year: string;
  reff_date: string;
  first_party: string;
  second_party: string;
  mediation_dates: string[];
  decision: string;
  remu: string;
  sort_order: number;
  created_at: string;
}

function dbRowToRecord(row: DbRow): MediationRecord {
  return {
    id: row.id,
    mediationCasePart: row.mediation_case_part ?? '',
    mediationCaseYear: row.mediation_case_year ?? '',
    nameOfCourt: row.name_of_court ?? '',
    caseNoPrefix: row.case_no_prefix ?? '',
    caseNoNumber: row.case_no_number ?? '',
    caseNoSuffix: row.case_no_suffix ?? '',
    caseNoYear: row.case_no_year ?? '',
    reffDate: row.reff_date ?? '',
    firstParty: row.first_party ?? '',
    secondParty: row.second_party ?? '',
    mediationDates: Array.isArray(row.mediation_dates) ? row.mediation_dates : [],
    decision: row.decision ?? '',
    remu: row.remu ?? '0',
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function recordToDbRow(record: MediationRecord): Omit<DbRow, 'created_at'> {
  return {
    id: record.id,
    mediation_case_part: record.mediationCasePart,
    mediation_case_year: record.mediationCaseYear,
    name_of_court: record.nameOfCourt,
    case_no_prefix: record.caseNoPrefix,
    case_no_number: record.caseNoNumber,
    case_no_suffix: record.caseNoSuffix,
    case_no_year: record.caseNoYear,
    reff_date: record.reffDate,
    first_party: record.firstParty,
    second_party: record.secondParty,
    mediation_dates: record.mediationDates,
    decision: record.decision,
    remu: record.remu,
    sort_order: record.sortOrder,
  };
}

export function normalizeRecords(records: MediationRecord[]): MediationRecord[] {
  return records
    .map((record, index) => ({
      ...record,
      caseNoSuffix: record.caseNoSuffix ?? '',
      sortOrder: typeof record.sortOrder === 'number' ? record.sortOrder : index,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((record, index) => ({ ...record, sortOrder: index }));
}

// ── LocalStorage helpers (primary data source) ─────────────────

export function loadRecords(): MediationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return normalizeRecords(parsed as MediationRecord[]);
  } catch {
    return [];
  }
}

export function saveRecords(records: MediationRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* storage full / unavailable — silently ignore */
  }
}

export function generateId(): string {
  return `rec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Manual cloud actions ────────────────────────────────────────

export type CloudActionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CloudActionResult {
  status: CloudActionStatus;
  message: string;
  records?: MediationRecord[];
  filterMonth?: string;
  filterYear?: string;
}

/**
 * Upload the complete local dataset to Supabase.
 * Cloud rows that no longer exist locally are deleted so the cloud
 * dataset exactly matches the local dataset.
 */
export async function updateCloud(
  records: MediationRecord[],
  filterMonth: string,
  filterYear: string,
): Promise<CloudActionResult> {
  try {
    // 1. Delete all cloud rows first so cloud matches local exactly
    const { error: delErr } = await supab
      .from('mediation_records')
      .delete()
      .neq('id', '____never_matches____');

    if (delErr) throw delErr;

    // 2. Insert all local rows (if any)
    if (records.length > 0) {
      const rows = records.map(recordToDbRow);
      const { error: insErr } = await supab
        .from('mediation_records')
        .insert(rows);

      if (insErr) throw insErr;
    }

    const { error: settingsErr } = await supab
      .from('mediation_settings')
      .upsert({ id: 'default', filter_month: filterMonth, filter_year: filterYear });

    if (settingsErr) throw settingsErr;

    return {
      status: 'success',
      message: `Uploaded ${records.length} record${records.length !== 1 ? 's' : ''} to cloud`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { status: 'error', message: `Upload failed: ${msg}` };
  }
}

/**
 * Fetch the complete dataset from Supabase and replace local storage.
 */
export async function syncFromCloud(): Promise<CloudActionResult> {
  try {
    const { data, error } = await supab
      .from('mediation_records')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const { data: settings, error: settingsErr } = await supab
      .from('mediation_settings')
      .select('filter_month, filter_year')
      .eq('id', 'default')
      .maybeSingle();

    if (settingsErr) throw settingsErr;

    const cloudRecords = normalizeRecords((data as DbRow[]).map(dbRowToRecord));
    saveRecords(cloudRecords);

    return {
      status: 'success',
      message: `Downloaded ${cloudRecords.length} record${cloudRecords.length !== 1 ? 's' : ''} from cloud`,
      records: cloudRecords,
      filterMonth: settings?.filter_month ?? '',
      filterYear: settings?.filter_year ?? '',
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { status: 'error', message: `Download failed: ${msg}` };
  }
}
