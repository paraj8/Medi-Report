import { useState } from 'react';
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Gavel,
  Hash,
  Landmark,
  Plus,
  Scale,
  Trash2,
  Users,
  Wallet,
  PlusCircle,
  RotateCcw,
  CalendarClock,
} from 'lucide-react';
import type { MediationRecord, RecordErrors } from '@/types';
import {
  CASE_NO_PREFIX_OPTIONS,
  COURT_OPTIONS,
  DECISION_OPTIONS,
  MONTHS,
  REMU_OPTIONS,
  YEARS,
} from '@/lib/options';
import { generateId } from '@/lib/storage';
import { OtherSelect } from '@/components/OtherSelect';
import { OtherInput } from '@/components/OtherInput';

interface EntryFormProps {
  onSave: (record: MediationRecord) => void;
}

const emptyForm = (): Omit<MediationRecord, 'id' | 'createdAt'> => ({
  statementMonth: '',
  statementYear: '',
  mediationCasePart: '',
  mediationCaseYear: '',
  decision: '',
  caseNoPrefix: '',
  caseNoNumber: '',
  caseNoYear: '',
  reffDate: '',
  firstParty: '',
  secondParty: '',
  mediationDates: [''],
  nameOfCourt: '',
  remu: '',
});

export function EntryForm({ onSave }: EntryFormProps) {
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState<RecordErrors>({});
  const [toast, setToast] = useState(false);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof RecordErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const e: RecordErrors = {};
    if (!form.statementMonth) e.statementMonth = 'Required';
    if (!form.statementYear) e.statementYear = 'Required';
    if (!form.mediationCasePart.trim()) e.mediationCasePart = 'Required';
    if (!form.mediationCaseYear) e.mediationCaseYear = 'Required';
    if (!form.decision) e.decision = 'Required';
    if (!form.caseNoPrefix) e.caseNoPrefix = 'Required';
    if (!form.caseNoNumber.trim()) e.caseNoNumber = 'Required';
    if (!form.caseNoYear) e.caseNoYear = 'Required';
    if (!form.reffDate) e.reffDate = 'Required';
    if (!form.firstParty.trim()) e.firstParty = 'Required';
    if (!form.secondParty.trim()) e.secondParty = 'Required';
    const filledDates = form.mediationDates.filter((d) => d.trim() !== '');
    if (filledDates.length === 0) e.mediationDates = 'At least one date is required';
    if (form.mediationDates.some((d) => d.trim() !== '' && Number.isNaN(Date.parse(d))))
      e.mediationDates = 'One or more dates are invalid';
    if (!form.nameOfCourt) e.nameOfCourt = 'Required';
    if (!form.remu) e.remu = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const record: MediationRecord = {
      ...form,
      mediationDates: form.mediationDates.filter((d) => d.trim() !== ''),
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    onSave(record);
    setForm(emptyForm());
    setErrors({});
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  const handleReset = () => {
    setForm(emptyForm());
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Statement Period */}
      <FormSection icon={<CalendarDays className="h-5 w-5 text-gold-500" />} title="Statement Period">
        <div className="grid gap-5 sm:grid-cols-2">
          <div data-error={!!errors.statementMonth}>
            <label className="field-label" htmlFor="stmt-month">
              Statement Month <span className="text-gold-500">*</span>
            </label>
            <select
              id="stmt-month"
              className={`field-select ${errors.statementMonth ? 'border-red-400 focus:ring-red-200' : ''}`}
              value={form.statementMonth}
              onChange={(e) => update('statementMonth', e.target.value)}
            >
              <option value="" disabled>Select month…</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.statementMonth && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.statementMonth}</p>
            )}
          </div>
          <div data-error={!!errors.statementYear}>
            <label className="field-label" htmlFor="stmt-year">
              Statement Year <span className="text-gold-500">*</span>
            </label>
            <select
              id="stmt-year"
              className={`field-select ${errors.statementYear ? 'border-red-400 focus:ring-red-200' : ''}`}
              value={form.statementYear}
              onChange={(e) => update('statementYear', e.target.value)}
            >
              <option value="" disabled>Select year…</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {errors.statementYear && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.statementYear}</p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Field 1 — Mediation Case No. */}
      <FormSection icon={<Hash className="h-5 w-5 text-gold-500" />} title="Mediation Case No.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div data-error={!!errors.mediationCasePart}>
            <label className="field-label" htmlFor="med-part">
              Case Part <span className="text-gold-500">*</span>
            </label>
            <input
              id="med-part"
              type="text"
              className={`field-input ${errors.mediationCasePart ? 'border-red-400 focus:ring-red-200' : ''}`}
              placeholder='e.g. 31, 16(i)'
              value={form.mediationCasePart}
              onChange={(e) => update('mediationCasePart', e.target.value)}
            />
            {errors.mediationCasePart && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.mediationCasePart}</p>
            )}
          </div>
          <div data-error={!!errors.mediationCaseYear}>
            <OtherInput
              id="med-year"
              label="Year"
              options={YEARS}
              value={form.mediationCaseYear}
              onChange={(v) => update('mediationCaseYear', v)}
              required
              selectPlaceholder="Select year…"
              placeholder="Enter custom year"
              error={errors.mediationCaseYear}
            />
          </div>
        </div>
      </FormSection>

      {/* Field 2 — Decision */}
      <FormSection icon={<Scale className="h-5 w-5 text-gold-500" />} title="Decision">
        <OtherSelect
          id="decision"
          label="Decision"
          options={DECISION_OPTIONS}
          value={form.decision}
          onChange={(v) => update('decision', v)}
          required
          error={errors.decision}
        />
      </FormSection>

      {/* Field 3 — Case No. */}
      <FormSection icon={<Gavel className="h-5 w-5 text-gold-500" />} title="Case No.">
        <div className="grid gap-5 sm:grid-cols-3">
          <div data-error={!!errors.caseNoPrefix}>
            <OtherSelect
              id="case-prefix"
              label="Prefix"
              options={CASE_NO_PREFIX_OPTIONS}
              value={form.caseNoPrefix}
              onChange={(v) => update('caseNoPrefix', v)}
              required
              error={errors.caseNoPrefix}
            />
          </div>
          <div data-error={!!errors.caseNoNumber}>
            <label className="field-label" htmlFor="case-num">
              Number <span className="text-gold-500">*</span>
            </label>
            <input
              id="case-num"
              type="text"
              className={`field-input ${errors.caseNoNumber ? 'border-red-400 focus:ring-red-200' : ''}`}
              placeholder="e.g. 337"
              value={form.caseNoNumber}
              onChange={(e) => update('caseNoNumber', e.target.value)}
            />
            {errors.caseNoNumber && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.caseNoNumber}</p>
            )}
          </div>
          <div data-error={!!errors.caseNoYear}>
            <OtherInput
              id="case-year"
              label="Year"
              options={YEARS}
              value={form.caseNoYear}
              onChange={(v) => update('caseNoYear', v)}
              required
              selectPlaceholder="Select year…"
              placeholder="Enter custom year"
              error={errors.caseNoYear}
            />
          </div>
        </div>
      </FormSection>

      {/* Reff. Date */}
      <FormSection icon={<CalendarClock className="h-5 w-5 text-gold-500" />} title="Reff. Date">
        <div data-error={!!errors.reffDate} className="sm:max-w-xs">
          <label className="field-label" htmlFor="reff-date">
            Reference Date <span className="text-gold-500">*</span>
          </label>
          <input
            id="reff-date"
            type="date"
            className={`field-input ${errors.reffDate ? 'border-red-400 focus:ring-red-200' : ''}`}
            value={form.reffDate}
            onChange={(e) => update('reffDate', e.target.value)}
          />
          {errors.reffDate && (
            <p className="mt-1.5 text-xs font-medium text-red-500">{errors.reffDate}</p>
          )}
        </div>
      </FormSection>

      {/* Fields 4 & 5 — Parties */}
      <FormSection icon={<Users className="h-5 w-5 text-gold-500" />} title="Parties">
        <div className="grid gap-5 sm:grid-cols-2">
          <div data-error={!!errors.firstParty}>
            <label className="field-label" htmlFor="first-party">
              First Party <span className="text-gold-500">*</span>
            </label>
            <input
              id="first-party"
              type="text"
              className={`field-input ${errors.firstParty ? 'border-red-400 focus:ring-red-200' : ''}`}
              placeholder="First party name"
              value={form.firstParty}
              onChange={(e) => update('firstParty', e.target.value)}
            />
            {errors.firstParty && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.firstParty}</p>
            )}
          </div>
          <div data-error={!!errors.secondParty}>
            <label className="field-label" htmlFor="second-party">
              Second Party <span className="text-gold-500">*</span>
            </label>
            <input
              id="second-party"
              type="text"
              className={`field-input ${errors.secondParty ? 'border-red-400 focus:ring-red-200' : ''}`}
              placeholder="Second party name"
              value={form.secondParty}
              onChange={(e) => update('secondParty', e.target.value)}
            />
            {errors.secondParty && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.secondParty}</p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Field 6 — Court */}
      <FormSection icon={<Landmark className="h-5 w-5 text-gold-500" />} title="Name of Court">
        <OtherSelect
          id="court"
          label="Court"
          options={COURT_OPTIONS}
          value={form.nameOfCourt}
          onChange={(v) => update('nameOfCourt', v)}
          required
          error={errors.nameOfCourt}
        />
      </FormSection>

      {/* Field 7 — Remu */}
      <FormSection icon={<Wallet className="h-5 w-5 text-gold-500" />} title="Remuneration">
        <div className="sm:max-w-xs">
          <OtherSelect
            id="remu"
            label="Remu (₹)"
            options={REMU_OPTIONS}
            value={form.remu}
            onChange={(v) => update('remu', v)}
            required
            error={errors.remu}
            placeholder="Select amount…"
          />
        </div>
      </FormSection>

      {/* Date(s) of Mediation */}
      <FormSection icon={<CalendarPlus className="h-5 w-5 text-gold-500" />} title="Date of Mediation">
        <div data-error={!!errors.mediationDates} className="space-y-3">
          {form.mediationDates.map((date, idx) => (
            <div key={idx} className="flex items-center gap-3 animate-fade-in">
              <div className="flex-1">
                <input
                  type="date"
                  className={`field-input ${errors.mediationDates ? 'border-red-400 focus:ring-red-200' : ''}`}
                  value={date}
                  onChange={(ev) => {
                    const next = [...form.mediationDates];
                    next[idx] = ev.target.value;
                    update('mediationDates', next);
                  }}
                />
              </div>
              {form.mediationDates.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const next = form.mediationDates.filter((_, i) => i !== idx);
                    update('mediationDates', next.length ? next : ['']);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink-200 text-ink-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                  title="Remove this date"
                  aria-label="Remove this date"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => update('mediationDates', [...form.mediationDates, ''])}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gold-300 bg-gold-50/50 px-4 py-2.5 text-sm font-medium text-gold-700 transition hover:border-gold-400 hover:bg-gold-50"
          >
            <Plus className="h-4 w-4" />
            Add another date
          </button>
          {errors.mediationDates && (
            <p className="text-xs font-medium text-red-500">{errors.mediationDates}</p>
          )}
        </div>
      </FormSection>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="submit" className="btn-accent">
          <PlusCircle className="h-4 w-4" />
          Save Record
        </button>
        <button type="button" className="btn-ghost" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          Reset Form
        </button>
      </div>

      {/* Toast */}
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center gap-2.5 rounded-xl bg-ink-900 px-5 py-3 text-sm font-medium text-white shadow-card-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          Record saved successfully
        </div>
      </div>
    </form>
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ink-200 bg-white p-6 shadow-card sm:p-7">
      <div className="mb-5 flex items-center gap-2.5">
        {icon}
        <h2 className="text-base font-semibold tracking-tight text-ink-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}
