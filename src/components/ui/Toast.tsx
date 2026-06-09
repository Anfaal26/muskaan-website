import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import type { ToastVariant } from '../../types';

const icons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors: Record<ToastVariant, string> = {
  success: 'border-l-[var(--color-gold)] bg-[var(--color-surface)]',
  error: 'border-l-[var(--color-terracotta)] bg-[var(--color-surface)]',
  info: 'border-l-[var(--color-ink)] bg-[var(--color-surface)]',
};

const iconColors: Record<ToastVariant, string> = {
  success: 'text-[var(--color-gold)]',
  error: 'text-[var(--color-terracotta)]',
  info: 'text-[var(--color-ink-muted)]',
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map(t => {
          const Icon = icons[t.variant];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-sm shadow-lg border border-[var(--color-border)] border-l-4 min-w-[260px] max-w-[360px] ${colors[t.variant]}`}
              role="alert"
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${iconColors[t.variant]}`} aria-hidden="true" />
              <p className="text-sm text-[var(--color-ink)] flex-1">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] cursor-pointer transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
