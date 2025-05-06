
import { Product } from "@/hooks/use-cart";

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "Experience crystal-clear audio with these noise-cancelling wireless headphones. Perfect for work and play.",
    price: 159.99,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    description: "Track your fitness goals, receive notifications, and more with this state-of-the-art smartwatch.",
    price: 299.99,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description: "Soft, comfortable, and environmentally friendly. This organic cotton t-shirt is perfect for everyday wear.",
    price: 24.99,
    image: "/placeholder.svg",
    category: "Clothing",
    rating: 4.2,
    inStock: true,
  },
  {
    id: "4",
    name: "Stainless Steel Water Bottle",
    description: "Keep your drinks cold for 24 hours or hot for 12 with this vacuum-insulated stainless steel bottle.",
    price: 35.99,
    image: "/placeholder.svg",
    category: "Home & Kitchen",
    rating: 4.9,
    inStock: true,
  },
  {
    id: "5",
    name: "Professional Blender",
    description: "Powerful 1000W motor can handle everything from smoothies to soups to nut butters.",
    price: 129.99,
    image: "/placeholder.svg",
    category: "Home & Kitchen",
    rating: 4.7,
    inStock: true,
    fastDelivery: true,
  },
  {
    id: "6",
    name: "Wireless Charging Pad",
    description: "Charge your Qi-enabled devices without the hassle of cables. Sleek, modern design.",
    price: 25.99,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.3,
    inStock: true,
    fastDelivery: true,
  },
  {
    id: "7",
    name: "Premium Yoga Mat",
    description: "Non-slip, eco-friendly yoga mat perfect for all types of yoga and fitness routines.",
    price: 45.99,
    image: "/placeholder.svg",
    category: "Sports & Fitness",
    rating: 4.6,
    inStock: true,
  },
  {
    id: "8",
    name: "Bestselling Fiction Novel",
    description: "The latest page-turner from an award-winning author. You won't be able to put it down!",
    price: 18.99,
    image: "/placeholder.svg",
    category: "Books",
    rating: 4.4,
    inStock: true,
  },
  {
    id: "9",
    name: "Bluetooth Portable Speaker",
    description: "Take your music anywhere with this waterproof, durable Bluetooth speaker with 24-hour battery life.",
    price: 79.99,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
    fastDelivery: true,
  },
  {
    id: "10",
    name: "Cast Iron Skillet",
    description: "Pre-seasoned cast iron skillet perfect for stovetop, oven, or campfire cooking.",
    price: 32.99,
    image: "/placeholder.svg",
    category: "Home & Kitchen",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "11",
    name: "Smartphone Stand and Wireless Charger",
    description: "Keep your phone upright while charging wirelessly. Perfect for video calls or watching content.",
    price: 49.99,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.2,
    inStock: false,
  },
  {
    id: "12",
    name: "Plant-Based Protein Powder",
    description: "25g of complete protein per serving with no artificial flavors, colors, or sweeteners.",
    price: 39.99,
    image: "/placeholder.svg",
    category: "Food & Beverage",
    rating: 4.0,
    inStock: true,
    fastDelivery: true,
  }
];

export const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Sports & Fitness",
  "Books",
  "Food & Beverage",
];

// Helper to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  if (category === "All") return products;
  return products.filter(product => product.category === category);
};

// Helper to get a single product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Helper to get featured products (for homepage)
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.rating >= 4.5).slice(0, 4);
};
