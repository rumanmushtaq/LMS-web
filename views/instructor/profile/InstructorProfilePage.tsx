"use client";

import {
  Loader2,
  PenSquare,
  ChevronRight,
  Home,
  CheckCircle2,
  Mail,
  Phone,
  User as UserIcon,
  BookOpen,
  Save,
  X,
  Plus,
  GraduationCap,
  Briefcase,
  Calendar,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Controller, useFieldArray } from "react-hook-form";
import InstructorLayout from "../InstructorLayout";
import { cn } from "@/lib/utils";
import { useInstructorProfile } from "@/hooks/useInstructorProfile";

export default function InstructorProfilePage() {
  const {
    profile,
    loading,
    isEditing,
    isUpdating,
    form,
    toggleEdit,
    updateProfile,
  } = useInstructorProfile();

  const {
    control,
    register,
    formState: { errors },
  } = form;

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
        </div>
      </InstructorLayout>
    );
  }

  if (!profile) {
    return (
      <InstructorLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-destructive font-medium">Profile not found.</p>
        </div>
      </InstructorLayout>
    );
  }

  const { firstName, lastName, email, createdAt, kycData } = profile;
  const fullName = `${firstName} ${lastName}`;

  return (
    <>
      <InstructorLayout>
        <div className="space-y-6 pb-12">
          {/* Banner/Header */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 border border-border/60 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
            {/* Abstract circles decoration inside banner */}
            <div className="absolute -top-24 -right-12 h-[400px] w-[400px] rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-32 right-32 h-[350px] w-[350px] rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute top-20 right-64 h-48 w-48 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden bg-background border-4 border-primary-foreground/20 shrink-0 z-10">
              {kycData?.avatar ? (
                <Image
                  src={kycData.avatar}
                  alt={fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-primary font-bold text-4xl">
                  {fullName.charAt(0)}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-6 w-6 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left z-10">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                  {fullName}
                </h2>
                <button
                  onClick={toggleEdit}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isEditing ? (
                    <X className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <PenSquare className="h-5 w-5 text-primary-foreground" />
                  )}
                </button>
              </div>
              <p className="text-primary-foreground/80 font-medium text-lg mt-1">
                Instructor
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-primary-foreground/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {email}
                </span>
                {kycData?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {kycData.phone}
                  </span>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 z-10">
                <Button
                  onClick={toggleEdit}
                  variant="ghost"
                  className="text-primary-foreground hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={updateProfile}
                  disabled={isUpdating}
                  className="bg-white text-primary hover:bg-white/90 gap-2 min-w-[120px]"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Personal Information Card */}
            <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-xl shadow-foreground/5 overflow-hidden">
              <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                {!isEditing && (
                  <Button
                    onClick={toggleEdit}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                  >
                    <PenSquare className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <InputField
                    label="First Name"
                    name="firstName"
                    control={control}
                    isEditing={isEditing}
                    defaultValue={firstName}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    control={control}
                    isEditing={isEditing}
                    defaultValue={lastName}
                  />
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                      Registration Date
                    </label>
                    <p className="text-sm font-semibold mt-1">
                      {createdAt
                        ? new Date(createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                      User Name
                    </label>
                    <p className="text-sm font-semibold mt-1">{email.split("@")[0]}</p>
                  </div>
                  <InputField
                    label="Phone Number"
                    name="phone"
                    control={control}
                    isEditing={isEditing}
                    defaultValue={kycData?.phone || "-"}
                  />
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                      Email Address
                    </label>
                    <p className="text-sm font-semibold mt-1">{email}</p>
                  </div>

                  <SelectField
                    label="Gender"
                    name="gender"
                    control={control}
                    isEditing={isEditing}
                    defaultValue={kycData?.gender || "-"}
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                  />
                  <InputField
                    label="DOB"
                    name="dob"
                    control={control}
                    isEditing={isEditing}
                    defaultValue={kycData?.dob ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(kycData.dob)) : "-"}
                  />
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                      Age
                    </label>
                    <p className="text-sm font-semibold mt-1">
                      {kycData?.dob
                        ? String(new Date().getFullYear() - new Date(kycData.dob).getFullYear())
                        : "-"}
                    </p>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2 mb-2">
                      <BookOpen className="h-3.5 w-3.5" />
                      Professional Bio
                    </label>
                    {isEditing ? (
                      <Controller
                        name="bio"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={4}
                            className="w-full p-4 rounded-2xl bg-muted/40 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
                            placeholder="Describe your expertise..."
                          />
                        )}
                      />
                    ) : (
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                          {kycData?.bio || "No professional bio provided yet."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-xl shadow-foreground/5 overflow-hidden">
              <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </h3>
                {isEditing && (
                  <Button
                    onClick={() =>
                      appendEducation({
                        degree: "",
                        institution: "",
                        period: "",
                      })
                    }
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                    Add Education
                  </Button>
                )}
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {isEditing ? (
                    educationFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 rounded-2xl border border-border/50 bg-muted/20 space-y-4 relative"
                      >
                        <button
                          onClick={() => removeEducation(index)}
                          className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Degree"
                            name={`education.${index}.degree` as any}
                            control={control}
                            isEditing={true}
                          />
                          <InputField
                            label="Institution"
                            name={`education.${index}.institution` as any}
                            control={control}
                            isEditing={true}
                          />
                          <InputField
                            label="Period"
                            name={`education.${index}.period` as any}
                            control={control}
                            isEditing={true}
                          />
                        </div>
                      </div>
                    ))
                  ) : kycData?.education?.length > 0 ? (
                    <div className="space-y-4">
                      {kycData.education.map((edu: any, idx: number) => (
                        <div key={idx} className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                            {idx !== kycData.education.length - 1 && (
                              <div className="w-0.5 flex-1 bg-border/50 my-1" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold">{edu.degree}</h4>
                            <p className="text-xs text-muted-foreground">
                              {edu.institution} • {edu.period}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No education details added.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-xl shadow-foreground/5 overflow-hidden">
              <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Experience
                </h3>
                {isEditing && (
                  <Button
                    onClick={() =>
                      appendExperience({ role: "", company: "", period: "" })
                    }
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </Button>
                )}
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {isEditing ? (
                    experienceFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 rounded-2xl border border-border/50 bg-muted/20 space-y-4 relative"
                      >
                        <button
                          onClick={() => removeExperience(index)}
                          className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Role"
                            name={`experience.${index}.role` as any}
                            control={control}
                            isEditing={true}
                          />
                          <InputField
                            label="Company"
                            name={`experience.${index}.company` as any}
                            control={control}
                            isEditing={true}
                          />
                          <InputField
                            label="Period"
                            name={`experience.${index}.period` as any}
                            control={control}
                            isEditing={true}
                          />
                        </div>
                      </div>
                    ))
                  ) : kycData?.experience?.length > 0 ? (
                    <div className="space-y-4">
                      {kycData.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 shrink-0">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold">{exp.role}</h4>
                            <p className="text-xs text-muted-foreground">
                              {exp.company} • {exp.period}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No experience details added.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </InstructorLayout>
    </>
  );
}

const InputField = ({ label, name, control, isEditing, defaultValue }: any) => (
  <div>
    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
      {label}
    </label>
    {isEditing ? (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full h-10 px-3 mt-1 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        )}
      />
    ) : (
      <p className="text-sm font-semibold mt-1">{defaultValue || "-"}</p>
    )}
  </div>
);

const SelectField = ({
  label,
  name,
  control,
  isEditing,
  defaultValue,
  options,
}: any) => (
  <div>
    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
      {label}
    </label>
    {isEditing ? (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className="w-full h-10 px-3 mt-1 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none"
          >
            <option value="">Select...</option>
            {options.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />
    ) : (
      <p className="text-sm font-semibold mt-1 capitalize">
        {defaultValue || "-"}
      </p>
    )}
  </div>
);

const Button = ({ children, variant, size, className, ...props }: any) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95",
      variant === "ghost"
        ? "hover:bg-accent hover:text-accent-foreground"
        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
      size === "sm" ? "h-9 px-3" : "h-10 px-4 py-2",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
