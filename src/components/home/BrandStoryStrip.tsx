import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function BrandStoryStrip() {
  return (
    <section className="py-0 overflow-hidden" aria-label="Brand story">
      <div className="grid lg:grid-cols-5">
        {/* Image side — 60% */}
        <div className="lg:col-span-3 relative" style={{ minHeight: 400 }}>
          <img
            src="https://picsum.photos/seed/muskaan-story/800/600"
            alt="Muskaan boutique — a curated display of ethnic garments"
            className="w-full h-full object-cover"
            style={{ minHeight: 400 }}
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, transparent 60%, rgba(249,247,244,0.5))' }}
            aria-hidden="true"
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
