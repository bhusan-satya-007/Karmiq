
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/hooks/use-cart";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category,
    rating: item.rating,
    inStock: item.inStock,
    fastDelivery: item.fastDelivery
  }));
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    if (error.code === 'PGRST116') {
      return null; // Product not found
    }
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    category: data.category,
    rating: data.rating,
    inStock: data.inStock,
    fastDelivery: data.fastDelivery
  };
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('rating', { ascending: false })
    .limit(8);

  if (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category,
    rating: item.rating,
    inStock: item.inStock,
    fastDelivery: item.fastDelivery
  }));
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const query = category === 'All' 
    ? supabase.from('products').select('*')
    : supabase.from('products').select('*').eq('category', category);
  
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category,
    rating: item.rating,
    inStock: item.inStock,
    fastDelivery: item.fastDelivery
  }));
}
