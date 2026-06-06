"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-footer text-footer-foreground py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                D
              </div>
              <span className="text-base sm:text-lg font-bold text-footer-heading">
                Dreams<span className="text-primary">LMS</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              Platform designed to help organizations, educators, and learners
              manage, deliver, and track learning and training activities.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Image
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                width={135}
                height={40}
                className="h-9 sm:h-10 w-auto"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                width={135}
                height={40}
                className="h-9 sm:h-10 w-auto"
              />
            </div>
          </div>

          {/* Support */}
          <div className="sm:col-span-1">
            <h4 className="text-footer-heading font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Support
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              {[
                "Education",
                "Enroll a Course",
                "Orders",
                "Payments",
                "Blogs",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div className="sm:col-span-1">
            <h4 className="text-footer-heading font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Pages
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              {["Categories", "Courses", "About us", "FAQ", "Contacts"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Useful Links */}
          <div className="sm:col-span-1">
            <h4 className="text-footer-heading font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Useful Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              {[
                "Our values",
                "Our advisory board",
                "Our partners",
                "Become a partner",
                "Work at Future Learn",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-footer-heading font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Subscribe Newsletter
            </h4>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4">
              Sign up to get updates & news.
            </p>
            <div className="space-y-2 sm:space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 bg-footer-input border-footer-input-border text-footer-heading placeholder:text-footer-foreground/60 text-xs sm:text-sm h-10 sm:h-11"
                />
              </div>
              <Button className="w-full text-xs sm:text-sm h-10 sm:h-11">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-footer-bottom text-footer-foreground/80 py-4 sm:py-5 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
          <p className="text-center sm:text-left">
            Copyright 2025 © <span className="text-primary">DreamsLMS</span>.
            All right reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link href="https://www.instagram.com/varonaacademy/?igsh=MTc0a3RsMHdvdXBsZQ%3D%3D&utm_source=qr#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
