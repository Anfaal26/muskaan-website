import { X, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import type { CartItem as CartItemType } from '../../types';

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCartStore();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--color-border)]">
      <Link
        to={`/product/${product.id}`}
        className="shrink-0 rounded-sm overflow-hidden"
        style={{ width: 72, aspectRatio: '3/4', background: 'var(--color-border)' }}
      >
        <img src={product.image_url} alt={product.label ?? 'Product'} className="w-full h-full object-cover" loading="lazy" />
      </Link>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <Link
          to={`/product/${product.id}`}
          className="text-sm text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors line-clamp-2"
          style={{ fontFamily: '"Playfair Display", serif', fontSize: '0.95rem' }}
        >
          {product.label ?? 'Latest Collection'}
        </Link>

        {product.price != null && (
          <span className="text-xs text-[var(--color-ink-muted)]">৳{product.price.toLocaleString()}</span>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          <div
            className="flex items-center border border-[var(--color-border)] rounded-sm overflow-hidden"
            role="group"
            aria-label={`Quantity for ${product.label ?? 'product'}`}
          >
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-[var(--color-ink-muted)] hover:bg-[var(--color-border)] cursor-pointer transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={12} aria-hidden="true" />
            </button>
            <span className="w-8 text-center text-xs text-[var(--color-ink)]" style={{ fontFamily: '"DM Mono", monospace' }}>
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-[var(--color-ink-muted)] hover:bg-[var(--color-border)] cursor-pointer transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={12} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeItem(product.id)}
        className="shrink-0 self-start p-1 text-[var(--color-ink-muted)] hover:text-[var(--color-terracotta)] cursor-pointer transition-colors mt-1"
        aria-label={`Remove ${product.label ?? 'product'} from cart`}
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
