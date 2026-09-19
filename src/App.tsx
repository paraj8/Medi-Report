import { useEffect, useState } from 'react';
import { ClipboardList, LayoutDashboard, Scale } from 'lucide-react';
import type { MediationRecord } from '@/types';
import { loadRecords, saveRecords } from '@/lib/storage';
import { EntryForm } from '@/components/EntryForm';
import { Dashboard } from '@/components/Dashboard';

type Tab = 'entry' | 'dashboard';

export default function App() {
  const [tab, setTab] = useState<Tab>('entry');
  const [records, setRecords] = useState<MediationRecord[]>([]);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const persist = (next: MediationRecord[]) => {
    setRecords(next);
    saveRecords(next);
  };

  const handleSave = (record: MediationRecord) => {
    persist([record, ...records]);
  };

  const handleDelete = (id: string) => {
    persist(records.filter((r) => r.id !== id));
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
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div key={tab} className="animate-fade-in">
          {tab === 'entry' ? (
            <div className="mx-auto max-w-3xl">
              <div className="mb-7">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  New Mediation Record
                </h2>

                <p className="mt-1.5 text-sm text-ink-300">
                  Enter the details for this mediation statement. Fields marked{' '}
                  <span className="font-semibold text-gold-500">*</span> are required.
                </p>
              </div>

              <EntryForm onSave={handleSave} />
            </div>
          ) : (
            <div>
              <Dashboard records={records} onDelete={handleDelete} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-ink-700 py-6">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-ink-400 sm:px-6">
          Legal Mediation Data Collector · Data stored locally in your browser
        </p>
      </footer>
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
