"use client";

import HeroBanner from "@/components/molecules/shop/hero-section";
import ProductCard from "@/components/molecules/shop/product-list";
import useShop from "./useShop";

const Index = () => {
  const { products, loading, error } = useShop();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeroBanner />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <HeroBanner />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-500 py-12">
            <p className="text-xl font-semibold">Error loading products</p>
            <p>{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
