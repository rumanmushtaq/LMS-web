"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Send, Facebook, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/signup") ||
    pathname.includes("/forgot-password") ||
    pathname.includes("/new-password") ||
    pathname.includes("/otp") ||
    pathname.includes("/landing-Page");

  if (isAuthPage) return null;

  return (
    <footer className="relative w-full overflow-hidden bg-background pt-16 border-t border-border/40">
      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 h-64 w-64 bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 h-64 w-64 bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand & Apps */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/lms-logo.png"
                alt="Dreams LMS"
                width={44}
                height={44}
                className="h-11 w-auto"
              />
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
                Dreams
                <span className="text-[var(--primary)] text-[10px] font-bold self-start mt-1.5 ml-0.5">
                  LMS
                </span>
              </h2>
            </div>
            <p className="max-w-xs text-[15px] leading-relaxed text-muted-foreground/80">
              Platform designed to help organizations, educators, and learners
              manage, deliver, and track learning and training activities.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="#"
                className="transition-all hover:opacity-80 active:scale-95"
              >
                <Image
                  src="/images/app-store-badge.png"
                  alt="Download on the App Store"
                  width={140}
                  height={42}
                  className="h-11 w-auto rounded-xl shadow-sm border border-border/50"
                />
              </Link>
              <Link
                href="#"
                className="transition-all hover:opacity-80 active:scale-95"
              >
                <Image
                  src="/images/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={140}
                  height={42}
                  className="h-11 w-auto rounded-xl shadow-sm border border-border/50"
                />
              </Link>
            </div>
          </div>

          {/* Links: For Instructor */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-foreground">
              For Instructor
            </h3>
            <ul className="space-y-3.5">
              {[
                "Search Mentors",
                "Login",
                "Register",
                "Booking",
                "Students",
                "Dashboard",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[15px] text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: For Student */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-foreground">For Student</h3>
            <ul className="space-y-3.5">
              {[
                "Appointments",
                "Chat",
                "Login",
                "Register",
                "Instructor Dashboard",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[15px] text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-foreground">Newsletter</h3>
              <div className="relative flex items-center">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-13 w-full rounded-full border-border/60 bg-card pr-36 pl-6 text-sm focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm"
                />
                <Button className="absolute right-1.5 h-10 rounded-full bg-[var(--primary)] px-6 text-xs font-bold text-white hover:bg-[var(--primary)] transition-all active:scale-95 shadow-lg shadow-purple-900/10">
                  <Send className="mr-2 h-3.5 w-3.5" /> Subscribe
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20 shadow-sm border border-purple-100/50 dark:border-purple-800/30">
                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="pt-1.5">
                  <p className="text-[15px] leading-snug text-muted-foreground">
                    3556 Beech Street, San Francisco,
                    <br />
                    California, CA 94108
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-50 dark:bg-pink-900/20 shadow-sm border border-pink-100/50 dark:border-pink-800/30">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <p className="text-[15px] text-muted-foreground">
                  dreamslms@example.com
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/20 shadow-sm border border-orange-100/50 dark:border-orange-800/30">
                  <Phone className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-[15px] text-muted-foreground">
                  +19 123-456-7890
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[var(--primary)] py-7 text-[13px] font-medium text-white/80">
        <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-6 md:flex-row">
          <p>© 2025 DreamsLMS. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20 hidden md:inline">|</span>
            <div className="flex items-center gap-4">
              <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="https://www.instagram.com/varonaacademy/?igsh=MTc0a3RsMHdvdXBsZQ%3D%3D&utm_source=qr#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
