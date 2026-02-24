"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Dreams<sup className="text-xs text-primary">LMS</sup>
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.
            </p>

            <div className="flex gap-3 pt-2">
              <div className="flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-medium text-background">
                <span>🍎</span> App Store
              </div>
              <div className="flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-medium text-background">
                <span>▶</span> Google Play
              </div>
            </div>
          </div>

          {/* For Instructor */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              For Instructor
            </h3>
            <ul className="space-y-2.5">
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
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Student */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              For Student
            </h3>
            <ul className="space-y-2.5">
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
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">
              Newsletter
            </h3>

            <div className="flex">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="rounded-r-none border-r-0 bg-muted text-sm"
              />
              <Button className="rounded-l-none bg-primary text-primary-foreground hover:bg-primary/90">
                ✨ Subscribe
              </Button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  3556 Beech Street, San Francisco, California, CA 94108
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>dreamslms@example.com</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+19 123-456-7890</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;