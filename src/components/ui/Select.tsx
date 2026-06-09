import { forwardRef, type SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth, className = '', id, ...rest }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-ink)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] rounded-sm px-4 py-3 text-sm transition-colors duration-150 focus:outline-none focus:border-[var(--color-gold)] cursor-pointer appearance-none ${error ? 'border-[var(--color-terracotta)]' : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
          aria-invalid={!!error}
          {...rest}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p role="alert" className="text-xs text-[var(--color-terracotta)]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
