
import * as React from "react";
import { ProductCard } from "@/components/product/product-card";
import { Product } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Product[];
  featured?: boolean;
  columns?: number;
}

export function ProductGrid({ 
  products, 
  featured = false, 
  columns = 4, 
  className,
  ...props 
}: ProductGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        gridCols[columns as keyof typeof gridCols],
        className
      )}
      {...props}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} featured={featured} />
      ))}
    </div>
  );
}
