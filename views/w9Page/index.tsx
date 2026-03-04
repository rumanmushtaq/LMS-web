"use client";

import { useW9Form } from "./useW9form";
import { taxClassifications, formatSSN, formatEIN } from "@/schemas/w9-form";

export default function W9Form() {
  const { formData, updateField } = useW9Form();

  return (
    /* Outer page wrapper — soft pink background */
    <div className="min-h-screen bg-panel-left p-6 flex items-start justify-center">
      <div className="w-full max-w-[850px] shadow-xl border border-primary/20 rounded-xl overflow-hidden">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="grid grid-cols-[200px_1fr_200px] border-b border-primary/20">

          {/* Left — deep pink tint */}
          <div className="p-3 border-r border-primary/20 flex flex-col justify-between bg-panel-left-circle">
            <div>
              <h1 className="text-2xl font-bold text-primary">Form W-9</h1>
              <p className="text-[10px] text-primary/60 mt-1">(Rev. March 2024)</p>
              <p className="text-[10px] text-primary/60">Department of the Treasury</p>
              <p className="text-[10px] text-primary/60">Internal Revenue Service</p>
            </div>
          </div>

          {/* Center — white card */}
          <div className="p-4 border-r border-primary/20 flex flex-col items-center justify-center text-center bg-card">
            <h2 className="text-lg font-bold text-foreground leading-tight">
              Request for Taxpayer<br />Identification Number and Certification
            </h2>
          </div>

          {/* Right — soft pink */}
          <div className="p-3 flex flex-col justify-between bg-panel-left-circle">
            <p className="text-[10px] text-foreground/70">
              Give form to the requester. <strong className="text-foreground">Do not</strong> send to the IRS.
            </p>
            <p className="text-[10px] text-primary font-medium mt-2">
              ▸ Go to <span className="underline cursor-pointer hover:text-primary/70 transition-colors">www.irs.gov/FormW9</span> for instructions and the latest information.
            </p>
          </div>
        </div>

        {/* ── Line 1 ─────────────────────────────────────────── */}
        <div className="border-b border-primary/15 p-3 bg-card">
          <label className="text-[11px] font-bold text-foreground block mb-1">
            1 &nbsp;Name of entity/individual.{" "}
            <span className="font-normal text-muted-foreground">
              An entry is required. (For a sole proprietor or disregarded entity, enter the owner&apos;s name on line 1, and enter the business/disregarded entity&apos;s name on line 2.)
            </span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full bg-transparent border-b border-primary/30 text-sm py-1 outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
            placeholder="Enter name"
          />
        </div>

        {/* ── Line 2 ─────────────────────────────────────────── */}
        <div className="border-b border-primary/15 p-3 bg-secondary/30">
          <label className="text-[11px] font-bold text-foreground block mb-1">
            2 &nbsp;Business name/disregarded entity name,{" "}
            <span className="font-normal text-muted-foreground">if different from above.</span>
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
            className="w-full bg-transparent border-b border-primary/30 text-sm py-1 outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
            placeholder="Enter business name"
          />
        </div>

        {/* ── Line 3a & 4 ────────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_250px] border-b border-primary/15">
          <div className="p-3 border-r border-primary/15 bg-card">
            <label className="text-[11px] font-bold text-foreground block mb-2">
              3a &nbsp;Check the appropriate box for federal tax classification of the entity/individual whose name is entered on line 1.{" "}
              <span className="font-normal text-muted-foreground">Check only one of the following seven boxes.</span>
            </label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {taxClassifications.map((tc) => (
                <label
                  key={tc.value}
                  className="flex items-center gap-1.5 text-[11px] text-foreground cursor-pointer hover:text-primary transition-colors"
                >
                  <input
                    type="radio"
                    name="taxClassification"
                    value={tc.value}
                    checked={formData.taxClassification === tc.value}
                    onChange={(e) => updateField("taxClassification", e.target.value)}
                    className="accent-primary w-3.5 h-3.5"
                  />
                  {tc.label}
                  {tc.value === "llc" && formData.taxClassification === "llc" && (
                    <span className="ml-1">
                      ▸{" "}
                      <input
                        type="text"
                        value={formData.llcClassification}
                        onChange={(e) => updateField("llcClassification", e.target.value)}
                        className="w-8 border-b border-primary/40 bg-transparent text-center outline-none focus:border-primary text-foreground"
                        placeholder="C/S/P"
                        maxLength={1}
                      />
                    </span>
                  )}
                  {tc.value === "other" && formData.taxClassification === "other" && (
                    <span className="ml-1">
                      ▸{" "}
                      <input
                        type="text"
                        value={formData.otherClassification}
                        onChange={(e) => updateField("otherClassification", e.target.value)}
                        className="w-32 border-b border-primary/40 bg-transparent outline-none focus:border-primary text-foreground"
                        placeholder="Specify"
                      />
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Exemptions — richer pink panel */}
          <div className="p-3 bg-panel-left-circle">
            <label className="text-[11px] font-bold text-foreground block mb-2">
              4 &nbsp;Exemptions{" "}
              <span className="font-normal text-muted-foreground">(codes apply only to certain entities, not individuals; see instructions):</span>
            </label>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-muted-foreground">Exempt payee code (if any)</span>
                <input
                  type="text"
                  value={formData.exemptPayeeCode}
                  onChange={(e) => updateField("exemptPayeeCode", e.target.value)}
                  className="w-full bg-white/60 border-b border-primary/30 text-sm py-0.5 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Exemption from FATCA reporting code (if any)</span>
                <input
                  type="text"
                  value={formData.fatcaCode}
                  onChange={(e) => updateField("fatcaCode", e.target.value)}
                  className="w-full bg-white/60 border-b border-primary/30 text-sm py-0.5 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Line 3b ────────────────────────────────────────── */}
        <div className="border-b border-primary/15 p-3 bg-secondary/20">
          <label className="flex items-start gap-2 text-[11px] text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasForeignPartners}
              onChange={(e) => updateField("hasForeignPartners", e.target.checked)}
              className="accent-primary mt-0.5 w-3.5 h-3.5"
            />
            <span>
              <strong className="text-primary">3b</strong> &nbsp;If on line 3a you checked &quot;Partnership&quot; or &quot;Trust/estate,&quot; or checked &quot;LLC&quot; and entered &quot;P&quot; as its tax classification, and you are providing this form to a partnership, trust, or estate in which you have an ownership interest, check this box if you have any foreign partners, owners, or beneficiaries. See instructions.
            </span>
          </label>
        </div>

        {/* ── Line 5 ─────────────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_250px] border-b border-primary/15">
          <div className="p-3 border-r border-primary/15 bg-card">
            <label className="text-[11px] font-bold text-foreground block mb-1">
              5 &nbsp;Address{" "}
              <span className="font-normal text-muted-foreground">(number, street, and apt. or suite no.). See instructions.</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full bg-transparent border-b border-primary/30 text-sm py-1 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              placeholder="Enter address"
            />
          </div>
          <div className="p-3 bg-panel-left">
            <span className="text-[10px] text-muted-foreground block mb-1">Requester&apos;s name and address (optional)</span>
            <div className="h-8 border-b border-dashed border-primary/30" />
          </div>
        </div>

        {/* ── Line 6 ─────────────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_250px] border-b border-primary/15">
          <div className="p-3 border-r border-primary/15 bg-secondary/20">
            <label className="text-[11px] font-bold text-foreground block mb-1">
              6 &nbsp;City, state, and ZIP code
            </label>
            <input
              type="text"
              value={formData.cityStateZip}
              onChange={(e) => updateField("cityStateZip", e.target.value)}
              className="w-full bg-transparent border-b border-primary/30 text-sm py-1 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              placeholder="City, State ZIP"
            />
          </div>
          <div className="p-3 bg-panel-left" />
        </div>

        {/* ── Line 7 ─────────────────────────────────────────── */}
        <div className="border-b border-primary/15 p-3 bg-card">
          <label className="text-[11px] font-bold text-foreground block mb-1">
            7 &nbsp;List account number(s) here{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.accountNumbers}
            onChange={(e) => updateField("accountNumbers", e.target.value)}
            className="w-full bg-transparent border-b border-primary/30 text-sm py-1 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
            placeholder="Account number(s)"
          />
        </div>

        {/* ── Part I — TIN ───────────────────────────────────── */}
        <div className="border-b border-primary/15">
          <div className="bg-primary px-3 py-2 flex items-center gap-2">
            <span className="text-xs font-bold text-primary-foreground tracking-widest uppercase">Part I</span>
            <span className="w-px h-4 bg-primary-foreground/30" />
            <span className="text-xs font-semibold text-primary-foreground/90">Taxpayer Identification Number (TIN)</span>
          </div>
          <div className="p-3 bg-secondary/10">
            <p className="text-[10px] text-muted-foreground mb-3">
              Enter your TIN in the appropriate box. The TIN provided must match the name given on line 1 to avoid backup withholding. For individuals, this is generally your social security number (SSN). However, for a resident alien, sole proprietor, or disregarded entity, see the instructions for Part I, later. For other entities, it is your employer identification number (EIN). If you do not have a number, see How to get a TIN, later.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* SSN */}
              <div className={`p-3 rounded-lg border-2 transition-all ${formData.tinType === "ssn" ? "border-primary bg-secondary/40 shadow-sm" : "border-primary/20 bg-white/50"}`}>
                <label className="flex items-center gap-2 text-[11px] font-bold text-foreground mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tinType"
                    value="ssn"
                    checked={formData.tinType === "ssn"}
                    onChange={() => updateField("tinType", "ssn")}
                    className="accent-primary"
                  />
                  Social security number (SSN)
                </label>
                <input
                  type="text"
                  value={formData.ssn}
                  onChange={(e) => updateField("ssn", formatSSN(e.target.value))}
                  disabled={formData.tinType !== "ssn"}
                  className="w-full bg-white/70 border border-primary/30 rounded px-2 py-1.5 text-sm tracking-widest font-mono outline-none focus:border-primary disabled:opacity-40 transition-colors text-foreground placeholder:text-muted-foreground"
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                />
              </div>

              {/* EIN */}
              <div className={`p-3 rounded-lg border-2 transition-all ${formData.tinType === "ein" ? "border-primary bg-secondary/40 shadow-sm" : "border-primary/20 bg-white/50"}`}>
                <label className="flex items-center gap-2 text-[11px] font-bold text-foreground mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tinType"
                    value="ein"
                    checked={formData.tinType === "ein"}
                    onChange={() => updateField("tinType", "ein")}
                    className="accent-primary"
                  />
                  Employer identification number (EIN)
                </label>
                <input
                  type="text"
                  value={formData.ein}
                  onChange={(e) => updateField("ein", formatEIN(e.target.value))}
                  disabled={formData.tinType !== "ein"}
                  className="w-full bg-white/70 border border-primary/30 rounded px-2 py-1.5 text-sm tracking-widest font-mono outline-none focus:border-primary disabled:opacity-40 transition-colors text-foreground placeholder:text-muted-foreground"
                  placeholder="XX-XXXXXXX"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Part II — Certification ────────────────────────── */}
        <div className="border-b border-primary/15">
          <div className="bg-primary px-3 py-2 flex items-center gap-2">
            <span className="text-xs font-bold text-primary-foreground tracking-widest uppercase">Part II</span>
            <span className="w-px h-4 bg-primary-foreground/30" />
            <span className="text-xs font-semibold text-primary-foreground/90">Certification</span>
          </div>
          <div className="p-3 bg-panel-left">
            <p className="text-[10px] text-foreground mb-2 font-medium">Under penalties of perjury, I certify that:</p>
            <ol className="text-[10px] text-foreground space-y-1.5 list-decimal pl-4 mb-3">
              <li>The number shown on this form is my correct taxpayer identification number (or I am waiting for a number to be issued to me); and</li>
              <li>I am not subject to backup withholding because (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding; and</li>
              <li>I am a U.S. citizen or other U.S. person (defined below); and</li>
              <li>The FATCA code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting is correct.</li>
            </ol>
            <p className="text-[9px] text-muted-foreground">
              <strong className="text-foreground">Certification instructions.</strong> You must cross out item 2 above if you have been notified by the IRS that you are currently subject to backup withholding because you have failed to report all interest and dividends on your tax return.
            </p>
          </div>
        </div>

        {/* ── Signature ──────────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_200px] border-b border-primary/15 bg-panel-left-circle">
          <div className="p-3 border-r border-primary/15">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary whitespace-nowrap">Sign Here ▸</span>
              <div className="flex-1">
                <span className="text-[10px] text-muted-foreground">Signature of U.S. person</span>
                <div className="border-b-2 border-primary/50 h-8 mt-1" />
              </div>
            </div>
          </div>
          <div className="p-3">
            <span className="text-[10px] text-muted-foreground block mb-1">Date</span>
            <input
              type="date"
              value={formData.signatureDate}
              onChange={(e) => updateField("signatureDate", e.target.value)}
              className="w-full bg-white/60 border-b border-primary/30 text-sm py-1 outline-none focus:border-primary text-foreground"
            />
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="px-3 py-2 flex items-center justify-between bg-primary/10">
          <p className="text-[9px] text-muted-foreground">Cat. No. 10231X</p>
          <p className="text-[9px] text-muted-foreground">
            Form <strong className="text-primary">W-9</strong> (Rev. 3-2024)
          </p>
        </div>

      </div>
    </div>
  );
}