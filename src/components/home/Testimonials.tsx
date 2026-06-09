import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          aria-hidden="true"
          style={{
            fill: i < Math.floor(rating) ? 'var(--color-gold)' : 'none',
            color: 'var(--color-gold)',
          }}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2
          className="text-[var(--color-ink)]"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
          }}
        >
          Loved by Our Customers
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((review, i) => (
          <motion.article
            key={review.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="flex flex-col gap-4 p-6 rounded-sm"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <StarRating rating={review.rating} />
            <blockquote className="text-sm text-[var(--color-ink-muted)] leading-relaxed italic flex-1">
              "{review.comment}"
            </blockquote>
            <div className="flex flex-col gap-0.5 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-sm font-medium text-[var(--color-ink)]">{review.reviewerName}</span>
              <span className="text-xs text-[var(--color-ink-muted)]">{review.garmentPurchased}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
