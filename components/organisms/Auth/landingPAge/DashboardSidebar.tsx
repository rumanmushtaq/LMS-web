"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  UserCircle,
  BookOpen,
  Star,
  DollarSign,
  Megaphone,
  ClipboardList,
  Users,
  Trophy,
  FileText,
  Award,
  CreditCard,
  MessageSquare,
  LogOut,
  LifeBuoy,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const mainMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: UserCircle, label: "My Profile", href: "/profile" },
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: Megaphone, label: "Announcements", href: "/announcements" },
  { icon: ClipboardList, label: "Assignments", href: "/assignments" },
  { icon: Users, label: "Students", href: "/students" },
  { icon: Trophy, label: "Quiz", href: "/quiz" },
  { icon: FileText, label: "Quiz Results", href: "/quiz-results" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: DollarSign, label: "Earnings", href: "/earnings", active: true },
  { icon: CreditCard, label: "Payout", href: "/payout" },
  { icon: FileText, label: "Statements", href: "/statements" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: LifeBuoy, label: "Support Tickets", href: "/support-tickets" },
];

const accountItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Logout", href: "/logout" },
];

const DashboardSidebar = () => {
  return (
    <div className="w-full md:w-72 shrink-0">
      <div className="border rounded-xl bg-card p-4">
        <h3 className="font-semibold text-foreground mb-3 px-2">Main Menu</h3>
        <nav className="flex flex-col gap-0.5">
          {mainMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                item.active
                  ? "text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-4" />

        <h3 className="font-semibold text-foreground mb-3 px-2">Account Settings</h3>
        <nav className="flex flex-col gap-0.5">
          {accountItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
