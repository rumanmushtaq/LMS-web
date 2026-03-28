"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Student/learning related images for slider
const sliderImages = [
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    alt: "Students studying together",
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    alt: "Students collaborating on project",
  },
  {
    src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
    alt: "Student learning online",
  },
  {
    src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
    alt: "Students in classroom",
  },
];

const LeftPanel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-[hsl(var(--panel-left))] relative overflow-hidden min-h-screen px-12">
      {/* Background circles */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[hsl(var(--panel-left-circle))] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[hsl(var(--panel-left)/0.6)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Image Slider */}
      <div className="relative z-10 mb-8 w-80 h-80 overflow-hidden rounded-2xl shadow-2xl">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderImages.map((image, index) => (
            <div key={index} className="min-w-full h-full relative">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        
        {/* Slider indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? "bg-primary w-6" 
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10 text-center max-w-sm mt-6">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Welcome to{" "}
          <span className="block">
            Dreams<span className="text-primary">LMS</span> Courses.
          </span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Platform designed to help organizations, educators, and learners
          manage, deliver, and track learning and training activities.
        </p>
      </div>
    </div>
  );
};

export default LeftPanel;
