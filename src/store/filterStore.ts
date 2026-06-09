import { create } from 'zustand';
import type { CategorySlug, SortOption } from '../types';

interface FilterState {
  categories: CategorySlug[];
  priceMin: number;
  priceMax: number;
  sortBy: SortOption;
  toggleCategory: (cat: CategorySlug) => void;
  setPriceRange: (min: number, max: number) => void;
  setSortBy: (sort: SortOption) => void;
  clearAll: () => void;
  activeFilterCount: () => number;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  categories: [],
  priceMin: 0,
  priceMax: 25000,
  sortBy: 'newest',

  toggleCategory: (cat) => {
    set(state => ({
      categories: state.categories.includes(cat)
        ? state.categories.filter(c => c !== cat)
        : [...state.categories, cat],
    }));
  },

  setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
  setSortBy: (sort) => set({ sortBy: sort }),

  clearAll: () => set({ categories: [], priceMin: 0, priceMax: 25000, sortBy: 'newest' }),

  activeFilterCount: () => {
    const s = get();
    let count = s.categories.length;
    if (s.priceMin > 0 || s.priceMax < 25000) count++;
    if (s.sortBy !== 'newest') count++;
    return count;
  },
}));
