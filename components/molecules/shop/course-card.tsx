"use client";

import { Star, Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  image: string;
  category: string;
  instructor: {
    name: string;
    avatar: string;
  };
  title: string;
  rating: number;
  reviews: number;
  price: string;
  badge?: string;
}

const CourseCard = ({
  image,
  category,
  instructor,
  title,
  rating,
  reviews,
  price,
  badge,
}: CourseCardProps) => {
  return (
    <div className="group bg-card rounded-[40px] border border-border/50 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full">
      {/* Course Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        {badge && (
          <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 space-y-4 flex flex-col flex-1">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={instructor.avatar}
              alt={instructor.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {instructor.name}
          </span>
          <span className="ml-auto bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-md uppercase">
            {category}
          </span>
        </div>

        <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 pt-2">
          <div className="flex text-yellow-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= Math.floor(rating) ? "fill-current" : "opacity-30"}`}
              />
            ))}
          </div>
          <span className="text-xs font-bold">
            {rating} ({reviews} Reviews)
          </span>
        </div>

        <div className="pt-6 flex flex-col items-center gap-4 mt-auto">
          <Button className="w-full rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 py-6 text-base">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
