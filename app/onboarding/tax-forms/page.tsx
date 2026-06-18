"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileUp,
  Download,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  FileSearch,
  PenLine,
  RotateCcw,
  Building2,
  User,
} from "lucide-react";
import { PDFDocument, rgb } from "pdf-lib";
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

// Signature coordinates for W9 and W8BEN based on official PDFs
const SIGNATURE_COORDS = {
  W9: {
    signature: { x: 182, y: 197, width: 170, height: 18 },
    date: { x: 430, y: 198, fontSize: 10 },
  },
  W8BEN: {
    signature: { x: 182, y: 79, width: 170, height: 18 },
    date: { x: 430, y: 80, fontSize: 10 },
  },
};

export default function TaxFormsPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedUSPerson, setSelectedUSPerson] = useState<boolean | null>(null);

  const isUS = !!selectedUSPerson;
  const formName = isUS ? "W-9" : "W-8BEN";
  const downloadLink = isUS ? "/tax-forms/fw9.pdf" : "/tax-forms/fw8ben.pdf";

  // State for the uploaded PDF
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // State for signature and final PDF
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [finalPdfUrl, setFinalPdfUrl] = useState<string | null>(null);
  const [finalPdfBlob, setFinalPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(apiEndpoints.Auth.ME);
        const userData = res.data.data || res.data;
        setUser(userData);
        if (userData && userData.isUSPerson !== null) {
          setSelectedUSPerson(userData.isUSPerson);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        router.push("/login");
      }
    };
    if (token) fetchUser();
  }, [token, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const selectedFile = e.target.files[0];

    if (selectedFile.type !== "application/pdf") {
      toast.error("Please upload a valid PDF document.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfForm = pdfDoc.getForm();
      const fields = pdfForm.getFields();

      if (fields.length === 0) {
        toast.error("This PDF does not contain fillable form fields. Please use the official IRS template.");
        setIsAnalyzing(false);
        return;
      }

      const fieldNames = fields.map((f) => f.getName());
      const isW9Uploaded = fieldNames.some(
        (name) => name.includes("f1_01") || name.includes("Address_ReadOrder")
      );
      const isW8Uploaded = fieldNames.some(
        (name) => name.includes("f_1") || name.includes("f_2") || name.includes("f_3")
      );

      if (isUS && !isW9Uploaded) {
        toast.error("Invalid form uploaded. You selected US Person, so you must upload Form W-9.");
        setIsAnalyzing(false);
        return;
      }

      if (!isUS && !isW8Uploaded) {
        toast.error("Invalid form uploaded. You selected International, so you must upload Form W-8BEN.");
        setIsAnalyzing(false);
        return;
      }

      // Check if the form is empty / has required fields filled
      if (isW9Uploaded) {
        let name = "";
        let address = "";
        let cityZip = "";
        try {
          name = pdfForm.getTextField("topmostSubform[0].Page1[0].f1_01[0]")?.getText()?.trim() || "";
          address = pdfForm.getTextField("topmostSubform[0].Page1[0].Address_ReadOrder[0].f1_07[0]")?.getText()?.trim() || "";
          cityZip = pdfForm.getTextField("topmostSubform[0].Page1[0].Address_ReadOrder[0].f1_08[0]")?.getText()?.trim() || "";
        } catch (err) {
          console.error("Error reading fields", err);
        }

        if (!name || !address || !cityZip) {
          toast.error("Form W-9 is incomplete. Please fill out your Name, Address, and City/State/ZIP.");
          setIsAnalyzing(false);
          return;
        }

        // Check if at least one checkbox is checked for Federal Tax Classification
        const checkboxes = [
          "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[0]",
          "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[1]",
          "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[2]",
          "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[3]",
          "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[4]",
          "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[5]",
          "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[6]",
          "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_2[0]",
        ];

        const isAnyClassSelected = checkboxes.some((cbName) => {
          try {
            return pdfForm.getCheckBox(cbName).isChecked();
          } catch (e) {
            return false;
          }
        });

        if (!isAnyClassSelected) {
          toast.error("Please select a Federal Tax Classification in the W-9 form.");
          setIsAnalyzing(false);
          return;
        }
      }

      if (isW8Uploaded) {
        let name = "";
        let countryCitizen = "";
        let address = "";
        let cityState = "";
        let country = "";
        try {
          name = pdfForm.getTextField("topmostSubform[0].Page1[0].f_1[0]")?.getText()?.trim() || "";
          countryCitizen = pdfForm.getTextField("topmostSubform[0].Page1[0].f_2[0]")?.getText()?.trim() || "";
          address = pdfForm.getTextField("topmostSubform[0].Page1[0].f_3[0]")?.getText()?.trim() || "";
          cityState = pdfForm.getTextField("topmostSubform[0].Page1[0].f_4[0]")?.getText()?.trim() || "";
          country = pdfForm.getTextField("topmostSubform[0].Page1[0].f_5[0]")?.getText()?.trim() || "";
        } catch (err) {
          console.error("Error reading fields", err);
        }

        if (!name || !countryCitizen || !address || !cityState || !country) {
          toast.error("Form W-8BEN is incomplete. Please fill out your Name, Citizenship, Address, and Country.");
          setIsAnalyzing(false);
          return;
        }
      }

      setUploadedFile(selectedFile);

      // Simulate high-end "Scanning" feel
      await new Promise((r) => setTimeout(r, 1500));
      setIsAnalyzing(false);
      toast.success("Document verified successfully. Please provide your digital signature.");
    } catch (error) {
      console.error("Failed to validate PDF", error);
      toast.error("Failed to read or validate PDF. Please make sure it is a valid fillable PDF form.");
      setIsAnalyzing(false);
    }
  };

  const generateFinalPDF = async (sigDataUrl: string) => {
    if (!uploadedFile) return;
    setIsGenerating(true);
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const formType = selectedUSPerson ? "W9" : "W8BEN";

      // Embed signature
      const signatureImage = await pdfDoc.embedPng(sigDataUrl);
      const page = pdfDoc.getPage(0);
      const coords = SIGNATURE_COORDS[formType as keyof typeof SIGNATURE_COORDS];

      // Proportional aspect-ratio calculation to avoid stretching
      const { width: imgWidth, height: imgHeight } = signatureImage;
      const scale = Math.min(coords.signature.width / imgWidth, coords.signature.height / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      // Draw the signature proportionally scaled
      page.drawImage(signatureImage, {
        x: coords.signature.x,
        y: coords.signature.y,
        width: drawWidth,
        height: drawHeight,
      });

      // Add date
      const today = new Date().toLocaleDateString();
      page.drawText(today, {
        x: coords.date.x,
        y: coords.date.y,
        size: coords.date.fontSize,
        color: rgb(0, 0, 0),
      });

      // Flatten the PDF so fields become non-editable (optional, but good for final submission)
      try {
        const form = pdfDoc.getForm();
        form.flatten();
      } catch (flattenError) {
        console.warn("Could not flatten PDF form fields:", flattenError);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      if (finalPdfUrl) URL.revokeObjectURL(finalPdfUrl);
      setFinalPdfUrl(url);
      setFinalPdfBlob(blob);
    } catch (error) {
      console.error("Error generating final PDF:", error);
      toast.error("Failed to merge signature with PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySignature = async (dataUrl: string | null) => {
    if (!dataUrl) return;
    setSignatureDataUrl(dataUrl);
    setIsSigningOpen(false);
    await generateFinalPDF(dataUrl);
  };

  const handleSubmitFinal = async () => {
    if (!finalPdfBlob) {
      toast.error("Please generate the final PDF first.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload the final signed PDF to our storage
      const formData = new FormData();
      formData.append(
        "file",
        finalPdfBlob,
        `${selectedUSPerson ? "W9" : "W8BEN"}_Signed.pdf`,
      );
      formData.append("folder", "tax-forms");

      const uploadRes = await axiosInstance.post(
        apiEndpoints.Onboarding.UPLOAD,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      // Backend returns { url: '...' } directly, handle both nested and flat shapes
      const pdfUrl = uploadRes.data?.data?.url || uploadRes.data?.url;

      if (!pdfUrl) {
        throw new Error("Upload succeeded but no URL was returned.");
      }

      console.log("selectedUSPerson", selectedUSPerson)
      // 2. Submit to onboarding endpoint
      await axiosInstance.post(apiEndpoints.Onboarding.TAX_FORM, {
        taxFormUrl: pdfUrl,
        isUSPerson: selectedUSPerson,
      });

      toast.success("Tax form signed and submitted successfully!");
      router.push("/onboarding/kyc");
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || error?.message || "Submission failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
              Tax <br /> <span className="text-primary italic">Documentation.</span>
            </motion.h1>
            <div className="space-y-6">
              <div className="flex gap-4 p-5 rounded-2xl bg-card shadow-sm border border-border">
                <FileSearch className="w-10 h-10 text-primary p-2 bg-primary/5 rounded-xl" />
                <div>
                  <h4 className="text-sm font-bold mb-1">
                    Official Documents Only
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Please use the official IRS {formName} template provided below. Fill it out completely before uploading.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Workflow Steps */}
          <div className="lg:w-8/12">
            <div className="space-y-6">

              {/* Step 0: Residency Status Selection */}
              {selectedUSPerson === null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-card border border-border p-8 shadow-xl space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Tax Residency</h3>
                    <p className="text-sm text-muted-foreground">
                      Please select your status for IRS compliance.
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
                        className="p-6 rounded-2xl border-2 text-left bg-card hover:border-primary/50 border-border transition-all duration-300 w-full"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border-2 bg-transparent text-primary border-primary">
                          <opt.icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-black text-base mb-1">
                          {opt.label}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-normal">
                          {opt.desc}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {selectedUSPerson !== null && (
                <>
                  {/* Step 1: Download */}
                  <div className="rounded-3xl bg-card border border-border p-8 shadow-xl">
                    <h3 className="text-xl font-black mb-2">1. Download & Fill {formName}</h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      Download the official IRS fillable PDF, fill it out on your computer, and save it.
                    </p>
                    <a
                      href={downloadLink}
                      download
                      className="flex items-center justify-between p-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors group"
                    >
                      <span className="font-bold flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Download {formName} Form Template
                      </span>
                    </a>
                  </div>

                  {/* Step 2: Upload */}
                  {!finalPdfUrl && (
                    <div className="rounded-3xl bg-card border border-border p-8 shadow-xl">
                      <h3 className="text-xl font-black mb-2">2. Upload Filled PDF</h3>
                      <p className="text-sm text-muted-foreground mb-5">
                        Upload your completed {formName} PDF here. We will apply your digital signature to it in the next step.
                      </p>
                      <label
                        className={`relative flex flex-col items-center justify-center min-h-[220px] rounded-3xl border-2 border-dashed transition-all cursor-pointer ${uploadedFile ? "border-green-500 bg-green-50/20" : "border-border hover:border-primary/50"}`}
                      >
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          accept=".pdf"
                        />
                        {isAnalyzing ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                              <Loader2 className="w-12 h-12 text-primary animate-spin" />
                              <div className="absolute inset-0 animate-ping opacity-20 bg-primary rounded-full" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-primary animate-pulse">
                              Processing Document...
                            </p>
                          </div>
                        ) : uploadedFile ? (
                          <div className="text-center p-6">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h4 className="text-sm font-black text-green-700">
                              {uploadedFile.name} Uploaded
                            </h4>
                            <p className="text-xs text-green-600 mt-2">Click to replace file</p>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <FileUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-xs font-bold uppercase tracking-tighter">
                              Drop filled {formName} here
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-2">PDF format only</p>
                          </div>
                        )}
                      </label>

                      {/* Step 3: Sign */}
                      <AnimatePresence>
                        {uploadedFile && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="mt-8 pt-8 border-t border-border"
                          >
                            <h3 className="text-xl font-black mb-2">3. Apply Digital Signature</h3>
                            <p className="text-sm text-muted-foreground mb-5">
                              Draw your signature below. We will automatically place it in the correct signature field of your uploaded PDF.
                            </p>

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
                                  onClick={() => {
                                    setSignatureDataUrl(null);
                                    setFinalPdfUrl(null);
                                    setFinalPdfBlob(null);
                                  }}
                                >
                                  <RotateCcw className="w-3 h-3" /> Redraw Signature
                                </Button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Step 4: Final Preview & Submit */}
                  {isGenerating ? (
                    <div className="rounded-3xl bg-card border border-border p-12 shadow-xl flex flex-col items-center justify-center">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest text-primary">
                        Applying Signature & Generating Final Document...
                      </p>
                    </div>
                  ) : finalPdfUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl bg-card border-2 border-primary/30 p-6 sm:p-8 shadow-2xl"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-black text-primary">Final Verification</h3>
                          <p className="text-sm text-muted-foreground">
                            Please preview your signed {formName} to ensure all requirements are fulfilled.
                          </p>
                        </div>
                        <a
                          href={finalPdfUrl}
                          download={`Signed_${formName}.pdf`}
                          className="px-4 py-2 bg-muted hover:bg-primary/10 text-foreground hover:text-primary rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-border"
                        >
                          <Download className="w-4 h-4" /> Download Final PDF
                        </a>
                      </div>

                      {/* PDF Preview Iframe */}
                      <div className="w-full h-[500px] rounded-xl border border-border overflow-hidden bg-neutral-800 mb-8">
                        <iframe
                          src={`${finalPdfUrl}#toolbar=0&view=FitH`}
                          className="w-full h-full"
                          title="Final Signed Tax Form"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-end border-t border-border pt-6">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFinalPdfUrl(null);
                            setFinalPdfBlob(null);
                            setSignatureDataUrl(null);
                            setUploadedFile(null);
                            if (user?.isUSPerson === null) {
                              setSelectedUSPerson(null);
                            }
                          }}
                          className="w-full sm:w-auto text-xs font-bold"
                        >
                          Start Over
                        </Button>
                        <Button
                          onClick={handleSubmitFinal}
                          disabled={loading}
                          className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Submit Signed Document"
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
