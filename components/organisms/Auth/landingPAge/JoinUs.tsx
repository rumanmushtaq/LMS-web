import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const JoinUs = () => {
  return (
    <section className="py-24 container mx-auto px-4 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Become an Instructor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative group overflow-hidden rounded-[40px] bg-orange-50/50 dark:bg-orange-950/20 p-8 lg:p-12 flex flex-col md:flex-row items-center gap-6 border border-orange-100 dark:border-orange-900/30 shadow-sm hover:shadow-xl transition-all duration-500"
        >
          <div className="flex-1 space-y-6 z-10 text-center md:text-left">
            <h2 className="text-3xl lg:text-5xl font-black text-foreground leading-tight">
              Become An Instructor
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
              Top instructors from around the world teach millions of students
              on Mentoring.
            </p>
            <Link href="/signup?role=tutor">
              <Button className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl px-8 py-6 text-lg font-bold group/btn shadow-lg shadow-indigo-200 mt-4">
                Apply Now
                <MoveRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="relative w-full max-w-[320px] aspect-square shrink-0">
            {/* Yellow Circle Graphic */}
            <div className="absolute inset-0 bg-brand-gold rounded-[60px] scale-90 translate-y-4" />
            <div className="relative w-full h-full">
              <Image
                src="/images/Instructor Image.svg"
                alt="Become Instructor"
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </motion.div>

        {/* Become a Student */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative group overflow-hidden rounded-[40px] bg-indigo-50/50 dark:bg-indigo-950/20 p-8 lg:p-12 flex flex-col md:flex-row items-center gap-6 border border-indigo-100 dark:border-indigo-900/30 shadow-sm hover:shadow-xl transition-all duration-500"
        >
          <div className="flex-1 space-y-6 z-10 text-center md:text-left">
            <h2 className="text-3xl lg:text-5xl font-black text-foreground leading-tight">
              Become An Student
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
              Start your educational journey with us and access a wealth of
              resources
            </p>
            <Link href="/signup?role=student">
              <Button className="bg-brand-cyan hover:bg-brand-cyan/90 text-white rounded-xl px-8 py-6 text-lg font-bold group/btn shadow-lg shadow-red-200 mt-4">
                Enroll Now
                <MoveRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="relative w-full max-w-[320px] aspect-square shrink-0">
            {/* Purple Circle Graphic */}
            <div className="absolute inset-0 bg-brand-purple rounded-[60px] scale-90 translate-y-4" />
            <div className="relative w-full h-full">
              <Image
                src="/images/Student Image.svg"
                alt="Become Student"
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinUs;
