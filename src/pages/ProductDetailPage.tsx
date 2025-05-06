
import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ChevronRight, 
  Minus, 
  Plus, 
  CheckCircle2,
  Truck
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { getProductById } from "@/data/products";
import { ProductGrid } from "@/components/product/product-grid";
import { products } from "@/data/products";
import { toast } from "@/components/ui/sonner";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    addToCart, 
    addToWishlist, 
    isInWishlist, 
    isInCart 
  } = useCart();

  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);

  // Get product data
  const product = getProductById(id || "");

  // Get related products (same category)
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  // Handle quantity changes
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  // Add to cart handler
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  // If product not found
  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/products">Browse All Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/products" className="hover:text-foreground">Products</Link>
            <ChevronRight className="h-4 w-4" />
            <Link 
              to={`/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-foreground"
            >
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </nav>
          
          {/* Product Details */}
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
              
              <Separator className="my-6" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>In Stock</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Free shipping on orders over $50</span>
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
                  <ShoppingCart className="mr-2 h-4 w-4" />
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
          
          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start border-b bg-transparent">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Product Details</h3>
                  <p>
                    {product.description}
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>High-quality materials</li>
                    <li>Durable construction</li>
                    <li>Premium finish</li>
                    <li>Satisfaction guaranteed</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shipping Information</h3>
                  <p>
                    We offer free standard shipping on all orders over $50. Orders typically ship within 1-2 business days.
                  </p>
                  <h3 className="text-lg font-medium">Return Policy</h3>
                  <p>
                    We accept returns within 30 days of delivery. Items must be unused and in their original packaging.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Customer Reviews</h3>
                    <Button>Write a Review</Button>
                  </div>
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <p className="mb-4">No reviews yet. Be the first to review this product!</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related Products */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Button variant="ghost" asChild>
                <Link to={`/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}`}>
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid products={relatedProducts} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
