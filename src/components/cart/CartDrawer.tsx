import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import CartItem from './CartItem';
import Button from '../ui/Button';

function MessengerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.867 1.44 5.42 3.686 7.09V22l3.37-1.85c.9.248 1.854.38 2.944.38 5.523 0 10-4.145 10-9.27C22 6.145 17.523 2 12 2zm1.09 12.486-2.542-2.71-4.963 2.71 5.455-5.79 2.604 2.71 4.9-2.71-5.454 5.79z" />
    </svg>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, itemCount, clearCart, checkoutUrl } = useCartStore();

  function handleCheckout() {
    const url = checkoutUrl();
    clearCart();
    closeDrawer();
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          <motion.aside
            key="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm flex flex-col shadow-xl"
            style={{ background: 'var(--color-surface)' }}
            aria-label="Shopping cart"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-xl flex items-center gap-2" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>
                <ShoppingBag size={18} aria-hidden="true" />
                Your Bag
                {itemCount() > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-gold-light)', color: 'var(--color-ink)' }}>
                    {itemCount()}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] cursor-pointer transition-colors"
                aria-label="Close cart"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-12">
                  <ShoppingBag size={48} className="text-[var(--color-border)]" aria-hidden="true" />
                  <div>
                    <p className="text-xl mb-1 text-[var(--color-ink)]" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300 }}>
                      Your bag is empty
                    </p>
                    <p className="text-sm text-[var(--color-ink-muted)]">Add something beautiful to get started.</p>
                  </div>
                  <Link to="/shop" onClick={closeDrawer}>
                    <Button variant="primary" size="sm">Start Shopping &rarr;</Button>
                  </Link>
                </div>
              ) : (
                items.map(item => <CartItem key={item.product.id} item={item} />)
              )}
            </div>

            {/* Footer with Messenger checkout */}
            {items.length > 0 && (
              <div className="border-t px-6 py-6 flex flex-col gap-3" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-xs text-[var(--color-ink-muted)] text-center">
                  {itemCount()} item{itemCount() !== 1 ? 's' : ''} — message us to complete your order
                </p>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold rounded-sm text-white cursor-pointer transition-opacity hover:opacity-90"
                  style={{ background: '#0084FF' }}
                >
                  <MessengerIcon />
                  Checkout via Messenger
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
