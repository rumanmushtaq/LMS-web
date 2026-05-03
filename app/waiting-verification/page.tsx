"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Mail, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

const WaitingVerificationPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-[#1A1A1A] font-sans flex flex-col items-center justify-center p-6 text-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
          <ShieldCheck className="w-3.5 h-3.5" /> Security Review In Progress
        </div>

        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          Almost there! Your profile is{" "}
          <span className="text-primary italic">under review.</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-12">
          Our team is currently verifying your documentation and professional
          background. This process typically takes 24-48 hours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
          <div className="p-6 rounded-3xl bg-white border border-border shadow-xl shadow-black/[0.02]">
            <Clock className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-black text-sm uppercase mb-2">Wait Time</h4>
            <p className="text-xs text-muted-foreground">
              Usually verified within 1-2 business days.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-border shadow-xl shadow-black/[0.02]">
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-black text-sm uppercase mb-2">Notification</h4>
            <p className="text-xs text-muted-foreground">
              We'll email you immediately once approved.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="h-14 px-8 rounded-2xl border-2 border-border font-black uppercase tracking-widest text-[10px] hover:bg-muted transition-all"
          >
            Back to Home
          </Button>
          <Button
            onClick={handleLogout}
            className="h-14 px-8 rounded-2xl bg-destructive/10 text-destructive border-2 border-destructive/20 font-black uppercase tracking-widest text-[10px] hover:bg-destructive hover:text-white transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </motion.div>

      <div className="mt-20 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
        Varona Academy &copy; 2026 • Secure Instructor Portal
      </div>
    </div>
  );
};

export default WaitingVerificationPage;
