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
}

/**
 * Dropdown that always appends an "Other" choice. When "Other" is selected,
 * a text input is revealed inline for custom entry.
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
}: OtherSelectProps) {
  const isOther = value === OTHER || (value && !options.includes(value) && value !== '');

  // Determine the select's displayed value
  const selectValue = isOther ? OTHER : value;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    if (next === OTHER) {
      onChange(OTHER);
    } else {
      onChange(next);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {icon}
        {label}
        {required && <span className="text-gold-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`field-select ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
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
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          aria-hidden
        />
      </div>
      {isOther && (
        <div className="mt-3 animate-slide-down">
          <input
            type="text"
            className={`field-input ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
            placeholder={`Enter custom ${label.toLowerCase()}`}
            value={value === OTHER ? '' : value}
            onChange={handleTextChange}
            autoFocus
          />
        </div>
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
