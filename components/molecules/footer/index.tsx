"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-[hsl(220,20%,14%)] text-[hsl(220,14%,80%)] py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                D
              </div>
              <span className="text-lg font-bold text-[hsl(0,0%,95%)]">
                Dreams<span className="text-primary">LMS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Platform designed to help organizations, educators, and learners manage,
              deliver, and track learning and training activities.
            </p>
            <div className="flex gap-2">
              <Image
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[hsl(0,0%,95%)] font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {["Education", "Enroll a Course", "Orders", "Payments", "Blogs"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-[hsl(0,0%,95%)] font-semibold mb-4">Pages</h4>
            <ul className="space-y-2 text-sm">
              {["Categories", "Courses", "About us", "FAQ", "Contacts"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-[hsl(0,0%,95%)] font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Our values",
                "Our advisory board",
                "Our partners",
                "Become a partner",
                "Work at Future Learn",
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[hsl(0,0%,95%)] font-semibold mb-4">
              Subscribe Newsletter
            </h4>
            <p className="text-sm mb-4">Sign up to get updates & news.</p>
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 bg-[hsl(220,20%,20%)] border-[hsl(220,20%,25%)] text-[hsl(0,0%,95%)] placeholder:text-[hsl(220,14%,50%)]"
                />
              </div>
              <Button className="w-full">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[hsl(220,20%,10%)] text-[hsl(220,14%,60%)] py-4 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>
            Copyright 2025 © <span className="text-primary">DreamsLMS</span>. All right reserved.
          </p>

          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>

          <div className="flex gap-3">
            <Link href="#"><Facebook className="w-4 h-4" /></Link>
            <Link href="#"><Instagram className="w-4 h-4" /></Link>
            <Link href="#"><Twitter className="w-4 h-4" /></Link>
            <Link href="#"><Youtube className="w-4 h-4" /></Link>
            <Link href="#"><Linkedin className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
