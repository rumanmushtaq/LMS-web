"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getName, getNames } from "country-list";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileUp,
  CheckCircle2,
  User,
  FileText,
  Camera,
  ShieldCheck,
  Fingerprint,
  ArrowRight,
  ArrowLeft,
  Info,
  BadgeCheck,
  Loader2,
  Globe,
  Clock,
  BookOpen,
  Award,
  Video,
  DollarSign,
  GraduationCap,
  Lock,
  Calendar,
  CreditCard,
  MoonIcon,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import apiEndpoints from "@/utils/apiConfig";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const KYCPage = () => {
  const [step, setStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Comprehensive Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: "",
    lastName: "",
    country: "United States",
    timezone: "UTC-5 (EST)",
    nativeLanguage: "English",
    spokenLanguages: ["English"],
    additionalLanguages: [],

    // Step 2: Professional
    category: "Academic",
    experience: "1-3 Years",
    education: "",
    certifications: [] as string[],

    // Step 3: Media
    aboutMe: "",
    photoUrl: "",
    introVideoUrl: "",

    // Step 4: Pricing
    lessonTimezone: "UTC-5 (EST)",
    pricePerHour: 25,
    availability: [] as { day: string; startTime: string; endTime: string }[],

    // Step 5: Identity
    idType: "Passport",
    idNumber: "",
    idFrontUrl: "",
    idBackUrl: "",
    selfieUrl: "",

    // Step 6: Payment Details
    bankAccount: {
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      accountHolderName: "",
    },
  });

  const [isUploading, setIsUploading] = useState<string | null>(null);

  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    setIsClient(true);
    if (!token) return;

    const fetchUserAndData = async () => {
      try {
        const res = await axiosInstance.get(apiEndpoints.Auth.ME);
        const userData = res.data.data || res.data;
        setUser(userData);

        const id = userData._id || userData.id;
        const storageKey = `kyc_form_data_${id}`;
        const stepKey = `kyc_step_${id}`;

        const savedStep = localStorage.getItem(stepKey);
        if (savedStep) {
          setStep(parseInt(savedStep));
        }
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          setFormData((prev) => ({ ...prev, ...JSON.parse(savedData) }));
        }

        // Pre-fill names if not already set by user-specific localStorage
        // OR if the saved values are empty/placeholder
        if (!savedData || !JSON.parse(savedData).firstName) {
          setFormData((prev) => ({
            ...prev,
            firstName: userData.firstName,
            lastName: userData.lastName,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        router.push("/login?redirect=/onboarding/kyc");
      }
    };
    fetchUserAndData();
  }, [token, router]);

  useEffect(() => {
    if (isClient && authUser?.id) {
      localStorage.setItem(`kyc_step_${authUser.id}`, step.toString());
    }
  }, [step, isClient, authUser?.id]);

  useEffect(() => {
    if (isClient && authUser?.id) {
      localStorage.setItem(
        `kyc_form_data_${authUser.id}`,
        JSON.stringify(formData),
      );
    }
  }, [formData, isClient, authUser?.id]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setIsUploading(type);

    try {
      const data = new FormData();
      data.append("file", file);

      const folder =
        type === "certification"
          ? "tutor-certs"
          : type === "selfie"
            ? "kyc-selfies"
            : type === "photo"
              ? "tutor-photos"
              : type === "video"
                ? "tutor-videos"
                : "kyc-documents";

      data.append("folder", folder);

      const uploadRes = await axiosInstance.post(
        apiEndpoints.Onboarding.UPLOAD,
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const url = uploadRes.data.data.url;

      if (type === "front") setFormData((p) => ({ ...p, idFrontUrl: url }));
      if (type === "back") setFormData((p) => ({ ...p, idBackUrl: url }));
      if (type === "selfie") setFormData((p) => ({ ...p, selfieUrl: url }));
      if (type === "photo") setFormData((p) => ({ ...p, photoUrl: url }));
      if (type === "video") setFormData((p) => ({ ...p, introVideoUrl: url }));
      if (type === "certification")
        setFormData((p) => ({
          ...p,
          certifications: [...p.certifications, url],
        }));

      toast.success("File uploaded securely!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        kycData: { ...formData },
        kycDocuments: [
          formData.idFrontUrl,
          formData.idBackUrl,
          formData.selfieUrl,
          ...formData.certifications,
          formData.photoUrl,
          formData.introVideoUrl,
        ].filter((url) => !!url),
      };

      await axiosInstance.post(apiEndpoints.Onboarding.KYC, payload);

      toast.success("Profile submitted for review!");
      localStorage.removeItem("kyc_step");
      localStorage.removeItem("kyc_form_data");
      useAuthStore.getState().logout();
      router.push("/login?message=pending_verification");
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("Final submission failed. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  const stepCardRef = useRef<HTMLDivElement>(null);

  const focusFirstInput = useCallback(() => {
    setTimeout(() => {
      const card = stepCardRef.current;
      if (!card) return;
      const first = card.querySelector<HTMLElement>(
        "input:not([type=file]):not([type=hidden]), select, textarea"
      );
      first?.focus();
    }, 200);
  }, []);

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => s + 1);
    focusFirstInput();
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => s - 1);
    focusFirstInput();
  };

  const steps = [
    { title: "Personal", icon: User },
    { title: "Professional", icon: Award },
    { title: "Student View", icon: BookOpen },
    { title: "Availability", icon: Clock },
    { title: "Identity", icon: Fingerprint },
    { title: "Account", icon: CreditCard },
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">
          Initializing secure kyc environment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="relative max-w-[1100px] mx-auto px-6 pt-12">
        {/* Progress Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> Premium Tutor Onboarding
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-8">
            Build your{" "}
            <span className="text-primary italic">Professional Profile.</span>
          </h1>

          <div className="flex items-center justify-between max-w-4xl mx-auto px-4 relative">
            <div className="absolute h-1 bg-muted w-full top-1/2 -translate-y-1/2 z-0 rounded-full" />
            {steps.map((s, idx) => {
              const num = idx + 1;
              const active = step >= num;
              const current = step === num;
              return (
                <div
                  key={idx}
                  className="relative z-10 flex flex-col items-center gap-3"
                >
                  <motion.div
                    animate={{
                      scale: current ? 1.15 : 1,
                      backgroundColor: active
                        ? "var(--primary)"
                        : "var(--card)",
                      color: active
                        ? "var(--primary-foreground)"
                        : "var(--muted-foreground)",
                      borderColor: current
                        ? "var(--primary)"
                        : active
                          ? "var(--primary)"
                          : "var(--border)",
                    }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-all cursor-pointer"
                    onClick={() => active && setStep(num)}
                  >
                    <s.icon className="w-5 h-5" />
                  </motion.div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest hidden md:block ${active ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div ref={stepCardRef} className="bg-card rounded-[44px] border border-border/50 shadow-2xl shadow-black/5 p-8 lg:p-14 overflow-hidden">
          <style>{`
            .kyc-select option:checked,
            .kyc-select option:hover {
              background-color: #FFD6E0 !important;
              color: #9D174D !important;
            }
          `}</style>
          <AnimatePresence mode="wait">
            {/* STEP 1: PERSONAL */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
                className="space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Personal Foundation</h2>
                    <p className="text-sm text-muted-foreground">
                      This info will be used for your public tutor profile
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      First Name
                    </Label>
                    <Input
                      className="h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Last Name
                    </Label>
                    <Input
                      className="h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Country
                    </Label>
                    <select
                      className="kyc-select w-full h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#FFD6E0]/50 focus:bg-[#FFF5F8] transition-colors rounded-2xl font-bold text-sm appearance-none cursor-pointer hover:border-[#F48FB1]"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                    >
                      <option value="United States">🇺🇸 United States</option>
                      <option disabled>──────────────────</option>
                      {getNames()
                        .filter((c) => c !== "United States")
                        .sort()
                        .map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Default Timezone
                    </Label>
                    <select
                      className="kyc-select w-full h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#FFD6E0]/50 focus:bg-[#FFF5F8] transition-colors rounded-2xl font-bold text-sm appearance-none cursor-pointer hover:border-[#F48FB1]"
                      value={formData.timezone}
                      onChange={(e) =>
                        setFormData({ ...formData, timezone: e.target.value })
                      }
                    >
                      <option>UTC-12 (IDLW)</option>
                      <option>UTC-11 (SST)</option>
                      <option>UTC-10 (HST)</option>
                      <option>UTC-9 (AKST)</option>
                      <option>UTC-8 (PST)</option>
                      <option>UTC-7 (MST)</option>
                      <option>UTC-6 (CST)</option>
                      <option>UTC-5 (EST)</option>
                      <option>UTC-4 (AST)</option>
                      <option>UTC-3 (ART)</option>
                      <option>UTC-2 (GST)</option>
                      <option>UTC-1 (AZOT)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (CET)</option>
                      <option>UTC+2 (EET)</option>
                      <option>UTC+3 (MSK)</option>
                      <option>UTC+4 (GST)</option>
                      <option>UTC+5 (PKT)</option>
                      <option>UTC+5:30 (IST)</option>
                      <option>UTC+6 (BST)</option>
                      <option>UTC+7 (ICT)</option>
                      <option>UTC+8 (SGT)</option>
                      <option>UTC+9 (JST)</option>
                      <option>UTC+10 (AEST)</option>
                      <option>UTC+11 (AEDT)</option>
                      <option>UTC+12 (NZST)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Native Language
                    </Label>
                    <Input
                      className="h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold"
                      value={formData.nativeLanguage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nativeLanguage: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Other Spoken Languages
                    </Label>
                    <Input
                      className="h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold"
                      placeholder="e.g. Spanish, French (comma separated)"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          spokenLanguages: e.target.value.split(","),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={nextStep}
                    disabled={!formData.firstName || !formData.lastName}
                    className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all"
                  >
                    Next: Professional Details{" "}
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PROFESSIONAL */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
                className="space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">
                      Expertise & Certifications
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Stand out with your professional background
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Academic Category
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        "Academic",
                        "Music",
                        "Coding",
                        "Design",
                        "Business",
                        "Language",
                      ].map((cat) => (
                        <button
                          key={cat}
                          onClick={() =>
                            setFormData({ ...formData, category: cat })
                          }
                          className={`py-4 rounded-2xl border-2 font-bold text-xs transition-all ${formData.category === cat ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-border bg-card hover:border-primary/30 text-foreground"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                        Years of Experience
                      </Label>
                      <select
                        className="kyc-select w-full h-14 px-5 bg-card border-2 border-border text-foreground rounded-2xl font-bold text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#FFD6E0]/50 focus:bg-[#FFF5F8] transition-colors cursor-pointer hover:border-[#F48FB1]"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                      >
                        <option>Less than 1 year</option>
                        <option>1-3 Years</option>
                        <option>3-5 Years</option>
                        <option>5-10 Years</option>
                        <option>10+ Years</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                        Education Background
                      </Label>
                      <Input
                        className="h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold"
                        placeholder="e.g. Master's in Applied Mathematics"
                        value={formData.education}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            education: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Certifications (Upload files)
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {formData.certifications.map((url, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-3xl bg-green-50 border border-green-200 flex items-center justify-center relative overflow-hidden group"
                        >
                          <CheckCircle2 className="text-green-500 w-8 h-8" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-[9px] font-black uppercase">
                              Click to view
                            </span>
                          </div>
                        </div>
                      ))}
                      <label className="aspect-square rounded-3xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-all bg-muted/10">
                        {isUploading === "certification" ? (
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        ) : (
                          <>
                            <FileUp className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-[9px] font-black text-muted-foreground uppercase">
                              Upload Cert
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "certification")}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-16 rounded-2xl border-2 border-border bg-card text-foreground font-black uppercase tracking-widest hover:bg-muted transition-all"
                  >
                    <ArrowLeft className="mr-3 w-5 h-5" /> Back
                  </Button>

                  <Button
                    onClick={nextStep}
                    disabled={!formData.education}
                    className="flex-[2] h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    Student Preview <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: MEDIA & BIO */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
                className="space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Student-Facing Info</h2>
                    <p className="text-sm text-muted-foreground">
                      Introduce yourself to your future students
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      About Me / Personal Bio
                    </Label>
                    <textarea
                      className="w-full h-40 p-6 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-[32px] font-bold text-sm resize-none"
                      placeholder="Share your passion, teaching style, and goals..."
                      value={formData.aboutMe}
                      onChange={(e) =>
                        setFormData({ ...formData, aboutMe: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                        Profile Photo
                      </Label>
                      <label className="relative aspect-square max-w-[200px] rounded-[60px] border-4 border-dashed border-muted hover:border-primary flex items-center justify-center cursor-pointer overflow-hidden transition-all">
                        {formData.photoUrl ? (
                          <img
                            src={formData.photoUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : isUploading === "photo" ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        )}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "photo")}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                        Intro Video (1-2 mins)
                      </Label>
                      <label className="relative aspect-video rounded-3xl border-2 border-dashed border-muted hover:border-primary flex flex-col items-center justify-center cursor-pointer bg-muted/10 transition-all">
                        {formData.introVideoUrl ? (
                          <BadgeCheck className="w-12 h-12 text-green-500" />
                        ) : isUploading === "video" ? (
                          <Loader2 className="animate-spin text-primary" />
                        ) : (
                          <>
                            <Video className="w-10 h-10 text-muted-foreground mb-3" />
                            <span className="text-[9px] font-black uppercase text-muted-foreground">
                              Upload Video
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "video")}
                          accept="video/*"
                        />
                      </label>
                      {formData.introVideoUrl && (
                        <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest text-center">
                          Video Uploaded Successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-16 rounded-2xl border-2 border-border bg-card text-foreground font-black uppercase tracking-widest hover:bg-muted transition-all"
                  >
                    <ArrowLeft className="mr-3 w-5 h-5" /> Back
                  </Button>

                  <Button
                    onClick={nextStep}
                    disabled={!formData.aboutMe || !formData.photoUrl}
                    className="flex-[2] h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    Availability & Price <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: AVAILABILITY & PRICE */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
                className="space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">
                      Availability & Pricing
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Set your lesson rates and active timezones
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] md:gap-12 gap-8 pt-4 items-start">
                  <div className="space-y-8 flex flex-col min-w-0 shrink-0">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                        Your Timezone
                      </Label>
                      <div className="flex items-center gap-4 h-14 px-5 rounded-2xl bg-transparent border-2 border-primary/50">
                        <Clock className="text-primary w-5 h-5" />
                        <span className="font-bold text-sm text-foreground">
                          {formData.timezone}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                        Lesson Timezone (Primary Target)
                      </Label>
                      <select
                        className="kyc-select w-full h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#FFD6E0]/50 focus:bg-[#FFF5F8] transition-colors rounded-2xl font-bold text-sm cursor-pointer hover:border-[#F48FB1]"
                        value={formData.lessonTimezone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lessonTimezone: e.target.value,
                          })
                        }
                      >
                        <option>UTC-12 (IDLW)</option>
                        <option>UTC-11 (SST)</option>
                        <option>UTC-10 (HST)</option>
                        <option>UTC-9 (AKST)</option>
                        <option>UTC-8 (PST)</option>
                        <option>UTC-7 (MST)</option>
                        <option>UTC-6 (CST)</option>
                        <option>UTC-5 (EST)</option>
                        <option>UTC-4 (AST)</option>
                        <option>UTC-3 (ART)</option>
                        <option>UTC-2 (GST)</option>
                        <option>UTC-1 (AZOT)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (CET)</option>
                        <option>UTC+2 (EET)</option>
                        <option>UTC+3 (MSK)</option>
                        <option>UTC+4 (GST)</option>
                        <option>UTC+5 (PKT)</option>
                        <option>UTC+5:30 (IST)</option>
                        <option>UTC+6 (BST)</option>
                        <option>UTC+7 (ICT)</option>
                        <option>UTC+8 (SGT)</option>
                        <option>UTC+9 (JST)</option>
                        <option>UTC+10 (AEST)</option>
                        <option>UTC+11 (AEDT)</option>
                        <option>UTC+12 (NZST)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-8 min-w-0">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-foreground">
                        Business Hours
                      </Label>

                      <p className="text-xs text-muted-foreground ml-1 mb-4">
                        Control your active tutoring hours for different times
                        of the day
                      </p>

                      <div className="flex flex-col border-2 border-border rounded-3xl bg-card overflow-hidden shadow-sm divide-y divide-border">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => {
                          const availabilityEntry = formData.availability.find(
                            (d) => d.day === day,
                          );
                          const isSelected = !!availabilityEntry;

                          const toggleDay = () => {
                            if (isSelected) {
                              setFormData({
                                ...formData,
                                availability: formData.availability.filter(
                                  (d) => d.day !== day,
                                ),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                availability: [
                                  ...formData.availability,
                                  { day, startTime: "09:00", endTime: "17:30" },
                                ],
                              });
                            }
                          };

                          return (
                            <div
                              key={day}
                              className="flex flex-col lg:flex-row lg:items-center justify-between p-4 px-4 sm:px-6 hover:bg-slate-50 transition-colors gap-4"
                            >
                              <div
                                className="flex items-center justify-between lg:justify-start gap-4 lg:w-40 cursor-pointer"
                                onClick={toggleDay}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out shadow-inner ${isSelected ? "bg-primary" : "bg-muted"}`}
                                  >
                                    <span
                                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isSelected ? "translate-x-5" : "translate-x-1"}`}
                                    />
                                  </div>
                                  <span
                                    className={`text-sm font-bold w-24 ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
                                  >
                                    {day}
                                  </span>
                                </div>
                              </div>

                              {isSelected ? (
                                <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-6 flex-1 lg:justify-end animate-in fade-in zoom-in duration-300 w-full lg:w-auto overflow-hidden">
                                  <div className="flex items-center gap-2 sm:gap-3 bg-[#F9F9F9] px-3 py-2 sm:py-1.5 rounded-xl border border-transparent hover:border-[#EFEFEF] transition-all flex-1 sm:flex-none w-full sm:w-auto min-w-0">
                                    <span className="text-xs font-bold text-muted-foreground shrink-0">
                                      From
                                    </span>
                                    <input
                                      type="time"
                                      value={availabilityEntry.startTime}
                                      onChange={(e) => {
                                        const newAvailability = [
                                          ...formData.availability,
                                        ];
                                        const index = newAvailability.findIndex(
                                          (d) => d.day === day,
                                        );
                                        newAvailability[index].startTime =
                                          e.target.value;
                                        setFormData({
                                          ...formData,
                                          availability: newAvailability,
                                        });
                                      }}
                                      className="bg-transparent text-sm font-bold text-foreground outline-none w-full"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 sm:gap-3 bg-[#F9F9F9] px-3 py-2 sm:py-1.5 rounded-xl border border-transparent hover:border-[#EFEFEF] transition-all flex-1 sm:flex-none w-full sm:w-auto min-w-0">
                                    <span className="text-xs font-bold text-muted-foreground shrink-0">
                                      To
                                    </span>
                                    <input
                                      type="time"
                                      value={availabilityEntry.endTime}
                                      onChange={(e) => {
                                        const newAvailability = [
                                          ...formData.availability,
                                        ];
                                        const index = newAvailability.findIndex(
                                          (d) => d.day === day,
                                        );
                                        newAvailability[index].endTime =
                                          e.target.value;
                                        setFormData({
                                          ...formData,
                                          availability: newAvailability,
                                        });
                                      }}
                                      className="bg-transparent text-sm font-bold text-foreground outline-none w-full"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
                                  <div className="flex items-center gap-3 px-10 py-1.5 opacity-40">
                                    <span className="text-sm font-bold text-muted-foreground">
                                      Closed
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 px-10 py-1.5 opacity-40">
                                    <span className="text-sm font-bold text-muted-foreground">
                                      Closed
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-10">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-16 rounded-2xl border-2 border-border bg-card text-foreground font-black uppercase tracking-widest hover:bg-muted transition-all"
                  >
                    <ArrowLeft className="mr-3 w-5 h-5" /> Back
                  </Button>

                  <Button
                    onClick={nextStep}
                    className="flex-[2] h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    Final: Identity Check{" "}
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: IDENTITY (EXISTING) */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
                className="space-y-10"
              >
                <div className="flex items-center gap-4">
                  <Fingerprint className="w-12 h-12 p-3 rounded-2xl bg-red-500/10 text-red-500" />

                  <div>
                    <h2 className="text-2xl font-black">
                      Identity Verification
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Secure your account with official identification
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                        ID Type
                      </Label>
                      <select
                        className="kyc-select w-full h-14 px-4 bg-card border-2 border-border text-foreground rounded-2xl font-bold text-sm appearance-none outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#FFD6E0]/50 focus:bg-[#FFF5F8] transition-colors cursor-pointer hover:border-[#F48FB1]"
                        value={formData.idType}
                        onChange={(e) =>
                          setFormData({ ...formData, idType: e.target.value })
                        }
                      >
                        <option>Passport</option>
                        <option>Driver License</option>
                        <option>National ID</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                        ID Number
                      </Label>
                      <Input
                        className="h-14 px-4 bg-card border-2 border-border text-foreground rounded-2xl font-bold"
                        value={formData.idNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, idNumber: e.target.value })
                        }
                        placeholder="e.g. A1234567"
                      />
                    </div>

                    <div className="p-6 rounded-3xl bg-muted/20 border border-dashed text-center relative group">
                      <Label className="text-[10px] font-black uppercase tracking-widest block mb-4 text-primary">
                        Selfie Verification
                      </Label>
                      <div className="relative aspect-square max-w-[120px] mx-auto rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center overflow-hidden transition-all bg-card group-hover:border-primary">
                        {formData.selfieUrl ? (
                          <img
                            src={formData.selfieUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : isUploading === "selfie" ? (
                          <Loader2 className="animate-spin text-primary" />
                        ) : (
                          <Camera className="w-6 h-6 text-primary" />
                        )}
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 z-20 cursor-pointer"
                          onChange={(e) => handleFileUpload(e, "selfie")}
                          accept="image/*"
                        />
                      </div>
                      <p className="mt-3 text-[9px] font-bold text-muted-foreground uppercase">
                        Hold your ID next to your face
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      ID Document Photos
                    </Label>
                    {["front", "back"].map((t) => {
                      const url =
                        t === "front"
                          ? formData.idFrontUrl
                          : formData.idBackUrl;
                      const uploading = isUploading === t;
                      return (
                        <div key={t} className="space-y-2">
                          <div
                            className={`relative flex flex-col items-center justify-center aspect-[16/6] rounded-2xl border-2 border-dashed transition-all overflow-hidden ${url ? "border-green-500 bg-green-500/10" : "border-border hover:border-primary/50"}`}
                          >
                            <input
                              type="file"
                              onChange={(e) => handleFileUpload(e, t)}
                              className="absolute inset-0 opacity-0 z-20 cursor-pointer"
                              accept="image/*"
                            />
                            {uploading ? (
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                <span className="text-[8px] font-bold text-primary animate-pulse uppercase">
                                  Uploading...
                                </span>
                              </div>
                            ) : url ? (
                              <div className="flex items-center gap-3 text-green-600 font-black text-[10px] uppercase">
                                <CheckCircle2 className="w-5 h-5" />
                                {t} side uploaded
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 text-muted-foreground font-black text-[10px] uppercase">
                                <FileUp className="w-5 h-5" />
                                Upload {t} side
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-8">
                  <Button
                    onClick={nextStep}
                    disabled={
                      loading ||
                      !formData.selfieUrl ||
                      !formData.idFrontUrl ||
                      !formData.idBackUrl ||
                      !formData.idNumber
                    }
                    className="w-full h-20 rounded-[32px] bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.01] transition-all group disabled:opacity-50 disabled:grayscale"
                  >
                    Next: Payment Details{" "}
                    <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: TEACHER ACCOUNT (PAYMENTS) */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
                className="space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <CreditCard className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Teacher Account</h2>
                    <p className="text-sm text-muted-foreground">
                      Where you want to receive your payments
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Bank Name
                    </Label>
                    <Input
                      className="h-14 px-5 bg-card border-2 border-border text-foreground rounded-2xl font-bold"
                      value={formData.bankAccount.bankName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccount: {
                            ...formData.bankAccount,
                            bankName: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Chase Bank"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Account Holder Name
                    </Label>
                    <Input
                      className="h-14 px-5 bg-card border-2 border-border text-foreground rounded-2xl font-bold"
                      value={formData.bankAccount.accountHolderName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccount: {
                            ...formData.bankAccount,
                            accountHolderName: e.target.value,
                          },
                        })
                      }
                      placeholder="Your Full Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Account Number
                    </Label>
                    <Input
                      className="h-14 px-5 bg-card border-2 border-border text-foreground rounded-2xl font-bold"
                      value={formData.bankAccount.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccount: {
                            ...formData.bankAccount,
                            accountNumber: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. 1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Routing Number / SWIFT
                    </Label>
                    <Input
                      className="h-14 px-5 bg-card border-2 border-border text-foreground rounded-2xl font-bold"
                      value={formData.bankAccount.routingNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccount: {
                            ...formData.bankAccount,
                            routingNumber: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. 021000021"
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      !formData.bankAccount.bankName ||
                      !formData.bankAccount.accountNumber ||
                      !formData.bankAccount.accountHolderName
                    }
                    className="w-full h-20 rounded-[32px] bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.01] transition-all group disabled:opacity-50 disabled:grayscale"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Finalize Enrollment{" "}
                        <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </Button>
                  <p className="text-center mt-6 text-[10px] font-bold text-muted-foreground tracking-widest uppercase flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" /> Encrypted data protection
                    enabled
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;
