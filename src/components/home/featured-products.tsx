
import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts } from "@/data/products";

export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();
  
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
