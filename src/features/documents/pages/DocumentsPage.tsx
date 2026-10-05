import { useMemo, useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import type { MediationRecord } from '@/types';
import { getReportRecords, getReportStatistics } from '@/lib/reportData';
import { DocumentCard } from '../components/DocumentCard';
import { generateLipikApplication, printLipikApplication } from '../services/lipikApplication';
import { generateSachibApplication, printSachibApplication } from '../services/sachibApplication';

type DocumentAction = 'lipik-print' | 'lipik-pdf' | 'sachib-print' | 'sachib-pdf';

export function DocumentsPage({
  records,
  month,
  year,
  onBackToDashboard,
}: {
  records: MediationRecord[];
  month: string;
  year: string;
  onBackToDashboard: () => void;
}) {
  const [activeAction, setActiveAction] = useState<DocumentAction | null>(null);
  const [error, setError] = useState('');
  const reportRecords = useMemo(() => getReportRecords(records), [records]);
  const statistics = useMemo(() => getReportStatistics(reportRecords), [reportRecords]);
  const periodSelected = Boolean(month && year);
  const canRunAction = periodSelected && reportRecords.length > 0 && activeAction === null;

  const runDocumentAction = async (
    action: DocumentAction,
    handler: typeof generateLipikApplication,
  ) => {
    setError('');
    setActiveAction(action);
    try {
      await handler({
        month,
        year,
        successful: statistics.successful,
        unsuccessful: statistics.unsuccessful,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The document action could not be completed.');
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Documents
          </h2>
          <p className="mt-1.5 text-sm text-ink-300">
            Generate administrative applications from the current report.
          </p>
        </div>
        <button type="button" className="btn-ghost bg-white" onClick={onBackToDashboard}>
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>
      </header>

      <section className="rounded-xl border border-ink-200 bg-white p-5 shadow-card">
        <h3 className="text-sm font-semibold text-ink-700">Selected Report</h3>
        <p className="mt-2 text-lg font-semibold text-ink-900">
          Report Period: {month || 'Month not selected'} {year || ''}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:max-w-md">
          <div className="rounded-lg bg-green-50 px-3 py-2 text-green-800">
            Successful cases: <strong>{String(statistics.successful).padStart(2, '0')}</strong>
          </div>
          <div className="rounded-lg bg-red-50 px-3 py-2 text-red-800">
            Unsuccessful cases: <strong>{String(statistics.unsuccessful).padStart(2, '0')}</strong>
          </div>
        </div>
      </section>

      {!periodSelected && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          Select both Month and Year on the Dashboard before generating a document.
        </div>
      )}
      {periodSelected && reportRecords.length === 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          There are no report records to include in these documents.
        </div>
      )}
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-200">
          Available Documents
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <DocumentCard
            title="Lipik Application"
            description="Generate the clerk application using the supplied Kruti Dev legacy font."
            onPrint={() => void runDocumentAction('lipik-print', printLipikApplication)}
            onGenerate={() => void runDocumentAction('lipik-pdf', generateLipikApplication)}
            disabled={!canRunAction}
            printLoading={activeAction === 'lipik-print'}
            generateLoading={activeAction === 'lipik-pdf'}
          />
          <DocumentCard
            title="Sachib Application"
            description="Generate the secretary application using the supplied Kruti Dev legacy font."
            onPrint={() => void runDocumentAction('sachib-print', printSachibApplication)}
            onGenerate={() => void runDocumentAction('sachib-pdf', generateSachibApplication)}
            disabled={!canRunAction}
            printLoading={activeAction === 'sachib-print'}
            generateLoading={activeAction === 'sachib-pdf'}
          />
        </div>
        <p className="mt-3 text-xs text-ink-300">
          Using Kruti Dev 010 for both document templates.
        </p>
      </section>
    </div>
  );
}
