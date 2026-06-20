"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getName, getNames } from "country-list";
import ISO6391 from "iso-639-1";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import categoriesService, { CategoryItem } from "@/services/categories";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const KYCPage = () => {
  const [step, setStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

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

  const [videoSource, setVideoSource] = useState<'upload' | 'link'>('upload');
  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    if (formData.introVideoUrl) {
      if (
        formData.introVideoUrl.includes("tutor-videos") ||
        formData.introVideoUrl.includes("kyc-documents")
      ) {
        setVideoSource("upload");
      } else if (formData.introVideoUrl.startsWith("http")) {
        setVideoSource("link");
      }
    }
  }, [formData.introVideoUrl]);

  const handleVideoSourceChange = (source: 'upload' | 'link') => {
    setVideoSource(source);
    setFormData((prev) => ({ ...prev, introVideoUrl: "" }));
  };

  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    categoriesService
      .getCategories()
      .then((data) => { if (data && data.length > 0) setCategories(data); })
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

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
        "input:not([type=file]):not([type=hidden]), select, textarea",
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

        <div
          ref={stepCardRef}
          className="bg-card rounded-[44px] border border-border/50 shadow-2xl shadow-black/5 p-8 lg:p-14 overflow-hidden"
        >
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
                    <Select
                      value={formData.country}
                      onValueChange={(val) =>
                        setFormData({ ...formData, country: val })
                      }
                    >
                      <SelectTrigger className="w-full h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold text-sm cursor-pointer hover:border-border/80 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] border-border rounded-xl">
                        <SelectItem
                          value="United States"
                          className="font-bold cursor-pointer"
                        >
                          🇺🇸 United States
                        </SelectItem>
                        {getNames()
                          .filter((c) => c !== "United States")
                          .sort()
                          .map((country) => (
                            <SelectItem
                              key={country}
                              value={country}
                              className="font-medium cursor-pointer"
                            >
                              {country}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Default Timezone
                    </Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={(val) =>
                        setFormData({ ...formData, timezone: val })
                      }
                    >
                      <SelectTrigger className="w-full h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold text-sm cursor-pointer hover:border-border/80 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select Timezone" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] border-border rounded-xl">
                        <SelectItem
                          value="UTC-12 (IDLW)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-12 (IDLW)
                        </SelectItem>
                        <SelectItem
                          value="UTC-11 (SST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-11 (SST)
                        </SelectItem>
                        <SelectItem
                          value="UTC-10 (HST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-10 (HST)
                        </SelectItem>
                        <SelectItem
                          value="UTC-9 (AKST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-9 (AKST)
                        </SelectItem>
                        <SelectItem
                          value="UTC-8 (PST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-8 (PST)
                        </SelectItem>
                        <SelectItem
                          value="UTC-7 (MST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-7 (MST)
                        </SelectItem>
                        <SelectItem
                          value="UTC-6 (CST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-6 (CST)
                        </SelectItem>
                        <SelectItem
                          value="UTC-5 (EST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-5 (EST)
                        </SelectItem>
                        <SelectItem
                          value="UTC-4 (AST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-4 (AST)
                        </SelectItem>
                        <SelectItem
                          value="UTC-3 (ART)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-3 (ART)
                        </SelectItem>
                        <SelectItem
                          value="UTC-2 (GST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-2 (GST)
                        </SelectItem>
                        <SelectItem
                          value="UTC-1 (AZOT)"
                          className="font-medium cursor-pointer"
                        >
                          UTC-1 (AZOT)
                        </SelectItem>
                        <SelectItem
                          value="UTC+0 (GMT)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+0 (GMT)
                        </SelectItem>
                        <SelectItem
                          value="UTC+1 (CET)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+1 (CET)
                        </SelectItem>
                        <SelectItem
                          value="UTC+2 (EET)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+2 (EET)
                        </SelectItem>
                        <SelectItem
                          value="UTC+3 (MSK)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+3 (MSK)
                        </SelectItem>
                        <SelectItem
                          value="UTC+4 (GST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+4 (GST)
                        </SelectItem>
                        <SelectItem
                          value="UTC+5 (PKT)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+5 (PKT)
                        </SelectItem>
                        <SelectItem
                          value="UTC+5:30 (IST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+5:30 (IST)
                        </SelectItem>
                        <SelectItem
                          value="UTC+6 (BST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+6 (BST)
                        </SelectItem>
                        <SelectItem
                          value="UTC+7 (ICT)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+7 (ICT)
                        </SelectItem>
                        <SelectItem
                          value="UTC+8 (SGT)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+8 (SGT)
                        </SelectItem>
                        <SelectItem
                          value="UTC+9 (JST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+9 (JST)
                        </SelectItem>
                        <SelectItem
                          value="UTC+10 (AEST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+10 (AEST)
                        </SelectItem>
                        <SelectItem
                          value="UTC+11 (AEDT)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+11 (AEDT)
                        </SelectItem>
                        <SelectItem
                          value="UTC+12 (NZST)"
                          className="font-medium cursor-pointer"
                        >
                          UTC+12 (NZST)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Native Language
                    </Label>
                    <Select
                      value={formData.nativeLanguage}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          nativeLanguage: val,
                        })
                      }
                    >
                      <SelectTrigger className="w-full h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold text-sm cursor-pointer hover:border-border/80 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select Native Language" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] border-border rounded-xl">
                        {ISO6391.getAllNames()
                          .sort()
                          .map((lang) => (
                            <SelectItem
                              key={lang}
                              value={lang}
                              className="font-medium cursor-pointer"
                            >
                              {lang}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Other Spoken Languages
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full h-auto min-h-14 px-4 py-2 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold text-sm cursor-pointer hover:border-border/80 focus:ring-0 focus:ring-offset-0 justify-start"
                        >
                          <div className="flex flex-wrap gap-2 items-center w-full">
                            {formData.spokenLanguages.length > 0 ? (
                              formData.spokenLanguages.map((lang) => (
                                <Badge
                                  key={lang}
                                  variant="secondary"
                                  className="rounded-lg px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-bold text-[10px] uppercase tracking-wider"
                                >
                                  {lang}
                                  <span
                                    role="button"
                                    aria-label="Remove language"
                                    tabIndex={0}
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:text-primary/70 transition-colors cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      setFormData((prev) => ({
                                        ...prev,
                                        spokenLanguages:
                                          prev.spokenLanguages.filter(
                                            (l) => l !== lang,
                                          ),
                                      }));
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </span>
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground font-medium text-sm">
                                Select languages...
                              </span>
                            )}
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full sm:w-[400px] p-0 border-border rounded-xl"
                        align="start"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search language..."
                            className="h-11 outline-none border-none ring-0 focus:ring-0"
                          />
                          <CommandList className="max-h-[300px]">
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                              {ISO6391.getAllNames()
                                .sort()
                                .map((lang) => {
                                  const isSelected =
                                    formData.spokenLanguages.includes(lang);
                                  return (
                                    <CommandItem
                                      key={lang}
                                      value={lang}
                                      onSelect={() => {
                                        if (isSelected) {
                                          setFormData((prev) => ({
                                            ...prev,
                                            spokenLanguages:
                                              prev.spokenLanguages.filter(
                                                (l) => l !== lang,
                                              ),
                                          }));
                                        } else {
                                          setFormData((prev) => ({
                                            ...prev,
                                            spokenLanguages: [
                                              ...prev.spokenLanguages,
                                              lang,
                                            ],
                                          }));
                                        }
                                      }}
                                      className="font-medium cursor-pointer flex items-center justify-between hover:bg-muted/50"
                                    >
                                      {lang}
                                      {isSelected && (
                                        <Check className="h-4 w-4 text-primary" />
                                      )}
                                    </CommandItem>
                                  );
                                })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                    {categories.length === 0 ? (
                      <div className="flex items-center gap-3 py-5 px-4 rounded-2xl border-2 border-dashed border-border">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Loading categories...</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat.title })}
                            className={`px-5 py-3 rounded-2xl border-2 font-bold text-sm transition-all duration-200 ${
                              formData.category === cat.title
                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                : "border-border bg-card hover:border-primary/40 text-foreground"
                            }`}
                          >
                            {cat.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                        Years of Experience
                      </Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(val) =>
                          setFormData({
                            ...formData,
                            experience: val,
                          })
                        }
                      >
                        <SelectTrigger className="w-full h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold text-sm cursor-pointer hover:border-border/80 focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Years of Experience" />
                        </SelectTrigger>
                        <SelectContent className="border-border rounded-xl">
                          <SelectItem
                            value="Less than 1 year"
                            className="font-medium cursor-pointer"
                          >
                            Less than 1 year
                          </SelectItem>
                          <SelectItem
                            value="1-3 Years"
                            className="font-medium cursor-pointer"
                          >
                            1-3 Years
                          </SelectItem>
                          <SelectItem
                            value="3-5 Years"
                            className="font-medium cursor-pointer"
                          >
                            3-5 Years
                          </SelectItem>
                          <SelectItem
                            value="5-10 Years"
                            className="font-medium cursor-pointer"
                          >
                            5-10 Years
                          </SelectItem>
                          <SelectItem
                            value="10+ Years"
                            className="font-medium cursor-pointer"
                          >
                            10+ Years
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                      
                      {/* Video source toggle tabs */}
                      <div className="flex gap-2 p-1 rounded-2xl bg-muted/30 border border-border max-w-[320px]">
                        <button
                          type="button"
                          onClick={() => handleVideoSourceChange("upload")}
                          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                            videoSource === "upload"
                              ? "bg-primary text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Upload Video
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVideoSourceChange("link")}
                          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                            videoSource === "link"
                              ? "bg-primary text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Video Link
                        </button>
                      </div>

                      {videoSource === "upload" ? (
                        <div className="space-y-4">
                          <label className="relative aspect-video rounded-3xl border-2 border-dashed border-muted hover:border-primary flex flex-col items-center justify-center cursor-pointer bg-muted/10 transition-all">
                            {formData.introVideoUrl && (formData.introVideoUrl.includes("tutor-videos") || formData.introVideoUrl.includes("kyc-documents")) ? (
                              <div className="flex flex-col items-center gap-2">
                                <BadgeCheck className="w-12 h-12 text-green-500" />
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                                  Video Uploaded Successfully
                                </span>
                              </div>
                            ) : isUploading === "video" ? (
                              <Loader2 className="animate-spin text-primary" />
                            ) : (
                              <>
                                <Video className="w-10 h-10 text-muted-foreground mb-3" />
                                <span className="text-[9px] font-black uppercase text-muted-foreground">
                                  Upload Video File
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
                          {formData.introVideoUrl && (formData.introVideoUrl.includes("tutor-videos") || formData.introVideoUrl.includes("kyc-documents")) && (
                            <div className="flex justify-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData(p => ({ ...p, introVideoUrl: "" }))}
                                className="h-9 px-4 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold text-xs"
                              >
                                Remove Uploaded Video
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative">
                            <Input
                              type="url"
                              className="h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold placeholder:text-muted-foreground/60"
                              placeholder="Paste Video URL (e.g. YouTube, Vimeo, S3 link)"
                              value={formData.introVideoUrl && !(formData.introVideoUrl.includes("tutor-videos") || formData.introVideoUrl.includes("kyc-documents")) ? formData.introVideoUrl : ""}
                              onChange={(e) =>
                                setFormData({ ...formData, introVideoUrl: e.target.value })
                              }
                            />
                          </div>
                          {formData.introVideoUrl && !(formData.introVideoUrl.includes("tutor-videos") || formData.introVideoUrl.includes("kyc-documents")) && (
                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest text-center">
                              ✓ Video Link Added
                            </p>
                          )}
                        </div>
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
                      <Select
                        value={formData.lessonTimezone}
                        onValueChange={(val) =>
                          setFormData({
                            ...formData,
                            lessonTimezone: val,
                          })
                        }
                      >
                        <SelectTrigger className="w-full h-14 px-5 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold text-sm cursor-pointer hover:border-border/80 focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Lesson Timezone" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] border-border rounded-xl">
                          <SelectItem
                            value="UTC-12 (IDLW)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-12 (IDLW)
                          </SelectItem>
                          <SelectItem
                            value="UTC-11 (SST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-11 (SST)
                          </SelectItem>
                          <SelectItem
                            value="UTC-10 (HST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-10 (HST)
                          </SelectItem>
                          <SelectItem
                            value="UTC-9 (AKST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-9 (AKST)
                          </SelectItem>
                          <SelectItem
                            value="UTC-8 (PST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-8 (PST)
                          </SelectItem>
                          <SelectItem
                            value="UTC-7 (MST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-7 (MST)
                          </SelectItem>
                          <SelectItem
                            value="UTC-6 (CST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-6 (CST)
                          </SelectItem>
                          <SelectItem
                            value="UTC-5 (EST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-5 (EST)
                          </SelectItem>
                          <SelectItem
                            value="UTC-4 (AST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-4 (AST)
                          </SelectItem>
                          <SelectItem
                            value="UTC-3 (ART)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-3 (ART)
                          </SelectItem>
                          <SelectItem
                            value="UTC-2 (GST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-2 (GST)
                          </SelectItem>
                          <SelectItem
                            value="UTC-1 (AZOT)"
                            className="font-medium cursor-pointer"
                          >
                            UTC-1 (AZOT)
                          </SelectItem>
                          <SelectItem
                            value="UTC+0 (GMT)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+0 (GMT)
                          </SelectItem>
                          <SelectItem
                            value="UTC+1 (CET)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+1 (CET)
                          </SelectItem>
                          <SelectItem
                            value="UTC+2 (EET)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+2 (EET)
                          </SelectItem>
                          <SelectItem
                            value="UTC+3 (MSK)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+3 (MSK)
                          </SelectItem>
                          <SelectItem
                            value="UTC+4 (GST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+4 (GST)
                          </SelectItem>
                          <SelectItem
                            value="UTC+5 (PKT)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+5 (PKT)
                          </SelectItem>
                          <SelectItem
                            value="UTC+5:30 (IST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+5:30 (IST)
                          </SelectItem>
                          <SelectItem
                            value="UTC+6 (BST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+6 (BST)
                          </SelectItem>
                          <SelectItem
                            value="UTC+7 (ICT)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+7 (ICT)
                          </SelectItem>
                          <SelectItem
                            value="UTC+8 (SGT)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+8 (SGT)
                          </SelectItem>
                          <SelectItem
                            value="UTC+9 (JST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+9 (JST)
                          </SelectItem>
                          <SelectItem
                            value="UTC+10 (AEST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+10 (AEST)
                          </SelectItem>
                          <SelectItem
                            value="UTC+11 (AEDT)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+11 (AEDT)
                          </SelectItem>
                          <SelectItem
                            value="UTC+12 (NZST)"
                            className="font-medium cursor-pointer"
                          >
                            UTC+12 (NZST)
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                                  <div className="flex items-center gap-2 sm:gap-3 bg-muted/30 px-3 py-2 sm:py-1.5 rounded-xl border border-transparent hover:border-border transition-all flex-1 sm:flex-none w-full sm:w-auto min-w-0">
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
                                  <div className="flex items-center gap-2 sm:gap-3 bg-muted/30 px-3 py-2 sm:py-1.5 rounded-xl border border-transparent hover:border-border transition-all flex-1 sm:flex-none w-full sm:w-auto min-w-0">
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
                      <Select
                        value={formData.idType}
                        onValueChange={(val) =>
                          setFormData({ ...formData, idType: val })
                        }
                      >
                        <SelectTrigger className="w-full h-14 px-4 bg-card border-2 border-border text-foreground outline-none focus:border-primary/50 transition-colors rounded-2xl font-bold text-sm cursor-pointer hover:border-border/80 focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Select ID Type" />
                        </SelectTrigger>
                        <SelectContent className="border-border rounded-xl">
                          <SelectItem
                            value="Passport"
                            className="font-medium cursor-pointer"
                          >
                            Passport
                          </SelectItem>
                          <SelectItem
                            value="Driver License"
                            className="font-medium cursor-pointer"
                          >
                            Driver License
                          </SelectItem>
                          <SelectItem
                            value="National ID"
                            className="font-medium cursor-pointer"
                          >
                            National ID
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
