// ============================================================
// DB types — match the Supabase schema exactly
// ============================================================

export interface DbProduct {
  id: string;
  image_url: string;
  label: string | null;
  price: number | null;
  description: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbAdmin {
  id: string;
  username: string;
}

// ============================================================
// Cart — client-side only, no sizes/colors
// ============================================================

export interface CartItem {
  product: DbProduct;
  quantity: number;
}

// ============================================================
// Admin dashboard stats
// ============================================================

export interface DashboardStats {
  total: number;
  noPrice: number;
  noLabel: number;
  recent: DbProduct[];
}

// ============================================================
// UI helpers
// ============================================================

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc';

// ============================================================
// Legacy types — kept for backwards compatibility with any
// remaining static data references. Do not use for DB data.
// ============================================================

export type CategorySlug = 'products' | 'new-arrivals';
export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type BadgeType = 'new' | 'sale' | 'low-stock';
