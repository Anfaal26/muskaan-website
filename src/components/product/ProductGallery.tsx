import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DbProduct } from '../../types';

interface ProductGalleryProps {
  product: DbProduct;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = [product.image_url, ...(product.gallery_urls ?? [])];
  const [active, setActive] = useState(0);
  const activeUrl = images[active] ?? images[0];

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-sm"
        style={{ aspectRatio: '3/4', background: 'var(--color-border)' }}
      >
        <motion.img
          key={activeUrl}
          src={activeUrl}
          alt={product.label ?? 'Product'}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          loading="eager"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3" role="tablist" aria-label="Product photos">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`View photo ${i + 1}`}
              onClick={() => setActive(i)}
              className="relative shrink-0 overflow-hidden rounded-sm cursor-pointer transition-opacity"
              style={{
                width: 64,
                height: 64,
                opacity: active === i ? 1 : 0.55,
                outline: active === i ? '2px solid var(--color-gold)' : '2px solid transparent',
                outlineOffset: '-2px',
              }}
            >
              <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
