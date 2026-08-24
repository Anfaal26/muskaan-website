import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { openMessenger, productMessageTemplates } from '../../lib/messenger';

interface Props {
  product: { label?: string | null; image_url: string };
  align?: 'left' | 'right';
  children: (props: { onClick: (e: React.MouseEvent) => void; open: boolean }) => ReactNode;
}

/**
 * Trigger + popover for picking a canned Messenger enquiry about a product.
 * Portaled to document.body so it isn't clipped by a card's overflow-hidden.
 */
export default function MessengerMenu({ product, align = 'right', children }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const templates = productMessageTemplates(product);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleDismiss = () => setOpen(false);
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleDismiss, true);
    window.addEventListener('resize', handleDismiss);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleDismiss, true);
      window.removeEventListener('resize', handleDismiss);
    };
  }, [open]);

  function handleTriggerClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: (align === 'right' ? rect.right : rect.left) + window.scrollX,
      });
    }
    setOpen(o => !o);
  }

  function handleSelect(e: React.MouseEvent, text: string) {
    e.preventDefault();
    e.stopPropagation();
    openMessenger(text);
    setOpen(false);
  }

  return (
    <div ref={triggerRef} className="inline-block" onClick={e => e.stopPropagation()}>
      {children({ onClick: handleTriggerClick, open })}
      {open && pos &&
        createPortal(
          <div
            ref={menuRef}
            className="absolute z-[100] w-60 rounded-sm shadow-lg border overflow-hidden"
            style={{
              top: pos.top,
              left: pos.left,
              transform: align === 'right' ? 'translateX(-100%)' : undefined,
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <p className="px-4 pt-3 pb-1.5 text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
              Ask on Messenger
            </p>
            {templates.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={e => handleSelect(e, t.text)}
                className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
              >
                {t.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
