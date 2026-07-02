import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import CartItem from './CartItem';
import Button from '../ui/Button';

const SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 150;

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, total, itemCount } = useCartStore();
  const subtotal = total();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm flex flex-col shadow-xl"
            style={{ background: 'var(--color-surface)' }}
            aria-label="Shopping cart"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <h2
                className="text-xl flex items-center gap-2"
                style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
              >
                <ShoppingBag size={18} aria-hidden="true" />
                Your Bag
                {itemCount() > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--color-gold-light)', color: 'var(--color-ink)' }}
                  >
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
                    <p
                      className="text-xl mb-1 text-[var(--color-ink)]"
                      style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300 }}
                    >
                      Your bag is empty
                    </p>
                    <p className="text-sm text-[var(--color-ink-muted)]">
                      Add something beautiful to get started.
                    </p>
                  </div>
                  <Link to="/shop" onClick={closeDrawer}>
                    <Button variant="primary" size="sm">Start Shopping â†’</Button>
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <CartItem key={`${item.product.id}-${item.selectedSize}`} item={item} />
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="border-t px-6 py-6 flex flex-col gap-3"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {/* Shipping progress */}
                {subtotal < SHIPPING_THRESHOLD && (
                  <div className="text-xs text-[var(--color-ink-muted)] mb-1">
                    Add <span style={{ color: 'var(--color-gold)', fontFamily: '"DM Mono",monospace' }}>
                      à§³{(SHIPPING_THRESHOLD - subtotal).toLocaleString()}
                    </span> more for free shipping
                    <div
                      className="mt-1.5 h-1 rounded-full overflow-hidden"
                      style={{ background: 'var(--color-border)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%`, background: 'var(--color-gold)' }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-sm text-[var(--color-ink-muted)]">
                  <span>Subtotal</span>
                  <span style={{ fontFamily: '"DM Mono",monospace' }}>à§³{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--color-ink-muted)]">
                  <span>Shipping</span>
                  <span style={{ fontFamily: '"DM Mono",monospace' }}>
                    {shipping === 0 ? 'Free' : `à§³${shipping}`}
                  </span>
                </div>
                <div
                  className="flex justify-between text-base font-semibold border-t pt-3"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <span>Total</span>
                  <span style={{ fontFamily: '"DM Mono",monospace' }}>à§³{orderTotal.toLocaleString()}</span>
                </div>

                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="block"
                >
                  <Button variant="primary" fullWidth size="lg">
                    View Cart & Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
