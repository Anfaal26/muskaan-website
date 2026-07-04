import ProductCard from './ProductCard';
import type { DbProduct } from '../../types';

interface ProductGridProps {
  products: DbProduct[];
  loading?: boolean;
  emptyMessage?: string;
}

function SkeletonCard() {
  return (
    <div>
      <div className="skeleton rounded-sm" style={{ aspectRatio: '3/4' }} />
      <div className="mt-3 flex flex-col gap-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading, emptyMessage }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="text-6xl" aria-hidden="true">&#x1F9F5;</div>
        <h3
          className="text-2xl text-[var(--color-ink)]"
          style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300 }}
        >
          Nothing here yet
        </h3>
        <p className="text-sm text-[var(--color-ink-muted)]">
          {emptyMessage ?? 'Try adjusting your filters or explore other categories.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
