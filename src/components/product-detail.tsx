
import * as React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Star, 
  Minus, 
  Plus, 
  CheckCircle2,
  Truck
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { fetchProductById } from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    addToCart, 
    addToWishlist, 
    isInWishlist, 
    isInCart 
  } = useCart();

  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id || ""),
    enabled: !!id
  });

  // Handle quantity changes
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  // Add to cart handler
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Images Loading Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-16 rounded-md" />
            ))}
          </div>
        </div>
        
        {/* Product Info Loading Skeleton */}
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          
          <div className="flex items-center mt-6">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }
  
  // If product not found
  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/products">Browse All Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border bg-muted">
          <img 
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-auto pb-2">
          {/* This would normally contain multiple product images */}
          {[1, 2, 3].map((_, idx) => (
            <button
              key={idx}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border ${
                selectedImage === idx ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedImage(idx)}
            >
              <img
                src={product.image}
                alt={`Product view ${idx + 1}`}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col">
        <div className="mb-4">
          {product.fastDelivery && (
            <Badge variant="secondary" className="mb-2">Fast Delivery</Badge>
          )}
          <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star 
                  key={idx}
                  className={`h-4 w-4 ${
                    idx < Math.floor(product.rating)
                      ? "fill-primary text-primary"
                      : idx < product.rating
                      ? "fill-primary/50 text-primary/50"
                      : "text-muted-foreground"
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} rating</span>
          </div>
        </div>
        
        <div>
          <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Includes all taxes and duties
          </p>
        </div>
        
        <div className="my-6 space-y-6">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>In Stock</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Out of Stock</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Free shipping on orders over $100</span>
            </div>
          </div>
        </div>
        
        <div className="my-6">
          <div className="flex items-center mb-6">
            <span className="mr-4">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-9 w-9"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={increaseQuantity}
                className="h-9 w-9"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
          <Button 
            onClick={handleAddToCart} 
            disabled={!product.inStock}
            size="lg" 
            className="flex-1"
          >
            {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1"
            onClick={() => addToWishlist(product)}
          >
            <Heart className={`mr-2 h-4 w-4 ${isInWishlist(product.id) ? "fill-primary text-primary" : ""}`} />
            {isInWishlist(product.id) ? "Added to Wishlist" : "Add to Wishlist"}
          </Button>
        </div>
      </div>
    </div>
  );
}
