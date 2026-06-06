import React from "react";
import WorldTutorsMarquee from "./WorldTutorsMarquee";

export default function WorldTutorsSection() {
  return (
    <section className="py-24 container mx-auto px-4 flex flex-col items-center">
      <div className="text-center space-y-4 mb-10 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
          Tutors from all over the world offer online lessons
        </h2>
        <p className="text-muted-foreground font-medium text-lg mx-auto">
          Learn languages online with the world's best tutors
        </p>
      </div>

      <div className="w-full">
        <WorldTutorsMarquee />
      </div>
    </section>
  );
}
