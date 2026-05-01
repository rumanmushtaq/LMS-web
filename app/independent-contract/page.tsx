"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import {
  Building2,
  User,
  MapPin,
  Info,
  CheckCircle2,
  Signature,
  ChevronRight,
  ChevronLeft,
  ScrollText,
  ShieldCheck,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import apiEndpoints from "@/utils/apiConfig";

const IndependentContractPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUSPerson, setIsUSPerson] = useState<boolean | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(apiEndpoints.Auth.ME);
        setUser(res.data.data || res.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
        router.push("/login");
      }
    };
    if (token) fetchUser();
  }, [token, router]);

  const handleSignatureSubmit = async () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("Please provide your signature.");
      return;
    }

    if (isUSPerson === null) {
      toast.error("Please select your residency status.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload signature image
      const signatureDataUrl = sigCanvas.current
        ?.getTrimmedCanvas()
        .toDataURL("image/png");
      if (!signatureDataUrl) throw new Error("Signature extraction failed");

      // Convert base64 to File object
      const resBlob = await fetch(signatureDataUrl);
      const blob = await resBlob.blob();
      const signatureFile = new File([blob], "signature.png", {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("file", signatureFile);
      formData.append("folder", "signatures");

      const uploadRes = await axiosInstance.post(
        apiEndpoints.Onboarding.UPLOAD,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const contractSignatureUrl = uploadRes.data.data.url;

      // 2. Submit contract agreement
      await axiosInstance.post(apiEndpoints.Onboarding.CONTRACT, {
        isUSPerson,
        contractSignatureUrl,
      });

      toast.success("Agreement signed successfully!");
      router.push("/onboarding/tax-forms");
    } catch (error: any) {
      console.error(error);
      // Detailed error toasts are already handled by interceptor for global codes
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Same visual design as before...
  return (
    <div className="min-h-screen bg-[#FDFCFD] text-[#1A1A1A] font-sans selection:bg-primary/20">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel: Progress & Context */}
        <div className="lg:w-[400px] border-r border-[#EFEFEF] bg-white/50 backdrop-blur-xl p-8 lg:p-12 flex flex-col sticky top-0 h-fit lg:h-screen">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Onboarding
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Tutor <br />
              <span className="text-primary italic">Agreement.</span>
            </h1>
          </motion.div>

          <div className="flex flex-col gap-10">
            {[
              {
                id: 1,
                title: "Review Terms",
                icon: ScrollText,
                desc: "Legal framework of our partnership",
              },
              {
                id: 2,
                title: "Residency Status",
                icon: MapPin,
                desc: "Tax compliance information",
              },
              {
                id: 3,
                title: "Signature",
                icon: Signature,
                desc: "Finalize your enrollment",
              },
            ].map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: s.id * 0.1 }}
                className={`flex gap-4 items-start transition-all duration-300 ${step === s.id ? "opacity-100" : "opacity-40 grayscale"}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${step === s.id ? "bg-primary text-white border-primary border-4 shadow-primary/20" : "bg-white text-muted-foreground border-border"}`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">
                    {s.title}
                  </h4>
                  <p className="text-[10px] font-bold text-muted-foreground leading-tight mt-1">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-12 text-[10px] text-muted-foreground leading-relaxed italic">
            "By proceeding, you verify that you are authorized to sign on behalf
            of the tutoring entity and agree to Varona's legal terms."
          </div>
        </div>

        {/* Right Panel: Active Content */}
        <div className="flex-1 p-6 lg:p-24 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="max-w-3xl mx-auto space-y-12"
              >
                <div className="prose prose-sm font-serif text-[15px] leading-relaxed text-[#2D2D2D] bg-white p-10 lg:p-16 rounded-[40px] shadow-2xl shadow-black/[0.03] border border-[#F2F2F2]">
                  <h2 className="text-2xl font-black font-sans text-center mb-12 tracking-tighter uppercase">
                    Independent Contractor Agreement
                  </h2>
                  <p className="text-xs text-muted-foreground mb-10 text-center font-sans">
                    This Agreement is between <b>Varona Academy</b> and{" "}
                    <b>{user.fullName}</b>
                  </p>

                  <section className="space-y-6">
                    <p>
                      <b>1. Relationship of the Parties.</b> The Tutor is an
                      independent contractor, not an employee, partner, or agent
                      of the Platform. The Tutor is not entitled to benefits,
                      insurance, or paid leave.
                    </p>
                    <p>
                      <b>2. Scope of Services.</b> Tutor agrees to provide
                      online tutoring, including live lessons, preparing
                      materials, and communicating with students via the
                      Platform.
                    </p>
                    <p>
                      <b>3. Compensation & Fees.</b> Tutors set their own rates.
                      The Platform retains a service fee from each booking.
                      Tutors are responsible for their own taxes.
                    </p>
                    <p>
                      <b>4. Confidentiality.</b> Tutor agrees to keep student
                      data and Platform business information strictly
                      confidential during and after the term of this service.
                    </p>
                  </section>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    className="h-14 px-10 rounded-2xl border-2 border-primary bg-transparent text-primary font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    I Have Reviewed the Terms{" "}
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="max-w-2xl mx-auto space-y-10"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black tracking-tight">
                    Tax Residency.
                  </h2>
                  <p className="text-muted-foreground">
                    Please select your status for IRS compliance.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      val: true,
                      label: "US Person",
                      desc: "Citizen, Resident, or US Entity",
                      icon: Building2,
                    },
                    {
                      val: false,
                      label: "International",
                      desc: "Foreign Tutor (Non-US)",
                      icon: User,
                    },
                  ].map((opt) => (
                    <motion.button
                      key={opt.label}
                      whileHover={{ y: -5 }}
                      onClick={() => setIsUSPerson(opt.val)}
                      className={`p-8 rounded-[32px] border-2 text-left transition-all duration-300 ${isUSPerson === opt.val ? "border-primary bg-primary/[0.02] shadow-xl shadow-primary/10" : "border-[#EFEFEF] bg-white hover:border-primary/50"}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border-2 transition-all duration-300 ${isUSPerson === opt.val ? "bg-primary text-white border-primary" : "bg-transparent text-primary border-primary"}`}
                      >
                        <opt.icon className="w-6 h-6" />
                      </div>
                      <h4 className="font-black text-lg mb-2">{opt.label}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {opt.desc}
                      </p>
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-8">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-14 px-8 rounded-2xl border-2 border-[#EFEFEF] bg-white text-[#1A1A1A] font-black uppercase tracking-widest text-[10px] hover:bg-[#F9F9F9] hover:border-[#EAEAEA] transition-all"
                  >
                    <ChevronLeft className="mr-1 w-4 h-4" /> Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={isUSPerson === null}
                    className="h-14 px-12 rounded-2xl border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                  >
                    Proceed to Signature{" "}
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="max-w-2xl mx-auto space-y-10"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black tracking-tight">
                    Final Signature.
                  </h2>
                  <p className="text-muted-foreground">
                    Sign below to finalize your Varona partnership.
                  </p>
                </div>

                <div className="relative group">
                  <div className="bg-white rounded-[40px] p-2 border-2 border-[#EFEFEF] shadow-2xl shadow-black/5 overflow-hidden transition-all duration-500 group-hover:border-primary/20">
                    <div className="bg-[#F9F9F9] rounded-[34px] border border-dashed border-[#DEDEDE] relative">
                      <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{
                          className: "w-full h-72 cursor-crosshair",
                        }}
                      />
                      <button
                        onClick={() => sigCanvas.current?.clear()}
                        className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover:opacity-100"
                      >
                        Clear Canvas
                      </button>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-white border border-border shadow-sm text-[9px] font-black uppercase tracking-tighter text-muted-foreground whitespace-nowrap">
                    Please sign within the dashed area
                  </div>
                </div>

                <div className="flex justify-between items-center pt-10">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="h-14 px-8 rounded-2xl border-[#EFEFEF] text-xs font-black uppercase tracking-widest hover:bg-muted transition-all"
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>

                  <Button
                    onClick={handleSignatureSubmit}
                    disabled={loading}
                    className="h-16 px-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="mr-3 w-5 h-5" /> Sign & Complete
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default IndependentContractPage;
