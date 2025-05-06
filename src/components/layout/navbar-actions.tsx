
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { NavbarAuth } from "./navbar-auth";

export function NavbarActions() {
  const { totalItems, wishlist } = useCart();
  
  return (
    <div className="flex items-center gap-4">
      <Link to="/wishlist">
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          {wishlist.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {wishlist.length}
            </span>
          )}
        </Button>
      </Link>
      
      <Link to="/cart">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </Link>
      
      <NavbarAuth />
    </div>
  );
}
