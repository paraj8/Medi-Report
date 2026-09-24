import { AlertCircle } from 'lucide-react';
import { MONTHS } from '@/lib/options';

const REPORT_YEARS = ['2024', '2025', '2026', '2027', '2028'];

interface ReportFiltersProps {
  filterMonth: string;
  filterYear: string;
  onFilterMonthChange: (value: string) => void;
  onFilterYearChange: (value: string) => void;
  showPeriodValidation: boolean;
}

export function ReportFilters({
  filterMonth,
  filterYear,
  onFilterMonthChange,
  onFilterYearChange,
  showPeriodValidation,
}: ReportFiltersProps) {
  return (
    <section className="no-print mb-6 rounded-xl border border-ink-200 bg-white p-3 shadow-card sm:p-5">
      <h2 className="mb-3 text-sm font-semibold text-ink-700 sm:mb-4">
        Report Period
      </h2>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <label
          className="text-xs font-medium text-ink-500"
          htmlFor="f-month"
        >
          Month
          <select
            id="f-month"
            className={`field-select mt-1 w-full ${showPeriodValidation && !filterMonth ? 'border-red-400 ring-2 ring-red-200' : ''}`}
            value={filterMonth}
            onChange={(event) => onFilterMonthChange(event.target.value)}
          >
            <option value="">All months</option>

            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <label
          className="text-xs font-medium text-ink-500"
          htmlFor="f-year"
        >
          Year
          <select
            id="f-year"
            className={`field-select mt-1 w-full ${showPeriodValidation && !filterYear ? 'border-red-400 ring-2 ring-red-200' : ''}`}
            value={filterYear}
            onChange={(event) => onFilterYearChange(event.target.value)}
          >
            <option value="">All years</option>

            {REPORT_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {showPeriodValidation && (!filterMonth || !filterYear) && (
        <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3.5 w-3.5" />
          Please select Month and Year first.
        </p>
      )}
    </section>
  );
}