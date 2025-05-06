import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductDetail } from "@/components/product-detail";
import { fetchProductById, fetchProductsByCategory } from "@/services/products";
import { useQuery } from "@tanstack/react-query";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id || ""),
    enabled: !!id
  });

  // Get related products (same category)
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['relatedProducts', product?.category],
    queryFn: () => fetchProductsByCategory(product?.category || ""),
    enabled: !!product?.category,
    select: (data) => data.filter(p => p.id !== product?.id).slice(0, 4)
  });

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
            {product && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link 
                  to={`/products?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-foreground"
                >
                  {product.category}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium truncate">{product.name}</span>
              </>
            )}
          </nav>
          
          {/* Product Details */}
          <ProductDetail />
          
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
                    {product?.description}
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
                    We offer free standard shipping on all orders over $100. Orders typically ship within 1-2 business days.
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
          {relatedProducts.length > 0 && (
            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Related Products</h2>
                {product && (
                  <Button variant="ghost" asChild>
                    <Link to={`/products?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`}>
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
              <ProductGrid products={relatedProducts} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
