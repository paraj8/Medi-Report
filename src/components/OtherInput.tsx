
import { OTHER } from '@/lib/options';

interface OtherInputProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  selectPlaceholder?: string;
  inputPlaceholder?: string;
  compact?: boolean;
}

/**
 * Year-style select with "Other": when "Other" is chosen,
 * reveals a text input for custom entry.
 *
 * `compact` is used by the mobile form only.
 * Desktop styling remains unchanged when compact is false.
 */
export function OtherInput({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  required,
  icon,
  selectPlaceholder = 'Select…',
  inputPlaceholder = 'Enter custom value',
  compact = false,
}: OtherInputProps) {
  const isOther = value === OTHER;
  const selectVal = isOther ? OTHER : value;

  const labelClass = compact
    ? 'mobile-field-label'
    : 'field-label';

  const selectClass = compact
    ? 'mobile-field-select'
    : 'field-select';

  const inputClass = compact
    ? 'mobile-field-input'
    : 'field-input';

  return (
    <div>
      {label && (
        <label htmlFor={id} className={labelClass}>
          {icon}
          {label}
          {required && <span className="text-gold-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          className={`${selectClass} ${
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
              : ''
          }`}
          value={selectVal}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            {selectPlaceholder}
          </option>

          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}

          <option value={OTHER}>{OTHER}</option>
        </select>
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
            placeholder={placeholder ?? inputPlaceholder}
            value=""
            onChange={(e) => onChange(e.target.value)}
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

