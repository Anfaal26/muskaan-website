import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../hooks/useToast';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const { addItem, openDrawer } = useCartStore();
  const { show } = useToast();

  if (!items.length) {
    return (
      <PageWrapper dotPattern="md">
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
          <Heart size={64} className="text-[var(--color-border)]" aria-hidden="true" />
          <h1
            className="text-[var(--color-ink)]"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '2.5rem' }}
          >
            Your wishlist is empty
          </h1>
          <p className="text-[var(--color-ink-muted)] max-w-sm">
            Save pieces you love by tapping the heart icon on any product. They'll wait here for you.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="lg">Discover the Collection â†’</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper dotPattern="sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 gap-4">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Back to Shop
          </Link>
          <h1
            className="text-[var(--color-ink)]"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '2rem' }}
          >
            Wishlist
            <span className="ml-3 text-lg text-[var(--color-ink-muted)]">({items.length})</span>
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
                {/* Image */}
                <div
                  className="relative overflow-hidden rounded-sm"
                  style={{ aspectRatio: '3/4', background: 'var(--color-border)' }}
                >
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant={product.badge} />
                    </div>
                  )}

                  {/* Remove from wishlist */}
                  <button
                    type="button"
                    onClick={() => {
                      toggle(product);
                      show('Removed from wishlist', 'info');
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Heart
                      size={14}
                      aria-hidden="true"
                      style={{ fill: 'var(--color-terracotta)', color: 'var(--color-terracotta)' }}
                    />
                  </button>

                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  {/* Add to cart overlay */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-250">
                    <button
                      type="button"
                      onClick={() => {
                        const size = product.sizes[1] ?? product.sizes[0];
                        addItem(product, size, product.colors[0]);
                        show(`${product.name} added to cart`, 'success');
                        openDrawer();
                      }}
                      className="w-full py-3 text-xs font-semibold tracking-widest uppercase cursor-pointer transition-colors"
                      style={{ background: 'var(--color-ink)', color: 'white' }}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
                    {product.category.replace('-', ' ')}
                  </span>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-sm text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors line-clamp-1"
                    style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem' }}
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    {product.originalPrice && (
                      <span
                        className="text-xs line-through text-[var(--color-ink-muted)]"
                        style={{ fontFamily: '"DM Mono", monospace' }}
                      >
                        à§³{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span
                      className="text-sm font-medium"
                      style={{
                        fontFamily: '"DM Mono", monospace',
                        color: product.originalPrice ? 'var(--color-terracotta)' : 'var(--color-ink)',
                      }}
                    >
                      à§³{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
