"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Home, Loader2, Save } from "lucide-react";
import Link from "next/link";
import usersService, { StudentProfile } from "@/services/users";
import StudentLayout from "../StudentLayout";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
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
      router.push("/student/profile");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
        </div>
      </StudentLayout>
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
              href="/"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--primary)]" />
            <Link href="/student/profile" className="hover:text-foreground">
              My Profile
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="text-foreground font-medium">Edit Profile</span>
          </nav>
        </div>
      </section>

      <StudentLayout>
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 sm:p-8">
          <h3 className="text-xl font-bold text-foreground border-b border-border/50 pb-5 mb-6">
            Edit Profile Information
          </h3>

          {error && (
            <div className="mb-6 bg-destructive/10 text-destructive text-[14px] font-medium p-3 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSave}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-foreground">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-foreground">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-foreground">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full h-11 px-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-foreground">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] appearance-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-foreground">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full h-11 px-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[14px] font-bold text-foreground">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full p-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="md:col-span-2 pt-4 border-t border-border/50 flex items-center justify-end gap-3">
              <Link href="/student/profile">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-full border border-border bg-background hover:bg-muted text-[14px] font-semibold text-foreground transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary)] text-white text-[14px] font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
      </StudentLayout>
    </>
  );
}
