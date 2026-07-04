import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Product data will be unavailable.');
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder'
);

export const GENERIC_DESCRIPTION =
  "This is a handpicked piece from Muskaan Boutique, Dhaka's premier destination for South Asian ethnic wear since 2007. Each garment is carefully selected for quality and craftsmanship. Message us on Messenger to enquire about availability, fabric details, and pricing.";

export const STORAGE_BUCKET = 'products';
