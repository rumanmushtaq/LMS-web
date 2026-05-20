"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  CheckCircle2,
  Info,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import productsService from "@/services/products";

export default function ProductDetail() {
  const params = useParams();
  const id = params?.slug as string; // Next.js dynamic route param

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
  });

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [liked, setLiked] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse font-display">
            Loading product excellence...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <Info className="w-12 h-12 text-destructive" />
        </div>
        <h2 className="text-3xl font-display font-black mb-2">
          Product Not Found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          We couldn't find the product you're looking for. It might have been
          moved or is no longer available.
        </p>
        <Link
          href="/shop"
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Dynamic Header/Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-border group-hover:border-primary/50 flex items-center justify-center bg-background group-hover:bg-primary/5 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to Shop
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
            <span>Shop</span>
            <span className="opacity-30">/</span>
            <span className="text-primary/70">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Visual Gallery Section */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] bg-muted/20 rounded-3xl overflow-hidden border border-border/50 group">
              <Image
                src={product.images?.[0] || "/images/placeholder.png"}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => setLiked((prev) => !prev)}
                  className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all border ${
                    liked
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-white/80 border-white/20 text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border/50 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  Fast delivery
                </span>
              </div>
              <div className="bg-card border border-border/50 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  Secure Pay
                </span>
              </div>
              <div className="bg-card border border-border/50 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  Pure Quality
                </span>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col py-2">
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-brand-gold/20">
                  Top Choice
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                  <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                  <span>4.9 (120+ Reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground drop-shadow-sm leading-[1.1]">
                {product.title}
              </h1>
            </div>

            <div className="text-3xl font-display font-black text-primary mb-8">
              ${product.price.toFixed(2)}
            </div>

            <div
              className="prose prose-sm max-w-none text-muted-foreground mb-10 font-body leading-relaxed border-l-2 border-primary/20 pl-6 py-2"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <div className="space-y-10">
              {/* Size Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                    Select Size
                  </h3>
                  <button className="text-[10px] font-bold text-primary underline underline-offset-4 uppercase">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[56px] h-14 flex items-center justify-center px-4 font-display font-black text-sm border-2 rounded-2xl transition-all ${
                        selectedSize === size
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                          : "bg-background border-border hover:border-primary/50 text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-6 pt-6 border-t border-border/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center bg-muted/30 rounded-2xl p-1 border border-border/50 w-full sm:w-auto self-start">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-background rounded-xl transition-colors text-muted-foreground"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-display font-black text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-background rounded-xl transition-colors text-muted-foreground"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    className="flex-1 bg-primary text-white h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Collection
                  </button>
                </div>

                <p className="text-[10px] text-center sm:text-left font-bold text-muted-foreground/60 uppercase tracking-tighter">
                  Free shipping on orders over $100 • 30-day elegant returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-border/50 p-8 sm:p-12 relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-8 top-8 w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-destructive hover:text-white transition-all"
            >
              ✕
            </button>

            <div className="text-center mb-10">
              <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2">
                Secure Checkout
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete your acquisition of the {product.title}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-muted/20 border-border/50 border-2 px-4 py-3 rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="w-full bg-muted/20 border-border/50 border-2 px-4 py-3 rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-muted/20 border-border/50 border-2 px-4 py-3 rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  Shipping Destination
                </label>
                <textarea className="w-full bg-muted/20 border-border/50 border-2 px-4 py-3 rounded-xl focus:border-primary outline-none transition-all font-bold text-sm min-h-[100px]" />
              </div>

              <button className="w-full bg-primary text-white h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all mt-4">
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
