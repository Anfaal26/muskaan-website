function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}
import { motion } from 'framer-motion';

const seeds = ['ig1', 'ig2', 'ig3', 'ig4', 'ig5', 'ig6', 'ig7', 'ig8'];

export default function InstagramGrid() {
  return (
    <section className="py-20 dot-bg" aria-label="Instagram gallery">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2
            className="text-[var(--color-ink)]"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            }}
          >
            Follow Our Story
          </h2>
          <a
            href="https://facebook.com/muskaan020"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors mt-2 inline-block"
          >
            @muskaan020
          </a>
        </motion.div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {seeds.map((seed, i) => (
            <motion.a
              key={seed}
              href="https://facebook.com/muskaan020"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-sm cursor-pointer"
              style={{ aspectRatio: '1/1', background: 'var(--color-border)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              aria-label="View on Facebook"
            >
              <img
                src={`https://picsum.photos/seed/${seed}/300/300`}
                alt="Muskaan boutique — customer styling"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <InstagramIcon />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
