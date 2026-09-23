import { useEffect, useState } from 'react';
import { ClipboardList, LayoutDashboard, Scale, UploadCloud, DownloadCloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { MediationRecord } from '@/types';
import {
  loadRecords,
  saveRecords,
  generateId,
  updateCloud,
  syncFromCloud,
  normalizeRecords,
  type CloudActionStatus,
} from '@/lib/storage';
import { EntryForm } from '@/components/EntryForm';
import { Dashboard } from '@/components/Dashboard';

type Tab = 'entry' | 'dashboard';

export default function App() {
  const [tab, setTab] = useState<Tab>('entry');
  const [records, setRecords] = useState<MediationRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<MediationRecord | null>(null);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Cloud action states
  const [uploadStatus, setUploadStatus] = useState<CloudActionStatus>('idle');
  const [uploadMsg, setUploadMsg] = useState('');
  const [downloadStatus, setDownloadStatus] = useState<CloudActionStatus>('idle');
  const [downloadMsg, setDownloadMsg] = useState('');

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const persist = (next: MediationRecord[]) => {
    setRecords(next);
    saveRecords(next);
  };

  const handleSave = (record: MediationRecord) => {
    if (editingRecord) {
      persist(records.map((existing) => (existing.id === record.id ? record : existing)));
      setEditingRecord(null);
      return;
    }

    const recordWithId = { ...record };
    if (!recordWithId.id) recordWithId.id = generateId();
    persist(normalizeRecords([recordWithId, ...records]));
  };

  const handleEdit = (record: MediationRecord) => {
    setEditingRecord(record);
    setTab('entry');
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    persist(normalizeRecords(records.filter((r) => r.id !== id)));
  };

  const handleReorder = (nextRecords: MediationRecord[]) => {
    persist(nextRecords);
  };

  const handleUpdateCloud = async () => {
    setUploadStatus('loading');
    setUploadMsg('');
    const result = await updateCloud(records, filterMonth, filterYear);
    setUploadStatus(result.status);
    setUploadMsg(result.message);
  };

  const handleSyncFromCloud = async () => {
    setDownloadStatus('loading');
    setDownloadMsg('');
    const result = await syncFromCloud();
    setDownloadStatus(result.status);
    setDownloadMsg(result.message);
    if (result.status === 'success') {
      setRecords(result.records ?? []);
      setFilterMonth(result.filterMonth || '');
      setFilterYear(result.filterYear || '');
    }
  };

  return (
    <div className="min-h-screen bg-ink-700 app-container">
      {/* Header */}
      <header className="no-print sticky top-0 z-30 border-b border-ink-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-900 text-white shadow-sm">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold tracking-tight text-ink-900 sm:text-xl">
                Legal Mediation Collector
              </h1>
              <p className="hidden text-xs text-ink-400 sm:block">
                Mediation statement data entry &amp; summary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1 rounded-lg bg-ink-100 p-1">
              <TabButton
                active={tab === 'entry'}
                onClick={() => setTab('entry')}
                icon={<ClipboardList className="h-4 w-4" />}
                label="Entry"
              />

              <TabButton
                active={tab === 'dashboard'}
                onClick={() => setTab('dashboard')}
                icon={<LayoutDashboard className="h-4 w-4" />}
                label="Summary"
                badge={records.length}
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div key={tab} className="animate-fade-in">
          {tab === 'entry' ? (
            <div className="mx-auto max-w-3xl">
              <div className="mb-7">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {editingRecord ? 'Edit Mediation Record' : 'New Mediation Record'}
                </h2>

                <p className="mt-1.5 text-sm text-ink-300">
                  Enter the details for this mediation statement. Fields marked{' '}
                  <span className="font-semibold text-gold-500">*</span> are required.
                </p>
              </div>

              <EntryForm
                onSave={handleSave}
                editingRecord={editingRecord}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          ) : (
            <div>
              <CloudActions
                onUpload={handleUpdateCloud}
                onDownload={handleSyncFromCloud}
                uploadStatus={uploadStatus}
                uploadMsg={uploadMsg}
                downloadStatus={downloadStatus}
                downloadMsg={downloadMsg}
                recordCount={records.length}
              />

              <Dashboard
                records={records}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onReorder={handleReorder}
                filterMonth={filterMonth}
                filterYear={filterYear}
                onFilterMonthChange={setFilterMonth}
                onFilterYearChange={setFilterYear}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-ink-700 py-6">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-ink-400 sm:px-6">
          Legal Mediation Data Collector · Local storage with manual cloud sync
        </p>
      </footer>
    </div>
  );
}

function CloudActions({
  onUpload,
  onDownload,
  uploadStatus,
  uploadMsg,
  downloadStatus,
  downloadMsg,
  recordCount,
}: {
  onUpload: () => void;
  onDownload: () => void;
  uploadStatus: CloudActionStatus;
  uploadMsg: string;
  downloadStatus: CloudActionStatus;
  downloadMsg: string;
  recordCount: number;
}) {
  return (
    <div className="mb-6 rounded-xl border border-ink-200 bg-white p-4 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ink-700">Cloud Sync</h3>
          <p className="mt-0.5 text-xs text-ink-400">
            {recordCount} record{recordCount !== 1 ? 's' : ''} stored locally
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onUpload}
            disabled={uploadStatus === 'loading' || recordCount === 0}
            className="flex items-center gap-2 rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadStatus === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            Update Cloud
          </button>
          <button
            onClick={onDownload}
            disabled={downloadStatus === 'loading'}
            className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-700 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloadStatus === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <DownloadCloud className="h-4 w-4" />
            )}
            Sync from Cloud
          </button>
        </div>
      </div>

      {/* Status messages */}
      <div className="mt-3 space-y-1.5">
        {uploadStatus === 'success' && (
          <StatusLine icon="check" text={uploadMsg} variant="success" />
        )}
        {uploadStatus === 'error' && (
          <StatusLine icon="alert" text={uploadMsg} variant="error" />
        )}
        {downloadStatus === 'success' && (
          <StatusLine icon="check" text={downloadMsg} variant="success" />
        )}
        {downloadStatus === 'error' && (
          <StatusLine icon="alert" text={downloadMsg} variant="error" />
        )}
      </div>
    </div>
  );
}

function StatusLine({
  icon,
  text,
  variant,
}: {
  icon: 'check' | 'alert';
  text: string;
  variant: 'success' | 'error';
}) {
  const colors =
    variant === 'success'
      ? 'text-green-600 bg-green-50'
      : 'text-red-600 bg-red-50';

  return (
    <div className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${colors}`}>
      {icon === 'check' ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      )}
      {text}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
        active
          ? 'bg-white text-ink-900 shadow-sm'
          : 'text-ink-500 hover:text-ink-700'
      }`}
    >
      {icon}

      <span className="hidden sm:inline">{label}</span>

      {badge !== undefined && badge > 0 && (
        <span className="ml-0.5 rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}
