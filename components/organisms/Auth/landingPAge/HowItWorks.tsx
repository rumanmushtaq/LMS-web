"use client";

import { motion } from "framer-motion";
import { Star, Video, Mic, Expand } from "lucide-react";

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  return (
    <section className="py-32 overflow-hidden w-full bg-background relative">
      {/* Ambient enchanting background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-3/4 -right-64 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="text-center space-y-4 mb-24 max-w-3xl mx-auto">
          <h2 className="text-5xl lg:text-6xl font-black text-foreground tracking-tight">
            Here's how it works
          </h2>
          <p className="text-muted-foreground text-xl">
            From exploring top-tier talent to mastering new skills, see exactly
            what your learning journey will look like.
          </p>
        </div>

        <motion.div
          className="flex flex-col gap-32 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Row 1: Discover Your Ideal Tutor */}
          <motion.div
            variants={itemVariants}
            className="relative flex flex-col lg:flex-row items-center w-full group"
          >
            {/* Enchanting Background block */}
            <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[70%] bg-gradient-to-bl from-brand-purple/20 via-brand-purple/5 to-transparent rounded-[40px] border border-brand-purple/20 z-0 transition-all duration-700 group-hover:scale-[1.02] shadow-[inset_0_0_80px_rgba(var(--brand-purple),0.05)]"></div>

            <div className="w-full lg:w-1/2 p-6 lg:p-0 z-10 relative">
              <div className="bg-card/80 backdrop-blur-2xl border border-border/80 rounded-[32px] p-8 lg:p-12 shadow-2xl lg:translate-x-[-5%] transition-transform duration-500 group-hover:-translate-y-2 relative overflow-hidden ring-1 ring-white/10">
                <div className="relative w-full h-[320px] flex items-center justify-center perspective-[1200px]">
                  {/* Back Card Top */}
                  <div className="absolute top-[5%] w-[85%] bg-card rounded-2xl border border-border p-4 flex items-center gap-4 shadow-xl opacity-60 translate-y-[-30px] scale-90 blur-[1px] z-0">
                    <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative">
                      <img
                        src="/images/avatar-2.jpg"
                        alt="Tutor"
                        className="object-cover w-full h-full"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=Raul+Soto&background=random")
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-foreground">
                        Raul Soto
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />{" "}
                        4.98 (64)
                      </p>
                    </div>
                  </div>

                  {/* Middle Active Card */}
                  <div className="absolute z-20 w-[95%] bg-card backdrop-blur-md rounded-2xl border border-border p-5 flex items-center gap-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ring-1 ring-primary/20 transition-transform duration-500 group-hover:scale-105">
                    <div className="w-16 h-16 rounded-full bg-muted overflow-hidden relative shadow-inner ring-2 ring-primary/20">
                      <img
                        src="/images/avatar-1.jpg"
                        alt="Tutor"
                        className="object-cover w-full h-full"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=Annie+Amusu&background=random")
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-foreground">
                          Annie Amusu
                        </h4>
                        <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                          <span className="check-icon pb-0.5">✓</span>
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Star className="w-4 h-4 text-emerald-500 fill-current" />{" "}
                        4.96{" "}
                        <span className="text-muted-foreground font-normal">
                          (128 reviews)
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Certified French & Italian Tutor
                      </p>
                    </div>
                    <button className="px-6 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold shadow-sm whitespace-nowrap hover:bg-primary transition-colors hover:text-primary-foreground border border-primary/20">
                      Book Space
                    </button>
                  </div>

                  {/* Back Card Bottom */}
                  <div className="absolute bottom-[5%] w-[85%] bg-card rounded-2xl border border-border p-4 flex items-center gap-4 shadow-xl opacity-60 translate-y-[30px] scale-90 blur-[1px] z-0">
                    <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative">
                      <img
                        src="/images/avatar-3.jpg"
                        alt="Tutor"
                        className="object-cover w-full h-full"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=Danja+R&background=random")
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-foreground">
                        Danja Roumiki
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />{" "}
                        4.96 (64)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 p-8 lg:p-16 z-10 lg:pl-12">
              <h3 className="text-4xl font-black text-foreground mb-6 leading-tight">
                Discover Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-primary">
                  Ideal Tutor
                </span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Browse hundreds of fully vetted, expert tutors across different
                subjects. Whether you're mastering a new language or exploring a
                creative skill, our intelligent matching system connects you
                with the perfect instructor to help you succeed effortlessly.
              </p>
            </div>
          </motion.div>

          {/* Row 2: Flexible Scheduling */}
          <motion.div
            variants={itemVariants}
            className="relative flex flex-col-reverse lg:flex-row items-center w-full group"
          >
            {/* Enchanting Background block */}
            <div className="absolute top-0 left-0 bottom-0 w-full lg:w-[70%] bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent rounded-[40px] border border-secondary/20 z-0 transition-all duration-700 group-hover:scale-[1.02] shadow-[inset_0_0_80px_rgba(var(--secondary),0.05)]"></div>

            <div className="w-full lg:w-1/2 p-8 lg:p-16 z-10 lg:pr-12">
              <h3 className="text-4xl font-black text-foreground mb-6 leading-tight">
                Flexible Scheduling
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-blue-400">
                  Made Easy
                </span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Take complete control of your academic timeline. Pick the exact
                time that functions for your routine—day or night. Book
                seamlessly and reschedule with absolute ease when life happens.
              </p>
            </div>

            <div className="w-full lg:w-1/2 p-6 lg:p-0 z-10 relative">
              <div className="bg-card/80 backdrop-blur-2xl border border-border/80 rounded-[32px] p-8 lg:p-10 shadow-2xl lg:translate-x-[5%] transition-transform duration-500 group-hover:-translate-y-2 lg:ml-auto relative overflow-hidden ring-1 ring-white/10 max-w-lg">
                <div className="flex justify-between items-center mb-8 border-b border-border/80 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-secondary/10 border border-secondary/20 flex items-center justify-center text-xl shadow-inner text-secondary">
                      📅
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground">
                        Advanced Mathematics
                      </h4>
                      <p className="text-sm text-secondary font-medium">
                        Dr. Jane Smith
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 px-2">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${i === 3 ? "text-secondary" : "text-muted-foreground"}`}
                      >
                        {day}
                      </span>
                      <span
                        className={`text-sm font-bold w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${i === 3 ? "bg-secondary text-secondary-foreground shadow-[0_0_15px_rgba(var(--secondary),0.5)] scale-110" : "text-foreground hover:bg-muted"}`}
                      >
                        {17 + i}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2 px-2">
                  {["09:00", "10:00", "11:00", "12:00"].map((time, rowId) =>
                    Array.from({ length: 7 }).map((_, colId) => {
                      const isActive = rowId === 1 && colId === 3;
                      const isUnavailable =
                        (rowId === 0 && colId === 1) ||
                        (rowId === 2 && colId === 4);
                      return (
                        <div
                          key={`${rowId}-${colId}`}
                          className={`h-10 rounded-lg flex items-center justify-center text-[11px] font-bold border transition-all ${
                            isActive
                              ? "bg-secondary text-secondary-foreground border-secondary shadow-[0_0_20px_rgba(var(--secondary),0.4)] scale-110 z-10 cursor-pointer"
                              : isUnavailable
                                ? "bg-muted/30 text-muted-foreground/30 border-transparent cursor-not-allowed"
                                : "bg-card text-muted-foreground border-border/80 hover:border-secondary hover:text-secondary cursor-pointer hover:shadow-md"
                          }`}
                        >
                          {time}
                        </div>
                      );
                    }),
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Row 3: Interactive Classroom */}
          <motion.div
            variants={itemVariants}
            className="relative flex flex-col lg:flex-row items-center w-full group"
          >
            {/* Enchanting Background block */}
            <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[70%] bg-gradient-to-tl from-primary/20 via-primary/5 to-transparent rounded-[40px] border border-primary/20 z-0 transition-all duration-700 group-hover:scale-[1.02] shadow-[inset_0_0_80px_rgba(var(--primary),0.05)]"></div>

            <div className="w-full lg:w-1/2 p-6 lg:p-0 z-10 relative">
              <div className="bg-card/80 backdrop-blur-2xl border border-border/80 rounded-[32px] p-6 lg:p-10 shadow-2xl lg:translate-x-[-5%] transition-transform duration-500 group-hover:-translate-y-2 relative overflow-hidden ring-1 ring-white/10">
                <div className="relative w-full aspect-[4/3] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group/video">
                  <img
                    src="/images/course-2.jpg"
                    alt="Teacher video feed"
                    className="object-cover w-full h-full opacity-80 transition-transform duration-1000 group-hover/video:scale-105"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000")
                    }
                  />

                  <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start pointer-events-none">
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                      <span className="text-white text-xs font-bold tracking-wider">
                        LIVE
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 cursor-pointer pointer-events-auto hover:bg-black/80 transition-colors shadow-lg">
                      <Expand className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-end">
                    <span className="bg-primary/95 text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-lg shadow-lg border border-white/10 backdrop-blur-sm">
                      Ada Williams
                    </span>
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:bg-primary transition-colors border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-red-500/90 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors border border-white/20 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                        <Mic className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 w-32 aspect-[3/4] bg-zinc-800 rounded-xl overflow-hidden border border-white/30 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover/video:-translate-y-4 group-hover/video:-translate-x-4">
                    <img
                      src="/images/avatar-4.jpg"
                      alt="Student video feed"
                      className="object-cover w-full h-full opacity-90"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://images.unsplash.com/photo-1539571696357-40a1b9b94e01?auto=format&fit=crop&q=80&w=300")
                      }
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                      <span className="text-white text-[10px] font-bold tracking-wide">
                        Hoda Wang
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 p-8 lg:p-16 z-10 lg:pl-12">
              <h3 className="text-4xl font-black text-foreground mb-6 leading-tight">
                Step Into Our
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-cyan">
                  Interactive Classroom
                </span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Experience high-fidelity live classes in a feature-rich virtual
                space. Share documents, utilize intelligent collaborative
                whiteboards, and learn face-to-face with your tutor inside one
                completely seamless, browser-based environment.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
