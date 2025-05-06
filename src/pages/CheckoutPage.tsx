
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = React.useState(false);
  
  // Shipping information
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [country, setCountry] = React.useState("United States");
  
  // Payment information
  const [paymentMethod, setPaymentMethod] = React.useState("credit-card");
  const [cardName, setCardName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvc, setCardCvc] = React.useState("");
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to proceed with checkout");
      navigate("/auth");
    }
    
    // Prefill email from authenticated user
    if (user?.email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, navigate, user]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    // Basic form validation
    if (!firstName || !lastName || !email || !address || !city || !state || !postalCode) {
      toast.error("Please fill in all required shipping information");
      return;
    }
    
    if (paymentMethod === "credit-card" && (!cardName || !cardNumber || !cardExpiry || !cardCvc)) {
      toast.error("Please fill in all payment information");
      return;
    }
    
    setLoading(true);
    
    try {
      if (!user) throw new Error("User not authenticated");
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_amount: subtotal,
          shipping_address: {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            postalCode,
            country
          },
          payment_details: {
            method: paymentMethod,
            cardName: paymentMethod === "credit-card" ? cardName : null,
            // Don't store full card details in a real app!
            // These would be tokenized by a payment processor
            lastFour: paymentMethod === "credit-card" ? cardNumber.slice(-4) : null
          }
        })
        .select('id')
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message and redirect
      toast.success("Order placed successfully!");
      navigate("/order-success");
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Failed to process your order: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Calculate values
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleCheckout}>
                {/* Shipping Information */}
                <div className="rounded-lg border p-6 space-y-4">
                  <h2 className="text-lg font-medium">Shipping Information</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea 
                      id="address" 
                      value={address} 
                      onChange={e => setAddress(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        value={city} 
                        onChange={e => setCity(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input 
                        id="state" 
                        value={state} 
                        onChange={e => setState(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input 
                        id="postalCode" 
                        value={postalCode} 
                        onChange={e => setPostalCode(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      value={country} 
                      onChange={e => setCountry(e.target.value)} 
                      readOnly 
                    />
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="rounded-lg border p-6 space-y-4 mt-6">
                  <h2 className="text-lg font-medium">Payment Method</h2>
                  
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod} 
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input 
                          id="cardName" 
                          value={cardName} 
                          onChange={e => setCardName(e.target.value)} 
                          required={paymentMethod === "credit-card"} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input 
                          id="cardNumber" 
                          value={cardNumber} 
                          onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} 
                          required={paymentMethod === "credit-card"} 
                          placeholder="XXXX XXXX XXXX XXXX" 
                          maxLength={16}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiration Date (MM/YY) *</Label>
                          <Input 
                            id="cardExpiry" 
                            value={cardExpiry} 
                            onChange={e => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) {
                                val = val.slice(0, 2) + '/' + val.slice(2, 4);
                              }
                              setCardExpiry(val);
                            }} 
                            required={paymentMethod === "credit-card"} 
                            placeholder="MM/YY" 
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvc">CVC *</Label>
                          <Input 
                            id="cardCvc" 
                            value={cardCvc} 
                            onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))} 
                            required={paymentMethod === "credit-card"} 
                            placeholder="CVC" 
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "paypal" && (
                    <div className="p-4 text-center text-muted-foreground">
                      <p>You will be redirected to PayPal to complete your payment after reviewing your order.</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Processing Order..." : "Place Order"}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="rounded-lg border p-6 space-y-4 sticky top-6">
                <h2 className="text-lg font-medium">Order Summary</h2>
                
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
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

export default CheckoutPage;
