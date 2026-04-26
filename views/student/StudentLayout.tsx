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
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainMenuItems = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/student/profile", icon: User },
  { name: "Enrolled Courses", href: "#", icon: BookOpen },
  { name: "My Certificates", href: "#", icon: Award },
  { name: "Wishlist", href: "#", icon: Heart },
  { name: "Reviews", href: "#", icon: Star },
  { name: "My Quiz Attempts", href: "#", icon: Clock },
  { name: "Order History", href: "#", icon: ShoppingCart },
  { name: "Referrals", href: "#", icon: Users },
  { name: "Messages", href: "#", icon: MessageSquare },
  { name: "Support Tickets", href: "#", icon: HelpCircle },
];

const accountSettingsItems = [
  { name: "Settings", href: "#", icon: Settings },
  { name: "Logout", href: "/api/v1/auth/logout", icon: LogOut },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Menu */}
          <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
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
