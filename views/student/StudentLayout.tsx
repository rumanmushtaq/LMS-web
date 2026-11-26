"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Award,
  Heart,
  Star,
  Clock,
  ShoppingCart,
  Users,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  CalendarClock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { initialsOf } from "@/lib/user";

// `hidden: true` = the page is not built yet. Kept here (not deleted) so it
// is a one-word change to show it again once the page exists.
const mainMenuItems = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/student/profile", icon: User },
  { name: "My Classes", href: "/student/classes", icon: CalendarClock },
  { name: "Enrolled Courses", href: "#", icon: BookOpen, hidden: true },
  { name: "My Certificates", href: "/student/certificates", icon: Award },
  { name: "Wishlist", href: "#", icon: Heart, hidden: true },
  { name: "Reviews", href: "#", icon: Star, hidden: true },
  { name: "My Quiz Attempts", href: "#", icon: Clock, hidden: true },
  { name: "Order History", href: "#", icon: ShoppingCart, hidden: true },
  { name: "Referrals", href: "#", icon: Users, hidden: true },
  { name: "Messages", href: "/chat", icon: MessageSquare },
  { name: "Support Tickets", href: "#", icon: HelpCircle, hidden: true },
];

const accountSettingsItems = [
  { name: "Settings", href: "#", icon: Settings, hidden: true },
  { name: "Logout", href: "/api/v1/auth/logout", icon: LogOut },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Menu */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-xl shadow-foreground/5 sticky top-24">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    Student Panel
                  </h4>
                  <p className="text-[12px] text-muted-foreground">
                    Keep learning & growing
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-[13px] uppercase tracking-wider text-muted-foreground/60 mb-4 px-3">
                Main Menu
              </h3>
              <nav className="space-y-1.5 mb-10">
                {mainMenuItems.filter((item) => !item.hidden).map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4.5 w-4.5",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <h3 className="font-bold text-[13px] uppercase tracking-wider text-muted-foreground/60 mb-4 px-3">
                Account Settings
              </h3>
              <nav className="space-y-1.5">
                {accountSettingsItems.filter((item) => !item.hidden).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1 transition-all duration-300"
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-10 pt-6 border-t border-border/50">
                <div className="bg-muted/40 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {initialsOf(user?.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user?.fullName ?? "Student"}</p>
                    <p className="text-[11px] text-muted-foreground truncate italic">
                      {user?.email ?? "Student"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
