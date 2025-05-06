
import { ProductGrid } from "@/components/product/product-grid";
import { fetchFeaturedProducts } from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProducts() {
  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts
  });
  
  if (isLoading) {
    return (
      <section className="py-10 bg-muted/40">
        <div className="container">
          <div className="mb-8 text-center space-y-2">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked favorites from our collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error || !featuredProducts) {
    return (
      <section className="py-10 bg-muted/40">
        <div className="container">
          <div className="mb-8 text-center space-y-2">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground text-red-500">
              Failed to load products. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-10 bg-muted/40">
      <div className="container">
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">Handpicked favorites from our collection</p>
        </div>
        
        <ProductGrid products={featuredProducts} featured={true} />
      </div>
    </section>
  );
}
