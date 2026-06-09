import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  dotPattern?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
}

const dotClasses = {
  sm: 'dot-bg-sm',
  md: 'dot-bg',
  lg: 'dot-bg-lg',
  none: '',
};

export default function PageWrapper({ children, dotPattern = 'md', className = '' }: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen ${dotClasses[dotPattern]} ${className}`}
    >
      {children}
    </motion.main>
  );
}
