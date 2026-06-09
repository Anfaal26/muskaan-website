import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const headline = ['Wear the Story', 'of a Thousand', 'Threads.'];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden dot-bg"
      aria-label="Hero"
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 py-16 items-center">
        {/* Text */}
        <div className="flex flex-col gap-8 z-10">
          <div aria-live="polite">
            {headline.map((line, i) => (
              <motion.h1
                key={line}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="leading-[1.05] text-[var(--color-ink)]"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 300,
                  fontSize: 'clamp(2.6rem, 5vw, 4.5rem)',
                  letterSpacing: '-0.01em',
                }}
              >
                {line}
              </motion.h1>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-base text-[var(--color-ink-muted)] max-w-md leading-relaxed"
          >
            Handpicked ethnic wear for women who carry culture with elegance.
            Dhaka's boutique since 2007.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.72 }}
            className="flex items-center gap-5 flex-wrap"
          >
            <Link to="/shop">
              <Button variant="primary" size="lg">Shop the Collection</Button>
            </Link>
            <Link
              to="/about"
              className="text-sm text-[var(--color-ink)] underline-offset-4 hover:underline hover:text-[var(--color-gold)] transition-colors"
            >
              Our Story →
            </Link>
          </motion.div>
        </div>

        {/* Image card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex justify-center"
        >
          <div
            className="relative rounded-sm overflow-hidden shadow-xl"
            style={{
              width: '80%',
              maxWidth: 400,
              aspectRatio: '3/4',
              border: '1.5px solid var(--color-gold)',
              background: 'var(--color-border)',
            }}
          >
            <img
              src="https://picsum.photos/seed/muskaan-hero/400/533"
              alt="Muskaan boutique fashion — a woman in a beautiful saree"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Gold corner accent */}
            <div
              className="absolute bottom-0 right-0 w-12 h-12"
              style={{
                background: 'linear-gradient(135deg, transparent 50%, var(--color-gold) 50%)',
                opacity: 0.6,
              }}
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
