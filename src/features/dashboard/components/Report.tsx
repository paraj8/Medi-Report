
import { Inbox } from 'lucide-react';
import type { MediationRecord } from '@/types';
import {
  formatDateDMY,
  formatMediationDatesStacked,
} from '@/lib/format';
import { ReportSummary } from './ReportSummary';

export function Report({
  records,
  filterMonth,
  filterYear,
  successful,
  unsuccessful,
  remuneration,
}: {
  records: MediationRecord[];
  filterMonth: string;
  filterYear: string;
  successful: number;
  unsuccessful: number;
  remuneration: number;
}) {
  if (records.length === 0) {
    return (
      <div className="no-print flex flex-col items-center justify-center rounded-xl border border-ink-200 bg-white px-6 py-20 text-center shadow-card">
        <Inbox className="mb-3 h-10 w-10 text-ink-300" />

        <p className="text-sm font-medium text-ink-500">
          No records found
        </p>

        <p className="mt-1 text-xs text-ink-400">
          Add a new record on the Entry tab.
        </p>
      </div>
    );
  }

  return (
    <div
      id="print-area"
      className="print-area rounded-xl border border-ink-200 bg-white p-4 shadow-card sm:p-8 lg:p-10"
    >
      {/* Letterhead */}
      <div className="mb-6 flex items-start justify-between gap-4 text-sm leading-relaxed text-ink-800 sm:gap-6">
        <div>
          <p className="font-semibold">To,</p>
          <p>The Chairman D.L.S.A Sahibganj.</p>
        </div>

        <div className="text-right font-semibold">
          <p>Statement of</p>
          <p>
            {filterMonth || 'All Months'} {filterYear || ''}.
          </p>
        </div>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left text-xs">

            <thead>
            <tr className="border border-ink-300 bg-ink-50 text-[10px] font-bold uppercase tracking-wider text-ink-700">
                {[
                'S.No.',
                'Mediation Case No.',
                'Name of Court',
                'Case No.',
                'Reff. Date',
                '1st Party',
                '2nd Party',
                'Date of Mediation',
                'Decision',
                'Remu',
                ].map((heading, index) => (
                <th
                    key={heading}
                    className={`border border-ink-300 px-2 py-2 ${
                    index === 9 ? 'text-right' : ''
                    }`}
                >
                    {heading}
                </th>
                ))}
            </tr>
            </thead>

          <tbody>
            {records.map((record, index) => (
              <ReportRow
                key={record.id}
                record={record}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <ReportSummary
        successful={successful}
        unsuccessful={unsuccessful}
        remuneration={remuneration}
      />

      {/* Signature */}
      <div className="mt-12 flex justify-end">
        <div className="text-center text-sm leading-relaxed text-ink-800">
          <p className="font-bold uppercase tracking-wide">
            Mediator
          </p>

          <p className="mt-1 font-semibold">
            Rabindra Nath Mandal
          </p>

          <p>Civil Court, Rajmahal</p>
        </div>
      </div>
    </div>
  );
}

function ReportRow({
  record,
  index,
}: {
  record: MediationRecord;
  index: number;
}) {
  return (
    <tr className="border border-ink-300 text-ink-700 odd:bg-white even:bg-ink-50/30">
      {/* S.No. */}
      <td className="border border-ink-300 px-1.5 py-1.5 text-center font-medium">
        {index + 1}
      </td>

      {/* Mediation Case No. */}
      <td className="whitespace-nowrap border border-ink-300 px-2 py-1.5 font-medium text-ink-800">
        {record.mediationCasePart}/{record.mediationCaseYear}
      </td>

      {/* Court */}
      <td className="border border-ink-300 px-2 py-1.5">
        {record.nameOfCourt}
      </td>

      {/* Case No. */}
      <td className="border border-ink-300 px-2 py-1.5">
        {record.caseNoPrefix} {record.caseNoNumber}
        {record.caseNoSuffix || ''}/{record.caseNoYear}
      </td>

      {/* Reference Date */}
      <td className="whitespace-nowrap border border-ink-300 px-2 py-1.5">
        {record.reffDate ? formatDateDMY(record.reffDate) : '—'}
      </td>

      {/* 1st Party */}
      <td className="border border-ink-300 px-2 py-1.5">
        {record.firstParty}
      </td>

      {/* 2nd Party */}
      <td className="border border-ink-300 px-2 py-1.5">
        {record.secondParty}
      </td>

      {/* Mediation Dates */}
      <td className="border border-ink-300 px-2 py-1.5">
        <div className="flex flex-col gap-0.5 leading-tight">
          {formatMediationDatesStacked(record.mediationDates).map(
            (date, dateIndex) => (
              <span key={dateIndex}>{date}</span>
            ),
          )}
        </div>
      </td>

      {/* Decision */}
      <td className="border border-ink-300 px-2 py-1.5 text-left font-medium">
        {record.decision}
      </td>

      {/* Remuneration */}
      <td className="whitespace-nowrap border border-ink-300 px-2 py-1.5 text-right font-semibold">
        {Number(record.remu || 0).toLocaleString('en-IN')}.00/-
      </td>
    </tr>
  );
}

