import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../../types';

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative overflow-hidden rounded-sm"
        style={{ aspectRatio: '3/4', background: 'var(--color-border)' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={product.images[active]}
            alt={`${product.name} — view ${active + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            loading="eager"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {product.images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {product.images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="shrink-0 rounded-sm overflow-hidden cursor-pointer transition-all duration-150"
              style={{
                width: 80,
                aspectRatio: '3/4',
                border: i === active ? '2px solid var(--color-gold)' : '2px solid var(--color-border)',
              }}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
