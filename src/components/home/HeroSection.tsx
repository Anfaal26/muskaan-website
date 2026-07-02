import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const headline = ['Wear the Story', 'of a Thousand', 'Threads.'];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Full-bleed boutique photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-boutique.webp"
          alt="Muskaan Boutique interior — Dhaka's premier ethnic wear destination"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay so text is legible */}
        <div className="absolute inset-0" style={{ background: 'rgba(20,16,12,0.52)' }} aria-hidden="true" />
      </div>

      {/* Text — centred over the photo */}
      <div className="relative z-10 w-full flex flex-col items-center text-center px-6 py-20">
        <div aria-live="polite" className="mb-6">
          {headline.map((line, i) => (
            <motion.h1
              key={line}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="leading-[1.08] text-white"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 500,
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                letterSpacing: '-0.01em',
                textShadow: '0 2px 24px rgba(0,0,0,0.4)',
              }}
            >
              {line}
            </motion.h1>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base max-w-md leading-relaxed mb-10"
          style={{ color: 'rgba(255,255,255,0.82)' }}
        >
          Handpicked ethnic wear for women who carry culture with elegance.
          Dhaka's boutique since 2007.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.78 }}
          className="flex items-center gap-5 flex-wrap justify-center"
        >
          <Link to="/shop">
            <Button variant="primary" size="lg">Shop the Collection</Button>
          </Link>
          <Link
            to="/shop/new-arrivals"
            className="text-sm underline-offset-4 hover:underline transition-colors"
            style={{ color: 'var(--color-gold)' }}
          >
            New Arrivals →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
