
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/hooks/use-cart";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart();
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${featured ? 'border-primary/20' : ''}`}>
      <Link to={`/product/${product.id}`} className="block overflow-hidden relative">
        <div className="aspect-square overflow-hidden bg-muted">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
          />
        </div>
        {product.fastDelivery && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            Fast Delivery
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-medium">
              Out of Stock
            </Badge>
          </div>
        )}
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-medium leading-tight mb-1 hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
            </Link>
            <div className="flex items-center text-sm mb-1">
              <Star className="h-3 w-3 fill-primary text-primary mr-1" />
              <span>{product.rating}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              addToWishlist(product);
            }}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-primary text-primary" : ""}`} />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
        <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant={isInCart(product.id) ? "secondary" : "default"}
          className="w-full"
          disabled={!product.inStock}
          onClick={() => addToCart(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
