import HeroBanner from '@/components/molecules/shop/hero-section';
import ProductCard from '@/components/molecules/shop/product-list'

const Index = () => {
  const products = [
    {
      id: "classic-black",
      image: "/images/tshirt-black.png",
      title: "Classic Black T-Shirt",
      description: "Comfortable cotton black T-shirt.",
      sizes: ["S", "M", "L", "XL"],
      price: "$19.99",
    },
    {
      id: "stylish-red",
      image: "/images/tshirt-red.png",
      title: "Stylish Red T-Shirt",
      description: "Bright red T-shirt with soft fabric.",
      sizes: ["S", "M", "L", "XL"],
      price: "$21.99",
    },
    {
      id: "classic-white",
      image: "/images/tshirt-white.png",
      title: "Classic White T-Shirt",
      description: "Comfortable and lightweight white T-shirt.",
      sizes: ["S", "M", "L", "XL"],
      price: "$18.99",
    },
    {
      id: "classic-white-splash",
      image: "/images/tshirt-white2.png",
      title: "Splash White T-Shirt",
      description: "Colorful splash design on premium white fabric.",
      sizes: ["S", "M", "L", "XL"],
      price: "$18.99",
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <HeroBanner />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...products, ...products, ...products, ...products]?.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} {...product} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Index