
import { Link } from "react-router-dom";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

const categoryIcons = {
  "Electronics": "🔌",
  "Clothing": "👕",
  "Home & Kitchen": "🍳",
  "Sports & Fitness": "🏋️‍♂️",
  "Books": "📚",
  "Food & Beverage": "🍲",
};

export function FeaturedCategories() {
  // Filter out the "All" category
  const displayCategories = categories.filter(category => category !== "All");
  
  return (
    <section className="py-10">
      <div className="container">
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground">Browse our extensive collection across popular categories</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((category) => (
            <Link 
              key={category}
              to={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                "flex flex-col items-center justify-center p-6 bg-card rounded-lg border",
                "hover:border-primary/50 hover:shadow-md transition-all duration-300"
              )}
            >
              <div className="text-4xl mb-3">
                {categoryIcons[category as keyof typeof categoryIcons] || "🛒"}
              </div>
              <span className="text-sm font-medium">{category}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
