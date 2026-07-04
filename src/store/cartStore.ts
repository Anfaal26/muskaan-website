import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, DbProduct } from '../types';

const FB_USERNAME = import.meta.env.VITE_FACEBOOK_PAGE_USERNAME ?? 'muskaan020';

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (product: DbProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;

  itemCount: () => number;
  checkoutUrl: () => string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        set(state => {
          const existing = state.items.find(i => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(i => i.product.id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeItem(productId); return; }
        set(state => ({
          items: state.items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleDrawer: () => set(state => ({ isOpen: !state.isOpen })),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      checkoutUrl: () => {
        const items = get().items;
        const productLines = items
          .map(i => encodeURIComponent(i.product.image_url))
          .join('%0A');
        const text = encodeURIComponent("Hi, I would like to order the following:\n") + productLines;
        return `https://m.me/${FB_USERNAME}?text=${text}`;
      },
    }),
    {
      name: 'muskaan-cart',
      // Only persist items, not drawer state
      partialize: state => ({ items: state.items }),
    }
  )
);
