import { create } from 'zustand';
import type { SortOption } from '../types';

interface FilterState {
  categories: string[];
  sortBy: SortOption;
  toggleCategory: (cat: string) => void;
  setSortBy: (sort: SortOption) => void;
  clearAll: () => void;
  activeFilterCount: () => number;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  categories: [],
  sortBy: 'newest',

  toggleCategory: (cat) => {
    set(state => ({
      categories: state.categories.includes(cat)
        ? state.categories.filter(c => c !== cat)
        : [...state.categories, cat],
    }));
  },

  setSortBy: (sort) => set({ sortBy: sort }),

  clearAll: () => set({ categories: [], sortBy: 'newest' }),

  activeFilterCount: () => {
    const s = get();
    let count = s.categories.length;
    if (s.sortBy !== 'newest') count++;
    return count;
  },
}));
