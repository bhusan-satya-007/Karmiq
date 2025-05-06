
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const orderNumber = "QC" + Math.floor(100000 + Math.random() * 900000);
  
  // Redirect if accessed directly
  useEffect(() => {
    const hasOrdered = localStorage.getItem("cartClearedAfterOrder");
    if (!hasOrdered) {
      navigate("/");
    }
    
    return () => {
      localStorage.removeItem("cartClearedAfterOrder");
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-8 px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="mb-2 text-3xl font-bold">Thank You!</h1>
        <p className="mb-6 text-muted-foreground">
          Your order has been received and is now being processed.
        </p>
        
        <div className="mb-6 rounded-lg border bg-card p-6 text-left">
          <h2 className="mb-4 text-lg font-medium">Order Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Delivery</span>
              <span>3-5 Business Days</span>
            </div>
          </div>
        </div>
        
        <p className="mb-6 text-sm text-muted-foreground">
          A confirmation email has been sent to your email address with all the order details.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild className="flex-1">
            <Link to="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
