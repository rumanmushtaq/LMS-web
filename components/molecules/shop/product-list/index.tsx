import { ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  sizes: string[];
  price: string;
}

const ProductCard = ({
  id,
  image,
  title,
  description,
  sizes,
  price,
}: ProductCardProps) => {
  return (
    <div className="group relative flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-muted/30 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="bg-background/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-brand-gold fill-brand-gold" />
            <span className="text-[10px] font-bold">New</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-base leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {title}
          </h3>
          <div
            className="text-muted-foreground text-xs leading-relaxed line-clamp-2 font-body"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
            Available Sizes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((size) => (
              <span
                key={size}
                className="px-2.5 py-1 text-[10px] font-bold border border-border rounded-full hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-default whitespace-nowrap"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-primary font-display font-black text-xl">
              {price}
            </span>
          </div>

          <Link
            href={`/shop/${id}`}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
