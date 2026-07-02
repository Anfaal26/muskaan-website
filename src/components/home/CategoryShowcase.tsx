import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../../data/categories';

export default function CategoryShowcase() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
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
          Shop by Category
        </h2>
        <Link
          to="/shop"
          className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors whitespace-nowrap"
        >
          View All â†’
        </Link>
      </motion.div>

      {/* Asymmetric 2-col grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Left tall card (spans 2 rows) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="row-span-2 hidden md:block"
        >
          <CategoryCard cat={categories[0]} tall />
        </motion.div>

        {/* Right 4 cards in 2Ã—2 */}
        {categories.slice(1).map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: (i + 1) * 0.07 }}
          >
            <CategoryCard cat={cat} />
          </motion.div>
        ))}

        {/* Mobile: show tall card normally */}
        <motion.div
          className="col-span-2 md:hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <CategoryCard cat={categories[0]} />
        </motion.div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  cat: typeof categories[0];
  tall?: boolean;
}

function CategoryCard({ cat, tall }: CategoryCardProps) {
  return (
    <Link
      to={`/shop/${cat.slug}`}
      className="group block relative overflow-hidden rounded-sm transition-all duration-300 hover:shadow-md cursor-pointer"
      style={{
        background: cat.color,
        minHeight: tall ? 420 : 180,
        border: '1px solid var(--color-border)',
      }}
      aria-label={`Shop ${cat.name}`}
    >
      <div className="absolute inset-0 group-hover:border-2 rounded-sm transition-all duration-200" style={{ borderColor: 'var(--color-gold)' }} />
      <div className="flex flex-col justify-end h-full p-6 min-h-[180px]">
        <p className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-1">
          {cat.productCount} pieces
        </p>
        <h3
          className="text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: tall ? '1.9rem' : '1.4rem',
          }}
        >
          {cat.name}
        </h3>
        <p className="text-xs text-[var(--color-ink-muted)] mt-1 hidden group-hover:block">
          {cat.description}
        </p>
      </div>
    </Link>
  );
}
