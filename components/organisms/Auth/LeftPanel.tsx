"use client";

import Image from "next/image";

const LeftPanel = () => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-[hsl(var(--panel-left))] relative overflow-hidden min-h-screen px-12">
      {/* Background circles */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[hsl(var(--panel-left-circle))] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[hsl(var(--panel-left)/0.6)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Illustration */}
      <div className="relative z-10 mb-8">
        <Image
          src="/images/login-illustration.png"
          alt="Login illustration"
          width={320}
          height={320}
          className="w-80 h-auto object-contain"
          priority
        />
      </div>

      {/* Text */}
      <div className="relative z-10 text-center max-w-sm">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Welcome to{" "}
          <span className="block">
            Dreams<span className="text-primary">LMS</span> Courses.
          </span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Platform designed to help organizations, educators, and learners
          manage, deliver, and track learning and training activities.
        </p>
      </div>

      {/* Dots */}
      <div className="relative z-10 flex gap-2 mt-6">
        <div className="w-6 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary/30" />
        <div className="w-2 h-2 rounded-full bg-primary/30" />
      </div>
    </div>
  );
};

export default LeftPanel;
