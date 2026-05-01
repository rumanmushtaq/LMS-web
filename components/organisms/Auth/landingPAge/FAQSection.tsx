"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What's DreamLMS want to give you?",
    answer:
      "DreamLMS aims to provide you with a comprehensive and intuitive learning platform that enhances your educational experience.",
  },
  {
    question: "Why choose us for your education?",
    answer:
      "We offer expert-led courses, flexible learning schedules, and a supportive community to help you achieve your goals.",
  },
  {
    question: "How We Provide Service For you?",
    answer:
      "Our platform provides seamless access to video lessons, interactive quizzes, and direct mentorship from industry leaders.",
  },
  {
    question: "Do you have a monthly plan?",
    answer:
      "Yes, we offer flexible subscription plans including monthly and annual options to suit different needs.",
  },
  {
    question: "Are you Affordable For Your Course",
    answer:
      "We strive to maintain competitive pricing while ensuring the highest quality of educational content.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        {/* Left Image Side */}
        <div className="flex-1 w-full relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[40px] overflow-hidden shadow-2xl h-[400px] lg:h-[600px]"
          >
            <Image
              src="/images/image.png"
              alt="Our Experts"
              fill
              className="object-cover"
            />
            {/* Overlay Question Mark Badge */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-[#ffc33d] rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
              <HelpCircle className="w-8 h-8 text-black" />
            </div>
          </motion.div>
          {/* Subtle Pink Glow */}
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
        </div>

        {/* Right Content Side */}
        <div className="flex-1 space-y-10 w-full">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore detailed answers to the most common questions about our
              platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-300 ${
                  openIndex === index
                    ? "bg-card border-primary/20 shadow-xl shadow-primary/5"
                    : "bg-muted/50 border-border hover:border-primary/30"
                }`}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span
                    className={`text-lg font-bold transition-colors ${
                      openIndex === index ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      openIndex === index
                        ? "bg-primary/20 text-primary rotate-180"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {openIndex === index ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
