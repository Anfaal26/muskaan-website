import { motion } from 'framer-motion';
import type { DbProduct } from '../../types';

interface ProductGalleryProps {
  product: DbProduct;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  return (
    <div>
      <div
        className="relative overflow-hidden rounded-sm"
        style={{ aspectRatio: '3/4', background: 'var(--color-border)' }}
      >
        <motion.img
          src={product.image_url}
          alt={product.label ?? 'Product'}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          loading="eager"
        />
      </div>
    </div>
  );
}
