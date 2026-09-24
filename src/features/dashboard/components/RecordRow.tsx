
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { MediationRecord } from '@/types';

export function RecordRow({
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
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
        <span className="text-xs font-medium text-red-700">
          Delete this record permanently?
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md bg-red-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-600"
            onClick={() => onDelete(record.id)}
          >
            Delete
          </button>

          <button
            type="button"
            className="rounded-md border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600 transition hover:bg-ink-50"
            onClick={() => setConfirm(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-100 bg-ink-50/40 px-4 py-2.5 transition hover:border-ink-200 hover:bg-white">
      <div className="flex min-w-0 items-center gap-3 text-xs text-ink-600">
        <span className="font-medium text-ink-800">
          {record.mediationCasePart}/{record.mediationCaseYear}
        </span>

        <span className="text-ink-400">|</span>

        <span className="truncate">
          {record.firstParty} vs. {record.secondParty}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(record)}
          className="flex items-center gap-1 text-xs font-medium text-ink-500 transition hover:text-ink-900"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-100 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
