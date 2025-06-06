
import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CheckIcon, SearchIcon, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/products";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const ProductsPage = () => {
  const { data: allProducts, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1500]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sort, setSort] = React.useState<string>("featured");
  const [showFilters, setShowFilters] = React.useState<boolean>(false);
  const [categories, setCategories] = React.useState<string[]>(["All"]);

  // Get unique categories from products
  React.useEffect(() => {
    if (allProducts) {
      const uniqueCategories = ["All", ...new Set(allProducts.map(p => p.category))];
      setCategories(uniqueCategories);

      // Initialize price range based on min and max product prices
      const prices = allProducts.map(p => p.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
  }, [allProducts]);

  // Filter and sort products when any filter changes
  React.useEffect(() => {
    if (!allProducts) return;
    
    let result = [...allProducts];
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // "featured" - no specific sorting
        break;
    }
    
    setFilteredProducts(result);
  }, [allProducts, selectedCategory, priceRange, searchQuery, sort]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container">
            <div className="mb-8">
              <Skeleton className="h-10 w-1/4" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !allProducts) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
            <p className="mb-6 text-muted-foreground">
              There was an error loading the products. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground">
              Browse our collection of high-quality products
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="w-full md:w-64 space-y-6 hidden md:block">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      className="justify-start w-full"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {selectedCategory === category && (
                        <CheckIcon className="mr-2 h-4 w-4" />
                      )}
                      <span>{category}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1500}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:w-auto sm:flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Filter Toggle - Mobile */}
                  <Button
                    variant="outline"
                    className="md:hidden flex-1"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                  
                  {/* Sort Dropdown */}
                  <Select
                    value={sort}
                    onValueChange={setSort}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Filters - Mobile */}
              {showFilters && (
                <div className="md:hidden mb-6 p-4 border rounded-lg space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className="text-sm"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={1500}
                        step={10}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="mb-4"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">${priceRange[0]}</span>
                        <span className="text-sm">${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("All");
                      setPriceRange([0, 1500]);
                      setSearchQuery("");
                      setSort("featured");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
