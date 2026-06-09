import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductBySlug, getRelatedProducts } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useToast } from '../hooks/useToast';
import PageWrapper from '../components/layout/PageWrapper';
import ProductGallery from '../components/product/ProductGallery';
import ProductGrid from '../components/product/ProductGrid';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import type { SizeOption } from '../types';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? getProductBySlug(slug) : undefined;
  const { addItem, openDrawer } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { show } = useToast();

  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[1] ?? product.sizes[0]);
      setSelectedColor(product.colors[0]);
      window.scrollTo({ top: 0 });
    }
  }, [product]);

  useEffect(() => {
    if (slug && !product) navigate('/shop', { replace: true });
  }, [slug, product, navigate]);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const related = getRelatedProducts(product);

  const handleAddToCart = () => {
    if (!selectedSize) { show('Please select a size', 'error'); return; }
    for (let i = 0; i < qty; i++) addItem(product, selectedSize, selectedColor);
    show(`${product.name} added to cart`, 'success');
    openDrawer();
  };

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
          <Link to={`/shop/${product.category}`} className="hover:text-[var(--color-gold)] transition-colors capitalize">
            {product.category.replace('-', ' ')}
          </Link>
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
            {/* Category + badge */}
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                {product.category.replace('-', ' ')}
              </span>
              {product.badge && <Badge variant={product.badge} />}
            </div>

            {/* Name */}
            <h1
              className="text-[var(--color-ink)] leading-tight"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
              <span style={{ color: 'var(--color-gold)' }}>{'★'.repeat(Math.floor(product.rating))}</span>
              <span style={{ fontFamily: '"DM Mono",monospace' }}>{product.rating}</span>
              <span>({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              {product.originalPrice && (
                <span className="text-lg line-through text-[var(--color-ink-muted)]" style={{ fontFamily: '"DM Mono",monospace' }}>
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span
                className="text-3xl font-medium"
                style={{
                  fontFamily: '"DM Mono",monospace',
                  color: product.originalPrice ? 'var(--color-terracotta)' : 'var(--color-ink)',
                }}
              >
                ৳{product.price.toLocaleString()}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{product.description}</p>

            {/* Divider */}
            <hr style={{ borderColor: 'var(--color-border)' }} />

            {/* Color swatches */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-2">Color</p>
                <div className="flex gap-2" role="radiogroup" aria-label="Select color">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className="w-7 h-7 rounded-full cursor-pointer transition-all duration-150"
                      style={{
                        background: c,
                        border: selectedColor === c ? '2px solid var(--color-gold)' : '2px solid var(--color-border)',
                        outline: selectedColor === c ? '1px solid var(--color-gold)' : 'none',
                        outlineOffset: 2,
                      }}
                      role="radio"
                      aria-checked={selectedColor === c}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-2">Size</p>
              <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Select size">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className="px-4 py-2 text-xs font-medium rounded-sm border cursor-pointer transition-all duration-150"
                    style={{
                      borderColor: selectedSize === s ? 'var(--color-gold)' : 'var(--color-border)',
                      background: selectedSize === s ? 'var(--color-gold)' : 'transparent',
                      color: selectedSize === s ? 'var(--color-ink)' : 'var(--color-ink)',
                    }}
                    role="radio"
                    aria-checked={selectedSize === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty stepper */}
            <div className="flex items-center gap-4">
              <p className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">Qty</p>
              <div
                className="flex items-center border border-[var(--color-border)] rounded-sm overflow-hidden"
                role="group"
                aria-label="Quantity"
              >
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[var(--color-ink-muted)] hover:bg-[var(--color-border)] cursor-pointer transition-colors text-lg" aria-label="Decrease quantity">−</button>
                <span className="w-10 text-center text-sm" style={{ fontFamily: '"DM Mono",monospace' }}>{qty}</span>
                <button type="button" onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-[var(--color-ink-muted)] hover:bg-[var(--color-border)] cursor-pointer transition-colors text-lg" aria-label="Increase quantity">+</button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-1">
              <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
                Add to Cart — ৳{(product.price * qty).toLocaleString()}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={handleWishlist}
                icon={<Heart size={16} style={{ fill: wishlisted ? 'var(--color-terracotta)' : 'none', color: wishlisted ? 'var(--color-terracotta)' : 'inherit' }} aria-hidden="true" />}
              >
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </Button>
              <a
                href={`https://wa.me/8801XXXXXXXXX?text=Hi! I'm interested in the ${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="md" fullWidth icon={<MessageCircle size={16} aria-hidden="true" />}>
                  Ask on WhatsApp
                </Button>
              </a>
            </div>

            {/* Info strips */}
            <div className="flex flex-col gap-2 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {[
                { Icon: Truck, text: 'Free shipping on orders over ৳2000' },
                { Icon: RotateCcw, text: '7-day hassle-free returns' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs text-[var(--color-ink-muted)]">
                  <Icon size={14} aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div>
              <Accordion title="Fabric & Care">
                <p>{product.fabric}</p>
                <p className="mt-2">Dry clean or gentle hand wash. Do not tumble dry. Iron on low heat on reverse side.</p>
              </Accordion>
              <Accordion title="Product Details">
                <p>{product.description}</p>
                <p className="mt-2">Occasions: {product.occasion.join(', ')}</p>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <p>Dispatched within 2–3 business days. Standard delivery 3–5 days across Bangladesh. Free shipping over ৳2000.</p>
              </Accordion>
            </div>

            {/* Share */}
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(window.location.href); show('Link copied!', 'success'); }}
              className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] cursor-pointer transition-colors w-fit"
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
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}
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
