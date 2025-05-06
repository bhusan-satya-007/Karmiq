
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { InfoBanner } from "@/components/home/info-banner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories />
        <FeaturedProducts />
        <InfoBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
