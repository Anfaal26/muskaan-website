import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { useToast } from '../../hooks/useToast';
import type { DbProduct } from '../../types';

const FB_USERNAME = import.meta.env.VITE_FACEBOOK_PAGE_USERNAME ?? 'muskaan020';

interface ProductCardProps {
  product: DbProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addToCart = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openDrawer);
  const { show } = useToast();

  const label = product.label ?? 'Latest Collection';

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product);
    openCart();
    show(`${label} added to bag`, 'success');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="group block relative" aria-label={`View ${label}`}>
        {/* Image container */}
        <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '3/4', background: 'var(--color-border)' }}>
          <img
            src={product.image_url}
            alt={label}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover overlay: Add to Bag + Messenger */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-250 flex">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-white cursor-pointer transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-ink)' }}
              aria-label={`Add ${label} to cart`}
            >
              <ShoppingBag size={13} aria-hidden="true" />
              Add to Bag
            </button>
            <a
              href={`https://m.me/${FB_USERNAME}?text=${encodeURIComponent(`Hi, can I know more about this product? ${product.image_url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="px-3 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-90"
              style={{ background: '#0084FF' }}
              aria-label="Enquire on Messenger"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.867 1.44 5.42 3.686 7.09V22l3.37-1.85c.9.248 1.854.38 2.944.38 5.523 0 10-4.145 10-9.27C22 6.145 17.523 2 12 2zm1.09 12.486-2.542-2.71-4.963 2.71 5.455-5.79 2.604 2.71 4.9-2.71-5.454 5.79z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
            {product.category ?? 'Muskaan Boutique'}
          </span>
          <h3
            className="text-sm text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-1"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', fontWeight: 400 }}
          >
            {label}
          </h3>
          {product.price != null ? (
            <span className="text-xs text-[var(--color-ink-muted)]" style={{ fontFamily: '"DM Mono", monospace' }}>
              &#2547;{product.price.toLocaleString()}
            </span>
          ) : (
            <a
              href={`https://m.me/${FB_USERNAME}?text=${encodeURIComponent('Hi, can I know more about pricing?')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-xs mt-0.5 hover:underline transition-colors"
              style={{ color: '#0084FF' }}
            >
              Contact for pricing &rarr;
            </a>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
