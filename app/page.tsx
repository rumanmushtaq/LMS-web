"use client";

import { useState, useEffect } from "react";
import HeroSlider from "@/components/organisms/Auth/landingPAge/hero-Banner";
import TestimonialSlider from "@/components/organisms/Auth/landingPAge/TestimonialSlider";
import CourseCard from "@/components/molecules/shop/course-card";
import JoinUs from "@/components/organisms/Auth/landingPAge/JoinUs";
import FAQSection from "@/components/organisms/Auth/landingPAge/FAQSection";
import LanguageTutorsSection from "@/components/organisms/Auth/landingPAge/LanguageTutorsSection";
import WorldTutorsSection from "@/components/organisms/Auth/landingPAge/WorldTutorsSection";
import HowItWorks from "@/components/organisms/Auth/landingPAge/HowItWorks";
import { CheckCircle, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import instructorsService, {
  InstructorProfile as IInstructor,
} from "@/services/instructors";
import categoriesService from "@/services/categories";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const [topCategories, setTopCategories] = useState<{ name: string; count: number; image?: string }[]>([]);
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to match category name to a visual emoji icon
  const getCategoryIcon = (name: string): string => {
    const iconMap: Record<string, string> = {
      "Management": "📊",
      "IT & Softwares": "💻",
      "IT & Software": "💻",
      "Software": "💻",
      "Marketing": "🎯",
      "Productivity": "⚡",
      "Lifestyles": "🏠",
      "Lifestyle": "🏠",
      "Design": "🎨",
      "Academic": "🎓",
      "Academics": "🎓",
      "Development": "🚀",
      "Business": "💼",
      "Finance": "💵",
      "Photography": "📷",
      "Music": "🎵",
      "Health & Fitness": "🏃",
      "Languages": "🗣️",
      "Language": "🗣️",
    };

    const normalized = name.trim();
    if (iconMap[normalized]) return iconMap[normalized];
    
    // Check substring matches
    for (const key of Object.keys(iconMap)) {
      if (normalized.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(normalized.toLowerCase())) {
        return iconMap[key];
      }
    }
    
    // Deterministic fallback
    const defaults = ["📚", "🎓", "✏️", "💡", "🏫", "🌟"];
    const index = Math.abs(name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % defaults.length;
    return defaults[index];
  };

  // Fetch available categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [filterRes, categoriesRes] = await Promise.all([
          instructorsService.getFilterOptions(),
          categoriesService.getCategories(),
        ]);

        if (filterRes.categories) {
          const names = filterRes.categories.map((c) => c.name);
          setCategories(["All Categories", ...names]);
        }

        if (categoriesRes) {
          const mapped = categoriesRes.map((cat) => {
            const match = filterRes.categories?.find(
              (c) => c.name.toLowerCase().trim() === cat.title.toLowerCase().trim()
            );
            return {
              name: cat.title,
              count: match ? match.count : 0,
              image: cat.image,
            };
          });
          setTopCategories(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch instructors when category changes
  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoading(true);
      try {
        const params =
          activeCategory === "All Categories"
            ? {}
            : { category: activeCategory };
        const response = await instructorsService.getInstructors(params);
        const rawData = Array.isArray(response)
          ? response
          : response.data || [];
        setInstructors(
          rawData.map((inst: any) => ({
            ...inst,
            avatar: inst.avatar || inst.photoUrl,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstructors();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <HeroSlider />

      {/* TOP CATEGORIES SECTION */}
      <section className="py-24 container mx-auto px-4 flex flex-col items-center">
        <div className="text-center space-y-4 mb-16 max-w-3xl">
          <p className="text-primary font-bold bg-primary/10 px-4 py-1 rounded-full inline-block">
            Favourite Course
          </p>
          <h2 className="text-4xl lg:text-5xl font-black">Top Category</h2>
          <p className="text-muted-foreground">
            The right course, guided by an expert mentor, can provide invaluable
            insights, practical skills
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
          {(topCategories.length > 0
            ? topCategories
            : [
                { name: "Management", count: 156 },
                { name: "IT & Softwares", count: 214 },
                { name: "Marketing", count: 174 },
                { name: "Productivity", count: 126 },
                { name: "Lifestyles", count: 214 },
                { name: "Design", count: 161 },
                { name: "Development", count: 189 },
              ]
          ).slice(0, 7).map((cat, i) => (
            <div
              key={i}
              className="relative group overflow-hidden rounded-[30px] aspect-[4/5] cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              {/* Full background image or fallback background with icon */}
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/80 to-primary/40 flex flex-col items-center justify-center transition-transform duration-700 group-hover:scale-110">
                  <span className="text-6xl drop-shadow-xl mb-4">{getCategoryIcon(cat.name)}</span>
                </div>
              )}

              {/* Gradient overlay to make text readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Content overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-lg leading-tight mb-1">
                  {cat.name}
                </h3>
                <p className="text-white/80 text-xs font-medium">
                  {cat.count} {cat.count === 1 ? "Course" : "Courses"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full ${i === 1 ? "w-8 bg-primary" : "w-2 bg-muted"}`}
            />
          ))}
        </div>
      </section>

      <WorldTutorsSection />

      {/* OUR BENEFITS SECTION */}
      <section className="py-24 bg-muted/50 relative overflow-hidden flex flex-col items-center">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="space-y-4 mb-16 max-w-3xl">
            <p className="text-white bg-foreground/80 px-4 py-1 rounded-full inline-block">
              Our Benefits
            </p>
            <h2 className="text-4xl lg:text-5xl font-black">
              Master the skills to drive your career
            </h2>
            <p className="text-muted-foreground">
              The right course, guided by an expert mentor, can provide
              invaluable insights, practical skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl">
            {[
              {
                title: "Stay motivated with instructors",
                desc: "Stay motivated with engaging instructors on our platform, guiding you through every course.",
                img: "👨‍🏫",
              },
              {
                title: "Get certified on courses",
                desc: "Get certified, master modern tech skills, and level up your career whether you're starting.",
                img: "📜",
              },
              {
                title: "Build skills on your way",
                desc: "Build skills your way with hands-on labs and immersive courses, tailored to fit.",
                img: "🚀",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="text-center space-y-6 flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl mx-auto outline outline-8 outline-primary/5">
                  {benefit.img}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* FEATURED COURSES SECTION -> INSTRUCTOR OR TUTOR */}
      <section className="py-24 container mx-auto px-4 flex flex-col items-center">
        <div className="text-center space-y-4 mb-16 max-w-3xl">
          <p className="text-primary font-bold bg-primary/10 px-4 py-1 rounded-full inline-block">
            What's New
          </p>
          <h2 className="text-4xl lg:text-5xl font-black">
            Instructor or Tutor
          </h2>
          <p className="text-muted-foreground">
            Discover our expert instructors, specially curated to help you gain
            in-demand skills
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12 w-full">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "bg-card border border-border/50 hover:border-primary text-muted-foreground hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium">
              Loading expert instructors...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {instructors.map((instructor, i) => (
                <CourseCard
                  key={i}
                  image={instructor.avatar || "/images/course-1.jpg"}
                  category={instructor.categories[0] || "General"}
                  title={instructor.title || instructor.fullName}
                  price={
                    instructor.hourlyRate
                      ? `$${instructor.hourlyRate}/hr`
                      : "Free"
                  }
                  rating={instructor.rating}
                  reviews={instructor.reviewCount}
                  badge={instructor.level || "Tutor"}
                  instructor={{
                    name: instructor.fullName,
                    avatar: instructor.avatar || "/images/avatar-1.jpg",
                  }}
                />
              ))}
            </div>

            {instructors.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-muted-foreground text-lg">
                  No instructors found in this category.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* STATS SECTION */}
      <section className="py-24 bg-primary text-primary-foreground rounded-[60px] lg:rounded-[100px] mx-4 lg:mx-12 my-12 relative overflow-hidden flex flex-col items-center shadow-2xl shadow-primary/20">
        <div className="absolute top-10 left-10 text-white opacity-20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3l-2 2 4 4-4 4 2 2 6-6-6-6zm-4 4l-6 6 6 6 2-2-4-4 4-4-2-2z" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="space-y-4 mb-20 max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-black">
              Achieve your Goals with VaronaAcademy
            </h2>
            <p className="text-primary-foreground/70">
              96% of eLearning for Business customers see improved results
              within six months.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 w-full">
            {[
              { label: "Students Enrolled all over World", value: "253,085" },
              { label: "Total Courses on our Platform", value: "1,205" },
              { label: "Countries of Students", value: "56" },
              { label: "Expert Tutors From Various Fields", value: "968" },
            ].map((stat, i) => (
              <div
                key={i}
                className="space-y-2 px-4 md:border-l border-primary-foreground/10 first:border-0 flex flex-col items-center"
              >
                <h3 className="text-4xl lg:text-5xl font-black tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-primary-foreground/70 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING INSTRUCTORS SECTION */}
      <section className="py-24 container mx-auto px-4 flex flex-col items-center">
        <div className="text-center space-y-4 mb-16 max-w-3xl">
          <p className="text-primary font-bold bg-primary/10 px-4 py-1 rounded-full inline-block">
            Trending Instructors
          </p>
          <h2 className="text-4xl lg:text-5xl font-black">
            Top Class & Professional Instructors
          </h2>
          <p className="text-muted-foreground">
            Empowering Change: Stories from Those Who Took the Leap
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {[
            {
              name: "Joyce Pence",
              role: "Lead Designer",
              img: "/images/avatar-1.jpg",
            },
            {
              name: "Edith Dorsey",
              role: "Accountant",
              img: "/images/avatar-2.jpg",
            },
            {
              name: "Ruben Holmes",
              role: "Architect",
              img: "/images/avatar-3.jpg",
            },
            {
              name: "Carol Magner",
              role: "Lead Designer",
              img: "/images/avatar-4.jpg",
            },
          ].map((instructor, i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-[40px] border border-border/50 text-center space-y-6 hover:shadow-xl transition-all group flex flex-col items-center"
            >
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-background shadow-lg">
                <Image
                  src={instructor.img}
                  alt={instructor.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black">{instructor.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {instructor.role}
                </p>
              </div>
              <div className="flex justify-center items-center gap-2 text-yellow-500">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground ml-1">
                  4.8 (210)
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <JoinUs />
      <HowItWorks />
      <FAQSection />
      <LanguageTutorsSection />

      <div className="flex justify-center w-full">
        <TestimonialSlider />
      </div>
    </div>
  );
}
