import { useMemo, useState } from 'react';
import { Download, FileText, Inbox, Printer } from 'lucide-react';
import type { MediationRecord } from '@/types';
import { MONTHS } from '@/lib/options';
import { formatDateDMY, formatMediationDatesStacked } from '@/lib/format';
import { recordsToCsv, downloadCsv } from '@/lib/csv';

interface DashboardProps {
  records: MediationRecord[];
  onDelete: (id: string) => void;
}

const REPORT_YEARS = ['2024', '2025', '2026', '2027'];

export function Dashboard({ records, onDelete }: DashboardProps) {
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const filtered = useMemo(() => {
    return records
      .filter((r) => {
        if (filterMonth && r.statementMonth !== filterMonth) return false;
        if (filterYear && r.statementYear !== filterYear) return false;
        return true;
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [records, filterMonth, filterYear]);

  const totals = useMemo(() => {
    const successful = filtered.filter((r) => r.decision === 'Successful').length;
    const unsuccessful = filtered.filter((r) => r.decision === 'Unsuccessful').length;
    const remuSum = filtered.reduce((sum, r) => {
      const n = Number(r.remu);
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
    return { total: filtered.length, successful, unsuccessful, remuSum };
  }, [filtered]);

  const hasPeriod = filterMonth && filterYear;

  const handleExportCsv = () => {
    const csv = recordsToCsv(filtered);
    const monthLabel = filterMonth ? filterMonth.slice(0, 3) : 'All';
    const yearLabel = filterYear || 'All';
    downloadCsv(`mediation_${monthLabel}_${yearLabel}.csv`, csv);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar — hidden in print */}
      <div className="no-print rounded-xl border border-ink-200 bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500" htmlFor="f-month">
                Month
              </label>
              <select
                id="f-month"
                className="field-select min-w-[140px]"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
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
              <label className="mb-1 block text-xs font-medium text-ink-500" htmlFor="f-year">
                Year
              </label>
              <select
                id="f-year"
                className="field-select min-w-[110px]"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
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
          <div className="flex flex-wrap gap-2">
            <button
              className="btn-primary"
              onClick={handlePrint}
              disabled={filtered.length === 0}
            >
              <Printer className="h-4 w-4" />
              Download PDF
            </button>
            <button
              className="btn-ghost"
              onClick={handleExportCsv}
              disabled={filtered.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
        {!hasPeriod && (
          <p className="mt-3 text-xs text-ink-400">
            Select a specific month and year to generate the official statement report.
          </p>
        )}
      </div>

      {/* Report — visible in print */}
      {filtered.length === 0 ? (
        <div className="no-print flex flex-col items-center justify-center rounded-xl border border-ink-200 bg-white px-6 py-20 text-center shadow-card">
          <Inbox className="mb-3 h-10 w-10 text-ink-300" />
          <p className="text-sm font-medium text-ink-500">
            {hasPeriod
              ? `No records found for ${filterMonth} ${filterYear}`
              : 'No records match the current filters'}
          </p>
          <p className="mt-1 text-xs text-ink-400">
            Adjust the filters above or add a new record on the Entry tab.
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
                        {r.caseNoPrefix} {r.caseNoNumber}/{r.caseNoYear}
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
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-700">
            <FileText className="h-4 w-4 text-gold-500" />
            Manage Records ({filtered.length})
          </h3>
          <div className="space-y-2">
            {filtered.map((r) => (
              <RecordRow key={r.id} record={r} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecordRow({
  record,
  onDelete,
}: {
  record: MediationRecord;
  onDelete: (id: string) => void;
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
        <span className="font-medium">{record.statementMonth} {record.statementYear}</span>
      </div>
      <button
        onClick={() => setConfirm(true)}
        className="text-xs font-medium text-ink-400 transition hover:text-red-500"
      >
        Delete
      </button>
    </div>
  );
}
