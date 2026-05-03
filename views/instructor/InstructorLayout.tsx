"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import {
  getTutorRedirectPath,
  isInstructorAccessAllowed,
} from "@/utils/onboarding-redirect";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Bell,
  FileCheck,
  Users,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Award,
  CircleDollarSign,
  CreditCard,
  FileText,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainMenuItems = [
  { name: "Dashboard", href: "/instructor/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/instructor/profile", icon: User },
  { name: "Courses", href: "/instructor/courses", icon: BookOpen },
  { name: "Announcements", href: "/instructor/announcements", icon: Bell },
  { name: "Assignments", href: "/instructor/assignments", icon: FileCheck },
  { name: "Students", href: "/instructor/students", icon: Users },
  { name: "Quiz", href: "/instructor/quiz", icon: Clock },
  { name: "Quiz Results", href: "/instructor/quiz-results", icon: FileCheck },
  { name: "Certificates", href: "/instructor/certificates", icon: Award },
  { name: "Earnings", href: "/instructor/earnings", icon: CircleDollarSign },
  { name: "Payout", href: "/instructor/payout", icon: CreditCard },
  { name: "Statements", href: "/instructor/statements", icon: FileText },
  { name: "Messages", href: "/instructor/messages", icon: MessageSquare },
  { name: "Support Tickets", href: "/instructor/support", icon: HelpCircle },
];

const accountSettingsItems = [
  { name: "Settings", href: "/instructor/settings", icon: Settings },
  { name: "Logout", href: "/api/v1/auth/logout", icon: LogOut },
];

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && user.role === "tutor") {
      if (!isInstructorAccessAllowed(user)) {
        const redirectPath = getTutorRedirectPath(user);
        if (pathname !== redirectPath) {
          router.push(redirectPath);
        }
      }
    }
  }, [user, pathname, router]);

  if (user && user.role === "tutor" && !isInstructorAccessAllowed(user)) {
    return null; // Prevent flicker while redirecting
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Sidebar Menu */}
          <aside className="w-full xl:w-72 flex-shrink-0">
            <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-xl shadow-foreground/5 sticky top-24">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    Instructor Panel
                  </h4>
                  <p className="text-[12px] text-muted-foreground">
                    Manage your journey
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-[13px] uppercase tracking-wider text-muted-foreground/60 mb-4 px-3">
                Main Menu
              </h3>
              <nav className="space-y-1.5 mb-10">
                {mainMenuItems.map((item) => {
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
                {accountSettingsItems.map((item) => {
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
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">John Doe</p>
                    <p className="text-[11px] text-muted-foreground truncate italic">
                      Premium Instructor
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
