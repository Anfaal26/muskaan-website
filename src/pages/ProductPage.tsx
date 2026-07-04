import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../hooks/useToast';
import PageWrapper from '../components/layout/PageWrapper';
import ProductGallery from '../components/product/ProductGallery';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';

const FB_USERNAME = import.meta.env.VITE_FACEBOOK_PAGE_USERNAME ?? 'muskaan020';

function MessengerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.867 1.44 5.42 3.686 7.09V22l3.37-1.85c.9.248 1.854.38 2.944.38 5.523 0 10-4.145 10-9.27C22 6.145 17.523 2 12 2zm1.09 12.486-2.542-2.71-4.963 2.71 5.455-5.79 2.604 2.71 4.9-2.71-5.454 5.79z" />
    </svg>
  );
}

function RelatedProducts({ category, excludeId }: { category: string | null; excludeId: string }) {
  const { data: all = [] } = useProducts(category ?? undefined);
  const related = all.filter(p => p.id !== excludeId).slice(0, 4);
  if (!related.length) return null;
  return (
    <section className="mt-20">
      <h2
        className="text-[var(--color-ink)] mb-8"
        style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}
      >
        You May Also Like
      </h2>
      <ProductGrid products={related} />
    </section>
  );
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id);
  const { toggle, isWishlisted } = useWishlistStore();
  const addToCart = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openDrawer);
  const { show } = useToast();

  useEffect(() => {
    if (product) window.scrollTo({ top: 0 });
  }, [product]);

  useEffect(() => {
    if (isError) navigate('/shop', { replace: true });
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-gold)' }} />
      </div>
    );
  }

  if (!product) return null;

  const label = product.label ?? 'Latest Collection';
  const wishlisted = isWishlisted(product.id);
  const messengerUrl = `https://m.me/${FB_USERNAME}?text=${encodeURIComponent(`Hi, I'm interested in this product: ${product.image_url}`)}`;

  const handleWishlist = () => {
    toggle(product);
    show(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', wishlisted ? 'info' : 'success');
  };

  const handleAddToCart = () => {
    addToCart(product);
    openCart();
    show(`${label} added to bag`, 'success');
  };

  return (
    <PageWrapper dotPattern="sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)] mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[var(--color-gold)] transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop" className="hover:text-[var(--color-gold)] transition-colors">Products</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--color-ink)] truncate max-w-[200px]">{label}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ProductGallery product={product} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            {product.category && (
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
                {product.category}
              </span>
            )}

            <h1
              className="text-[var(--color-ink)] leading-tight"
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}
            >
              {label}
            </h1>

            {product.price != null ? (
              <p className="text-xl font-medium" style={{ fontFamily: '"DM Mono",monospace', color: 'var(--color-ink)' }}>
                &#2547;{product.price.toLocaleString()}
              </p>
            ) : (
              <a
                href={messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline"
                style={{ color: '#0084FF' }}
              >
                Contact for pricing &rarr;
              </a>
            )}

            {product.description && (
              <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                {product.description}
              </p>
            )}

            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              A handpicked piece from Muskaan Boutique, Dhaka's premier destination for South Asian ethnic wear.
              Message us on Messenger to enquire about availability and fabric details.
            </p>

            <hr style={{ borderColor: 'var(--color-border)' }} />

            <div className="flex flex-col gap-3 pt-1">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                icon={<ShoppingBag size={16} aria-hidden="true" />}
              >
                Add to Bag
              </Button>

              <a href={messengerUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<MessengerIcon />}
                  style={{ background: '#0084FF', borderColor: '#0084FF' }}
                >
                  Enquire on Messenger
                </Button>
              </a>

              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={handleWishlist}
                icon={
                  <Heart
                    size={16}
                    style={{ fill: wishlisted ? 'var(--color-terracotta)' : 'none', color: wishlisted ? 'var(--color-terracotta)' : 'inherit' }}
                    aria-hidden="true"
                  />
                }
              >
                {wishlisted ? 'Wishlisted' : 'Save to Wishlist'}
              </Button>
            </div>

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

        <RelatedProducts category={product.category} excludeId={product.id} />
      </div>
    </PageWrapper>
  );
}
