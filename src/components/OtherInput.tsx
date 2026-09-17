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
}

/**
 * Year-style select with "Other": when "Other" is chosen, reveals a text input.
 * Unlike OtherSelect, the select only ever holds a preset year or "Other";
 * the text input carries the custom value.
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
}: OtherInputProps) {
  const isOther = value === OTHER;
  const selectVal = isOther ? OTHER : value;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="field-label">
          {icon}
          {label}
          {required && <span className="text-gold-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`field-select ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
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
        <div className="mt-3 animate-slide-down">
          <input
            type="text"
            className={`field-input ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
            placeholder={placeholder ?? inputPlaceholder}
            value=""
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        </div>
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
