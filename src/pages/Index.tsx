import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryBanner from "@/components/CategoryBanner";
import PromoBanner from "@/components/PromoBanner";

const Index = () => {
  return (
    <main>
      <HeroSection />
      <PromoBanner />
      <FeaturedProducts />
      <CategoryBanner />
    </main>
  );
};

export default Index;
