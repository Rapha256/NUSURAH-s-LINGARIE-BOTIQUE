import { Link } from "react-router-dom";

const categories = [
  { name: "Nightwear", emoji: "🌙", color: "bg-lavender-light" },
  { name: "Lingerie", emoji: "💕", color: "bg-rose-light" },
  { name: "Innerwear", emoji: "✨", color: "bg-nude-light" },
  { name: "New Arrivals", emoji: "🆕", color: "bg-lavender-light" },
];

const CategoryBanner = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/shop"
              className={`${cat.color} rounded-lg p-6 md:p-8 text-center hover:shadow-elevated transition-all duration-300 group border border-border`}
            >
              <span className="text-4xl mb-3 block">{cat.emoji}</span>
              <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;
