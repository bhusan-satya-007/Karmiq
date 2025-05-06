
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
          
          {wishlist.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-medium">Your wishlist is empty</h2>
              <p className="mt-2 text-muted-foreground">
                Items added to your wishlist will be saved here.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/products">Discover Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((product) => (
                <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg border">
                  <Link 
                    to={`/product/${product.id}`}
                    className="aspect-square overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-4">
                    <Link 
                      to={`/product/${product.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </div>
                    <div className="mt-auto pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">${product.price.toFixed(2)}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFromWishlist(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-3 w-full"
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
