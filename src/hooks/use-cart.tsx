
import * as React from "react";
import { toast } from "@/components/ui/sonner";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  fastDelivery?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface SavedItem {
  product: Product;
}

interface CartContextType {
  cart: CartItem[];
  savedItems: SavedItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isInCart: (productId: string) => boolean;
  isInSaved: (productId: string) => boolean;
  totalItems: number;
  subtotal: number;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = React.useState<SavedItem[]>([]);
  const [wishlist, setWishlist] = React.useState<Product[]>([]);

  // Load from localStorage on initial render
  React.useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedWishlist = localStorage.getItem("wishlist");
    const savedForLater = localStorage.getItem("savedItems");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedForLater) setSavedItems(JSON.parse(savedForLater));
  }, []);

  // Save to localStorage whenever cart, wishlist, or savedItems change
  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
  }, [cart, wishlist, savedItems]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    
    toast(`${product.name} added to cart`, {
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const saveForLater = (productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    if (!item) return;
    
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    setSavedItems(prev => [...prev, { product: item.product }]);
    
    toast("Item saved for later");
  };

  const moveToCart = (productId: string) => {
    const item = savedItems.find(item => item.product.id === productId);
    if (!item) return;
    
    setSavedItems(prev => prev.filter(item => item.product.id !== productId));
    addToCart(item.product);
    
    toast("Item moved to cart");
  };

  const clearCart = () => {
    setCart([]);
    toast("Cart cleared");
  };

  const addToWishlist = (product: Product) => {
    const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);
    
    if (!isAlreadyInWishlist) {
      setWishlist(prev => [...prev, product]);
      toast(`${product.name} added to wishlist`);
    } else {
      removeFromWishlist(product.id);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    toast("Item removed from wishlist");
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.product.id === productId);
  };

  const isInSaved = (productId: string) => {
    return savedItems.some(item => item.product.id === productId);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );

  const value = {
    cart,
    savedItems,
    wishlist,
    addToCart,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isInCart,
    isInSaved,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = (): CartContextType => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
