
import {
  CalendarClock,
  CalendarPlus,
  Gavel,
  Hash,
  Landmark,
  Plus,
  PlusCircle,
  RotateCcw,
  Scale,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';
import type { MediationRecord, RecordErrors } from '@/types';
import {
  CASE_NO_PREFIX_OPTIONS,
  COURT_OPTIONS,
  DECISION_OPTIONS,
  REMU_OPTIONS,
  YEARS,
} from '@/lib/options';
import { OtherInput } from '@/components/OtherInput';
import { OtherSelect } from '@/components/OtherSelect';
import type { EntryFormUpdate, EntryFormValues } from '@/components/EntryForm';

export interface EntryFormMobileProps {
  form: EntryFormValues;
  errors: RecordErrors;
  editingRecord: MediationRecord | null | undefined;
  onUpdate: EntryFormUpdate;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  onCancelEdit: () => void;
}

export function EntryFormMobile({
  form,
  errors,
  editingRecord,
  onUpdate,
  onSubmit,
  onReset,
  onCancelEdit,
}: EntryFormMobileProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      {/* Mediation Case */}
      <MobileSection
        icon={<Hash className="h-4 w-4 text-gold-500" />}
        title="Mediation Case"
      >
        <div className="grid grid-cols-[1fr_0.85fr] gap-3">
          <div data-error={!!errors.mediationCasePart}>
            <label
              className="mobile-field-label"
              htmlFor="mobile-med-part"
            >
              Case Part <span className="text-gold-500">*</span>
            </label>

            <input
              id="mobile-med-part"
              type="number"
              className={`mobile-field-input ${
                errors.mediationCasePart
                  ? 'border-red-400 focus:ring-red-200'
                  : ''
              }`}
              placeholder="e.g. 31"
              value={form.mediationCasePart}
              onChange={(event) =>
                onUpdate('mediationCasePart', event.target.value)
              }
            />

            {errors.mediationCasePart && (
              <MobileError text={errors.mediationCasePart} />
            )}
          </div>

          <div data-error={!!errors.mediationCaseYear}>
            <OtherInput
              id="mobile-med-year"
              label="Year"
              options={YEARS}
              value={form.mediationCaseYear}
              onChange={(value) =>
                onUpdate('mediationCaseYear', value)
              }
              required
              selectPlaceholder="Year…"
              placeholder="Year"
              error={errors.mediationCaseYear}
              compact
            />
          </div>
        </div>
      </MobileSection>

      {/* Decision */}
      <MobileSection
        icon={<Scale className="h-4 w-4 text-gold-500" />}
        title="Decision"
      >
        <OtherSelect
          id="mobile-decision"
          label="Decision"
          options={DECISION_OPTIONS}
          value={form.decision}
          onChange={(value) => onUpdate('decision', value)}
          required
          error={errors.decision}
          compact
        />
      </MobileSection>

      {/* Case Number */}
      <MobileSection
        icon={<Gavel className="h-4 w-4 text-gold-500" />}
        title="Case Number"
      >
        <div className="space-y-3">
          {/* Prefix */}
          <div data-error={!!errors.caseNoPrefix}>
            <OtherSelect
              id="mobile-case-prefix"
              label="Prefix"
              options={CASE_NO_PREFIX_OPTIONS}
              value={form.caseNoPrefix}
              onChange={(value) => onUpdate('caseNoPrefix', value)}
              required
              error={errors.caseNoPrefix}
              compact
            />
          </div>

          {/* Number + Suffix + Year */}
          <div className="grid grid-cols-[1.2fr_0.75fr_0.9fr] gap-2.5">
            {/* Number */}
            <div data-error={!!errors.caseNoNumber}>
              <label
                className="mobile-field-label"
                htmlFor="mobile-case-number"
              >
                Number <span className="text-gold-500">*</span>
              </label>

              <input
                id="mobile-case-number"
                type="number"
                className={`mobile-field-input ${
                  errors.caseNoNumber
                    ? 'border-red-400 focus:ring-red-200'
                    : ''
                }`}
                placeholder="565"
                value={form.caseNoNumber}
                onChange={(event) =>
                  onUpdate('caseNoNumber', event.target.value)
                }
              />

              {errors.caseNoNumber && (
                <MobileError text={errors.caseNoNumber} />
              )}
            </div>

            {/* Suffix */}
            <div>
              <label
                className="mobile-field-label"
                htmlFor="mobile-case-suffix"
              >
                Suffix
              </label>

              <input
                id="mobile-case-suffix"
                type="text"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                className="mobile-field-input"
                placeholder="i"
                value={form.caseNoSuffix}
                onChange={(event) =>
                  onUpdate('caseNoSuffix', event.target.value)
                }
              />
            </div>

            {/* Year */}
            <div data-error={!!errors.caseNoYear}>
              <OtherInput
                id="mobile-case-year"
                label="Year"
                options={YEARS}
                value={form.caseNoYear}
                onChange={(value) =>
                  onUpdate('caseNoYear', value)
                }
                required
                selectPlaceholder="Year…"
                placeholder="Year"
                error={errors.caseNoYear}
                compact
              />
            </div>
          </div>

          <p className="text-[11px] leading-snug text-ink-400">
            Suffix is optional. Enter{' '}
            <span className="font-medium">i</span>,
            <span className="font-medium"> ii</span>, etc.
          </p>
        </div>
      </MobileSection>

      {/* Reference Date */}
      <MobileSection
        icon={<CalendarClock className="h-4 w-4 text-gold-500" />}
        title="Reference Date"
      >
        <div data-error={!!errors.reffDate}>
          <label
            className="mobile-field-label"
            htmlFor="mobile-reff-date"
          >
            Reference Date <span className="text-gold-500">*</span>
          </label>

          <input
            id="mobile-reff-date"
            type="date"
            className={`mobile-field-input ${
              errors.reffDate
                ? 'border-red-400 focus:ring-red-200'
                : ''
            }`}
            value={form.reffDate}
            onChange={(event) =>
              onUpdate('reffDate', event.target.value)
            }
          />

          {errors.reffDate && (
            <MobileError text={errors.reffDate} />
          )}
        </div>
      </MobileSection>

      {/* Parties */}
      <MobileSection
        icon={<Users className="h-4 w-4 text-gold-500" />}
        title="Parties"
      >
        <div className="space-y-3">
          {/* First Party */}
          <div data-error={!!errors.firstParty}>
            <label
              className="mobile-field-label"
              htmlFor="mobile-first-party"
            >
              First Party <span className="text-gold-500">*</span>
            </label>

            <input
              id="mobile-first-party"
              type="text"
              className={`mobile-field-input ${
                errors.firstParty
                  ? 'border-red-400 focus:ring-red-200'
                  : ''
              }`}
              placeholder="First party name"
              value={form.firstParty}
              onChange={(event) =>
                onUpdate('firstParty', event.target.value)
              }
            />

            {errors.firstParty && (
              <MobileError text={errors.firstParty} />
            )}
          </div>

          {/* Second Party */}
          <div data-error={!!errors.secondParty}>
            <label
              className="mobile-field-label"
              htmlFor="mobile-second-party"
            >
              Second Party <span className="text-gold-500">*</span>
            </label>

            <input
              id="mobile-second-party"
              type="text"
              className={`mobile-field-input ${
                errors.secondParty
                  ? 'border-red-400 focus:ring-red-200'
                  : ''
              }`}
              placeholder="Second party name"
              value={form.secondParty}
              onChange={(event) =>
                onUpdate('secondParty', event.target.value)
              }
            />

            {errors.secondParty && (
              <MobileError text={errors.secondParty} />
            )}
          </div>
        </div>
      </MobileSection>

      {/* Court */}
      <MobileSection
        icon={<Landmark className="h-4 w-4 text-gold-500" />}
        title="Name of Court"
      >
        <OtherSelect
          id="mobile-court"
          label="Court"
          options={COURT_OPTIONS}
          value={form.nameOfCourt}
          onChange={(value) => onUpdate('nameOfCourt', value)}
          required
          error={errors.nameOfCourt}
          compact
        />
      </MobileSection>

      {/* Remuneration */}
      <MobileSection
        icon={<Wallet className="h-4 w-4 text-gold-500" />}
        title="Remuneration"
      >
        <OtherSelect
          id="mobile-remu"
          label="Remu (₹)"
          options={REMU_OPTIONS}
          value={form.remu}
          onChange={(value) => onUpdate('remu', value)}
          required
          error={errors.remu}
          placeholder="Select amount…"
          compact
        />
      </MobileSection>

      {/* Mediation Dates */}
      <MobileSection
        icon={<CalendarPlus className="h-4 w-4 text-gold-500" />}
        title="Mediation Dates"
      >
        <div
          data-error={!!errors.mediationDates}
          className="space-y-2.5"
        >
          {form.mediationDates.map((date, index) => (
            <div key={index}>
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <label
                    className="mobile-field-label"
                    htmlFor={`mobile-mediation-date-${index}`}
                  >
                    Date {index + 1}
                  </label>

                  <input
                    id={`mobile-mediation-date-${index}`}
                    type="date"
                    className={`mobile-field-input ${
                      errors.mediationDates
                        ? 'border-red-400 focus:ring-red-200'
                        : ''
                    }`}
                    value={date}
                    onChange={(event) => {
                      const next = [...form.mediationDates];
                      next[index] = event.target.value;
                      onUpdate('mediationDates', next);
                    }}
                  />
                </div>

                {form.mediationDates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = form.mediationDates.filter(
                        (_, itemIndex) => itemIndex !== index,
                      );

                      onUpdate(
                        'mediationDates',
                        next.length ? next : [''],
                      );
                    }}
                    className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink-200 text-ink-400 transition active:scale-95 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                    title={`Remove mediation date ${index + 1}`}
                    aria-label={`Remove mediation date ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onUpdate('mediationDates', [
                ...form.mediationDates,
                '',
              ])
            }
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gold-300 bg-gold-50/50 px-3 text-sm font-medium text-gold-700 transition active:scale-[0.99] hover:border-gold-400 hover:bg-gold-50"
          >
            <Plus className="h-4 w-4" />
            Add another date
          </button>

          {errors.mediationDates && (
            <MobileError text={errors.mediationDates} />
          )}
        </div>
      </MobileSection>

      {/* Actions */}
      <div className="space-y-2.5 pt-0.5">
        <button
          type="submit"
          className="btn-accent flex h-10 w-full items-center justify-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          {editingRecord ? 'Update Record' : 'Save Record'}
        </button>

        {editingRecord && (
          <button
            type="button"
            className="btn-ghost flex h-10 w-full items-center justify-center"
            onClick={onCancelEdit}
          >
            Cancel Edit
          </button>
        )}

        <button
          type="button"
          className="btn-ghost flex h-10 w-full items-center justify-center gap-2"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4" />
          Reset Form
        </button>
      </div>
    </form>
  );
}

function MobileSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ink-200 bg-white p-3.5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        {icon}

        <h2 className="text-[15px] font-semibold tracking-tight text-ink-900">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function MobileError({ text }: { text: string }) {
  return (
    <p className="mt-1 text-[11px] font-medium leading-snug text-red-500">
      {text}
    </p>
  );
}

