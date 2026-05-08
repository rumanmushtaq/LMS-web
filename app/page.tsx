"use client";

import { useState } from "react";
import HeroSlider from "@/components/organisms/Auth/landingPAge/hero-Banner";
import InstructorProfile from "@/components/organisms/Auth/landingPAge/instructor-Profile";
import CourseCard from "@/components/molecules/shop/course-card";
import JoinUs from "@/components/organisms/Auth/landingPAge/JoinUs";
import FAQSection from "@/components/organisms/Auth/landingPAge/FAQSection";
import { CheckCircle, Star } from "lucide-react";
import Image from "next/image";

const allInstructors = [
  {
    title: "Information About UI/UX Design Degree",
    cat: "UI/UX Design",
    price: "$120",
    stars: 4.9,
    rev: 200,
    img: "/images/course-1.jpg",
    badge: "Xd",
  },
  {
    title: "The Complete Business and Management Course",
    cat: "General",
    price: "$168",
    stars: 5.0,
    rev: 210,
    img: "/images/course-2.jpg",
    badge: "N",
  },
  {
    title: "Learn & Create ReactJS Tech Fundamentals Apps",
    cat: "Development",
    price: "$147",
    stars: 5.0,
    rev: 154,
    img: "/images/course-3.jpg",
    badge: "ReactJS",
  },
  {
    title: "Build Creative Arts & media Course Completed",
    cat: "Graphic Design",
    price: "$190",
    stars: 4.9,
    rev: 178,
    img: "/images/course-4.jpg",
    badge: "Mentor",
  },
  {
    title: "Mastering Modern Web Frameworks and Tools",
    cat: "Framework",
    price: "$155",
    stars: 4.8,
    rev: 120,
    img: "/images/course-1.jpg",
    badge: "NextJS",
  },
];

const categories = [
  "All Categories",
  "Development",
  "UI/UX Design",
  "Graphic Design",
  "Framework",
  "General",
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Categories");

  const filteredInstructors =
    activeCategory === "All Categories"
      ? allInstructors
      : allInstructors.filter((ins) => ins.cat === activeCategory);

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full">
          {[
            { name: "Management", courses: 156, icon: "📊" },
            { name: "IT & Softwares", courses: 214, icon: "💻" },
            { name: "Marketing", courses: 174, icon: "🎯" },
            { name: "Productivity", courses: 126, icon: "⚡" },
            { name: "Lifestyles", courses: 214, icon: "🏠" },
            { name: "Design", courses: 161, icon: "🎨" },
          ].map((cat, i) => (
            <div
              key={i}
              className="group p-8 rounded-[40px] border border-border/50 bg-card hover:bg-primary transition-all duration-500 text-center space-y-4 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/20 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center text-3xl transition-colors">
                {cat.icon}
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                  {cat.courses} Courses
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {filteredInstructors.map((course, i) => (
            <CourseCard
              key={i}
              image={course.img}
              category={course.cat}
              title={course.title}
              price={course.price}
              rating={course.stars}
              reviews={course.rev}
              badge={course.badge}
              instructor={{
                name: "Brenda Slaton",
                avatar: "/images/avatar-1.jpg",
              }}
            />
          ))}
        </div>

        {filteredInstructors.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-lg">
              No instructors found in this category.
            </p>
          </div>
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
              Achieve your Goals with DreamsLMS
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
      <FAQSection />

      <div className="flex justify-center w-full">
        <InstructorProfile />
      </div>
    </div>
  );
}
