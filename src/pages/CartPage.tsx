import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../hooks/useToast';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 150;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, checkoutUrl } = useCartStore();
  const { show } = useToast();
  const subtotal = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : items.length ? SHIPPING_COST : 0;
  const orderTotal = subtotal + shipping;

  const handleCheckout = () => {
    window.open(checkoutUrl(), '_blank', 'noopener,noreferrer');
  };

  if (!items.length) {
    return (
      <PageWrapper dotPattern="md">
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
          <ShoppingBag size={64} className="text-[var(--color-border)]" aria-hidden="true" />
          <h1
            className="text-[var(--color-ink)]"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '2.5rem' }}
          >
            Your bag is empty
          </h1>
          <p className="text-[var(--color-ink-muted)] max-w-sm">
            Looks like you haven't added anything yet. Explore our collection and find something beautiful.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="lg">Start Shopping &rarr;</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper dotPattern="sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Continue Shopping
          </Link>
          <div className="flex-1 h-px bg-[var(--color-border)]" aria-hidden="true" />
          <h1
            className="text-[var(--color-ink)]"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '2rem' }}
          >
            Your Bag ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart items */}
          <div className="lg:col-span-2">
            {/* Desktop table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 pb-3 border-b border-[var(--color-border)] text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Price</span>
              <span />
            </div>

            <div className="divide-y divide-[var(--color-border)]">
              {items.map(item => {
                const label = item.product.label ?? 'Product';
                return (
                  <motion.div
                    key={item.product.id}
                    layout
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="py-6 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center"
                  >
                    {/* Product info */}
                    <div className="flex gap-4 items-start">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="shrink-0 rounded-sm overflow-hidden"
                        style={{ width: 80, aspectRatio: '3/4', background: 'var(--color-border)' }}
                      >
                        <img
                          src={item.product.image_url}
                          alt={label}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </Link>
                      <div className="flex flex-col gap-1">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-sm text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors"
                          style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem' }}
                        >
                          {label}
                        </Link>
                        {item.product.category && (
                          <span className="text-xs text-[var(--color-ink-muted)] capitalize">
                            {item.product.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div
                      className="flex items-center justify-center border border-[var(--color-border)] rounded-sm w-fit mx-auto"
                      role="group"
                      aria-label={`Quantity for ${label}`}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-[var(--color-ink-muted)] hover:bg-[var(--color-border)] cursor-pointer transition-colors text-lg leading-none"
                        aria-label="Decrease"
                      >
                        &minus;
                      </button>
                      <span
                        className="w-10 text-center text-sm text-[var(--color-ink)]"
                        style={{ fontFamily: '"DM Mono", monospace' }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-[var(--color-ink-muted)] hover:bg-[var(--color-border)] cursor-pointer transition-colors text-lg leading-none"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <div
                      className="text-sm font-medium text-right text-[var(--color-ink)]"
                      style={{ fontFamily: '"DM Mono", monospace' }}
                    >
                      {item.product.price != null
                        ? `&#2547;${(item.product.price * item.quantity).toLocaleString()}`
                        : <span className="text-[var(--color-ink-muted)] text-xs">Contact for pricing</span>
                      }
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => {
                        removeItem(item.product.id);
                        show('Item removed from cart', 'info');
                      }}
                      className="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-terracotta)] cursor-pointer transition-colors justify-self-end"
                      aria-label={`Remove ${label}`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => { clearCart(); show('Cart cleared', 'info'); }}
              className="mt-4 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-terracotta)] cursor-pointer transition-colors underline-offset-4 hover:underline"
            >
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <aside
            className="lg:sticky lg:top-24 self-start rounded-sm p-6 flex flex-col gap-4"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            aria-label="Order summary"
          >
            <h2
              className="text-lg text-[var(--color-ink)] border-b pb-4"
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, borderColor: 'var(--color-border)' }}
            >
              Order Summary
            </h2>

            <div className="flex justify-between text-sm text-[var(--color-ink-muted)]">
              <span>Subtotal</span>
              <span style={{ fontFamily: '"DM Mono", monospace' }}>&#2547;{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm text-[var(--color-ink-muted)]">
              <span>Shipping</span>
              <span style={{ fontFamily: '"DM Mono", monospace' }}>
                {shipping === 0 ? (items.length ? 'Free' : '—') : `৳${shipping}`}
              </span>
            </div>

            {subtotal > 0 && subtotal < SHIPPING_THRESHOLD && (
              <p className="text-xs text-[var(--color-ink-muted)] bg-[var(--color-bg)] rounded-sm px-3 py-2">
                Add <strong style={{ color: 'var(--color-gold)', fontFamily: '"DM Mono",monospace' }}>
                  &#2547;{(SHIPPING_THRESHOLD - subtotal).toLocaleString()}
                </strong> more for free shipping
              </p>
            )}

            {/* Promo code */}
            <div className="flex gap-2 pt-1">
              <Input placeholder="Promo code" fullWidth className="text-xs py-2" />
              <Button variant="ghost" size="sm" className="shrink-0">Apply</Button>
            </div>

            <div
              className="flex justify-between text-base font-semibold border-t pt-4"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <span>Total</span>
              <span style={{ fontFamily: '"DM Mono", monospace' }}>&#2547;{orderTotal.toLocaleString()}</span>
            </div>

            <Button variant="primary" fullWidth size="lg" onClick={handleCheckout}>
              Enquire on Messenger
            </Button>

            <p className="text-xs text-center text-[var(--color-ink-muted)]">
              Secure checkout &middot; Free returns within 7 days
            </p>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
}
