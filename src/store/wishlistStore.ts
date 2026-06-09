import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const exists = get().items.some(i => i.id === product.id);
        set(state => ({
          items: exists
            ? state.items.filter(i => i.id !== product.id)
            : [...state.items, product],
        }));
      },

      isWishlisted: (productId) => get().items.some(i => i.id === productId),

      clear: () => set({ items: [] }),
    }),
    { name: 'muskaan-wishlist' }
  )
);
