
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="px-4 py-12 md:py-24 lg:py-32 bg-accent relative overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-xl space-y-6">
          <div className="space-y-2">
            <Badge className="opacity-60" variant="secondary">New Collection</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Shop Smarter, <br />
              <span className="text-primary">Delivered Faster</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground md:text-xl">
            Experience lightning-fast delivery and discover products you'll love. Shop with confidence on QuickCart.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/deals">View Deals</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
        <div className="absolute right-0 w-1/3 md:w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
      </div>
    </section>
  );
}

// Local Badge component for the hero section
function Badge({ className, variant = "default", children }: { className?: string; variant?: "default" | "secondary"; children: React.ReactNode }) {
  return (
    <span 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors
        ${variant === "secondary" ? "border-muted bg-secondary text-secondary-foreground" : "border-transparent bg-primary/10 text-primary"}
        ${className || ""}`
      }
    >
      {children}
    </span>
  );
}
