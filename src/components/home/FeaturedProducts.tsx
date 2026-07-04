import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFeaturedProducts } from '../../hooks/useProducts';
import ProductCard from '../product/ProductCard';

function SkeletonCard() {
  return (
    <div className="snap-start shrink-0 w-[260px] sm:w-[280px]">
      <div className="skeleton rounded-sm" style={{ aspectRatio: '3/4' }} />
      <div className="mt-3 flex flex-col gap-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: products = [], isLoading } = useFeaturedProducts(8);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section className="py-20 dot-bg-sm">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10 gap-4"
        >
          <h2
            className="text-[var(--color-ink)]"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            This Week's Edit
          </h2>
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] cursor-pointer transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] cursor-pointer transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
          role="list"
          aria-label="Featured products"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => (
                <div key={p.id} className="snap-start shrink-0 w-[260px] sm:w-[280px]" role="listitem">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
