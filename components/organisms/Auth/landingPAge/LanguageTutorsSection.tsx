import React from "react";
import {
  ShieldCheck,
  CircleDollarSign,
  CalendarDays,
  Plane,
} from "lucide-react";

export default function LanguageTutorsSection() {
  const features = [
    {
      title: "Verified tutors",
      description:
        "Our community has over 2,000 expert tutors – all with prior teaching experience.",
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      gradient: "from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/20",
      emoji: "👨‍🏫",
    },
    {
      title: "Affordable",
      description:
        "With lesson prices starting at $5, Varona Academy provides remote learning to fit any budget.",
      icon: <CircleDollarSign className="w-5 h-5 text-white" />,
      gradient: "from-emerald-400 to-teal-500",
      shadow: "shadow-emerald-500/20",
      emoji: "💰",
    },
    {
      title: "Flexible schedule",
      description:
        "We make learning happen on your schedule. Book lessons when you want to learn.",
      icon: <CalendarDays className="w-5 h-5 text-white" />,
      gradient: "from-orange-400 to-red-500",
      shadow: "shadow-orange-500/20",
      emoji: "🗓️",
    },
    {
      title: "Travel Assistance",
      description:
        "Prepare for that big trip the right way. Know the language and customs. Do's and don't.",
      icon: <Plane className="w-5 h-5 text-white" />,
      gradient: "from-cyan-400 to-blue-500",
      shadow: "shadow-cyan-500/20",
      emoji: "✈️",
    },
  ];

  return (
    <section className="py-24 container mx-auto px-4 flex flex-col items-center">
      {/* Main Container */}
      <div className="w-full relative overflow-hidden bg-card border border-border/50 rounded-[40px] md:rounded-[60px] py-20 px-6 md:px-12 shadow-xl shadow-primary/5 dark:shadow-none flex flex-col items-center text-center">
        {/* Subtle Decorative Gradient */}
        <div className="absolute -top-[50%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none opacity-60" />

        <div className="relative z-10 space-y-4 mb-20 max-w-3xl">
          <p className="text-primary font-bold bg-primary/10 px-4 py-1 rounded-full inline-block text-sm tracking-wide uppercase">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
            Learn languages online with the world's best tutors
          </h2>
          <p className="text-muted-foreground font-medium text-lg mx-auto">
            Tutors from all over the world offer online language lessons
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center text-center p-8 bg-background rounded-[32px] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image / Emoji Container */}
              <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                {/* Glowing Backdrop */}
                <div
                  className={`absolute inset-0 opacity-20 group-hover:opacity-40 rounded-[32px] blur-xl transition-all duration-500 bg-gradient-to-br ${feature.gradient}`}
                />

                {/* Inner Card */}
                <div className="relative w-full h-full bg-card/80 rounded-[32px] border border-border/50 shadow-inner flex items-center justify-center text-6xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 backdrop-blur-md">
                  <span className="drop-shadow-md">{feature.emoji}</span>
                </div>

                {/* Small Accent Icon */}
                <div
                  className={`absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${feature.gradient} border-4 border-card ${feature.shadow} group-hover:scale-110 transition-transform duration-500`}
                >
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Aesthetic Bottom Line Indicator */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 rounded-t-full bg-primary opacity-0 group-hover:w-20 group-hover:opacity-100 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
