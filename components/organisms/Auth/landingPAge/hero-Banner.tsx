"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CategorySearch from "@/components/molecules/shop/hero-section/CategorySearch";
import axiosInstance from "@/utils/axiosInstance";

const SLIDE_MS = 8000;

interface Banner {
  _id: string;
  videoUrl: string;
  isActive: boolean;
}

const HeroSlider = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Fetch directly with axiosInstance to avoid any wrapper issues */
  useEffect(() => {
    axiosInstance
      .get("/api/v1/admin/hero-banner/active")
      .then(({ data }) => {
        const list: Banner[] = Array.isArray(data?.data) ? data.data : [];
        const urls = list.map((b) => b.videoUrl).filter(Boolean);
        setVideos(urls);
      })
      .catch(() => setVideos([]))
      .finally(() => setReady(true));
  }, []);

  /* Auto-advance */
  useEffect(() => {
    if (videos.length <= 1) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIdx((prev) => (prev + 1) % videos.length);
    }, SLIDE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idx, videos.length]);

  /* Play video when src changes */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videos[idx]) return;
    el.src = videos[idx];
    el.load();
    el.play().catch(() => {});
  }, [idx, videos]);

  const currentSrc = videos[idx] ?? null;

  return (
    <section
      className="relative w-full overflow-hidden shadow-2xl"
      style={{ height: "600px", borderRadius: "0 0 48px 48px" }}
    >
      {/* ── Always-visible animated gradient background ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#1e1b4b_0%,_#0f172a_60%,_#000_100%)]" />
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] bg-violet-900/30 -top-40 -left-40 animate-pulse"
        style={{ zIndex: 0 }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bg-pink-950/30 bottom-0 right-0 animate-pulse"
        style={{ zIndex: 0, animationDelay: "1.5s" }}
      />

      {/* ── VIDEO element — always in DOM, src swaps on slide change ── */}
      {ready && currentSrc && (
        <video
          ref={videoRef}
          src={currentSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover", zIndex: 1, opacity: 1 }}
        />
      )}

      {/* ── Overlay so text stays legible ── */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.20) 100%)",
        }}
      />

      {/* ── Foreground text + search ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
        style={{ zIndex: 10 }}
      >
        <motion.span
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold uppercase tracking-widest"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-pulse inline-block" />
          The Leader in Online Learning
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-xl max-w-4xl"
        >
          Engaging &amp; Accessible <br />
          <span className="text-[#FF4D6D]">Online Courses</span> For All
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-4 text-base sm:text-lg text-white/75 max-w-xl leading-relaxed drop-shadow"
        >
          Our specialized online courses are designed to bring the classroom
          experience to you, no matter where you are.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-8 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50"
        >
          <CategorySearch />
        </motion.div>
      </div>

      {/* ── Slide dots (shown only when > 1 video) ── */}
      {videos.length > 1 && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
          style={{ zIndex: 20 }}
        >
          {videos.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === idx
                  ? "w-8 h-2 bg-[#FF4D6D] shadow-md"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
