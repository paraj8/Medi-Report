import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  GripVertical,
  ListOrdered,
  Pencil,
  FileText,
  Inbox,
  FileDown,
  Printer,
} from 'lucide-react';
import type { MediationRecord } from '@/types';
import { MONTHS } from '@/lib/options';
import {
  formatDateDMY,
  formatMediationDatesStacked,
} from '@/lib/format';
import { recordsToCsv, downloadCsv } from '@/lib/csv';
import { generateMediationReport } from '@/lib/pdf';

interface DashboardProps {
  records: MediationRecord[];
  onDelete: (id: string) => void;
  onEdit: (record: MediationRecord) => void;
  onReorder: (records: MediationRecord[]) => void;
  filterMonth: string;
  filterYear: string;
  onFilterMonthChange: (value: string) => void;
  onFilterYearChange: (value: string) => void;
}

const REPORT_YEARS = ['2024', '2025', '2026', '2027', '2028'];

export function Dashboard({
  records,
  onDelete,
  onEdit,
  onReorder,
  filterMonth,
  filterYear,
  onFilterMonthChange,
  onFilterYearChange,
}: DashboardProps) {

const orderedRecords = useMemo(
  () => [...records].sort((a, b) => a.sortOrder - b.sortOrder),
  [records],
);
const [isArrangeOpen, setIsArrangeOpen] = useState(false);

const filtered = useMemo(() => {
  return orderedRecords.filter((r) => r.reffDate);
}, [orderedRecords]);

useEffect(() => {
  if (!isArrangeOpen) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setIsArrangeOpen(false);
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isArrangeOpen]);

const totals = useMemo(() => {
  const successful = filtered.filter(
    (r) => r.decision === 'Successful'
  ).length;

  const unsuccessful = filtered.filter(
    (r) => r.decision === 'Unsuccessful'
  ).length;

  const remuSum = filtered.reduce((sum, r) => {
    const n = Number(r.remu);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);

  return {
    total: filtered.length,
    successful,
    unsuccessful,
    remuSum,
  };
}, [filtered]);

const handleExportCsv = () => {
  const csv = recordsToCsv(filtered);

  const monthLabel = filterMonth
    ? filterMonth.slice(0, 3)
    : 'All';

  const yearLabel = filterYear || 'All';

  downloadCsv(`mediation_${monthLabel}_${yearLabel}.csv`, csv);
};

const handleDownloadPdf = () => {
  generateMediationReport(filtered, {
    month: filterMonth,
    year: filterYear,
  });
};

const handlePrint = () => {
  window.print();
};

  return (
<div className="space-y-6">
  {/* Toolbar — hidden in print */}
  <div className="no-print rounded-xl border border-ink-200 bg-white p-5 shadow-card sm:p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label
            className="mb-1 block text-xs font-medium text-ink-500"
            htmlFor="f-month"
          >
            Month
          </label>

          <select
            id="f-month"
            className="field-select min-w-[140px]"
            value={filterMonth}
            onChange={(e) => onFilterMonthChange(e.target.value)}
          >
            <option value="">All months</option>

            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="mb-1 block text-xs font-medium text-ink-500"
            htmlFor="f-year"
          >
            Year
          </label>

          <select
            id="f-year"
            className="field-select min-w-[110px]"
            value={filterYear}
            onChange={(e) => onFilterYearChange(e.target.value)}
          >
            <option value="">All years</option>

            {REPORT_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {/* Print */}
        <button
          className="btn-ghost"
          onClick={handlePrint}
          disabled={filtered.length === 0}
          title="Print report"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>

        {/* Download PDF */}
        <button
          className="btn-primary"
          onClick={handleDownloadPdf}
          disabled={filtered.length === 0}
          title="Download PDF"
        >
          <FileDown className="h-4 w-4" />
          Download PDF
        </button>

        {/* Export CSV */}
        <button
          className="btn-ghost"
          onClick={handleExportCsv}
          disabled={filtered.length === 0}
          title="Export CSV"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>
    </div>
  </div>

      {/* Report — visible in print */}
      {filtered.length === 0 ? (
        <div className="no-print flex flex-col items-center justify-center rounded-xl border border-ink-200 bg-white px-6 py-20 text-center shadow-card">
          <Inbox className="mb-3 h-10 w-10 text-ink-300" />
            <p className="text-sm font-medium text-ink-500">
              No records found
            </p>
            <p className="mt-1 text-xs text-ink-400">
              Add a new record on the Entry tab.
            </p>
        </div>
      ) : (
        <div id="print-area" className="print-area rounded-xl border border-ink-200 bg-white p-8 shadow-card sm:p-10">
          {/* Letterhead */}
          <div className="mb-6 flex items-start justify-between gap-6">
            <div className="text-sm leading-relaxed text-ink-800">
              <p className="font-semibold">To,</p>
              <p>The Chairman D.L.S.A Sahibganj.</p>
            </div>
            <div className="text-right text-sm font-semibold text-ink-800">
              <p>Statement of</p>
              <p>
                {filterMonth || 'All Months'} {filterYear || ''}.
              </p>
            </div>
          </div>

          {/* Data table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border border-ink-300 bg-ink-50 text-[10px] font-bold uppercase tracking-wider text-ink-700">
                  <th className="border border-ink-300 px-1.5 py-2 text-center">S.No.</th>
                  <th className="border border-ink-300 px-2 py-2">Mediation Case No.</th>
                  <th className="border border-ink-300 px-2 py-2">Name of Court</th>
                  <th className="border border-ink-300 px-2 py-2">Case No.</th>
                  <th className="border border-ink-300 px-2 py-2 whitespace-nowrap">Reff. Date</th>
                  <th className="border border-ink-300 px-2 py-2">1st Party</th>
                  <th className="border border-ink-300 px-2 py-2">2nd Party</th>
                  <th className="border border-ink-300 px-2 py-2">Date of Mediation</th>
                  <th className="border border-ink-300 px-2 py-2">Decision</th>
                  <th className="border border-ink-300 px-2 py-2 text-right">Remu</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const stackedDates = formatMediationDatesStacked(r.mediationDates);
                  return (
                    <tr key={r.id} className="border border-ink-300 text-ink-700 odd:bg-white even:bg-ink-50/30">
                      <td className="border border-ink-300 px-1.5 py-1.5 text-center font-medium">{i + 1}</td>
                      <td className="border border-ink-300 px-2 py-1.5 whitespace-nowrap font-medium text-ink-800">
                        {r.mediationCasePart}/{r.mediationCaseYear}
                      </td>
                      <td className="border border-ink-300 px-2 py-1.5">{r.nameOfCourt}</td>
                      <td className="border border-ink-300 px-2 py-1.5">
                        {r.caseNoPrefix} {r.caseNoNumber}{r.caseNoSuffix || ''}/{r.caseNoYear}
                      </td>
                      <td className="border border-ink-300 px-2 py-1.5 whitespace-nowrap">
                        {r.reffDate ? formatDateDMY(r.reffDate) : '—'}
                      </td>
                      <td className="border border-ink-300 px-2 py-1.5">{r.firstParty}</td>
                      <td className="border border-ink-300 px-2 py-1.5">{r.secondParty}</td>
                      <td className="border border-ink-300 px-2 py-1.5">
                        <div className="flex flex-col gap-0.5 leading-tight">
                          {stackedDates.map((d, di) => (
                            <span key={di}>{d}</span>
                          ))}
                        </div>
                      </td>
                      <td className="border border-ink-300 px-2 py-1.5">{r.decision}</td>
                      <td className="border border-ink-300 px-2 py-1.5 text-right whitespace-nowrap font-semibold">
                        {Number(r.remu || 0).toLocaleString('en-IN')}.00/-
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Aggregation footer */}
          <div className="relative mt-3 text-sm text-ink-800">
            {/* Centered */}
            <div className="flex justify-center gap-8">
              <span>
                <span className="font-semibold">Success</span> = {totals.successful}
              </span>
              <span>
                <span className="font-semibold">Unsuccess</span> = {totals.unsuccessful}
              </span>
            </div>

            {/* Under Remu column */}
            <div className="absolute right-0 top-0 font-bold whitespace-nowrap">
              Total = {totals.remuSum.toLocaleString('en-IN')}.00/-
            </div>
          </div>

          {/* Signature block */}
          <div className="mt-12 flex justify-end">
            <div className="text-center text-sm leading-relaxed text-ink-800">
              <p className="font-bold uppercase tracking-wide">Mediator</p>
              <p className="mt-1 font-semibold">Rabindra Nath Mandal</p>
              <p>Civil Court, Rajmahal</p>
            </div>
          </div>
        </div>
      )}

      {/* Record management list — hidden in print */}
      {filtered.length > 0 && (
        <div className="no-print rounded-xl border border-ink-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-700">
              <FileText className="h-4 w-4 text-gold-500" />
              Manage Records ({filtered.length})
            </h3>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setIsArrangeOpen(true)}
              disabled={orderedRecords.length < 2}
              title="Arrange records"
            >
              <ListOrdered className="h-4 w-4" />
              Arrange
            </button>
          </div>
          <div className="space-y-2">
            {filtered.map((r) => (
              <RecordRow key={r.id} record={r} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        </div>
      )}

      {isArrangeOpen && (
        <ArrangeModal
          records={orderedRecords}
          onClose={() => setIsArrangeOpen(false)}
          onSave={(nextRecords) => {
            onReorder(nextRecords);
            setIsArrangeOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ArrangeModal({
  records,
  onClose,
  onSave,
}: {
  records: MediationRecord[];
  onClose: () => void;
  onSave: (records: MediationRecord[]) => void;
}) {
  const [arrangedRecords, setArrangedRecords] = useState(records);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    setArrangedRecords((current) => {
      const fromIndex = current.findIndex((record) => record.id === draggedId);
      const toIndex = current.findIndex((record) => record.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return current;

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggedId(null);
  };

  const handleSave = () => {
    onSave(arrangedRecords.map((record, index) => ({ ...record, sortOrder: index })));
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(720px,calc(100vh-2rem))] w-full max-w-xl flex-col rounded-xl bg-white shadow-card-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="arrange-records-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-ink-100 px-5 py-4 sm:px-6">
          <h2 id="arrange-records-title" className="text-lg font-semibold text-ink-900">
            Arrange Records
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Drag and drop records to set their order.
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-5 sm:p-6">
          {arrangedRecords.map((record) => (
            <div
              key={record.id}
              draggable
              onDragStart={() => setDraggedId(record.id)}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(record.id)}
              className={`flex cursor-grab items-center gap-3 rounded-lg border px-3 py-3 text-sm transition active:cursor-grabbing ${
                draggedId === record.id
                  ? 'border-gold-400 bg-gold-50 opacity-60'
                  : 'border-ink-200 bg-ink-50/40 hover:border-ink-300 hover:bg-white'
              }`}
            >
              <GripVertical className="h-5 w-5 shrink-0 text-ink-400" aria-hidden="true" />
              <span className="min-w-0 truncate font-medium text-ink-800">
                {record.mediationCasePart}/{record.mediationCaseYear}
              </span>
              <span className="truncate text-ink-500">
                {record.firstParty} vs. {record.secondParty}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 border-t border-ink-100 px-5 py-4 sm:px-6">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
}

function RecordRow({
  record,
  onDelete,
  onEdit,
}: {
  record: MediationRecord;
  onDelete: (id: string) => void;
  onEdit: (record: MediationRecord) => void;
}) {
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
        <span className="text-xs font-medium text-red-700">Delete this record permanently?</span>
        <div className="flex gap-2">
          <button
            className="rounded-md bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
            onClick={() => onDelete(record.id)}
          >
            Delete
          </button>
          <button
            className="rounded-md border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600 hover:bg-ink-50"
            onClick={() => setConfirm(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-ink-100 bg-ink-50/40 px-4 py-2.5 transition hover:border-ink-200 hover:bg-white">
      <div className="flex items-center gap-3 text-xs text-ink-600">
        <span className="font-medium text-ink-800">
          {record.mediationCasePart}/{record.mediationCaseYear}
        </span>
        <span className="text-ink-400">|</span>
        <span>{record.firstParty} vs. {record.secondParty}</span>
        <span className="text-ink-400">|</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onEdit(record)}
          className="flex items-center gap-1 text-xs font-medium text-ink-500 transition hover:text-ink-900"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => setConfirm(true)}
          className="text-xs font-medium text-ink-400 transition hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
