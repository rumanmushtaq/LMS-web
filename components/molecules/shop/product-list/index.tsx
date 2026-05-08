import { ChevronRight } from "lucide-react";
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
    <div className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-150 hover:shadow-md group">
      
      <div className="aspect-square bg-secondary/30 flex items-center justify-center p-4 overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={300}
          height={300}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="bg-product-title px-4 py-2.5">
        <h3 className="text-product-title-foreground font-display font-semibold text-sm">
          {title}
        </h3>
      </div>

      <div className="px-4 py-4 space-y-3">
        <p className="text-muted-foreground text-sm font-body">{description}</p>

        <div>
          <p className="text-xs text-muted-foreground mb-1.5 font-body">
            Available sizes:
          </p>

          <div className="flex gap-1.5">
            {sizes.map((size) => (
              <span
                key={size}
                className="w-7 h-7 flex items-center justify-center text-xs font-medium border border-size-badge rounded text-foreground"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-price font-display font-bold text-lg">
            {price}
          </span>

          <Link
            href={`/shop/${id}`}
            className="text-link text-sm font-medium flex items-center gap-0.5 hover:underline transition-colors duration-150"
          >
            View details <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
