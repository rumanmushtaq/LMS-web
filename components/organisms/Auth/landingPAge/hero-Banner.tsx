"use client";

import { motion } from "framer-motion";

interface HeroBannerProps {
  title: string;
  breadcrumbs: { label: string; active?: boolean }[];
}

const HeroBanner = ({ title, breadcrumbs }: HeroBannerProps) => {
  return (
    <div className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
        >
          {title}
        </motion.h1>

        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex items-center justify-center gap-2 text-muted-foreground"
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="h-2 w-4 rounded-sm bg-accent inline-block" />}
              <span className={crumb.active ? "text-muted-foreground" : "text-foreground font-medium"}>
                {crumb.label}
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
