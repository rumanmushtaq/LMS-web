"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Home,
  Loader2,
  Save,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import usersService from "@/services/users";
import InstructorLayout from "../InstructorLayout";
import { cn } from "@/lib/utils";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    usersService
      .getProfile()
      .then((data) => {
        setProfile(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhone(data.kycData?.phone || "");
        setGender(data.kycData?.gender || "");

        // format dob for date input (YYYY-MM-DD)
        let formattedDob = "";
        if (data.kycData?.dob) {
          try {
            const d = new Date(data.kycData.dob);
            formattedDob = d.toISOString().split("T")[0];
          } catch (e) {}
        }
        setDob(formattedDob);
        setBio(data.kycData?.bio || "");
      })
      .catch((err) => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await usersService.updateProfile({
        firstName,
        lastName,
        phone,
        gender,
        dob: dob ? new Date(dob).toISOString() : undefined,
        bio,
      });
      router.push("/instructor/profile");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-[#FF4667]" />
        </div>
      </InstructorLayout>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-blue-50 dark:from-rose-950/20 dark:via-background dark:to-blue-950/20 border-b border-border/50">
        <div className="container mx-auto px-6 py-10 text-center relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Edit Profile
          </h1>
          <nav className="flex items-center justify-center gap-2 text-[14px] text-muted-foreground">
            <Link
              href="/instructor/dashboard"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#FF4667]" />
            <Link href="/instructor/profile" className="hover:text-foreground">
              My Profile
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#FF4667]" />
            <span className="text-foreground font-medium">Edit Profile</span>
          </nav>
        </div>
      </section>

      <InstructorLayout>
        <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-xl shadow-foreground/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-border/50 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Edit Profile Information</h3>
          </div>

          {error && (
            <div className="m-6 bg-destructive/10 text-destructive text-[14px] font-medium p-4 rounded-xl border border-destructive/20">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSave}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 ml-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 ml-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 ml-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 ml-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 ml-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 ml-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="w-full p-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="Tell us about yourself and your expertise..."
              />
            </div>

            <div className="md:col-span-2 pt-6 border-t border-border/50 flex items-center justify-end gap-3 mt-4">
              <Link href="/instructor/profile">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-all"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </InstructorLayout>
    </>
  );
}
