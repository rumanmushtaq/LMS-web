"use client";

import HeroBanner from "@/components/molecules/shop/hero-section";
import ProductCard from "@/components/molecules/shop/product-list";
import useShop from "./useShop";
import { Package, Loader2 } from "lucide-react";

const ShopSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 xl:gap-8">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex flex-col rounded-2xl overflow-hidden bg-card border border-border animate-pulse">
        <div className="aspect-[3/4] bg-muted/50" />
        <div className="p-4 flex flex-col gap-3">
          <div className="h-4 bg-muted/60 rounded w-3/4" />
          <div className="h-3 bg-muted/40 rounded w-full" />
          <div className="flex gap-1.5">
            <div className="h-6 w-12 bg-muted/40 rounded-md" />
            <div className="h-6 w-10 bg-muted/40 rounded-md" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Index = () => {
  const { products, loading, error } = useShop();

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />

      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-14 md:py-20">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-black tracking-[0.3em] uppercase text-primary mb-2">
              Exclusive Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              Shop Our Latest
              <span className="block text-muted-foreground/50 text-2xl md:text-3xl font-semibold mt-1">
                Premium Products
              </span>
            </h2>
          </div>
          {!loading && !error && products && products.length > 0 && (
            <p className="text-sm text-muted-foreground font-medium shrink-0">
              {products.length} item{products.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* ── DIVIDER ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

        {/* ── CONTENT ── */}
        {loading ? (
          <ShopSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Package className="w-8 h-8 text-destructive/60" strokeWidth={1.5} />
            </div>
            <p className="text-lg font-semibold text-foreground">Failed to load products</p>
            <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
          </div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground/40" strokeWidth={1} />
            </div>
            <p className="text-xl font-bold text-foreground">No products yet</p>
            <p className="text-sm text-muted-foreground">
              Check back soon — new arrivals are on their way.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 xl:gap-8">
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.images[0] || ""}
                title={product.title}
                description={product.description}
                sizes={product.sizes}
                price={`$${product.price.toFixed(2)}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
