import type { MediationRecord } from '@/types';

const STORAGE_KEY = 'mediation_records_v1';

export function loadRecords(): MediationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as MediationRecord[];
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
