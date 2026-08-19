"use client";

import {
  Loader2, PenSquare, ChevronRight, Home, CheckCircle2, Mail, Phone,
  User as UserIcon, BookOpen, Save, X, Plus, GraduationCap, Briefcase,
  Trash2, Globe, Star, Users, Clock, DollarSign, Award, MapPin, Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Controller, useFieldArray } from "react-hook-form";
import InstructorLayout from "../InstructorLayout";
import { cn } from "@/lib/utils";
import { useInstructorProfile } from "@/hooks/useInstructorProfile";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";
import apiEndpoints from "@/utils/apiConfig";
import { getMaterials, deleteMaterial, TutorMaterial } from "@/services/materials";
import categoriesService, { CategoryItem } from "@/services/categories";
import { FileTypePlaceholder } from "@/components/materials/FileTypePlaceholder";
import { formatDateOnly, formatAge } from "@/utils/date";
import { useAuthStore } from "@/store/auth";
import { Library } from "lucide-react";

/* ─── Tiny shared primitives ─────────────────────────────── */

const Btn = ({ children, variant = "primary", size = "md", className = "", ...p }: any) => (
  <button
    // Buttons default to type="submit" inside a form; without this, pressing
    // Enter in any input "clicks" the first Btn in the form (implicit
    // submission) — which was adding Education rows out of nowhere.
    type="button"
    className={cn(
      "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95 gap-2",
      variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground"
        : variant === "outline" ? "border border-border hover:bg-muted"
        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
      size === "sm" ? "h-9 px-3" : size === "lg" ? "h-12 px-6" : "h-10 px-4",
      className
    )}
    {...p}
  >
    {children}
  </button>
);

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="space-y-1">
    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">{label}</p>
    <p className="text-sm font-semibold text-foreground">{value || "—"}</p>
  </div>
);

const InputField = ({ label, name, control, placeholder = "" }: any) => (
  <div>
    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 block mb-1">{label}</label>
    <Controller name={name} control={control} render={({ field }) => (
      <input {...field} type="text" placeholder={placeholder}
        className="w-full h-10 px-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm" />
    )} />
  </div>
);

const SelectField = ({ label, name, control, options }: any) => (
  <div>
    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 block mb-1">{label}</label>
    <Controller name={name} control={control} render={({ field }) => (
      <select {...field}
        className="w-full h-10 px-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none">
        <option value="">Select…</option>
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    )} />
  </div>
);

/** Chip editor for string arrays (specialties, spoken languages). Enter, comma, or the + button adds; ✕ removes. */
const TagInputField = ({ label, name, control, placeholder = "Type and press Enter" }: any) => {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 block mb-1">{label}</label>
      <Controller name={name} control={control} render={({ field }) => {
        // Older KYC records can hold a non-array here; never assume.
        const tags: string[] = Array.isArray(field.value) ? field.value : [];
        const commit = () => {
          const tag = draft.trim().replace(/,+$/, "");
          if (tag && !tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
            field.onChange([...tags, tag]);
          }
          setDraft("");
        };
        return (
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            {tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                {tag}
                <button type="button" onClick={() => field.onChange(tags.filter((_, idx) => idx !== i))}
                  className="hover:text-destructive transition-colors" aria-label={`Remove ${tag}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={tags.length === 0 ? placeholder : ""}
              className="flex-1 min-w-[110px] h-7 px-1 bg-transparent focus:outline-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  commit();
                }
              }}
              onBlur={commit}
            />
            <button
              type="button"
              onClick={commit}
              disabled={!draft.trim()}
              className="p-1.5 rounded-lg border border-border text-primary hover:bg-primary/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label={`Add ${label}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      }} />
    </div>
  );
};

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Weekly availability editor — same day/startTime/endTime slots the KYC onboarding produces. */
const AvailabilityEditor = ({ control }: any) => (
  <Controller name="availability" control={control} render={({ field }) => {
    const slots: { day: string; startTime: string; endTime: string }[] = field.value ?? [];
    const slotFor = (day: string) => slots.find((s) => s.day === day);
    const setSlot = (day: string, patch: Partial<{ startTime: string; endTime: string }> | null) => {
      if (patch === null) {
        field.onChange(slots.filter((s) => s.day !== day));
      } else if (slotFor(day)) {
        field.onChange(slots.map((s) => (s.day === day ? { ...s, ...patch } : s)));
      } else {
        field.onChange([...slots, { day, startTime: "09:00", endTime: "17:00", ...patch }]);
      }
    };
    return (
      <div className="space-y-2">
        {WEEK_DAYS.map((day) => {
          const slot = slotFor(day);
          return (
            <div key={day} className={cn(
              "flex flex-wrap items-center gap-3 p-3 rounded-xl border transition-colors",
              slot ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/20",
            )}>
              <label className="flex items-center gap-2.5 w-32 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!slot}
                  onChange={(e) => setSlot(day, e.target.checked ? {} : null)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className={cn("text-sm font-semibold", slot ? "text-foreground" : "text-muted-foreground")}>{day}</span>
              </label>
              {slot && (
                <div className="flex items-center gap-2 text-sm">
                  <input type="time" value={slot.startTime}
                    onChange={(e) => setSlot(day, { startTime: e.target.value })}
                    className="h-9 px-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <span className="text-muted-foreground">to</span>
                  <input type="time" value={slot.endTime}
                    onChange={(e) => setSlot(day, { endTime: e.target.value })}
                    className="h-9 px-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }} />
);

const EXPERIENCE_LEVELS = ["Less than 1 year", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"];

/** "1783186451488-certificate_Tekaa2zZ8.jpeg" → "certificate_Tekaa2zZ8.jpeg" — never the raw URL. */
const certDisplayName = (url: string, index: number) => {
  try {
    const base = decodeURIComponent(url.split("/").pop()!.split("?")[0]).replace(/^\d+-/, "");
    return base || `Certificate ${index + 1}`;
  } catch {
    return `Certificate ${index + 1}`;
  }
};

/** Add/remove certificate files. Uses the same upload endpoint and folder as KYC onboarding. */
const CertificationsEditor = ({ control }: any) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Controller name="certifications" control={control} render={({ field }) => {
      const certs: string[] = Array.isArray(field.value) ? field.value : [];

      const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        setUploading(true);
        try {
          const data = new FormData();
          data.append("file", file);
          data.append("folder", "tutor-certs");
          const res = await axiosInstance.post(apiEndpoints.Onboarding.UPLOAD, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          field.onChange([...certs, res.data.data.url]);
          toast.success("Certificate uploaded. Remember to save your profile.");
        } catch (err) {
          console.error("Certificate upload failed", err);
          toast.error("Certificate upload failed. Please try again.");
        } finally {
          setUploading(false);
        }
      };

      return (
        <div className="space-y-3">
          {certs.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No certifications uploaded yet.</p>
          )}
          <div className="flex flex-wrap gap-2">
            {certs.map((url, i) => (
              <span key={i} className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                <Award className="h-3.5 w-3.5 shrink-0" />
                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline max-w-[220px] truncate" title={certDisplayName(url, i)}>
                  {certDisplayName(url, i)}
                </a>
                <button type="button" onClick={() => field.onChange(certs.filter((_, idx) => idx !== i))}
                  className="p-0.5 hover:text-destructive transition-colors" aria-label="Remove certificate">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onFile} />
          <Btn variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}
            className="text-primary hover:bg-primary/10">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Add Certificate"}
          </Btn>
        </div>
      );
    }} />
  );
};

const SectionCard = ({ icon: Icon, title, action, children }: any) => (
  <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-xl shadow-foreground/5 overflow-hidden">
    <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
      <h3 className="text-base font-bold flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />{title}
      </h3>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */

export default function InstructorProfilePage() {
  const { profile, loading, isEditing, isUpdating, form, toggleEdit, updateProfile } = useInstructorProfile();
  const { control, formState: { errors } } = form;

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });

  const { user } = useAuthStore();
  const [materials, setMaterials] = useState<TutorMaterial[]>([]);

  useEffect(() => {
    if (user?.id) {
      getMaterials({ tutorId: user.id }).then(setMaterials).catch(console.error);
    }
  }, [user?.id]);

  const [deletingMaterialId, setDeletingMaterialId] = useState<string | null>(null);

  // Same source the KYC onboarding uses for its category picker.
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  useEffect(() => {
    categoriesService.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleDeleteMaterial = async (m: TutorMaterial) => {
    if (!window.confirm(`Delete "${m.title}" permanently? It will be removed from sale and this cannot be undone. If you only want to stop selling it, use Edit and set it to Hidden instead.`)) return;
    setDeletingMaterialId(m._id);
    try {
      await deleteMaterial(m._id);
      setMaterials((prev) => prev.filter((x) => x._id !== m._id));
    } catch (error) {
      console.error("Failed to delete material:", error);
      alert("Failed to delete material. Please try again.");
    } finally {
      setDeletingMaterialId(null);
    }
  };

  if (loading) return (
    <InstructorLayout>
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    </InstructorLayout>
  );

  if (!profile) return (
    <InstructorLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive font-medium">Profile not found.</p>
      </div>
    </InstructorLayout>
  );

  const { firstName, lastName, email, createdAt, kycData } = profile;
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();

  const availability: { day: string; startTime: string; endTime: string }[] =
    kycData?.availability ?? [];

  const stats = [
    { icon: Users, label: "Students", value: kycData?.studentCount ?? "—" },
    { icon: BookOpen, label: "Courses", value: kycData?.lessonCount ?? "—" },
    { icon: Star, label: "Rating", value: kycData?.rating ? `${kycData.rating}/5` : "—" },
    // Onboarding writes pricePerHour; seeded/older records use hourlyRate.
    { icon: DollarSign, label: "Rate/hr", value: (kycData?.pricePerHour ?? kycData?.hourlyRate) ? `$${kycData.pricePerHour ?? kycData.hourlyRate}` : "—" },
  ];

  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-blue-50 dark:from-rose-950/20 dark:via-background dark:to-blue-950/20 border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,70,103,0.07),_transparent_60%)]" />
        <div className="container mx-auto px-6 py-8 text-center relative">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">My Profile</h1>
          <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link href="/instructor/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-primary" />
            <span className="text-foreground font-medium">My Profile</span>
          </nav>
        </div>
      </section>

      <InstructorLayout>
        <div className="space-y-6 pb-16">

          {/* ── Profile Banner ── */}
          <div
            className="relative rounded-3xl overflow-hidden p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6"
            style={{ background: "linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 60%, oklch(0.7 0.15 210) 100%)" }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />

            {/* Avatar */}
            <div className="relative h-28 w-28 rounded-2xl overflow-hidden border-4 border-white/20 shrink-0 shadow-xl">
              {kycData?.photoUrl || kycData?.avatar ? (
                <Image src={kycData.photoUrl || kycData.avatar} alt={fullName} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10 text-white font-bold text-3xl">
                  {initials}
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-green-400 rounded-full h-5 w-5 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 z-10">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{fullName}</h2>
                <span className="px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold border border-white/20">
                  Instructor
                </span>
              </div>
              {kycData?.title && (
                <p className="text-white/70 text-sm mt-1">{kycData.title}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-white/70 text-sm">
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{email}</span>
                {kycData?.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{kycData.phone}</span>}
                {kycData?.address && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{kycData.address}</span>}
              </div>
              {/* Stats row */}
              <div className="flex flex-wrap gap-3 mt-4">
                {stats.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
                    <Icon className="h-3.5 w-3.5 text-white/70" />
                    <span className="text-white text-xs font-bold">{value}</span>
                    <span className="text-white/50 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit / Save actions */}
            <div className="flex gap-2 shrink-0 z-10">
              {isEditing ? (
                <>
                  <Btn variant="ghost" className="text-white hover:bg-white/10 border border-white/20" onClick={toggleEdit}>
                    <X className="h-4 w-4" /> Cancel
                  </Btn>
                  <Btn onClick={updateProfile} disabled={isUpdating} className="bg-white text-primary hover:bg-white/90 min-w-[110px]">
                    {isUpdating ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4" />Save</>}
                  </Btn>
                </>
              ) : (
                <Btn onClick={toggleEdit} className="bg-white text-primary hover:bg-white/90">
                  <PenSquare className="h-4 w-4" /> Edit Profile
                </Btn>
              )}
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            // Enter in a text input must never trigger implicit submission —
            // saving is the explicit Save button's job. Textareas keep Enter
            // for newlines; tag inputs handle Enter themselves first.
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
                e.preventDefault();
              }
            }}
            className="space-y-6"
          >

            {/* ── Personal Information ── */}
            <SectionCard icon={UserIcon} title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isEditing ? (
                  <>
                    <InputField label="First Name" name="firstName" control={control} />
                    <InputField label="Last Name" name="lastName" control={control} />
                    <InputField label="Phone" name="phone" control={control} />
                    <SelectField label="Gender" name="gender" control={control}
                      options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }, { label: "Other", value: "other" }]} />
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 block mb-1">Date of Birth</label>
                      <Controller name="dob" control={control} render={({ field }) => (
                        <input {...field} type="date"
                          className="w-full h-10 px-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm" />
                      )} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 block mb-1">Email (read-only)</label>
                      <p className="text-sm font-semibold mt-1">{email}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Field label="First Name" value={firstName} />
                    <Field label="Last Name" value={lastName} />
                    <Field label="Email" value={email} />
                    <Field label="Phone" value={kycData?.phone} />
                    <Field label="Gender" value={kycData?.gender} />
                    <Field label="Date of Birth" value={kycData?.dob ? formatDateOnly(kycData.dob) : undefined} />
                    <Field label="Age" value={formatAge(kycData?.dob) || undefined} />
                    <Field label="Registration Date" value={createdAt ? new Date(createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : undefined} />
                    <Field label="Country" value={kycData?.country} />
                    <Field label="Timezone" value={kycData?.timezone} />
                  </>
                )}
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5 mb-2">
                  <BookOpen className="h-3.5 w-3.5" /> Professional Bio
                </label>
                {isEditing ? (
                  <Controller name="bio" control={control} render={({ field }) => (
                    <textarea {...field} rows={4} placeholder="Describe your expertise…"
                      className="w-full p-4 rounded-2xl bg-muted/40 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm" />
                  )} />
                ) : (
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                    <p className="text-sm text-foreground/80 leading-relaxed">{kycData?.bio || "No bio added yet."}</p>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* ── Expertise & Languages ── */}
            <SectionCard icon={Award} title="Expertise & Languages">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TagInputField label="Specialties" name="specialties" control={control}
                    placeholder="e.g. Algebra — press Enter to add" />
                  <div className="space-y-4">
                    <InputField label="Native Language" name="nativeLanguage" control={control} placeholder="English" />
                    <TagInputField label="Other Languages" name="spokenLanguages" control={control}
                      placeholder="e.g. Spanish — press Enter to add" />
                  </div>
                  <SelectField label="Category" name="category" control={control}
                    options={categories.map((c) => ({ value: c.title, label: c.title }))} />
                  <SelectField label="Experience Level" name="level" control={control}
                    options={EXPERIENCE_LEVELS.map((l) => ({ value: l, label: l }))} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Specialties</p>
                    {Array.isArray(kycData?.specialties) && kycData.specialties.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {kycData.specialties.map((s: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">{s}</span>
                        ))}
                      </div>
                    ) : <p className="text-sm text-muted-foreground italic">None listed.</p>}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Languages</p>
                    {((Array.isArray(kycData?.spokenLanguages) && kycData.spokenLanguages.length > 0) || kycData?.nativeLanguage) ? (
                      <div className="flex flex-wrap gap-2">
                        {kycData?.nativeLanguage && (
                          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold border border-accent/30">
                            {kycData.nativeLanguage} (Native)
                          </span>
                        )}
                        {kycData?.spokenLanguages?.map((l: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold border border-border/50">{l}</span>
                        ))}
                      </div>
                    ) : <p className="text-sm text-muted-foreground italic">No languages listed.</p>}
                  </div>
                  <Field label="Category" value={kycData?.category} />
                  {/* `experience` is the work-history array rendered further
                      down; the level is its own field. Reading `experience`
                      here printed "[object Object]" once any history existed. */}
                  <Field label="Experience Level" value={kycData?.level} />
                </div>
              )}
            </SectionCard>

            {/* ── Education ── */}
            <SectionCard
              icon={GraduationCap}
              title="Education"
              action={isEditing && (
                <Btn variant="ghost" size="sm" className="text-primary hover:bg-primary/10"
                  onClick={() => appendEdu({ degree: "", institution: "", period: "" })}>
                  <Plus className="h-4 w-4" /> Add
                </Btn>
              )}
            >
              {isEditing ? (
                <div className="space-y-4">
                  {eduFields.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No education added yet.</p>
                  )}
                  {eduFields.map((field, i) => (
                    <div key={field.id} className="p-4 rounded-2xl border border-border/50 bg-muted/20 space-y-4 relative">
                      <button type="button" onClick={() => removeEdu(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Degree" name={`education.${i}.degree`} control={control} />
                        <InputField label="Institution" name={`education.${i}.institution`} control={control} />
                        <InputField label="Period" name={`education.${i}.period`} control={control} placeholder="2010–2014" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : Array.isArray(kycData?.education) && kycData.education.length > 0 ? (
                <div className="space-y-4">
                  {kycData.education.map((edu: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center mt-1">
                        <div className="h-3 w-3 rounded-full bg-primary shrink-0" />
                        {idx !== kycData.education.length - 1 && <div className="w-0.5 flex-1 bg-border/50 my-1 min-h-[20px]" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{edu.degree}</h4>
                        <p className="text-xs text-muted-foreground">{edu.institution} • {edu.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground italic">No education details added.</p>}
            </SectionCard>

            {/* ── Experience ── */}
            <SectionCard
              icon={Briefcase}
              title="Experience"
              action={isEditing && (
                <Btn variant="ghost" size="sm" className="text-primary hover:bg-primary/10"
                  onClick={() => appendExp({ role: "", company: "", period: "" })}>
                  <Plus className="h-4 w-4" /> Add
                </Btn>
              )}
            >
              {isEditing ? (
                <div className="space-y-4">
                  {expFields.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No experience added yet.</p>
                  )}
                  {expFields.map((field, i) => (
                    <div key={field.id} className="p-4 rounded-2xl border border-border/50 bg-muted/20 space-y-4 relative">
                      <button type="button" onClick={() => removeExp(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Role" name={`experience.${i}.role`} control={control} />
                        <InputField label="Company" name={`experience.${i}.company`} control={control} />
                        <InputField label="Period" name={`experience.${i}.period`} control={control} placeholder="2018–Present" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : Array.isArray(kycData?.experience) && kycData.experience.length > 0 ? (
                <div className="space-y-4">
                  {kycData.experience.map((exp: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{exp.role}</h4>
                        <p className="text-xs text-muted-foreground">{exp.company} • {exp.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground italic">No experience details added.</p>}
            </SectionCard>

            {/* ── Availability Calendar ── */}
            <SectionCard icon={Calendar} title="Availability Schedule">
              {isEditing ? (
                <>
                  <p className="text-xs text-muted-foreground mb-4">
                    Tick the days you teach and set your hours. The schedule repeats weekly and is shown to students in their own timezone.
                  </p>
                  <AvailabilityEditor control={control} />
                </>
              ) : availability.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No availability schedule set yet.</p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground mb-4">
                    Days highlighted in blue indicate available teaching slots. Availability repeats weekly.
                  </p>
                  <AvailabilityCalendar availability={availability} />
                </>
              )}
            </SectionCard>

            {/* ── Certifications ── */}
            <SectionCard icon={Award} title="Certifications">
              {isEditing ? (
                <CertificationsEditor control={control} />
              ) : Array.isArray(kycData?.certifications) && kycData.certifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {kycData.certifications.map((c: string, i: number) => (
                    <a key={i} href={c} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:underline">
                      <Award className="h-3.5 w-3.5 shrink-0" />
                      <span className="max-w-[220px] truncate" title={certDisplayName(c, i)}>{certDisplayName(c, i)}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No certifications uploaded yet.</p>
              )}
            </SectionCard>

            {/* ── Social Links ── */}
            {kycData?.social && Object.values(kycData.social).some(Boolean) && (
              <SectionCard icon={Globe} title="Social Links">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(kycData.social).filter(([, v]) => v).map(([platform, url]) => (
                    <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-sm font-semibold capitalize">
                      <Globe className="h-4 w-4 text-primary" /> {platform}
                    </a>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* ── Materials for Sale ── */}
            <SectionCard
              icon={Library}
              title="Materials & Notes"
              action={
                <Link href="/instructor/materials">
                  <Btn variant="outline" size="sm" className="text-primary hover:bg-primary/10">
                    Manage Materials
                  </Btn>
                </Link>
              }
            >
              {materials.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">You haven't listed any materials yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {materials?.map((m) => (
                    <div key={m._id} className="group rounded-xl border border-border/50 bg-muted/20 p-3 flex flex-col gap-2">
                      <div className="relative aspect-[4/3] bg-background rounded-lg overflow-hidden border border-border/50">
                        {m.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.coverImageUrl} alt={m.title} className="w-full h-full object-cover" />
                        ) : (
                          <FileTypePlaceholder fileUrl={m.fileUrl} className="w-full h-full" />
                        )}
                        {/* Hover actions — type="button" so they never submit the enclosing profile form */}
                        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <Link
                            href={`/instructor/materials?edit=${m._id}`}
                            title="Edit material"
                            className="p-1.5 rounded-lg bg-background/90 backdrop-blur border border-border/50 text-foreground hover:text-primary hover:border-primary/50 shadow-sm"
                          >
                            <PenSquare className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            title="Delete material"
                            onClick={() => handleDeleteMaterial(m)}
                            disabled={deletingMaterialId === m._id}
                            className="p-1.5 rounded-lg bg-background/90 backdrop-blur border border-border/50 text-foreground hover:text-destructive hover:border-destructive/50 shadow-sm disabled:opacity-50"
                          >
                            {deletingMaterialId === m._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-foreground line-clamp-1" title={m.title}>{m.title}</h4>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                        <span className="text-primary font-bold text-xs">${(m.price / 100).toFixed(2)}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.isActive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                          {m.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

          </form>
        </div>
      </InstructorLayout>
    </>
  );
}
