
import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Heart, ArrowRight, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/components/ui/sonner";

const CartPage = () => {
  const { 
    cart, 
    savedItems, 
    removeFromCart, 
    updateQuantity, 
    saveForLater, 
    moveToCart, 
    subtotal 
  } = useCart();
  const navigate = useNavigate();
  
  // Calculate shipping and tax
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 4.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Empty cart view
  if (cart.length === 0 && savedItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
              <p className="mt-2 text-muted-foreground">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
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
          <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
          
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              {/* Cart Items */}
              {cart.length > 0 ? (
                <div className="rounded-lg border">
                  <div className="p-6">
                    <h2 className="text-lg font-medium mb-6">Cart Items ({cart.length})</h2>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-start space-x-4">
                          <div className="h-20 w-20 flex-shrink-0 rounded-md border">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="font-medium hover:text-primary"
                              >
                                {item.product.name}
                              </Link>
                              <span className="font-medium">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              ${item.product.price.toFixed(2)} each
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center border rounded-md">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="h-8 w-8"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => saveForLater(item.product.id)}
                                >
                                  Save for later
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromCart(item.product.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border bg-muted/30 p-6 text-center">
                  <p>Your cart is empty. Add some products to continue shopping.</p>
                  <Button className="mt-4" asChild>
                    <Link to="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
              
              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <div className="mt-8 rounded-lg border">
                  <div className="p-6">
                    <h2 className="text-lg font-medium mb-6">Saved for Later ({savedItems.length})</h2>
                    <div className="space-y-4">
                      {savedItems.map((item) => (
                        <div key={item.product.id} className="flex items-start space-x-4">
                          <div className="h-20 w-20 flex-shrink-0 rounded-md border">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="font-medium hover:text-primary"
                              >
                                {item.product.name}
                              </Link>
                              <span className="font-medium">
                                ${item.product.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => moveToCart(item.product.id)}
                              >
                                Move to Cart
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const savedItems = JSON.parse(localStorage.getItem("savedItems") || "[]");
                                  const updatedItems = savedItems.filter((saved: any) => 
                                    saved.product.id !== item.product.id
                                  );
                                  localStorage.setItem("savedItems", JSON.stringify(updatedItems));
                                  toast("Item removed");
                                  window.location.reload();
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="mt-8 lg:col-span-4 lg:mt-0">
              <div className="rounded-lg border bg-card">
                <div className="p-6">
                  <h2 className="text-lg font-medium">Order Summary</h2>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          "Free"
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full"
                      disabled={cart.length === 0}
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-center text-sm">
                    <p className="text-muted-foreground">
                      or <Link to="/products" className="font-medium text-primary underline-offset-4 hover:underline">Continue Shopping</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
