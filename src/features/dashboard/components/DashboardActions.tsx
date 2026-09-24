
import {
  AlertCircle,
  CheckCircle2,
  Download,
  DownloadCloud,
  FileDown,
  Loader2,
  Printer,
  UploadCloud,
} from 'lucide-react';
import type { CloudActionStatus } from '@/lib/storage';

interface DashboardActionsProps {
  onUpdateCloud: () => void;
  onSyncFromCloud: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onExportCsv: () => void;
  uploadStatus: CloudActionStatus;
  uploadMsg: string;
  downloadStatus: CloudActionStatus;
  downloadMsg: string;
  recordCount: number;
  reportCount: number;
  isReportPeriodSelected: boolean;
  onPeriodValidation: () => void;
}

export function DashboardActions({
  onUpdateCloud,
  onSyncFromCloud,
  onPrint,
  onDownloadPdf,
  onExportCsv,
  uploadStatus,
  uploadMsg,
  downloadStatus,
  downloadMsg,
  recordCount,
  reportCount,
  isReportPeriodSelected,
  onPeriodValidation,
}: DashboardActionsProps) {
  const isUploading = uploadStatus === 'loading';
  const isDownloading = downloadStatus === 'loading';

  return (
    <section className="no-print mb-5 rounded-xl border border-ink-200 bg-white p-3 shadow-card sm:p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink-800">
            Report Controls
          </h2>
          <p className="text-[11px] text-ink-400">
            {recordCount} stored · {reportCount} in report
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Cloud */}
        <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-2.5">
          <div className="mb-2 flex items-center gap-1.5">
            <UploadCloud className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              Cloud
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1" onClick={!isReportPeriodSelected ? onPeriodValidation : undefined}>
              <button
                onClick={onUpdateCloud}
                disabled={!isReportPeriodSelected || isUploading || recordCount === 0}
                className={`btn-primary min-h-9 w-full px-2.5 py-1.5 text-xs ${!isReportPeriodSelected ? 'pointer-events-none' : ''}`}
              >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UploadCloud className="h-3.5 w-3.5" />
              )}
              Update
              </button>
            </div>

            <div className="flex-1" onClick={!isReportPeriodSelected ? onPeriodValidation : undefined}>
              <button
                onClick={onSyncFromCloud}
                disabled={!isReportPeriodSelected || isDownloading}
                className={`btn-ghost min-h-9 w-full px-2.5 py-1.5 text-xs ${!isReportPeriodSelected ? 'pointer-events-none' : ''}`}
              >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <DownloadCloud className="h-3.5 w-3.5" />
              )}
              Sync
              </button>
            </div>
          </div>
        </div>

        {/* Report */}
        <div className="rounded-lg border border-gold-100 bg-gold-50/30 p-2.5">
          <div className="mb-2 flex items-center gap-1.5">
            <FileDown className="h-3.5 w-3.5 text-gold-600" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              Report
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1" onClick={!isReportPeriodSelected ? onPeriodValidation : undefined}>
              <button
                onClick={onPrint}
                disabled={!isReportPeriodSelected || reportCount === 0}
                className={`btn-ghost min-h-9 w-full px-2 py-1.5 text-xs ${!isReportPeriodSelected ? 'pointer-events-none' : ''}`}
              >
              <Printer className="h-3.5 w-3.5" />
              Print
              </button>
            </div>

            <div className="flex-1" onClick={!isReportPeriodSelected ? onPeriodValidation : undefined}>
              <button
                onClick={onDownloadPdf}
                disabled={!isReportPeriodSelected || reportCount === 0}
                className={`btn-primary min-h-9 w-full px-2 py-1.5 text-xs ${!isReportPeriodSelected ? 'pointer-events-none' : ''}`}
              >
              <FileDown className="h-3.5 w-3.5" />
              PDF
              </button>
            </div>

            <div className="flex-1" onClick={!isReportPeriodSelected ? onPeriodValidation : undefined}>
              <button
                onClick={onExportCsv}
                disabled={!isReportPeriodSelected || reportCount === 0}
                className={`btn-ghost min-h-9 w-full px-2 py-1.5 text-xs ${!isReportPeriodSelected ? 'pointer-events-none' : ''}`}
              >
              <Download className="h-3.5 w-3.5" />
              CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      {(uploadStatus !== 'idle' || downloadStatus !== 'idle') && (
        <div className="mt-2 space-y-1">
          {uploadStatus !== 'idle' && uploadStatus !== 'loading' && (
            <StatusLine
              message={uploadMsg}
              success={uploadStatus === 'success'}
            />
          )}

          {downloadStatus !== 'idle' && downloadStatus !== 'loading' && (
            <StatusLine
              message={downloadMsg}
              success={downloadStatus === 'success'}
            />
          )}
        </div>
      )}
    </section>
  );
}

function StatusLine({
  message,
  success,
}: {
  message: string;
  success: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium ${
        success
          ? 'bg-green-50 text-green-600'
          : 'bg-red-50 text-red-600'
      }`}
    >
      {success ? (
        <CheckCircle2 className="h-3 w-3 shrink-0" />
      ) : (
        <AlertCircle className="h-3 w-3 shrink-0" />
      )}

      {message}
    </div>
  );
}

