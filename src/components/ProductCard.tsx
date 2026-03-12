import { Heart, ShoppingCart, MessageCircle, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, formatPrice } from "@/data/products";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const isVideoUrl = (url: string) => /\.(mp4|webm|mov|avi|mkv|flv|wmv|m4v|3gp|ogv)(\?|$)/i.test(url);

const ProductCard = ({ product }: ProductCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.likes);

  const whatsappMessage = encodeURIComponent(
    `Hi Nusurah! I'm interested in: ${product.name} (${formatPrice(product.price)}). Please share more details.`
  );

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const stockQty = product.stockQuantity ?? 0;
  const isLowStock = stockQty > 0 && stockQty <= 5;
  const isOutOfStock = stockQty === 0;

  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {isVideoUrl(product.image) ? (
          <video
            src={product.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            autoPlay muted loop playsInline
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
              NEW
            </span>
          )}
          {product.isNewThisWeek && (
            <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
              🔥 THIS WEEK
            </span>
          )}
          {product.isDiscounted && product.originalPrice && (
            <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
        {/* Like */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-foreground/60"}`} />
        </button>
        {/* Stock Badge */}
        <div className="absolute bottom-3 left-3">
          {isOutOfStock ? (
            <span className="bg-destructive/90 text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Package className="h-3 w-3" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-yellow-500/90 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Package className="h-3 w-3" /> Only {stockQty} left!
            </span>
          ) : (
            <span className="bg-card/80 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Package className="h-3 w-3" /> {stockQty} in stock
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-base mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-border"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
          <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
            <Heart className="h-3 w-3" /> {likeCount}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={`https://wa.me/256765608475?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90" disabled={isOutOfStock}>
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
          </a>
          <Button size="sm" variant="outline" className="flex-1" disabled={isOutOfStock}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
