import type { MediationRecord } from '@/types';

export interface ReportStatistics {
  successful: number;
  unsuccessful: number;
  remuneration: number;
}

export function getReportRecords(records: MediationRecord[]): MediationRecord[] {
  return [...records]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((record) => record.reffDate);
}

export function getReportStatistics(records: MediationRecord[]): ReportStatistics {
  return {
    successful: records.filter((record) => record.decision === 'Successful').length,
    unsuccessful: records.filter((record) => record.decision === 'Unsuccessful').length,
    remuneration: records.reduce((sum, record) => {
      const value = Number(record.remu);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0),
  };
}
