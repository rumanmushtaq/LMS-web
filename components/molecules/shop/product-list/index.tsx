"use client";

import { ShoppingBag, Star, Package, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useCart } from "@/store/cart";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  sizes: string[];
  price: string;
}

/** Pulls a numeric major-unit price out of a display string like "$24.00". */
function parsePrice(price: string): number {
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const ProductCard = ({
  id,
  image,
  title,
  description,
  sizes,
  price,
}: ProductCardProps) => {
  const add = useCart((s) => s.add);

  const handleAdd = (e: React.MouseEvent) => {
    // The whole card is a <Link>; keep the click from navigating.
    e.preventDefault();
    e.stopPropagation();
    const size = sizes?.[0] || "M";
    add({
      productId: id,
      title,
      image,
      price: parsePrice(price),
      size,
      sizes,
    });
    toast.success(`Added ${title} (${size}) to cart`);
  };

  return (
    <Link
      href={`/shop/${id}`}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 relative"
    >
      {/* ── IMAGE AREA ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.07]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted/60 to-muted/20">
            <Package
              className="w-14 h-14 text-muted-foreground/25"
              strokeWidth={1}
            />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground/40">
              No Image
            </span>
          </div>
        )}

        {/* ── NEW ARRIVAL BADGE ── */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <div className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-black tracking-[0.15em] uppercase">
              New
            </span>
          </div>
        </div>

        {/* ── PRICE TAG (top-right) ── */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <div className="bg-background/90 backdrop-blur-md text-foreground px-3.5 py-1.5 rounded-full shadow-lg border border-border/60">
            <span className="text-sm font-black tracking-tight">{price}</span>
          </div>
        </div>

        {/* ── HOVER CTA OVERLAY ── */}
        <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-24 transition-all duration-500 ease-out overflow-hidden z-20">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 to-primary/70 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2.5 text-primary-foreground translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
              <ShoppingBag className="w-5 h-5" strokeWidth={2} />
              <span className="font-bold text-sm tracking-wide">
                View Details
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── INFO AREA ── */}
      <div className="flex flex-col gap-3 p-4 pt-4 pb-5">
        {/* Title */}
        <div>
          <h3 className="font-bold text-[15px] leading-snug text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <div
            className="text-muted-foreground text-xs leading-relaxed line-clamp-1 mt-1 opacity-75"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* Sizes */}
        {sizes && sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-muted/60 text-muted-foreground rounded-md border border-border/50 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-200"
              >
                {size}
              </span>
            ))}
            {sizes.length > 5 && (
              <span className="px-2 py-1 text-[10px] font-bold text-muted-foreground/60">
                +{sizes.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Add to cart */}
        <button
          type="button"
          onClick={handleAdd}
          className="mt-1 inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add to cart
        </button>
      </div>

      {/* ── BOTTOM ACCENT LINE ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
    </Link>
  );
};

export default ProductCard;
