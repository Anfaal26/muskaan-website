import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth, className = '', id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-ink)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] rounded-sm px-4 py-3 text-sm transition-colors duration-150 focus:outline-none focus:border-[var(--color-gold)] ${icon ? 'pl-10' : ''} ${error ? 'border-[var(--color-terracotta)]' : ''} ${className}`}
            aria-describedby={error ? `${inputId}-error` : undefined}
            aria-invalid={!!error}
            {...rest}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--color-terracotta)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
