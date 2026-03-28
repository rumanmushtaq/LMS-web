"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Star, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

const allProducts: Record<
  string,
  {
    image: string;
    title: string;
    description: string;
    longDescription: string;
    sizes: string[];
    price: string;
    rating: number;
    reviews: number;
    material: string;
    care: string[];
  }
> = {
  "classic-black": {
    image: "/images/tshirt-black.png",
    title: "Classic Black T-Shirt",
    description: "Comfortable cotton black T-shirt.",
    longDescription:
      "Our signature Classic Black T-Shirt features premium Varona Academy artwork with vibrant colors that pop against the deep black fabric.",
    sizes: ["S", "M", "L", "XL"],
    price: "$19.99",
    rating: 4.8,
    reviews: 124,
    material: "100% Ring-Spun Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
  },

  "stylish-red": {
    image: "/images/tshirt-red.png",
    title: "Stylish Red T-Shirt",
    description: "Bright red T-shirt with soft fabric.",
    longDescription:
      "Stand out from the crowd with this bold Stylish Red T-Shirt.",
    sizes: ["S", "M", "L", "XL"],
    price: "$21.99",
    rating: 4.9,
    reviews: 89,
    material: "60% Cotton, 40% Polyester",
    care: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
  },

  "classic-white": {
    image: "/images/tshirt-white.png",
    title: "Classic White T-Shirt",
    description: "Comfortable and lightweight white T-shirt.",
    longDescription:
      "Clean, crisp, and classic — our White T-Shirt is a wardrobe essential.",
    sizes: ["S", "M", "L", "XL"],
    price: "$18.99",
    rating: 4.7,
    reviews: 156,
    material: "100% Combed Cotton",
    care: ["Machine wash cold", "Tumble dry low"],
  },

  "classic-white-splash": {
    image: "/images/tshirt-white2.png",
    title: "Splash White T-Shirt",
    description: "Colorful splash design on premium white fabric.",
    longDescription: "Unleash your creativity with the Splash White T-Shirt.",
    sizes: ["S", "M", "L", "XL"],
    price: "$18.99",
    rating: 4.9,
    reviews: 67,
    material: "100% Organic Cotton",
    care: ["Machine wash cold", "Hang dry recommended"],
  },
};

export default function ProductDetail() {
  const params = useParams();
  const id = params?.slug as string;
  const product = id ? allProducts[id] : null;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  const fullStars = Math.floor(product.rating);

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="bg-secondary/30 rounded-xl p-8 border flex justify-center">
            <Image
              src={product.image}
              alt={product.title}
              width={500}
              height={500}
              className="object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < fullStars
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <span className="text-sm">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-muted-foreground">{product.longDescription}</p>

            <div className="text-3xl font-bold">{product.price}</div>

            {/* Size Selection */}
            <div>
              <p className="font-semibold mb-2">Select Size</p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded-lg ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "hover:border-gray-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-semibold mb-2">Quantity</p>

              <div className="flex items-center border rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10"
                >
                  -
                </button>

                <span className="w-12 text-center">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                But Now
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setLiked((prev) => !prev)}
                className="w-14 h-14 border rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`w-5 h-5 transition ${
                    liked ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-center mb-4">
              COMPLETE YOUR PURCHASE SECURELY
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-2 rounded-md"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded-md"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border p-2 rounded-md"
              />

              <input
                type="text"
                placeholder="Shipping Address"
                className="w-full border p-2 rounded-md"
              />

              <textarea
                placeholder="Additional Notes"
                className="w-full border p-2 rounded-md"
              />

              <button className="w-full bg-primary text-white py-3 rounded-lg">
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
