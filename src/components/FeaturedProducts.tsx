import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const FeaturedProducts = () => {
  const newThisWeek = products.filter((p) => p.isNewThisWeek);
  const featured = products.slice(0, 6);

  return (
    <>
      {/* New This Week Section */}
      {newThisWeek.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.2em] uppercase text-primary font-medium mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" /> Fresh Arrivals
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                New This Week 🔥
              </h2>
              <p className="text-muted-foreground mt-2">
                Check out our latest outfits — available for one week only in this section!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {newThisWeek.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Featured Products */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] uppercase text-primary font-medium mb-2">
              Our Collection
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Featured Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button size="lg" variant="outline" className="px-8">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;
