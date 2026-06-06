"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  DollarSign,
  Users,
  Award,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  Star,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/utils/axiosInstance";

interface Banner {
  _id: string;
  videoUrl: string;
  isActive: boolean;
}

// Stats for Hero Section
const heroStats = [
  { label: "Active Learners", value: "250K+", icon: Users, color: "text-blue-500 bg-blue-500/10" },
  { label: "Average Rating", value: "4.9/5", icon: Star, color: "text-amber-500 bg-amber-500/10" },
  { label: "Paid to Tutors", value: "$12M+", icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10" },
];

// Benefits Grid
const benefits = [
  {
    title: "Teach Your Way",
    description: "Design your own curriculum, select your teaching methods, and specialize in topics you love. Complete academic freedom.",
    icon: BookOpen,
    color: "from-blue-500/20 to-indigo-500/5 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Flexible Scheduling",
    description: "Be your own boss. Teach full-time, part-time, or just a few hours on weekends. Easily fit teaching around your life.",
    icon: Clock,
    color: "from-amber-500/20 to-orange-500/5 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Global Student Pool",
    description: "Connect with students from over 120 countries. Expand your impact beyond physical borders and make lifelong connections.",
    icon: Users,
    color: "from-emerald-500/20 to-teal-500/5 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Reliable Weekly Payouts",
    description: "Get paid on time, every week, directly to your bank account or PayPal. Transparent revenue split of up to 85% on your sales.",
    icon: ShieldCheck,
    color: "from-purple-500/20 to-pink-500/5 text-purple-600 dark:text-purple-400",
  },
];

// Steps to become a tutor
const steps = [
  {
    number: "01",
    title: "Apply Online",
    description: "Submit your basic details, teaching experience, and subjects of expertise. It takes less than 10 minutes.",
  },
  {
    number: "02",
    title: "Complete Verification",
    description: "Our team will quickly review your profile, verify credentials, and guide you through a brief welcome call.",
  },
  {
    number: "03",
    title: "Launch & Earn",
    description: "Set your hourly rate, sync your calendar, and welcome students. Start receiving payments immediately.",
  },
];


const faqs = [
  {
    question: "1) WHO ARE WE?",
    answer: (
      <div className="space-y-2">
        <p className="font-bold">Who We Are</p>
        <p>
          At <strong>VARONA ACADEMY</strong>, we believe that everyone deserves access to high-quality, individualized education — no matter where they are or what subject they're tackling. Our mission is to empower learners of all ages with the support and expertise they need to grow academically and build confidence.
        </p>
        <p>
          We're a team of passionate and highly qualified tutors, each specializing in different areas: from <strong>mathematics and science</strong> to <strong>languages, test preparation,</strong> and <strong>creative subjects.</strong> Whether you need help with homework, want to prepare for a major exam, or simply deepen your understanding, we're here to guide you.
        </p>
        <p>
          <strong>What sets us apart</strong> is our multi-topic approach: you don't have to switch platforms or tutors to get help across subjects. Our flexible, online-first model means you can book sessions when it's most convenient for you — even outside traditional school hours.
        </p>
        <p>
          We value <em>personalized learning, academic integrity</em>, and a <em>growth mindset</em>. Every session is tailored to your unique strengths, challenges, and goals. We don't just teach — we mentor, encourage, and celebrate progress.
        </p>
        <p>
          Our vision is to become a <strong>global learning community</strong> where students feel supported, confident, and excited about their education.
        </p>
        <p className="font-bold">
          Join us — let's make learning a lifelong, joyful journey.
        </p>
      </div>
    ),
  },
  {
    question: "2) Cancellation & Rescheduling Policy",
    answer: (
      <div className="space-y-2">
        <p className="font-bold">Cancellation & Rescheduling Policy</p>
        <p>
          You may cancel or reschedule a tutoring session by contacting us at least <strong>24 hours</strong> before the scheduled start time.
        </p>
        <p>
          <strong>If you cancel or reschedule with 24+ hours' notice</strong>, we will credit you the full amount paid for that session. The credit can be used to book another class at the same price.
        </p>
        <p>
          <strong>No-shows</strong> (if you miss a session without prior notice) are considered as completed, and we cannot issue credit for those.
        </p>
        <p>
          Because of the nature of our service, we do not offer cash refunds for canceled sessions. All changes are handled via credit for future use.
        </p>
        <p>
          If we cancel a session (for example, due to tutor unavailability), we will either <strong>reschedule the session</strong> or <strong>grant you credit</strong>, depending on your preference.
        </p>
        <p>
          Credits must be used within <strong>[6 or 12 months]</strong> from the date they are issued. In case of emergencies (e.g., illness), please reach out to us — we will evaluate on a case-by-case basis and may grant an exception for credit, depending on the situation.
        </p>
      </div>
    ),
  },
  {
    question: "3) How do I contact customer support if there are technical issues?",
    answer: (
      <div className="space-y-2">
        <p>
          If you run into any technical problems — for example, trouble joining a session, connection issues, or difficulty using our platform — you can reach our support team by email at: info@varonaacademy.com.
        </p>
        <p>
          We aim to respond to all technical support inquiries within <strong>24 hours</strong>. Please include as much detail as possible when you write (your name, the session time, what device/browser you're using, and a description of the issue). This helps us troubleshoot faster and get you back on track.
        </p>
      </div>
    ),
  },
  {
    question: "4) What times are tutoring sessions available?",
    answer: (
      <div className="space-y-2">
        <p>
          We offer flexible tutoring hours to fit your schedule: our tutors are available <strong>[world wide]</strong>, and we support sessions during all international peak times and off-hours.
        </p>
        <p>
          You can book sessions in advance for a time that works best for you.
        </p>
        <p>
          If you need help right away, we also offer <strong>on-demand / last-minute sessions</strong> (depending on tutor availability).
        </p>
        <p>
          <strong>Time zone:</strong> All times are shown in <em>[your time zone or "your local time zone"]</em>, so it's easy to coordinate.
        </p>
        <p>
          If you tell us what time your preferred tutor is available (or your own availability), we'll do our best to match you up.
        </p>
      </div>
    ),
  },
  {
    question: "5) How do you ensure the quality and accuracy of tutoring help (assignments, answers)?",
    answer: (
      <div className="space-y-2">
        <p>
          We take the quality and accuracy of our tutoring very seriously. Here's how we maintain high standards at Varona Academy:
        </p>
        <p>
          <strong>Vetted and Qualified Tutors</strong><br/>
          All of our tutors go through a careful screening process. We verify their academic credentials, subject expertise, and teaching experience. Many of them have degrees or certifications in the subjects they teach.
        </p>
        <p>
          <strong>Ongoing Training & Professional Development</strong><br/>
          Our tutors receive regular training and coaching so they stay up to date with best practices in online instruction. This ensures they don't just know the content — they know how to teach it effectively.
        </p>
        <p>
          <strong>Rigorous Feedback Loop</strong><br/>
          Throughout every session, tutors give timely, constructive feedback on assignments, so mistakes are addressed immediately and students learn from them.
        </p>
        <p>
          <strong>Consistent Tutor-Student Pairing</strong><br/>
          Whenever possible, we pair students with the same tutor session after session. Building that relationship helps the tutor better understand your strengths, challenges, and learning style, which in turn improves the quality of help.
        </p>
        <p>
          <strong>Quality Assurance and Monitoring</strong><br/>
          We regularly review sessions, look at student satisfaction, and evaluate the correctness of the work done. If we identify recurring issues or inaccuracies, we provide additional training or feedback to the tutor.
        </p>
        <p>
          <strong>Student Feedback</strong><br/>
          After each session, students can rate their tutor and leave feedback. We take those ratings seriously — your voice helps us maintain high standards and improve where needed.
        </p>
        <p>
          <strong>Ethical and Professional Conduct</strong><br/>
          Our tutors follow a strict code of professional behavior: respectful communication, academic integrity, and a focus on helping students learn, not just giving them the right answer.
        </p>
      </div>
    ),
  },
  {
    question: "6) Do you offer trial or introductory lessons?",
    answer: (
      <div className="space-y-2">
        <p>
          Yes, we offer introductory lessons to help you find the right fit! It's a great opportunity to meet your tutor, discuss your goals, and experience our learning platform before committing to regular sessions.
        </p>
      </div>
    ),
  },
];

export default function BecomeTutorPage() {
  // Earnings Calculator State
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(15);
  const [studentsCount, setStudentsCount] = useState<number>(8);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Video banner state (same as home page)
  const [videos, setVideos] = useState<string[]>([]);
  const [vidIdx, setVidIdx] = useState(0);
  const [vidReady, setVidReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch hero banners
  useEffect(() => {
    axiosInstance
      .get("/api/v1/admin/hero-banner/active")
      .then(({ data }) => {
        const list: Banner[] = Array.isArray(data?.data) ? data.data : [];
        const urls = list.map((b) => b.videoUrl).filter(Boolean);
        setVideos(urls);
      })
      .catch(() => setVideos([]))
      .finally(() => setVidReady(true));
  }, []);

  // Auto-advance videos
  useEffect(() => {
    if (videos.length <= 1) return;
    const t = setTimeout(() => setVidIdx((p) => (p + 1) % videos.length), 8000);
    return () => clearTimeout(t);
  }, [vidIdx, videos.length]);

  // Swap video src
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videos[vidIdx]) return;
    el.src = videos[vidIdx];
    el.load();
    el.play().catch(() => {});
  }, [vidIdx, videos]);

  // Earnings calculations
  const weeklyEarnings = hourlyRate * hoursPerWeek;
  const monthlyEarnings = Math.round(weeklyEarnings * 4.33);
  const yearlyEarnings = Math.round(weeklyEarnings * 52);

  return (
    <div className="min-h-screen bg-background">

      {/* 1. HERO SECTION — video background (same as home page) */}
      <section
        className="relative w-full overflow-hidden shadow-2xl"
        style={{ height: "600px", borderRadius: "0 0 48px 48px" }}
      >
        {/* Always-visible animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#1e1b4b_0%,_#0f172a_60%,_#000_100%)]" />
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] bg-violet-900/30 -top-40 -left-40 animate-pulse" style={{ zIndex: 0 }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bg-pink-950/30 bottom-0 right-0 animate-pulse" style={{ zIndex: 0, animationDelay: "1.5s" }} />

        {/* Video element — same as home page */}
        {vidReady && videos[vidIdx] && (
          <video
            ref={videoRef}
            src={videos[vidIdx]}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", zIndex: 1, opacity: 1 }}
          />
        )}

        {/* Gradient overlay so text stays legible */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 2,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.25) 100%)",
          }}
        />

        {/* Foreground content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          style={{ zIndex: 10 }}
        >
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            Join Our Global Faculty of 15,000+ Educators
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-xl max-w-4xl"
          >
            Share Your Knowledge. <br />
            <span className="text-primary">Inspire the World.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed drop-shadow"
          >
            Teach what you love, on your own terms. Get access to tools, a global
            student audience, and reliable weekly payouts — all in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup?role=tutor">
              <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-2xl shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all text-base group border-0">
                Start Teaching Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                const el = document.getElementById("earnings-calculator");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-14 px-10 rounded-2xl border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-base hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              Estimate Earnings
            </Button>
          </motion.div>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-10"
          >
            {heroStats.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-black text-white leading-none">{item.value}</div>
                  <div className="text-xs text-white/60 font-medium">{item.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Slide dots (only when multiple videos) */}
        {videos.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ zIndex: 20 }}>
            {videos.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setVidIdx(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === vidIdx ? "w-8 h-2 bg-primary shadow-md" : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. INTERACTIVE EARNINGS CALCULATOR */}
      <section id="earnings-calculator" className="py-24 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border border-amber-600/10">
              <TrendingUp className="w-4 h-4" /> Earning Calculator
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">How much can you earn?</h2>
            <p className="text-muted-foreground text-lg">
              Set your own hourly rate, decide how many hours you want to teach weekly, and see your estimated earnings accumulate!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Controls Card */}
            <div className="lg:col-span-7 bg-card border border-border/80 rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col justify-between">
              <div className="space-y-8">
                {/* Hourly Rate Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-foreground">Hourly Rate</span>
                    <span className="text-2xl font-black text-primary">${hourlyRate}<span className="text-sm text-muted-foreground font-normal">/hr</span></span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="150"
                    step="5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                    <span>$15/hr</span>
                    <span>$80/hr</span>
                    <span>$150/hr</span>
                  </div>
                </div>

                {/* Hours Per Week Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-foreground">Teaching Hours Per Week</span>
                    <span className="text-2xl font-black text-primary">{hoursPerWeek} <span className="text-sm text-muted-foreground font-normal">hrs</span></span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    step="1"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                    <span>2 hrs</span>
                    <span>20 hrs</span>
                    <span>40 hrs</span>
                  </div>
                </div>

                {/* Estimate based on students */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-foreground">Expected Class Size / Regular Students</span>
                    <span className="text-2xl font-black text-primary">{studentsCount} <span className="text-sm text-muted-foreground font-normal">students</span></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={studentsCount}
                    onChange={(e) => setStudentsCount(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                    <span>1 student</span>
                    <span>25 students</span>
                    <span>50 students</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/40">
                <p className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-primary text-base">💡</span>
                  <span>
                    Earnings are estimates based on selected configurations. Real earnings depend on your subjects, course reviews, and marketing. Tutors keeping over 15 students booked typically make full-time salary.
                  </span>
                </p>
              </div>
            </div>

            {/* Right Display Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-primary to-indigo-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              {/* Ambient overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/25 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <span className="inline-block bg-white/15 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Estimated Earnings
                </span>

                <div className="space-y-8">
                  <div>
                    <span className="text-sm text-white/70 block font-medium">Monthly Potential Earning</span>
                    <h3 className="text-5xl md:text-6xl font-black tracking-tight text-white mt-1">
                      ${monthlyEarnings.toLocaleString()}
                    </h3>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-white/60 block font-semibold">Weekly potential</span>
                      <span className="text-2xl font-extrabold block text-white mt-0.5">
                        ${weeklyEarnings.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-white/60 block font-semibold">Yearly potential</span>
                      <span className="text-2xl font-extrabold block text-accent mt-0.5">
                        ${yearlyEarnings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-10 space-y-4">
                <Link href="/signup?role=tutor" className="w-full inline-block">
                  <Button className="w-full h-14 bg-white hover:bg-white/90 text-primary hover:text-primary font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-base">
                    Claim Your Earnings Now
                  </Button>
                </Link>
                <p className="text-[11px] text-white/50 text-center">
                  Get paid weekly directly to bank/stripe. No hidden subscription fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY TEACH ON DREAMS LMS */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-semibold text-primary bg-primary/10 border border-primary/20">
              <Award className="w-4 h-4" /> Top Perks
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Why Teach With Us?</h2>
            <p className="text-muted-foreground text-lg">
              We empower instructors with cutting-edge tools and resources to make teaching fulfilling, organized, and highly profitable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative"
                >
                  <Card className="h-full border border-border/60 hover:border-primary/30 transition-all duration-300 rounded-[2rem] hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                    <CardContent className="p-8 md:p-10 flex gap-6 items-start">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${benefit.color} shrink-0`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-black group-hover:text-primary transition-colors">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          {benefit.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (STEPS) */}
      <section className="py-24 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Three Steps to Start</h2>
            <p className="text-muted-foreground text-lg">
              Getting started is quick and simple. You can be hosting your first lesson and receiving students in less than 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative bg-card border border-border/60 p-8 md:p-10 rounded-[2.5rem] space-y-6 hover:shadow-lg transition-shadow">
                {/* Large floating number */}
                <div className="text-6xl md:text-7xl font-black text-primary/10 select-none absolute top-4 right-8">
                  {step.number}
                </div>

                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/signup?role=tutor">
              <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 group">
                Create Your Profile Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* 6. FAQ SECTION */}
      <section className="py-24 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-semibold text-primary bg-primary/10 border border-primary/20">
              <HelpCircle className="w-4 h-4" /> FAQ
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-center">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Have questions about registration, billing, or teaching formats? We have answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-card border border-border/60 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-base sm:text-lg font-bold text-foreground">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-muted-foreground"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 text-muted-foreground text-sm sm:text-base leading-relaxed border-t border-border/30">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION CARD */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-gradient-to-br from-primary via-indigo-900 to-accent text-white rounded-[3rem] p-10 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
            {/* Absolute visual blobs */}
            <div className="absolute top-[-30%] left-[-20%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-30%] right-[-20%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-semibold text-accent bg-white/10 border border-white/20 backdrop-blur-md">
                <Zap className="w-4 h-4 fill-current text-accent" />
                Join Over 15,000+ Educators
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Turn your passion into a sustainable career.
              </h2>
              <p className="text-white/80 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
                Take the next step in your professional teaching journey. Apply now and start making a global impact.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link href="/signup?role=tutor" className="w-full sm:w-auto">
                <Button className="w-full h-14 px-8 bg-white hover:bg-white/95 text-primary hover:text-primary font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-base">
                  Apply to Teach Now
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-14 px-8 border-white/25 hover:bg-white/10 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-base bg-transparent">
                  Talk to Our Team
                </Button>
              </Link>
            </div>

            <p className="relative z-10 text-[11px] text-white/50">
              No subscription fee, cancel/pause listings anytime. By joining, you agree to our Tutor Terms of Service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
