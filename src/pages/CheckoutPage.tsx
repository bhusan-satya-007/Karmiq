
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  CreditCard,
  LockIcon,
  ChevronLeft,
  ChevronRight,
  Gift,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/components/ui/sonner";

const CheckoutPage = () => {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = React.useState("credit-card");
  const [promoCode, setPromoCode] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  
  // Shipping and tax calculations
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 4.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax - discount;
  
  // Form states
  const [shippingInfo, setShippingInfo] = React.useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: ""
  });
  
  const [billingInfo, setBillingInfo] = React.useState({
    sameAsShipping: true,
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });
  
  const [paymentInfo, setPaymentInfo] = React.useState({
    cardNumber: "",
    nameOnCard: "",
    expiry: "",
    cvc: ""
  });

  // Handle shipping info change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle billing info change
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle payment info change
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Toggle billing same as shipping
  const toggleSameAsShipping = (checked: boolean) => {
    setBillingInfo(prev => ({
      ...prev,
      sameAsShipping: checked,
      firstName: checked ? shippingInfo.firstName : prev.firstName,
      lastName: checked ? shippingInfo.lastName : prev.lastName,
      address: checked ? shippingInfo.address : prev.address,
      city: checked ? shippingInfo.city : prev.city,
      state: checked ? shippingInfo.state : prev.state,
      zipCode: checked ? shippingInfo.zipCode : prev.zipCode,
      country: checked ? shippingInfo.country : prev.country
    }));
  };
  
  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.trim().toLowerCase() === "discount10") {
      const newDiscount = subtotal * 0.1; // 10% discount
      setDiscount(newDiscount);
      toast.success("Promo code applied successfully!", {
        description: `You saved $${newDiscount.toFixed(2)}`,
      });
    } else {
      toast.error("Invalid promo code", {
        description: "Please check and try again.",
      });
    }
  };
  
  // Process order
  const processOrder = () => {
    // Simulate order processing
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: "Processing your order...",
        success: "Order placed successfully!",
        error: "There was a problem processing your order.",
      }
    );
    
    // Clear cart and redirect to success page
    setTimeout(() => {
      clearCart();
      navigate("/order-success");
    }, 2000);
  };
  
  // Redirect if cart is empty
  React.useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const renderShippingForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={shippingInfo.firstName}
            onChange={handleShippingChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={shippingInfo.lastName}
            onChange={handleShippingChange}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            name="address"
            value={shippingInfo.address}
            onChange={handleShippingChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={shippingInfo.city}
            onChange={handleShippingChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State / Province</Label>
          <Input
            id="state"
            name="state"
            value={shippingInfo.state}
            onChange={handleShippingChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP / Postal Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={shippingInfo.zipCode}
            onChange={handleShippingChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select 
            value={shippingInfo.country} 
            onValueChange={(value) => setShippingInfo(prev => ({ ...prev, country: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleShippingChange}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => setStep(2)}>
          Continue to Billing
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderBillingForm = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="sameAsShipping"
          checked={billingInfo.sameAsShipping}
          onCheckedChange={toggleSameAsShipping}
        />
        <Label htmlFor="sameAsShipping">Same as shipping address</Label>
      </div>
      
      {!billingInfo.sameAsShipping && (
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="billingFirstName">First Name</Label>
            <Input
              id="billingFirstName"
              name="firstName"
              value={billingInfo.firstName}
              onChange={handleBillingChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="billingLastName">Last Name</Label>
            <Input
              id="billingLastName"
              name="lastName"
              value={billingInfo.lastName}
              onChange={handleBillingChange}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="billingAddress">Street Address</Label>
            <Input
              id="billingAddress"
              name="address"
              value={billingInfo.address}
              onChange={handleBillingChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="billingCity">City</Label>
            <Input
              id="billingCity"
              name="city"
              value={billingInfo.city}
              onChange={handleBillingChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="billingState">State / Province</Label>
            <Input
              id="billingState"
              name="state"
              value={billingInfo.state}
              onChange={handleBillingChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="billingZipCode">ZIP / Postal Code</Label>
            <Input
              id="billingZipCode"
              name="zipCode"
              value={billingInfo.zipCode}
              onChange={handleBillingChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="billingCountry">Country</Label>
            <Select 
              value={billingInfo.country} 
              onValueChange={(value) => setBillingInfo(prev => ({ ...prev, country: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Shipping
        </Button>
        <Button onClick={() => setStep(3)}>
          Continue to Payment
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Payment Method</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div 
            className={`flex cursor-pointer items-center rounded-lg border p-4 ${
              paymentMethod === "credit-card" ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => setPaymentMethod("credit-card")}
          >
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Credit Card</p>
              <p className="text-sm text-muted-foreground">Pay with Visa, Mastercard, etc.</p>
            </div>
          </div>
          
          <div 
            className={`flex cursor-pointer items-center rounded-lg border p-4 ${
              paymentMethod === "paypal" ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.076 21c-.992 0-1.836-.675-2.013-1.637L3.074 6.175C2.88 5.083 3.81 4 5.008 4H18.92c1.13 0 2.043.94 2.074 2.067l.217 7.865C21.242 15.675 20.316 17 18.57 17h-6.151c-1.004 0-1.875.678-2.11 1.65l-.44 1.712C9.636 21.342 8.83 22 7.815 22c-.246 0-.493-.044-.739-.133v-.867z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">PayPal</p>
              <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
            </div>
          </div>
        </div>
      </div>
      
      {paymentMethod === "credit-card" && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input
              id="nameOnCard"
              name="nameOnCard"
              value={paymentInfo.nameOnCard}
              onChange={handlePaymentChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiration Date</Label>
              <Input
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={paymentInfo.expiry}
                onChange={handlePaymentChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                name="cvc"
                placeholder="123"
                value={paymentInfo.cvc}
                onChange={handlePaymentChange}
                required
              />
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <LockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Your payment information is secure and encrypted
            </span>
          </div>
        </div>
      )}
      
      {paymentMethod === "paypal" && (
        <div className="rounded-lg border bg-card p-4 text-center">
          <p>You'll be redirected to PayPal to complete your payment.</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Billing
        </Button>
        <Button onClick={processOrder}>
          Complete Order
        </Button>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step >= 1 ? "bg-primary text-primary-foreground" : "border bg-muted text-muted-foreground"
          }`}>
            1
          </div>
          <span className="mt-1 text-sm">Shipping</span>
        </div>
        <div className="flex-1 border-t mx-2" />
        <div className="flex flex-col items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step >= 2 ? "bg-primary text-primary-foreground" : "border bg-muted text-muted-foreground"
          }`}>
            2
          </div>
          <span className="mt-1 text-sm">Billing</span>
        </div>
        <div className="flex-1 border-t mx-2" />
        <div className="flex flex-col items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step >= 3 ? "bg-primary text-primary-foreground" : "border bg-muted text-muted-foreground"
          }`}>
            3
          </div>
          <span className="mt-1 text-sm">Payment</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          
          {renderStepIndicator()}
          
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="rounded-lg border p-6">
                {step === 1 && renderShippingForm()}
                {step === 2 && renderBillingForm()}
                {step === 3 && renderPaymentForm()}
              </div>
            </div>
            
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              <div className="rounded-lg border bg-card">
                <div className="p-6">
                  <h2 className="text-lg font-medium">Order Summary</h2>
                  
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="flex-1">{item.product.name} (x{item.quantity})</span>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="pr-20"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute right-1 top-1 h-7"
                          onClick={applyPromoCode}
                        >
                          Apply
                        </Button>
                      </div>
                      <Gift className="ml-2 h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex items-center justify-between text-green-600">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
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
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
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

export default CheckoutPage;
