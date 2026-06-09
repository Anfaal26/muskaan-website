import { X, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import type { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const { product, quantity, selectedSize, selectedColor } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--color-border)]">
      {/* Image */}
      <Link
        to={`/product/${product.slug}`}
        className="shrink-0 rounded-sm overflow-hidden"
        style={{ width: 72, aspectRatio: '3/4', background: 'var(--color-border)' }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <Link
          to={`/product/${product.slug}`}
          className="text-sm text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors line-clamp-2"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem' }}
        >
          {product.name}
        </Link>

        <div className="flex gap-3 text-xs text-[var(--color-ink-muted)]">
          <span>Size: {selectedSize}</span>
          {selectedColor && (
            <span className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full border border-[var(--color-border)] inline-block"
                style={{ background: selectedColor }}
                aria-hidden="true"
              />
              Color
            </span>
          )}
        </div>

        {/* Quantity + price */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div
            className="flex items-center border border-[var(--color-border)] rounded-sm overflow-hidden"
            role="group"
            aria-label={`Quantity for ${product.name}`}
          >
            <button
              type="button"
              onClick={() => updateQuantity(product.id, selectedSize, quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-[var(--color-ink-muted)] hover:bg-[var(--color-border)] cursor-pointer transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={12} aria-hidden="true" />
            </button>
            <span
              className="w-8 text-center text-xs text-[var(--color-ink)]"
              style={{ fontFamily: '"DM Mono", monospace' }}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(product.id, selectedSize, quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-[var(--color-ink-muted)] hover:bg-[var(--color-border)] cursor-pointer transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={12} aria-hidden="true" />
            </button>
          </div>

          <span
            className="text-sm font-medium text-[var(--color-ink)]"
            style={{ fontFamily: '"DM Mono", monospace' }}
          >
            ৳{(product.price * quantity).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => removeItem(product.id, selectedSize)}
        className="shrink-0 self-start p-1 text-[var(--color-ink-muted)] hover:text-[var(--color-terracotta)] cursor-pointer transition-colors mt-1"
        aria-label={`Remove ${product.name} from cart`}
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
