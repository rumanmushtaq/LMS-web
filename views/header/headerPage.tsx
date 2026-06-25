"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Moon, ShoppingCart, Sun, Menu, X, Bell, CheckCheck, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/theme";
import { useAuthStore } from "@/store/auth";
import { useNotificationStore } from "@/store/notification";
import { useChatStore } from "@/store/chat";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Header = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const openChat = useChatStore((state) => state.openChat);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      fetchNotifications();
    }
  }, []);

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
    {
      name: "Become a Tutor",
      href: "/become-a-tutor",
      hasDropdown: false,
    },
    { name: "Instructors", href: "/instructors", hasDropdown: false },
    { name: "Shop", href: "/shop", hasDropdown: false },
    { name: "Contact us", href: "/contact", hasDropdown: false },
  ];

  // Message icon nav item (shown when authenticated)
  const showMessagesIcon = mounted && isAuth;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/shop" && pathname.startsWith("/product")) return true;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background shadow-sm">
      <div className="container mx-auto flex h-28 items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logo-image.png"
            alt="Varona Academy"
            width={300}
            height={120}
            className="h-24 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Center: Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const highlighted = (link as any).isHighlighted;
            return (
              <div key={link.name} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 text-[15px] relative font-semibold transition-all py-1",
                    highlighted
                      ? "text-white bg-[var(--primary)] px-4 py-2 rounded-full hover:bg-[var(--primary)]/90 hover:scale-105 shadow-lg shadow-primary/20"
                      : cn(
                          "hover:text-[var(--primary)]",
                          active ? "text-[var(--primary)]" : "text-foreground/80",
                        ),
                  )}
                >
                  {link.name}
                  {link.hasDropdown && (
                    <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                  {!highlighted && active && (
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
          {/* Messages Icon */}
          {showMessagesIcon && (
            <Link href="/chat">
              <div
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-full bg-muted/50 transition-colors hover:bg-muted cursor-pointer group",
                  pathname.startsWith("/chat") && "bg-primary/10"
                )}
                title="Messages"
              >
                <MessageSquare
                  className={cn(
                    "h-5 w-5 transition-colors",
                    pathname.startsWith("/chat")
                      ? "text-primary"
                      : "text-foreground/70 group-hover:text-foreground"
                  )}
                />
              </div>
            </Link>
          )}
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

          {/* Notifications */}
          {isAuth && mounted && (
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-muted">
                    <Bell className="h-5 w-5 text-foreground/70 group-hover:text-foreground" />
                  </div>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-0 text-xs text-primary hover:bg-transparent">
                      <CheckCheck className="mr-1 h-3 w-3" /> Mark all read
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {!Array.isArray(notifications) || notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={cn("p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors", !notification.read && "bg-primary/5")}
                          onClick={() => {
                            markAsRead(notification._id);
                            if (notification.type === 'chat_message' && notification.senderId) {
                              openChat(notification.senderId, "New Message");
                            }
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{notification.title}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{notification.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-2 border-t bg-muted/20">
                  <Link href="/notifications" className="block w-full text-center text-sm font-medium text-primary hover:underline py-1 transition-all">
                    View all notifications
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
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
                <Link
                  href={
                    user?.role === "tutor"
                      ? "/instructor/profile"
                      : "/student/profile"
                  }
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-muted transition-colors cursor-pointer border border-border/50">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                      {user?.fullName
                        ?.split(" ")[0]
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-semibold max-w-[100px] truncate">
                      {user?.fullName?.split(" ")[0] || "User"}
                    </span>
                  </div>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => logout()}
                  className="h-11 rounded-full font-bold border-border/60 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button className="h-11 px-8 rounded-full font-bold bg-[var(--primary)] hover:bg-[var(--primary)] text-white shadow-lg shadow-primary/20">
                    Sign In
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
                  <Link
                    href={
                      user?.role === "tutor"
                        ? "/instructor/profile"
                        : "/student/profile"
                    }
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/50">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                        {user?.fullName
                          ?.split(" ")[0]
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>
                      <span className="text-base font-semibold truncate">
                        {user?.fullName?.split(" ")[0] || "User"}
                      </span>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="h-12 w-full rounded-full font-bold border-border/60 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="h-12 w-full rounded-full font-bold bg-[var(--primary)] text-white">
                      Sign In
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
