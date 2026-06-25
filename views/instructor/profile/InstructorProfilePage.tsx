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

/* ─── Tiny shared primitives ─────────────────────────────── */

const Btn = ({ children, variant = "primary", size = "md", className = "", ...p }: any) => (
  <button
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
    { icon: DollarSign, label: "Rate/hr", value: kycData?.pricePerHour ? `$${kycData.pricePerHour}` : "—" },
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

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

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
                    <Field label="Date of Birth" value={kycData?.dob ? new Date(kycData.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : undefined} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Specialties</p>
                  {kycData?.specialties?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {kycData.specialties.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">{s}</span>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground italic">None listed.</p>}
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Languages</p>
                  {(kycData?.spokenLanguages?.length > 0 || kycData?.nativeLanguage) ? (
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
                <Field label="Experience Level" value={kycData?.experience} />
              </div>
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
                      <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
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
              ) : kycData?.education?.length > 0 ? (
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
                      <button onClick={() => removeExp(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
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
              ) : kycData?.experience?.length > 0 ? (
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
              {availability.length === 0 ? (
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
            {kycData?.certifications?.length > 0 && (
              <SectionCard icon={Award} title="Certifications">
                <div className="flex flex-wrap gap-2">
                  {kycData.certifications.map((c: string, i: number) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                      <Award className="h-3.5 w-3.5" /> {c}
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

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

          </form>
        </div>
      </InstructorLayout>
    </>
  );
}
