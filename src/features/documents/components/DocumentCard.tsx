import { FileDown, FileText, Loader2, Printer } from 'lucide-react';

export function DocumentCard({
  title,
  description,
  onPrint,
  onGenerate,
  disabled,
  printLoading,
  generateLoading,
}: {
  title: string;
  description: string;
  onPrint: () => void;
  onGenerate: () => void;
  disabled: boolean;
  printLoading: boolean;
  generateLoading: boolean;
}) {
  return (
    <section className="rounded-xl border border-ink-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-lg bg-gold-50 p-2 text-gold-600">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-ink-900">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-500">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPrint}
          disabled={disabled}
          className="btn-ghost min-h-10 px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {printLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
          {printLoading ? 'Preparing…' : 'Print'}
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled}
          className="btn-primary min-h-10 px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
          {generateLoading ? 'Generating…' : 'Generate PDF'}
        </button>
      </div>
    </section>
  );
}
