import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../hooks/useToast';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';

const FB_USERNAME = import.meta.env.VITE_FACEBOOK_PAGE_USERNAME ?? 'muskaan020';

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const addToCart = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openDrawer);
  const { show } = useToast();

  if (!items.length) {
    return (
      <PageWrapper dotPattern="md">
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
          <Heart size={64} className="text-[var(--color-border)]" aria-hidden="true" />
          <h1 className="text-[var(--color-ink)]" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '2.5rem' }}>
            Your wishlist is empty
          </h1>
          <p className="text-[var(--color-ink-muted)] max-w-sm">
            Save pieces you love by tapping the heart icon on any product.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="lg">Discover the Collection &rarr;</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper dotPattern="sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10 gap-4">
          <Link to="/shop" className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors">
            <ArrowLeft size={15} aria-hidden="true" /> Back to Shop
          </Link>
          <h1 className="text-[var(--color-ink)]" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '2rem' }}>
            Wishlist <span className="ml-3 text-lg text-[var(--color-ink-muted)]">({items.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {items.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              layout
            >
              <div className="group relative">
                <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '3/4', background: 'var(--color-border)' }}>
                  <button
                    type="button"
                    onClick={() => { toggle(product); show('Removed from wishlist', 'info'); }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                    aria-label={`Remove ${product.label ?? 'product'} from wishlist`}
                  >
                    <Heart size={14} aria-hidden="true" style={{ fill: 'var(--color-terracotta)', color: 'var(--color-terracotta)' }} />
                  </button>

                  <Link to={`/product/${product.id}`}>
                    <img src={product.image_url} alt={product.label ?? 'Product'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </Link>

                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-250 flex">
                    <button
                      type="button"
                      onClick={() => { addToCart(product); openCart(); show('Added to bag', 'success'); }}
                      className="flex-1 py-3 flex items-center justify-center text-xs font-semibold tracking-widest uppercase text-white cursor-pointer"
                      style={{ background: 'var(--color-ink)' }}
                    >
                      Add to Bag
                    </button>
                    <a
                      href={`https://m.me/${FB_USERNAME}?text=${encodeURIComponent(`Hi, can I know more about this product? ${product.image_url}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-4 flex items-center justify-center text-xs font-semibold text-white"
                      style={{ background: '#0084FF' }}
                      aria-label="Enquire on Messenger"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.867 1.44 5.42 3.686 7.09V22l3.37-1.85c.9.248 1.854.38 2.944.38 5.523 0 10-4.145 10-9.27C22 6.145 17.523 2 12 2zm1.09 12.486-2.542-2.71-4.963 2.71 5.455-5.79 2.604 2.71 4.9-2.71-5.454 5.79z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-0.5">
                  <Link to={`/product/${product.id}`} className="text-sm text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors line-clamp-1" style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem' }}>
                    {product.label ?? 'Latest Collection'}
                  </Link>
                  {product.price != null ? (
                    <span className="text-xs text-[var(--color-ink-muted)]" style={{ fontFamily: '"DM Mono",monospace' }}>
                      &#2547;{product.price.toLocaleString()}
                    </span>
                  ) : (
                    <a href={`https://m.me/${FB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-xs mt-1 hover:underline" style={{ color: '#0084FF' }}>
                      Contact for pricing &rarr;
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
