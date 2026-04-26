"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Sidebar Menu */}
          <aside className="w-full xl:w-64 flex-shrink-0">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sticky top-24">
              <h3 className="font-bold text-foreground mb-4 px-3">Main Menu</h3>
              <nav className="space-y-1 mb-8">
                {mainMenuItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
                        isActive
                          ? "bg-[#FF4667]/10 text-[#FF4667]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <h3 className="font-bold text-foreground mb-4 px-3">
                Account Settings
              </h3>
              <nav className="space-y-1">
                {accountSettingsItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
