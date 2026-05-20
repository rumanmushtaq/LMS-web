"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HeroBannerService } from "@/services/hero-banner";
import CategorySearch from "@/components/molecules/shop/hero-section/CategorySearch";
import { Star, GraduationCap, Users, BookOpen, Banana } from "lucide-react";

/**
 * Premium Hero Slider designed to match the user's specific reference.
 * It features a split layout with text/search on the left and a
 * professional student cutout with a background accent on the right.
 */
const DEFAULT_BANNER = {
  subtitle: "The Leader in Online Learning",
  title: "Engaging & Accessible Online Courses For All",
  description:
    "Our specialized online courses are designed to bring the classroom experience to you, no matter where you are.",
  imageUrl:
    "https://ik.imagekit.io/gjn7eiizx/premium_lms_banner_student_1_1778874538909.png",
  trustedText: "Trusted by over 15K Users worldwide since 2022",
  studentCount: "35K+",
  courseCount: "50+",
  rating: "4.9 / 5.0",
  highlightedWord: "Online",
};

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
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  if (loading) {
    return (
      <div className="h-[600px] lg:h-[700px] w-full bg-muted/20 animate-pulse rounded-b-[60px]" />
    );
  }

  // Use the fetched banner if available, otherwise use the static default
  const currentBanner =
    banners.length > 0 ? banners[currentIndex] : DEFAULT_BANNER;
  // Default highlighted word if not provided by API
  const highlightedWord = currentBanner.highlightedWord || "Online";

  return (
    <section className="relative w-full min-h-[650px] lg:h-[750px] overflow-hidden bg-white/50 dark:bg-background/50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[50%] w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl animate-bounce duration-[10s]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto h-full flex flex-col lg:flex-row items-center relative z-10 px-4 py-12 lg:py-0"
        >
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-1/2 space-y-8 text-left lg:pr-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-[2px] bg-primary/40 rounded-full" />
                <p className="text-muted-foreground font-bold tracking-wide text-sm uppercase">
                  {currentBanner.subtitle}
                </p>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] text-foreground tracking-tight">
                {currentBanner.title
                  .split(highlightedWord)
                  .map((part: string, i: number) => (
                    <span key={i}>
                      {part}
                      {i === 0 &&
                        currentBanner.title.includes(highlightedWord) && (
                          <span className="relative inline-block mx-2">
                            <span className="relative z-10 text-[#FF4D6D] border-3 border-[#FF4D6D] px-6 py-1 rounded-full inline-block transform -rotate-1 shadow-sm">
                              {highlightedWord}
                            </span>
                          </span>
                        )}
                    </span>
                  ))}
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                {currentBanner.description}
              </p>
            </motion.div>

            {/* SEARCH SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full max-w-2xl bg-white dark:bg-card border-none shadow-2xl shadow-primary/10 rounded-[2rem] p-1 scale-105 origin-left"
            >
              <CategorySearch />
            </motion.div>

            {/* TRUSTED INFO */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden relative shadow-sm"
                    >
                      <Image
                        src={`/images/avatar-${(i % 4) + 1}.jpg`}
                        alt="student"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-black text-primary drop-shadow-sm">
                      {currentBanner.studentCount}
                    </span>{" "}
                    <span className="text-muted-foreground font-medium">
                      Students Enrolled worldwide
                    </span>
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[#FFB800]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <span className="text-xs font-bold text-foreground ml-1">
                      {currentBanner.rating} / 5.0 (200 Review)
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />{" "}
                {currentBanner.trustedText}
              </p>
            </motion.div>
          </div>

          {/* RIGHT SIDE - IMAGE & DECORATIONS */}
          <div className="w-full lg:w-1/2 h-[500px] lg:h-full relative flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
            {/* Background Circle Element */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              className="absolute w-[350px] lg:w-[450px] h-[350px] lg:h-[450px] bg-[#FFB800] rounded-full z-0 transform translate-x-10 -translate-y-5"
            />

            {/* Banana Mascot / Icon for the expert touch */}
            <motion.div
              initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-[10%] right-[10%] z-30 bg-white dark:bg-card p-4 rounded-3xl shadow-xl border border-border/50"
            >
              <Banana className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            </motion.div>

            {/* Main Student Image */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-[400px] lg:w-[500px] h-[500px] lg:h-[600px] z-10"
            >
              <Image
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Stats Boxes - Floating */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute left-[5%] bottom-[20%] z-20 bg-white dark:bg-card p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-border/50 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E8F1FF] flex items-center justify-center text-[#1E90FF]">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-black">
                  {currentBanner.courseCount || "50+"}
                </p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                  Courses
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute top-[40%] right-[-5%] z-20"
            >
              <div className="w-16 h-16 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shadow-lg animate-bounce">
                <GraduationCap className="w-8 h-8" />
              </div>
            </motion.div>

            {/* Small decorative elements */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-0">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                className="text-primary opacity-20 transform rotate-45"
              >
                <path fill="currentColor" d="M12 2L1 21h22L12 2z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Controls */}
      <div className="absolute bottom-12 right-12 flex items-center gap-4 z-30">
        <div className="flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-10 bg-primary shadow-lg shadow-primary/30"
                  : "w-2 bg-primary/20 hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
