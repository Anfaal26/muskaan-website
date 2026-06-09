import { create } from 'zustand';
import type { CartItem, Product, SizeOption } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: SizeOption, color: string) => void;
  removeItem: (productId: string, size: SizeOption) => void;
  updateQuantity: (productId: string, size: SizeOption, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product, size, color) => {
    set(state => {
      const existing = state.items.find(
        i => i.product.id === product.id && i.selectedSize === size
      );
      if (existing) {
        return {
          items: state.items.map(i =>
            i.product.id === product.id && i.selectedSize === size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { product, quantity: 1, selectedSize: size, selectedColor: color }],
      };
    });
  },

  removeItem: (productId, size) => {
    set(state => ({
      items: state.items.filter(
        i => !(i.product.id === productId && i.selectedSize === size)
      ),
    }));
  },

  updateQuantity: (productId, size, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, size);
      return;
    }
    set(state => ({
      items: state.items.map(i =>
        i.product.id === productId && i.selectedSize === size
          ? { ...i, quantity }
          : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),
  toggleDrawer: () => set(state => ({ isOpen: !state.isOpen })),
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),

  total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
