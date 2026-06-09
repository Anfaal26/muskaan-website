import type { BadgeType } from '../../types';

interface BadgeProps {
  variant: BadgeType;
  className?: string;
}

const styles: Record<BadgeType, string> = {
  new: 'bg-[var(--color-gold)] text-[var(--color-ink)]',
  sale: 'bg-[var(--color-terracotta)] text-white',
  'low-stock': 'bg-[var(--color-ink)] text-white',
};

const labels: Record<BadgeType, string> = {
  new: 'NEW',
  sale: 'SALE',
  'low-stock': 'LOW STOCK',
};

export default function Badge({ variant, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase rounded-sm ${styles[variant]} ${className}`}
    >
      {labels[variant]}
    </span>
  );
}
