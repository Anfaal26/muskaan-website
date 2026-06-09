import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--color-border)]">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-sm font-medium text-[var(--color-ink)] cursor-pointer hover:text-[var(--color-gold)] transition-colors duration-150"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          size={16}
          className="transition-transform duration-200 text-[var(--color-ink-muted)]"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-4 text-sm text-[var(--color-ink-muted)] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
