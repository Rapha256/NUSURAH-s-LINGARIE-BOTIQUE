export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  gender: string;
  ageRange?: string;
  isNew?: boolean;
  isDiscounted?: boolean;
  rating: number;
  reviews: number;
  likes: number;
}

export const categories = [
  "Nightwear",
  "Innerwear",
  "Lingerie",
  "New Arrivals",
  "Discounted Items",
  "Women",
  "Men",
  "Children",
];

export const products: Product[] = [
  {
    id: "1",
    name: "Elegant Pajama Set",
    description: "Soft printed pajama set perfect for a cozy night's sleep. Lightweight and breathable fabric.",
    price: 45000,
    originalPrice: 55000,
    image: "/images/product-1.jpeg",
    category: "Nightwear",
    gender: "Women",
    ageRange: "18-25",
    isDiscounted: true,
    rating: 4.5,
    reviews: 24,
    likes: 56,
  },
  {
    id: "2",
    name: "Classic Sleepwear Pajamas",
    description: "Beautiful patterned sleepwear for ultimate comfort. Comes with matching bonnet.",
    price: 50000,
    image: "/images/product-2.jpeg",
    category: "Nightwear",
    gender: "Women",
    ageRange: "26-35",
    isNew: true,
    rating: 4.8,
    reviews: 31,
    likes: 72,
  },
  {
    id: "3",
    name: "Comfort Night Set",
    description: "Premium quality night set with detailed patterns. Perfect gift for loved ones.",
    price: 48000,
    image: "/images/product-3.jpeg",
    category: "Nightwear",
    gender: "Women",
    ageRange: "26-35",
    rating: 4.3,
    reviews: 18,
    likes: 43,
  },
  {
    id: "4",
    name: "Floral Sheer Robe",
    description: "Delicate floral sheer robe with lace trim. Perfect for bridal wear or special occasions.",
    price: 65000,
    originalPrice: 80000,
    image: "/images/product-4.jpeg",
    category: "Lingerie",
    gender: "Women",
    ageRange: "18-25",
    isDiscounted: true,
    rating: 4.9,
    reviews: 45,
    likes: 120,
  },
  {
    id: "5",
    name: "Cute Polka Dot Pajama Set",
    description: "Adorable polka dot pajama set available in pink, orange, and lavender. Super soft material.",
    price: 38000,
    image: "/images/product-5.jpeg",
    category: "Nightwear",
    gender: "Women",
    ageRange: "18-25",
    isNew: true,
    rating: 4.6,
    reviews: 52,
    likes: 89,
  },
  {
    id: "6",
    name: "Embroidered Satin Robe",
    description: "Luxurious pink satin robe with floral embroidery. Elegant and comfortable.",
    price: 75000,
    image: "/images/product-6.jpeg",
    category: "Lingerie",
    gender: "Women",
    ageRange: "26-35",
    isNew: true,
    rating: 4.7,
    reviews: 38,
    likes: 95,
  },
];

export const formatPrice = (price: number) => {
  return `UGX ${price.toLocaleString()}`;
};
