import { useEffect, useMemo, useState } from 'react';
import type { MediationRecord } from '@/types';
import { recordsToCsv, downloadCsv } from '@/lib/csv';
import { generateMediationReport } from '@/lib/pdf';
import type { CloudActionStatus } from '@/lib/storage';
import { DashboardActions } from '@/features/dashboard/components/DashboardActions';
import { ReportFilters } from '@/features/dashboard/components/ReportFilters';
import { Report } from '@/features/dashboard/components/Report';
import { RecordManagement } from '@/features/dashboard/components/RecordManagement';
import { ArrangeModal } from '@/features/dashboard/components/ArrangeModal';

interface DashboardProps {
  records: MediationRecord[];
  onDelete: (id: string) => void;
  onEdit: (record: MediationRecord) => void;
  onReorder: (records: MediationRecord[]) => void;
  filterMonth: string;
  filterYear: string;
  onFilterMonthChange: (value: string) => void;
  onFilterYearChange: (value: string) => void;
  uploadStatus?: CloudActionStatus;
  uploadMsg?: string;
  downloadStatus?: CloudActionStatus;
  downloadMsg?: string;
  onUpdateCloud?: () => void;
  onSyncFromCloud?: () => void;
}

export function Dashboard({ records, onDelete, onEdit, onReorder, filterMonth, filterYear, onFilterMonthChange, onFilterYearChange, uploadStatus = 'idle', uploadMsg = '', downloadStatus = 'idle', downloadMsg = '', onUpdateCloud = () => undefined, onSyncFromCloud = () => undefined }: DashboardProps) {
  const orderedRecords = useMemo(() => [...records].sort((a, b) => a.sortOrder - b.sortOrder), [records]);
  const filtered = useMemo(() => orderedRecords.filter((record) => record.reffDate), [orderedRecords]);
  const [isArrangeOpen, setIsArrangeOpen] = useState(false);
  const [showPeriodValidation, setShowPeriodValidation] = useState(false);

  useEffect(() => {
    if (!isArrangeOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsArrangeOpen(false); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isArrangeOpen]);

  const totals = useMemo(() => ({
    successful: filtered.filter((record) => record.decision === 'Successful').length,
    unsuccessful: filtered.filter((record) => record.decision === 'Unsuccessful').length,
    remuneration: filtered.reduce((sum, record) => { const value = Number(record.remu); return sum + (Number.isFinite(value) ? value : 0); }, 0),
  }), [filtered]);

  const isReportPeriodSelected = Boolean(filterMonth && filterYear);

  useEffect(() => {
    if (isReportPeriodSelected) setShowPeriodValidation(false);
  }, [isReportPeriodSelected]);

  const handleExportCsv = () => downloadCsv(`mediation_${filterMonth ? filterMonth.slice(0, 3) : 'All'}_${filterYear || 'All'}.csv`, recordsToCsv(filtered));
  const handleDownloadPdf = () => generateMediationReport(filtered, { month: filterMonth, year: filterYear });

  return <div className="space-y-6">
    <DashboardActions onUpdateCloud={onUpdateCloud} onSyncFromCloud={onSyncFromCloud} onPrint={() => window.print()} onDownloadPdf={handleDownloadPdf} onExportCsv={handleExportCsv} uploadStatus={uploadStatus} uploadMsg={uploadMsg} downloadStatus={downloadStatus} downloadMsg={downloadMsg} recordCount={records.length} reportCount={filtered.length} isReportPeriodSelected={isReportPeriodSelected} onPeriodValidation={() => setShowPeriodValidation(true)} />
    <ReportFilters filterMonth={filterMonth} filterYear={filterYear} onFilterMonthChange={onFilterMonthChange} onFilterYearChange={onFilterYearChange} showPeriodValidation={showPeriodValidation} />
    <Report records={filtered} filterMonth={filterMonth} filterYear={filterYear} {...totals} />
    {filtered.length > 0 && <RecordManagement records={filtered} totalRecords={orderedRecords.length} onDelete={onDelete} onEdit={onEdit} onArrange={() => setIsArrangeOpen(true)} />}
    {isArrangeOpen && <ArrangeModal records={orderedRecords} onClose={() => setIsArrangeOpen(false)} onSave={(nextRecords) => { onReorder(nextRecords); setIsArrangeOpen(false); }} />}
  </div>;
}
