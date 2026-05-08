"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HeroBannerService } from "@/services/hero-banner";
import CategorySearch from "@/components/molecules/shop/hero-section/CategorySearch";
import { Star } from "lucide-react";

const HeroSlider = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await HeroBannerService.getActiveBanners();
        setBanners(data);
      } catch (error) {
        console.error("Failed to fetch banners", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  if (loading || banners.length === 0) {
    return (
      <div className="h-[600px] w-full bg-muted animate-pulse rounded-b-[60px]" />
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative w-full h-[650px] lg:h-[750px] overflow-hidden bg-background rounded-b-[60px] lg:rounded-b-[100px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with Gradient Overlay */}
          <div className="relative w-full h-full">
            <Image
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>

          <div className="container relative z-20 h-full flex items-center justify-center">
            <div className="flex flex-col items-center text-center space-y-10 w-full max-w-4xl px-6 lg:px-0">
              {/* CONTENT */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <p className="text-primary font-bold tracking-widest uppercase text-sm bg-primary/10 px-4 py-1 rounded-full inline-block">
                    {currentBanner.subtitle}
                  </p>
                  <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] text-foreground">
                    {currentBanner.title
                      .split("Online")
                      .map((part: string, i: number) => (
                        <span key={i}>
                          {part}
                          {i === 0 &&
                            currentBanner.title.includes("Online") && (
                              <span className="relative inline-block mx-2">
                                <span className="relative z-10 text-white bg-primary px-4 py-1 rounded-2xl transform -rotate-2 inline-block shadow-lg shadow-primary/30">
                                  Online
                                </span>
                              </span>
                            )}
                        </span>
                      ))}
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center"
                >
                  <CategorySearch />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden relative"
                        >
                          <Image
                            src={`/images/avatar-${i}.jpg`}
                            alt="student"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {currentBanner.studentCount} Students Enrolled
                      </p>
                    </div>
                  </div>

                  <div className="h-8 w-[1px] bg-border hidden sm:block" />

                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {currentBanner.rating} / 5.0 (200 Review)
                    </p>
                  </div>
                </motion.div>

                <p className="text-muted-foreground/80 font-medium">
                  {currentBanner.trustedText}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
