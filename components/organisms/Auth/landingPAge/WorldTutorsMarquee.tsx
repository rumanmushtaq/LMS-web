import React from "react";

const countries = [
  { name: "Portugal", tutors: 1, flag: "🇵🇹" },
  { name: "Cambodia", tutors: 1, flag: "🇰🇭" },
  { name: "Saudi Arabia", tutors: 2, flag: "🇸🇦" },
  { name: "United Arab Emirates", tutors: 1, flag: "🇦🇪" },
  { name: "USA", tutors: 2, flag: "🇺🇸" },
  { name: "UK", tutors: 1, flag: "🇬🇧" },
  { name: "Ukraine", tutors: 2, flag: "🇺🇦" },
  { name: "Vietnam", tutors: 4, flag: "🇻🇳" },
  { name: "Brazil", tutors: 3, flag: "🇧🇷" },
  { name: "Spain", tutors: 5, flag: "🇪🇸" },
  { name: "France", tutors: 2, flag: "🇫🇷" },
  { name: "Germany", tutors: 4, flag: "🇩🇪" },
  { name: "Japan", tutors: 2, flag: "🇯🇵" },
  { name: "India", tutors: 8, flag: "🇮🇳" },
];

export default function WorldTutorsMarquee() {
  return (
    <div className="w-full overflow-hidden py-10 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-scroll {
          display: flex;
          width: max-content;
          animation: marquee-scroll 30s linear infinite;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
        
        /* Fade edges for a premium look */
        .marquee-container {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
      
      <div className="marquee-container w-full overflow-hidden">
        <div className="animate-marquee-scroll gap-4 px-4 py-2">
          {[...countries, ...countries].map((country, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer min-w-max"
            >
              <div className="text-3xl drop-shadow-sm">{country.flag}</div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-sm">{country.name}</span>
                <span className="text-xs text-muted-foreground font-medium">{country.tutors} + Tutors</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
