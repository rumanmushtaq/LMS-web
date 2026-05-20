"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Jenny Wilson",
    role: "Mandarin with Sarah",
    text: "Varona Acedamy made it easy to connect with native English tutors. My speaking confidence improved a lot in just 5 lessons.",
    image: "/images/avatar-1.jpg",
    rating: 5,
  },
  {
    name: "Darrell Steward",
    role: "Mandarin with Sarah",
    text: "As a beginner in yoga, I was nervous at first. But my instructor was patient and supportive. Now I love attending my online sessions.",
    image: "/images/avatar-2.jpg",
    rating: 4,
  },
  {
    name: "Annette Black",
    role: "Mandarin with Sarah",
    text: "I took art classes and within 2 months I felt confident about my painting skills. The tutors here are professionals and super friendly!",
    image: "/images/avatar-3.jpg",
    rating: 4,
  },
  {
    name: "Mina T.",
    role: "Mandarin with Sarah",
    text: "The platform is smooth and the tutors are top-class. I loved how I could schedule lessons at my convenience.",
    image: "/images/avatar-4.jpg",
    rating: 5,
  },
  {
    name: "Theresa Webb",
    role: "Mandarin with Sarah",
    text: "Varona Acedamy gave me the confidence to finally pursue my dream of learning guitar. My tutor is patient and really understands how to teach beginners like me.",
    image: "/images/avatar-1.jpg",
    rating: 5,
  },
  {
    name: "Busola Dakolo",
    role: "Mandarin with Sarah",
    text: "Varona Acedamy gave me the confidence to finally pursue my dream of learning guitar. My tutor is patient and really understands how to teach beginners like me.",
    image: "/images/avatar-2.jpg",
    rating: 4,
  },
];

const TestimonialSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const getCardStyles = (index: number) => {
    const total = TESTIMONIALS.length;
    let diff = index - activeIndex;

    // Normalize diff to be between -total/2 and total/2
    if (diff < -total / 2) diff += total;
    if (diff > total / 2) diff -= total;

    if (diff === 0) {
      // Center
      return {
        className:
          "z-30 transform scale-100 opacity-100 left-1/2 -translate-x-1/2 shadow-2xl bg-white dark:bg-card border-none",
        visible: true,
      };
    } else if (diff === 1) {
      // Right
      return {
        className:
          "z-20 transform scale-90 opacity-60 left-1/2 translate-x-[15%] shadow-md bg-white/90 dark:bg-card/90 border-transparent",
        visible: true,
      };
    } else if (diff === -1) {
      // Left
      return {
        className:
          "z-20 transform scale-90 opacity-60 left-1/2 -translate-x-[115%] shadow-md bg-white/90 dark:bg-card/90 border-transparent",
        visible: true,
      };
    } else if (diff > 1) {
      // Far Right (hidden but ready to fly in)
      return {
        className:
          "z-10 transform scale-75 opacity-0 left-1/2 translate-x-[100%] pointer-events-none",
        visible: false,
      };
    } else {
      // Far Left (hidden but ready to fly in)
      return {
        className:
          "z-10 transform scale-75 opacity-0 left-1/2 -translate-x-[200%] pointer-events-none",
        visible: false,
      };
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden flex flex-col items-center w-full">
      <div className="w-full px-4 text-center">
        <h2 className="text-4xl lg:text-5xl font-black mb-4">
          What students, love, about us
        </h2>
        <p className="text-muted-foreground font-medium mb-16 max-w-2xl mx-auto">
          Safe, effective, affordable learning. For language learners just like
          you.
        </p>

        {/* Desktop slider */}
        <div className="relative h-[450px] w-full mx-auto hidden md:block overflow-hidden">
          <div className="flex justify-center items-center h-full w-full relative max-w-[1400px] mx-auto perspective-1000">
            {TESTIMONIALS.map((item, index) => {
              const { className } = getCardStyles(index);
              return (
                <div
                  key={index}
                  className={`absolute w-[450px] transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${className}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="bg-card rounded-3xl p-10 border border-border/50 transition-shadow cursor-pointer flex flex-col items-start text-left h-[340px] w-full">
                    <div className="flex mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < item.rating
                              ? "text-[#FFB800] fill-[#FFB800]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-foreground text-[15px] leading-relaxed mb-8 flex-grow tracking-wide">
                      "{item.text}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto w-full">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-background shadow-sm shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-foreground text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile slider */}
        <div className="md:hidden relative h-[380px] w-full max-w-sm mx-auto">
          <div className="flex justify-center items-center h-full w-full relative perspective-1000">
            {TESTIMONIALS.map((item, index) => {
              const { className } = getCardStyles(index);
              return (
                <div
                  key={index}
                  className={`absolute w-full transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${className}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-xl flex flex-col items-start text-left h-[320px] w-full">
                    <div className="flex mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating
                              ? "text-[#FFB800] fill-[#FFB800]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-foreground text-sm leading-relaxed mb-8 flex-grow">
                      "{item.text}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto w-full">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-background shadow-sm shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-foreground text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? "w-8 bg-[#312E81] shadow-lg"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
