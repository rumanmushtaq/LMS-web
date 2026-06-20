"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2, Building2, User, RotateCcw } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import apiEndpoints from "@/utils/apiConfig";
import SignaturePad from "@/components/SignaturePad";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const contractText = `INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement ("Agreement") is entered into between:

Company:
Varona Academy, a company organized under the laws of State of California, USA, with its principal place of business at 18034 Ventura Boulevard, Suite 313, Encino, California 91316 ("Platform")

and

Tutor:
The registered user accepting this agreement ("Tutor").

1. Relationship of the Parties
The Tutor is an independent contractor, not an employee, partner, agent, or joint venturer of the Platform.
Nothing in this Agreement shall be interpreted to create:
- An employment relationship
- A partnership or joint venture
- An agency relationship
The Tutor is not entitled to benefits, insurance, paid leave, or other employee benefits.

2. Scope of Services
Tutor agrees to provide online tutoring services to students via the Platform, including:
- Conducting live lessons
- Preparing lesson materials
- Communicating with students as necessary

Tutor retains full control over:
- Teaching methods
- Lesson structure
- Scheduling availability
- Acceptance or rejection of students

3. Platform Role
The Platform:
- Operates a technology marketplace
- Facilitates payments
- Provides scheduling, messaging, and lesson tools
- Does not supervise or control how tutoring services are delivered

4. Compensation
Tutor shall be paid for completed lessons at rates displayed on the Platform.
The Platform retains a commission or service fee.
Payments are made via approved third-party payment processors (e.g., Wise, PayPal, Payoneer).

The Tutor is responsible for:
- All applicable taxes
- Currency conversion fees
- Payment processor fees

5. Taxes & Tax Status
Tutor acknowledges that:
- Tutor is solely responsible for all taxes arising from payments received
- Platform will not withhold taxes
- Tutor must provide accurate tax documentation (e.g., W-8BEN or W-9 if applicable)

6. Location of Services
Tutor represents that tutoring services are performed outside the United States, unless otherwise disclosed in writing.
Tutor understands that tax obligations may change if services are performed within the U.S.

7. Non-Exclusivity
Tutor may:
- Work with other tutoring platforms
- Offer services independently
- Set their own prices where permitted by Platform rules

8. Intellectual Property
Tutor retains ownership of independently created teaching materials.
Tutor grants the Platform a non-exclusive, royalty-free license to use Tutor's name, photo, bio, and lesson descriptions for marketing and platform operation.

9. Confidentiality
Tutor agrees to keep confidential:
- Student data
- Platform systems
- Business practices
- Pricing and commission structures
This obligation survives termination.

10. Conduct & Platform Standards
Tutor agrees to:
- Act professionally
- Follow Platform policies
- Comply with applicable laws
- Avoid misleading or harmful behavior
The Platform may suspend or terminate access for violations.

11. Term & Termination
This Agreement begins upon acceptance.
Either party may terminate at any time with or without cause.
Outstanding payments for completed lessons will be honored.

12. Limitation of Liability
The Platform is not liable for:
- Tutor's teaching outcomes
- Student disputes
- Tutor's tax obligations
- Losses due to payment processors

13. Governing Law
This Agreement shall be governed by the laws of California, USA, without regard to conflict-of-law rules.

14. Entire Agreement
This Agreement represents the entire understanding between the parties and supersedes all prior agreements.`;

export default function ContractPage() {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedUSPerson, setSelectedUSPerson] = useState<boolean | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(apiEndpoints.Auth.ME);
        const userData = res.data.data || res.data;
        setUser(userData);
        // Only pre-fill residency if user has previously set it — do NOT silently pre-select
        // to avoid confusing users who re-enter the flow
      } catch (error) {
        console.error("Failed to fetch user", error);
        router.push("/login");
      } finally {
        setIsFetching(false);
      }
    };
    if (token) {
      fetchUser();
    } else {
      router.push("/login");
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplySignature = (dataUrl: string | null) => {
    setSignatureDataUrl(dataUrl);
  };

  const handleSubmit = async () => {
    if (selectedUSPerson === null) {
      toast.error("Please select your Tax Residency status first.");
      return;
    }

    if (!signatureDataUrl) {
      toast.error("Please sign the agreement to continue.");
      return;
    }

    setLoading(true);
    try {
      // 1. Convert base64 signature to blob
      const fetchRes = await fetch(signatureDataUrl);
      const blob = await fetchRes.blob();

      // 2. Upload the signature to storage
      const formData = new FormData();
      formData.append("file", blob, "Contract_Signature.png");
      formData.append("folder", "tutors-onboarding/contracts");

      const uploadRes = await axiosInstance.post(
        apiEndpoints.Onboarding.UPLOAD,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // FIX: Consistent with rest of codebase — backend wraps in { data: { url } }
      const signatureUrl = uploadRes.data.data.url;

      if (!signatureUrl) {
        toast.error("Failed to upload signature. Please try again.");
        return;
      }

      // 3. Submit signed contract to onboarding endpoint
      await axiosInstance.post(apiEndpoints.Onboarding.CONTRACT, {
        contractSignatureUrl: signatureUrl,
        isUSPerson: selectedUSPerson,
      });

      toast.success("Contract signed successfully!");
      router.push("/onboarding/tax-forms");
    } catch (error) {
      console.error(error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading skeleton while fetching user
  if (isFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading your agreement...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left Column: Title & Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:w-4/12"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-8"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Onboarding
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8"
            >
              Tutor <br /> <span className="text-primary italic">Agreement.</span>
            </motion.h1>
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex gap-4 p-5 rounded-2xl bg-card shadow-sm border border-border">
                <div>
                  <h4 className="text-sm font-bold mb-1">
                    Independent Contractor
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Please review and sign the agreement to clarify your independent contractor relationship with Varona Academy.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-2xl bg-card shadow-sm border border-border">
                <div>
                  <h4 className="text-sm font-bold mb-1">What happens next?</h4>
                  <p className="text-xs text-muted-foreground">
                    After signing, you will be guided to submit your IRS tax form (W-9 or W-8BEN) based on your residency status.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Workflow Steps */}
          <div className="lg:w-8/12">
            <div className="space-y-6">

              {/* Step 1: Residency Status Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl bg-card border border-border p-8 shadow-xl space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">1. Tax Residency</h3>
                  <p className="text-sm text-muted-foreground">
                    Please select your status for IRS compliance before signing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { val: true, label: "US Person", desc: "Citizen, Resident, or US Entity", icon: Building2 },
                    { val: false, label: "International", desc: "Foreign Tutor (Non-US)", icon: User },
                  ].map((opt) => (
                    <motion.button
                      key={opt.label}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedUSPerson(opt.val)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 w-full ${
                        selectedUSPerson === opt.val
                          ? "bg-primary/5 border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border-2 ${
                          selectedUSPerson === opt.val
                            ? "bg-primary text-white border-primary"
                            : "bg-transparent text-primary border-primary"
                        }`}
                      >
                        <opt.icon className="w-5 h-5" />
                      </div>
                      <h4 className={`font-black text-base mb-1 ${selectedUSPerson === opt.val ? "text-primary" : ""}`}>
                        {opt.label}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {opt.desc}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Step 2: Contract Review & Signature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl bg-card border border-border p-8 shadow-xl space-y-6"
              >
                <h3 className="text-xl font-black mb-2">2. Review & Sign Agreement</h3>

                {/* Contract Text Box */}
                <div className="w-full h-64 overflow-y-auto p-6 bg-muted/30 border border-border rounded-2xl text-xs font-medium text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {contractText}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-bold mb-4">Digital Signature</p>
                  {!signatureDataUrl ? (
                    <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                      <SignaturePad
                        onSignatureChange={handleApplySignature}
                        signatureDataUrl={signatureDataUrl}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-6 bg-white rounded-2xl border-2 border-green-500/20">
                      <img
                        src={signatureDataUrl}
                        alt="Your Signature"
                        className="max-h-20 w-auto"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 text-muted-foreground text-xs gap-2"
                        onClick={() => setSignatureDataUrl(null)}
                      >
                        <RotateCcw className="w-3 h-3" /> Redraw Signature
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "I Agree & Submit"
                  )}
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
