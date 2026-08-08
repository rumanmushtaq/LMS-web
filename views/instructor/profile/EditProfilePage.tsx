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
import { FieldRepeater } from "./FieldRepeater";

type AvailabilitySlot = { day: string; startTime: string; endTime: string };
type EducationEntry = { degree: string; institution: string; period: string };
type ExperienceEntry = { role: string; company: string; period: string };

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Drops rows the tutor added but left completely blank. */
function withoutEmptyRows<Row extends Record<string, string>>(rows: Row[]): Row[] {
  return rows.filter((row) =>
    Object.values(row).some((value) => String(value ?? "").trim() !== ""),
  );
}

/** Labelled text input, so the long form below stays readable. */
function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      {hint && <p className="text-xs text-muted-foreground ml-1">{hint}</p>}
    </div>
  );
}

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

  // Tutor profile fields — shown on the public profile, previously uneditable.
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [spokenLanguages, setSpokenLanguages] = useState("");
  const [certifications, setCertifications] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");

  // List fields — arrays of records, edited through FieldRepeater.
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);

  /** Comma-separated input <-> string[] stored on the profile. */
  const toList = (value: string) =>
    value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

  useEffect(() => {
    usersService
      .getProfile()
      .then((data) => {
        const kyc: Record<string, any> = data.kycData ?? {};
        setProfile(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhone(kyc.phone || "");
        setGender(kyc.gender || "");

        // format dob for date input (YYYY-MM-DD)
        let formattedDob = "";
        if (kyc.dob) {
          try {
            const d = new Date(kyc.dob);
            formattedDob = d.toISOString().split("T")[0];
          } catch (e) {}
        }
        setDob(formattedDob);
        setBio(kyc.bio || "");

        setTitle(kyc.title || "");
        setAddress(kyc.address || "");
        setCountry(kyc.country || "");
        setTimezone(kyc.timezone || "");
        setCategory(kyc.category || "");
        setLevel(kyc.level || "");
        setNativeLanguage(kyc.nativeLanguage || "");
        // Records written by onboarding use pricePerHour; older ones hourlyRate.
        setPricePerHour(
          kyc.pricePerHour ?? kyc.hourlyRate ? String(kyc.pricePerHour ?? kyc.hourlyRate) : "",
        );
        setSpecialties((kyc.specialties ?? []).join(", "));
        setSpokenLanguages((kyc.spokenLanguages ?? []).join(", "));
        setCertifications((kyc.certifications ?? []).join(", "));

        setAvailability(Array.isArray(kyc.availability) ? kyc.availability : []);
        setEducation(Array.isArray(kyc.education) ? kyc.education : []);
        // `experience` is the work-history array. Older records sometimes hold
        // a plain string here (it used to double as the level), so ignore
        // anything that isn't a list rather than crashing the editor.
        setExperience(Array.isArray(kyc.experience) ? kyc.experience : []);

        const social = kyc.social ?? {};
        setLinkedin(social.linkedin || "");
        setFacebook(social.facebook || "");
        setInstagram(social.instagram || "");
        setTwitter(social.twitter || "");
        setYoutube(social.youtube || "");
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
        title,
        address,
        country,
        timezone,
        category,
        level,
        nativeLanguage,
        pricePerHour: pricePerHour ? Number(pricePerHour) : undefined,
        specialties: toList(specialties),
        spokenLanguages: toList(spokenLanguages),
        certifications: toList(certifications),
        social: { linkedin, facebook, instagram, twitter, youtube },
        availability: withoutEmptyRows(availability),
        education: withoutEmptyRows(education),
        experience: withoutEmptyRows(experience),
      });
      router.push("/instructor/profile");
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setError(
        // The API returns an array of messages when several fields fail.
        Array.isArray(message)
          ? message.join(" · ")
          : message || "Failed to update profile.",
      );
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
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
            <ChevronRight className="h-3.5 w-3.5 text-[var(--primary)]" />
            <Link href="/instructor/profile" className="hover:text-foreground">
              My Profile
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--primary)]" />
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

            <div className="md:col-span-2 pt-6 mt-2 border-t border-border/50">
              <h4 className="text-sm font-bold text-foreground">
                Teaching Profile
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                This is what students see on your public profile.
              </p>
            </div>

            <Field
              label="Professional Title"
              value={title}
              onChange={setTitle}
              placeholder="Senior Mathematics Tutor"
            />
            <Field
              label="Category"
              value={category}
              onChange={setCategory}
              placeholder="Mathematics"
            />
            <Field
              label="Experience Level"
              value={level}
              onChange={setLevel}
              placeholder="Expert"
            />
            <Field
              label="Rate per Hour (USD)"
              value={pricePerHour}
              onChange={setPricePerHour}
              type="number"
              placeholder="45"
            />
            <Field
              label="Country"
              value={country}
              onChange={setCountry}
              placeholder="United States"
            />
            <Field
              label="Timezone"
              value={timezone}
              onChange={setTimezone}
              placeholder="America/New_York"
            />
            <Field
              label="Address"
              value={address}
              onChange={setAddress}
              placeholder="12 Example Street, New York"
              className="md:col-span-2"
            />
            <Field
              label="Specialties"
              value={specialties}
              onChange={setSpecialties}
              placeholder="Algebra, Calculus, Statistics"
              hint="Separate with commas"
              className="md:col-span-2"
            />
            <Field
              label="Native Language"
              value={nativeLanguage}
              onChange={setNativeLanguage}
              placeholder="English"
            />
            <Field
              label="Spoken Languages"
              value={spokenLanguages}
              onChange={setSpokenLanguages}
              placeholder="English, Spanish"
              hint="Separate with commas"
            />
            <Field
              label="Certifications"
              value={certifications}
              onChange={setCertifications}
              placeholder="CELTA, PGCE"
              hint="Separate with commas"
              className="md:col-span-2"
            />

            <div className="md:col-span-2 pt-6 mt-2 border-t border-border/50" />

            <FieldRepeater<AvailabilitySlot>
              title="Availability"
              description="The weekly slots students can book you in."
              rows={availability}
              onChange={setAvailability}
              addLabel="Add slot"
              emptyLabel="No availability set — students will not know when you are free."
              blankRow={{ day: "", startTime: "", endTime: "" }}
              columns={[
                { key: "day", label: "Day", options: DAYS },
                { key: "startTime", label: "From", type: "time", className: "md:max-w-[160px]" },
                { key: "endTime", label: "To", type: "time", className: "md:max-w-[160px]" },
              ]}
            />

            <div className="md:col-span-2 pt-6 mt-2 border-t border-border/50" />

            <FieldRepeater<EducationEntry>
              title="Education"
              description="Degrees and qualifications shown on your public profile."
              rows={education}
              onChange={setEducation}
              addLabel="Add education"
              emptyLabel="No education added yet."
              blankRow={{ degree: "", institution: "", period: "" }}
              columns={[
                { key: "degree", label: "Degree", placeholder: "BSc Mathematics" },
                { key: "institution", label: "Institution", placeholder: "MIT" },
                { key: "period", label: "Period", placeholder: "2010 – 2014", className: "md:max-w-[200px]" },
              ]}
            />

            <div className="md:col-span-2 pt-6 mt-2 border-t border-border/50" />

            <FieldRepeater<ExperienceEntry>
              title="Work Experience"
              description="Teaching or industry roles shown on your public profile."
              rows={experience}
              onChange={setExperience}
              addLabel="Add experience"
              emptyLabel="No experience added yet."
              blankRow={{ role: "", company: "", period: "" }}
              columns={[
                { key: "role", label: "Role", placeholder: "Senior Tutor" },
                { key: "company", label: "Organisation", placeholder: "Varona Academy" },
                { key: "period", label: "Period", placeholder: "2018 – present", className: "md:max-w-[200px]" },
              ]}
            />

            <div className="md:col-span-2 pt-6 mt-2 border-t border-border/50">
              <h4 className="text-sm font-bold text-foreground">Social Links</h4>
            </div>

            <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/…" />
            <Field label="Facebook" value={facebook} onChange={setFacebook} placeholder="https://facebook.com/…" />
            <Field label="Instagram" value={instagram} onChange={setInstagram} placeholder="https://instagram.com/…" />
            <Field label="X / Twitter" value={twitter} onChange={setTwitter} placeholder="https://x.com/…" />
            <Field label="YouTube" value={youtube} onChange={setYoutube} placeholder="https://youtube.com/@…" className="md:col-span-2" />

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
