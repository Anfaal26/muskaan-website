import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data/categories';
import { useProducts } from '../hooks/useProducts';
import { useFilterStore } from '../store/filterStore';
import PageWrapper from '../components/layout/PageWrapper';
import ProductGrid from '../components/product/ProductGrid';
import type { SortOption } from '../types';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const PAGE_SIZE = 12;

export default function ShopPage() {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('q') ?? '';
  const { categories: activeCats, sortBy, setSortBy, clearAll, activeFilterCount } = useFilterStore();
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  const { data: allProducts = [], isLoading } = useProducts(category);

  const filtered = useMemo(() => {
    let list = allProducts;

    if (activeCats.length > 0) list = list.filter(p => p.category != null && activeCats.includes(p.category));

    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter(p =>
        (p.label ?? '').toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'oldest':
        list = [...list].sort((a, b) => a.created_at.localeCompare(b.created_at));
        break;
      case 'price-asc':
        list = [...list].sort((a, b) => {
          if (a.price == null && b.price == null) return 0;
          if (a.price == null) return 1;
          if (b.price == null) return -1;
          return a.price - b.price;
        });
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => {
          if (a.price == null && b.price == null) return 0;
          if (a.price == null) return 1;
          if (b.price == null) return -1;
          return b.price - a.price;
        });
        break;
    }

    return list;
  }, [allProducts, activeCats, sortBy, searchQ]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const currentCat = category ? categories.find(c => c.slug === category) : null;
  const filterCount = activeFilterCount();

  return (
    <PageWrapper dotPattern="sm">
      <div
        className="py-12 px-6 text-center border-b"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
      >
        <h1
          className="text-[var(--color-ink)]"
          style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: 'clamp(2rem,4vw,3.2rem)' }}
        >
          {currentCat?.name ?? (searchQ ? `Results for "${searchQ}"` : 'All Collections')}
        </h1>
        {currentCat && (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{currentCat.description}</p>
        )}
        {!isLoading && (
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]" style={{ fontFamily: '"DM Mono",monospace' }}>
            {filtered.length} pieces
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-64 shrink-0" aria-label="Filters">
            <FilterPanel filterCount={filterCount} onClear={clearAll} />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                type="button"
                onClick={() => setMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 text-sm border border-[var(--color-border)] px-4 py-2 rounded-sm cursor-pointer hover:border-[var(--color-gold)] transition-colors"
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                Filters
                {filterCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}>
                    {filterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <label htmlFor="sort" className="text-xs text-[var(--color-ink-muted)] hidden sm:block">Sort by</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="border border-[var(--color-border)] bg-[var(--color-bg)] text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-[var(--color-gold)] cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <ProductGrid products={visible} loading={isLoading} />

            {hasMore && !isLoading && (
              <div className="mt-14 text-center">
                <button
                  type="button"
                  onClick={() => setPage(p => p + 1)}
                  className="px-10 py-4 border border-[var(--color-ink)] text-sm tracking-wide hover:bg-[var(--color-ink)] hover:text-white cursor-pointer transition-colors duration-200 rounded-sm"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileFilters(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.26 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 overflow-y-auto p-6 lg:hidden"
              style={{ background: 'var(--color-bg)' }}
              aria-label="Mobile filters"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Filters</h2>
                <button type="button" onClick={() => setMobileFilters(false)} className="cursor-pointer" aria-label="Close filters">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <FilterPanel filterCount={filterCount} onClear={clearAll} onDone={() => setMobileFilters(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

function FilterPanel({ filterCount, onClear, onDone }: { filterCount: number; onClear: () => void; onDone?: () => void }) {
  const { categories: activeCats, toggleCategory } = useFilterStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ink)]">Filters</h3>
        {filterCount > 0 && (
          <button
            type="button"
            onClick={() => { onClear(); onDone?.(); }}
            className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-terracotta)] cursor-pointer transition-colors"
          >
            Clear All ({filterCount})
          </button>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const active = activeCats.includes(cat.slug);
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggleCategory(cat.slug)}
                className="px-3 py-1.5 text-xs rounded-full border cursor-pointer transition-all duration-150"
                style={{
                  borderColor: active ? 'var(--color-gold)' : 'var(--color-border)',
                  background: active ? 'var(--color-gold)' : 'transparent',
                  color: active ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                }}
                aria-pressed={active}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <a
          href="https://m.me/muskaan020"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs font-semibold px-4 py-3 rounded-sm transition-colors"
          style={{ background: '#0084FF', color: 'white' }}
        >
          Contact us for pricing
        </a>
      </div>
    </div>
  );
}
