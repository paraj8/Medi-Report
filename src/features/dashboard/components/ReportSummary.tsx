
export function ReportSummary({
  successful,
  unsuccessful,
  remuneration,
}: {
  successful: number;
  unsuccessful: number;
  remuneration: number;
}) {
  return (
    <div className="relative mt-3 min-h-5 text-sm text-ink-800">
      {/* Success + Unsuccess — left on phone, centered on desktop */}
      <div className="flex justify-start gap-6 sm:justify-center">
        <span>
          <span className="font-semibold">Success</span> = {successful}
        </span>

        <span>
          <span className="font-semibold">Unsuccess</span> = {unsuccessful}
        </span>
      </div>

      {/* Total — aligned with the right edge of the report */}
      <div className="absolute right-0 top-0 font-bold whitespace-nowrap">
        Total = {remuneration.toLocaleString('en-IN')}.00/-
      </div>
    </div>
  );
}

