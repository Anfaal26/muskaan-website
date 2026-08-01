import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function BrandStoryStrip() {
  return (
    <section className="py-0 overflow-hidden" aria-label="Brand story">
      <div className="grid lg:grid-cols-5">
        {/* Image side — 60% */}
        <div
          className="lg:col-span-3 relative flex items-center justify-center overflow-hidden dot-bg-sm"
          style={{ minHeight: 400 }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 420,
              height: 420,
              background: 'radial-gradient(circle, var(--color-gold-light) 0%, transparent 70%)',
              opacity: 0.5,
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <motion.img
            src="/muskaan_sil.png"
            alt="Muskaan ornamental emblem"
            className="relative w-3/4 max-w-md object-contain"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
            transition={{
              opacity: { duration: 0.8, ease: 'easeOut' },
              scale: { duration: 0.8, ease: 'easeOut' },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
            }}
            loading="lazy"
          />
        </div>

        {/* Text side — 40% */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 flex flex-col justify-center gap-6 px-8 lg:px-14 py-16 dot-bg-lg"
        >
          <span
            className="text-2xl text-[var(--color-gold)] italic leading-snug"
            style={{ fontFamily: '"Dancing Script", cursive' }}
          >
            "Every piece is chosen with love."
          </span>

          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
            Muskaan began in 2007 in the heart of Dhaka — not as a business, but as a promise. A promise that every woman deserves to wear her culture with pride, without compromising on beauty or quality.
          </p>

          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
            From handwoven Jamdani to delicate chikankari, every garment in our collection is personally curated. We travel to weavers, artisans, and workshops to bring you pieces that carry a story in every thread.
          </p>

          <Link
            to="/about"
            className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-gold)] underline-offset-4 hover:underline transition-colors w-fit"
          >
            Read Our Story →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
