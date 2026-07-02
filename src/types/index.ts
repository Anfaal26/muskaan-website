export type CategorySlug = 'products' | 'new-arrivals';

export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type BadgeType = 'new' | 'sale' | 'low-stock';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  originalPrice?: number;
  description: string;
  fabric: string;
  occasion: string[];
  colors: string[];
  sizes: SizeOption[];
  images: string[];
  badge?: BadgeType;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  productCount: number;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: SizeOption;
  selectedColor: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  garmentPurchased: string;
  date: string;
}

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';
