import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'link' | 'whatsapp' | 'terracotta';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[#b8943e] focus-visible:outline-[var(--color-gold)] tracking-wide',
  ghost:
    'border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white focus-visible:outline-[var(--color-ink)]',
  link: 'text-[var(--color-ink)] underline-offset-4 hover:underline focus-visible:outline-[var(--color-gold)] px-0',
  whatsapp:
    'bg-[#25D366] text-white hover:bg-[#1ebe5a] focus-visible:outline-[#25D366]',
  terracotta:
    'bg-[var(--color-terracotta)] text-white hover:bg-[#9e4432] focus-visible:outline-[var(--color-terracotta)]',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded',
  md: 'px-6 py-3 text-sm rounded-sm',
  lg: 'px-8 py-4 text-base rounded-sm',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, fullWidth, className = '', children, disabled, ...rest }, ref) => {
    const variantClasses = variant === 'link' ? variants.link : `${variants[variant]} ${sizes[size]}`;
    return (
      <button
        ref={ref}
        className={`${base} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...rest}
      >
        {loading && (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}
        {!loading && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
