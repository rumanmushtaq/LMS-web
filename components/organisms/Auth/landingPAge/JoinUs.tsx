import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const JoinUs = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-orange-400/10 dark:bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1536px] relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 w-full mx-auto">
          {/* Become an Instructor */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative group p-[1px] rounded-[3rem] overflow-hidden bg-gradient-to-br from-orange-200 via-orange-100 to-transparent dark:from-orange-800/50 dark:via-orange-900/20 dark:to-transparent hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-700"
          >
            <div className="relative h-full flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between gap-8 p-8 xl:p-12 rounded-[calc(3rem-1px)] bg-gradient-to-br from-white/90 to-orange-50/80 dark:from-background dark:to-orange-950/30 backdrop-blur-xl">
              <div className="flex-1 space-y-6 z-10 text-center sm:text-left lg:text-center xl:text-left">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 ring-1 ring-inset ring-orange-600/10 dark:ring-orange-500/20 mb-2">
                  For Educators
                </div>
                <h2 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-orange-600 dark:to-orange-400 leading-tight">
                  Become An Instructor
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto sm:mx-0 lg:mx-auto xl:mx-0">
                  Top instructors from around the world teach millions of
                  students on Mentoring. Start your teaching journey.
                </p>
                <Link href="/signup?role=tutor" className="inline-block pt-2">
                  <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg font-bold shadow-xl shadow-orange-500/25 border-0 hover:scale-[1.02] active:scale-[0.98] transition-all group/btn overflow-hidden relative">
                    <span className="relative z-10 flex items-center">
                      Apply Now
                      <MoveRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                  </Button>
                </Link>
              </div>

              <div className="relative w-full max-w-[200px] sm:max-w-[260px] md:max-w-[280px] lg:max-w-[260px] xl:max-w-[280px] 2xl:max-w-[320px] shrink-0 aspect-square mt-8 sm:mt-0 lg:mt-8 xl:mt-0">
                {/* Dynamic Background Blob */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-[3rem] rotate-6 scale-90 group-hover:rotate-12 group-hover:scale-95 transition-all duration-700 ease-out shadow-inner" />
                <div className="absolute inset-0 bg-gradient-to-bl from-orange-300 to-yellow-400 rounded-[3rem] -rotate-3 scale-95 opacity-50 group-hover:-rotate-6 transition-all duration-700 ease-out" />

                <div className="relative w-full h-full z-10 drop-shadow-2xl">
                  <Image
                    src="/images/Instructor Image.svg"
                    alt="Become Instructor"
                    fill
                    className="object-contain group-hover:scale-110 group-hover:-translate-y-4 transition-transform duration-700 ease-out"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Become a Student */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative group p-[1px] rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-200 via-indigo-100 to-transparent dark:from-indigo-800/50 dark:via-indigo-900/20 dark:to-transparent hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-700"
          >
            <div className="relative h-full flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between gap-8 p-8 xl:p-12 rounded-[calc(3rem-1px)] bg-gradient-to-br from-white/90 to-indigo-50/80 dark:from-background dark:to-indigo-950/30 backdrop-blur-xl">
              <div className="flex-1 space-y-6 z-10 text-center sm:text-left lg:text-center xl:text-left">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 ring-1 ring-inset ring-indigo-600/10 dark:ring-indigo-500/20 mb-2">
                  For Learners
                </div>
                <h2 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-indigo-600 dark:to-indigo-400 leading-tight">
                  Become A Student
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto sm:mx-0 lg:mx-auto xl:mx-0">
                  Start your educational journey with us and access a wealth of
                  premium resources and courses.
                </p>
                <Link href="/signup?role=student" className="inline-block pt-2">
                  <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white text-lg font-bold shadow-xl shadow-indigo-500/25 border-0 hover:scale-[1.02] active:scale-[0.98] transition-all group/btn overflow-hidden relative">
                    <span className="relative z-10 flex items-center">
                      Enroll Now
                      <MoveRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                  </Button>
                </Link>
              </div>

              <div className="relative w-full max-w-[200px] sm:max-w-[260px] md:max-w-[280px] lg:max-w-[260px] xl:max-w-[280px] 2xl:max-w-[320px] shrink-0 aspect-square mt-8 sm:mt-0 lg:mt-8 xl:mt-0">
                {/* Dynamic Background Blob */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-[3rem] -rotate-6 scale-90 group-hover:-rotate-12 group-hover:scale-95 transition-all duration-700 ease-out shadow-inner" />
                <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400 to-blue-500 rounded-[3rem] rotate-3 scale-95 opacity-50 group-hover:rotate-6 transition-all duration-700 ease-out" />

                <div className="relative w-full h-full z-10 drop-shadow-2xl">
                  <Image
                    src="/images/Student Image.svg"
                    alt="Become Student"
                    fill
                    className="object-contain group-hover:scale-110 group-hover:-translate-y-4 transition-transform duration-700 ease-out"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
