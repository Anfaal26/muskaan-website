import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductBySlug, getRelatedProducts } from '../data/products';
import { useWishlistStore } from '../store/wishlistStore';
import { useToast } from '../hooks/useToast';
import PageWrapper from '../components/layout/PageWrapper';
import ProductGallery from '../components/product/ProductGallery';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

function MessengerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.867 1.44 5.42 3.686 7.09V22l3.37-1.85c.9.248 1.854.38 2.944.38 5.523 0 10-4.145 10-9.27C22 6.145 17.523 2 12 2zm1.09 12.486-2.542-2.71-4.963 2.71 5.455-5.79 2.604 2.71 4.9-2.71-5.454 5.79z" />
    </svg>
  );
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? getProductBySlug(slug) : undefined;
  const { toggle, isWishlisted } = useWishlistStore();
  const { show } = useToast();

  useEffect(() => {
    if (product) window.scrollTo({ top: 0 });
  }, [product]);

  useEffect(() => {
    if (slug && !product) navigate('/shop', { replace: true });
  }, [slug, product, navigate]);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const related = getRelatedProducts(product);

  const handleWishlist = () => {
    toggle(product);
    show(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♡', wishlisted ? 'info' : 'success');
  };

  return (
    <PageWrapper dotPattern="sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)] mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[var(--color-gold)] transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop" className="hover:text-[var(--color-gold)] transition-colors">Products</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--color-ink)] truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <ProductGallery product={product} />

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            {/* Badge */}
            <div className="flex items-center gap-3">
              {product.badge && <Badge variant={product.badge} />}
            </div>

            {/* Name */}
            <h1
              className="text-[var(--color-ink)] leading-tight"
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
              <span style={{ color: 'var(--color-gold)' }}>{'★'.repeat(Math.floor(product.rating))}</span>
              <span style={{ fontFamily: '"DM Mono",monospace' }}>{product.rating}</span>
              <span>({product.reviewCount} reviews)</span>
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              This is a handpicked piece from Muskaan Boutique, Dhaka's premier destination for South Asian ethnic wear since 2007.
              Each garment is carefully selected for quality and craftsmanship. Visit us in-store or message us on Messenger to enquire about availability, fabric details, and pricing.
            </p>

            <hr style={{ borderColor: 'var(--color-border)' }} />

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-1">
              <a
                href="https://m.me/muskaan020"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<MessengerIcon />}
                  style={{ background: '#0084FF', borderColor: '#0084FF' }}
                >
                  Order this on Messenger
                </Button>
              </a>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={handleWishlist}
                icon={<Heart size={16} style={{ fill: wishlisted ? 'var(--color-terracotta)' : 'none', color: wishlisted ? 'var(--color-terracotta)' : 'inherit' }} aria-hidden="true" />}
              >
                {wishlisted ? 'Wishlisted' : 'Save to Wishlist'}
              </Button>
            </div>

            {/* Share */}
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(window.location.href); show('Link copied!', 'success'); }}
              className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] cursor-pointer transition-colors w-fit mt-2"
            >
              <Share2 size={14} aria-hidden="true" />
              Share this piece
            </button>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2
              className="text-[var(--color-ink)] mb-8"
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}
            >
              You May Also Like
            </h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
