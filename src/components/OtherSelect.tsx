
import { ChevronDown } from 'lucide-react';
import { OTHER } from '@/lib/options';

interface OtherSelectProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  compact?: boolean;
}

/**
 * Dropdown that always appends an "Other" choice.
 * When "Other" is selected, a text input is revealed
 * for custom entry.
 *
 * `compact` is used by the mobile form only.
 * Desktop styling remains unchanged when compact is false.
 */
export function OtherSelect({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  error,
  required,
  icon,
  compact = false,
}: OtherSelectProps) {
  const isOther =
    value === OTHER ||
    (value && !options.includes(value) && value !== '');

  const selectValue = isOther ? OTHER : value;

  const labelClass = compact
    ? 'mobile-field-label'
    : 'field-label';

  const selectClass = compact
    ? 'mobile-field-select'
    : 'field-select';

  const inputClass = compact
    ? 'mobile-field-input'
    : 'field-input';

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const next = e.target.value;
    onChange(next === OTHER ? OTHER : next);
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {icon}
        {label}
        {required && <span className="text-gold-500">*</span>}
      </label>

      <div className="relative">
        <select
          id={id}
          className={`${selectClass} ${
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
              : ''
          }`}
          value={selectValue}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}

          <option value={OTHER}>{OTHER}</option>
        </select>

        {!compact && (
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
        )}
      </div>

      {isOther && (
        <div className="mt-2 animate-slide-down">
          <input
            type="text"
            className={`${inputClass} ${
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                : ''
            }`}
            placeholder={`Enter custom ${label.toLowerCase()}`}
            value={value === OTHER ? '' : value}
            onChange={handleTextChange}
            autoFocus
          />
        </div>
      )}

      {error && (
        <p className="mt-1 text-[11px] font-medium leading-snug text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

