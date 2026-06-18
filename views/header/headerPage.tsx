"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Moon, ShoppingCart, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/theme";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Header = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, logout, accessToken } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync auth state with cookies — if cookie expired but Zustand state is stale, log out
  useEffect(() => {
    if (!mounted) return;
    const cookieToken = typeof window !== "undefined"
      ? document.cookie.split(";").find((c) => c.trim().startsWith("access_token="))
      : null;
    if (!cookieToken && accessToken) {
      // Stale Zustand state — cookie is gone, clear the store
      logout();
    }
  }, [mounted, accessToken, logout]);

  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/signup") ||
    pathname.includes("/forgot-password") ||
    pathname.includes("/new-password") ||
    pathname.includes("/otp") ||
    pathname.includes("/landing-Page");

  if (isAuthPage) return null;

  const isAuth = mounted ? isAuthenticated() : false;

  const navLinks = [
    { name: "Home", href: "/", hasDropdown: false },
    ...(isAuth
      ? [
          {
            name: "Dashboard",
            href:
              user?.role === "tutor"
                ? "/instructor/dashboard"
                : "/student/dashboard",
            hasDropdown: false,
            highlighted: true,
          },
        ]
      : []),
    { name: "Instructors", href: "/instructors", hasDropdown: false },
    { name: "Shop", href: "/shop", hasDropdown: false },
    { name: "Blog", href: "/blog", hasDropdown: false },
    { name: "Contact us", href: "/contact", hasDropdown: false },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/shop" && pathname.startsWith("/product")) return true;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logo-image.png"
            alt="Dreams LMS"
            width={140}
            height={56}
            className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Center: Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <div key={link.name} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 text-[15px] relative font-semibold transition-colors hover:text-[var(--primary)] py-1",
                    active ? "text-[var(--primary)]" : "text-foreground/80",
                  )}
                >
                  {link.name}
                  {link.hasDropdown && (
                    <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                  {active && (
                    <motion.div
                      layoutId="header-active-tab-underline"
                      className="absolute left-0 right-0 -bottom-[8px] h-[3px] rounded-full bg-[var(--primary)]"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-11 w-11 hover:bg-muted"
            >
              {theme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          )}

          {/* Cart */}
          <div className="relative cursor-pointer group">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-muted">
              <ShoppingCart className="h-5 w-5 text-foreground/70 group-hover:text-foreground" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1DBF73] text-[10px] font-bold text-white ring-2 ring-background">
              1
            </span>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 ml-2">
            {!mounted ? (
              <div className="w-[180px] h-11 animate-pulse bg-muted rounded-full" />
            ) : isAuth ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => logout()}
                  className="h-11 px-8 rounded-full font-bold border-border/60 hover:bg-muted bg-muted/30"
                >
                  Sign Out
                </Button>
                <Link
                  href={
                    user?.role === "tutor"
                      ? "/instructor/profile"
                      : "/student/profile"
                  }
                >
                  <Button className="h-11 px-8 rounded-full font-bold bg-[var(--primary)] hover:bg-[var(--primary)] text-white shadow-lg shadow-primary/20 cursor-pointer">
                    Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="h-11 px-8 rounded-full font-bold border-border/60 hover:bg-muted bg-muted/30"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="h-11 px-8 rounded-full font-bold bg-[var(--primary)] hover:bg-[var(--primary)] text-white shadow-lg shadow-primary/20">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-11 w-11"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-lg font-semibold py-2 transition-colors",
                  isActive(link.href)
                    ? "text-[var(--primary)]"
                    : "text-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="my-2 border-border/50" />
            <div className="flex flex-col gap-3 pt-2">
              {!mounted ? (
                <div className="w-full h-12 animate-pulse bg-muted rounded-full" />
              ) : isAuth ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="h-12 w-full rounded-full font-bold"
                  >
                    Sign Out
                  </Button>
                  <Link
                    href={
                      user?.role === "tutor"
                        ? "/instructor/profile"
                        : "/student/profile"
                    }
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="h-12 w-full rounded-full font-bold bg-[var(--primary)] text-white">
                      Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-full font-bold"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="h-12 w-full rounded-full font-bold bg-[var(--primary)] text-white">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
