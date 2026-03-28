"use client";

import { Pencil, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

const InstructorProfile = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="container my-10"
    >
      <div className="gradient-profile rounded-2xl px-8 py-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        
        {/* Decorative circles */}
        <div className="absolute right-10 top-4 w-32 h-32 rounded-full border-2 border-primary-foreground/10 opacity-30" />
        <div className="absolute right-24 bottom-2 w-20 h-20 rounded-full bg-primary-foreground/5" />
        <div className="absolute right-2 top-8 w-16 h-16 rounded-full bg-primary-foreground/10" />

        {/* Instructor Info */}
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative">
            <Image
              src="/images/instructor-avatar.jpg"
              alt="Eugene Andre"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover border-4 border-primary-foreground/20"
            />

            <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-card">
              <CheckCircle className="h-4 w-4 text-white" />
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-foreground flex items-center gap-2">
              Eugene Andre
              <Pencil className="h-4 w-4 text-primary-foreground/60 cursor-pointer hover:text-primary-foreground transition-colors" />
            </h2>
            <p className="text-primary-foreground/70 text-sm mt-0.5">
              Instructor
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6 md:mt-0 relative z-10">
          <Button
            variant="outline"
            className="bg-card text-foreground border-0 font-semibold hover:bg-card/90 shadow-md"
          >
            Add New Course
          </Button>

          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md">
            Student Dashboard
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorProfile;