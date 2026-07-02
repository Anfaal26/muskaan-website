import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useToast } from '../../hooks/useToast';
import Badge from '../ui/Badge';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlistStore();
  const { addItem, openDrawer } = useCartStore();
  const { show } = useToast();
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product);
    show(
      wishlisted ? 'Removed from wishlist' : 'Added to wishlist â™¡',
      wishlisted ? 'info' : 'success'
    );
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultSize = product.sizes[1] ?? product.sizes[0];
    const defaultColor = product.colors[0];
    addItem(product, defaultSize, defaultColor);
    show(`${product.name} added to cart`, 'success');
    openDrawer();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block relative"
        aria-label={`View ${product.name}`}
      >
        {/* Image container */}
        <div
          className="relative overflow-hidden rounded-sm"
          style={{ aspectRatio: '3/4', background: 'var(--color-border)' }}
        >
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant={product.badge} />
            </div>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110"
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart
              size={14}
              aria-hidden="true"
              style={{ fill: wishlisted ? 'var(--color-terracotta)' : 'none', color: wishlisted ? 'var(--color-terracotta)' : 'var(--color-ink)' }}
            />
          </button>

          {/* Images */}
          <div className="img-hover-swap w-full h-full">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            {product.images[1] && (
              <img
                src={product.images[1]}
                alt={`${product.name} â€” alternate view`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Quick add â€” slides up on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-250"
          >
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full py-3 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase cursor-pointer transition-colors duration-150"
              style={{ background: 'var(--color-ink)', color: 'white' }}
            >
              <ShoppingBag size={14} aria-hidden="true" />
              Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">{product.category.replace('-', ' ')}</span>
          <h3
            className="text-sm text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-1"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', fontWeight: 400 }}
          >
            {product.name}
          </h3>
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
      </Link>
    </motion.div>
  );
}
