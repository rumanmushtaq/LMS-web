"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import { useW9Form } from "./useW9form";
import { taxClassifications, certifications } from "@/schemas/w9-form";

export default function W9Form() {
  const { form, watchTaxClass, watchTinType, onSubmit, handleReset } =
    useW9Form();

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="rounded-t-lg border-2 border-primary overflow-hidden">
          <div className="bg-primary px-3 py-3 sm:px-6 sm:py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground shrink-0" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground">
                  Form W-9
                </h1>
                <p className="text-primary-foreground/80 text-xs sm:text-sm">
                  (Rev. March 2024)
                </p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-primary-foreground font-semibold text-xs sm:text-sm">
                Request for Taxpayer
              </p>
              <p className="text-primary-foreground font-semibold text-xs sm:text-sm">
                Identification Number and Certification
              </p>
              <p className="text-primary-foreground/70 text-xs mt-1">
                Department of the Treasury — Internal Revenue Service
              </p>
            </div>
          </div>
          <div className="bg-w9-section-bg px-3 sm:px-6 py-2 border-b border-w9-section-border">
            <p className="text-xs text-muted-foreground">
              ▸ Go to{" "}
              <span className="text-primary font-medium">
                www.irs.gov/FormW9
              </span>{" "}
              for instructions and the latest information.
              <span className="ml-4 font-semibold text-w9-label">
                Give form to the requester. Do not send to the IRS.
              </span>
            </p>
          </div>
        </div>

        {/* ── Form Body ──────────────────────────────────────────────────── */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="border-2 border-t-0 border-primary rounded-b-lg"
          >
            {/* Line 1 — Name */}
            <div className="px-3 sm:px-6 py-4 border-b border-w9-section-border">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-w9-label">
                      <span className="text-primary font-bold">1</span> Name of
                      entity/individual
                      <span className="text-primary text-xs ml-2">
                        (as shown on your income tax return)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter legal name"
                        className="mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Line 2 — Business Name */}
            <div className="px-3 sm:px-6 py-4 border-b border-w9-section-border">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-w9-label">
                      <span className="text-primary font-bold">2</span> Business
                      name/disregarded entity name, if different from above
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter business name (if applicable)"
                        className="mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Line 3a — Federal Tax Classification */}
            <div className="px-3 sm:px-6 py-4 border-b border-w9-section-border">
              <FormField
                control={form.control}
                name="taxClassification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-w9-label">
                      <span className="text-primary font-bold">3a</span> Check
                      appropriate box for federal tax classification of the
                      entity/individual
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="mt-3 space-y-2"
                      >
                        {taxClassifications.map((tc) => (
                          <div
                            key={tc.value}
                            className="flex items-center space-x-3"
                          >
                            <RadioGroupItem
                              value={tc.value}
                              id={tc.value}
                              className="border-primary text-primary"
                            />
                            <Label
                              htmlFor={tc.value}
                              className="text-sm text-foreground cursor-pointer"
                            >
                              {tc.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LLC sub-classification */}
              {watchTaxClass === "llc" && (
                <div className="mt-4 ml-4 sm:ml-8 p-3 sm:p-4 bg-w9-section-bg rounded-lg border border-w9-section-border">
                  <FormField
                    control={form.control}
                    name="llcClassification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-w9-label">
                          Enter the tax classification (C=C corporation, S=S
                          corporation, P=Partnership)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="C, S, or P"
                            maxLength={1}
                            className="mt-1 w-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Other sub-classification */}
              {watchTaxClass === "other" && (
                <div className="mt-4 ml-4 sm:ml-8 p-3 sm:p-4 bg-w9-section-bg rounded-lg border border-w9-section-border">
                  <FormField
                    control={form.control}
                    name="otherClassification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-w9-label">
                          Specify classification
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter classification"
                            className="mt-1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Line 3b — Foreign LLC */}
            <div className="px-3 sm:px-6 py-4 border-b border-w9-section-border">
              <FormField
                control={form.control}
                name="isForeignLLC"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 border-primary data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-w9-label leading-snug font-normal">
                      <span className="text-primary font-bold">3b</span> If on
                      line 3a you checked &quot;Limited liability company,&quot;
                      check this box if the LLC is a foreign LLC treated as a
                      partnership for U.S. federal tax purposes
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Line 4 — Exemptions */}
            <div className="px-3 sm:px-6 py-4 border-b border-w9-section-border">
              <p className="text-sm font-semibold text-w9-label mb-3">
                <span className="text-primary font-bold">4</span> Exemptions{" "}
                <span className="font-normal text-muted-foreground">
                  (codes apply only to certain entities, not individuals; see
                  instructions)
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="exemptPayeeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-w9-label">
                        Exempt payee code (if any)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter code"
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatcaExemptionCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-w9-label">
                        Exemption from FATCA reporting code (if any)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter code"
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                (Applies to accounts maintained outside the U.S.)
              </p>
            </div>

            {/* Line 5 — Address */}
            <div className="px-3 sm:px-6 py-4 border-b border-w9-section-border">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-w9-label">
                      <span className="text-primary font-bold">5</span> Address
                      (number, street, and apt. or suite no.)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter street address"
                        className="mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Line 6 — City, State, ZIP */}
            <div className="px-3 sm:px-6 py-4 border-b border-w9-section-border">
              <FormField
                control={form.control}
                name="cityStateZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-w9-label">
                      <span className="text-primary font-bold">6</span> City,
                      state, and ZIP code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City, State ZIP"
                        className="mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Line 7 — Account Numbers & Requester */}
            <div className="px-3 sm:px-6 py-4 border-b border-w9-section-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountNumbers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-w9-label">
                        <span className="text-primary font-bold">7</span> List
                        account number(s) here (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Account number(s)"
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requesterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-w9-label">
                        Requester&apos;s name and address (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Requester info"
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ── Part I — TIN ───────────────────────────────────────────── */}
            <div className="bg-w9-section-bg">
              <div className="px-3 sm:px-6 py-3 border-b border-w9-section-border">
                <h2 className="text-lg font-bold text-primary">
                  Part I — Taxpayer Identification Number (TIN)
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your TIN in the appropriate box. The TIN provided must
                  match the name given on line 1 to avoid backup withholding.
                </p>
              </div>

              <div className="px-3 sm:px-6 py-4 border-b border-w9-section-border">
                {/* SSN / EIN toggle */}
                <FormField
                  control={form.control}
                  name="tinType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col gap-2 sm:flex-row sm:gap-6 mb-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="ssn"
                              id="ssn"
                              className="border-primary text-primary"
                            />
                            <Label
                              htmlFor="ssn"
                              className="text-sm font-medium cursor-pointer"
                            >
                              Social Security Number (SSN)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="ein"
                              id="ein"
                              className="border-primary text-primary"
                            />
                            <Label
                              htmlFor="ein"
                              className="text-sm font-medium cursor-pointer"
                            >
                              Employer Identification Number (EIN)
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* SSN fields */}
                {watchTinType === "ssn" && (
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-w9-label">
                      SSN:
                    </span>
                    <FormField
                      control={form.control}
                      name="ssn1"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input
                              maxLength={3}
                              placeholder="XXX"
                              className="w-14 sm:w-20 text-center tracking-widest"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-primary font-bold">–</span>
                    <FormField
                      control={form.control}
                      name="ssn2"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input
                              maxLength={2}
                              placeholder="XX"
                              className="w-12 sm:w-16 text-center tracking-widest"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-primary font-bold">–</span>
                    <FormField
                      control={form.control}
                      name="ssn3"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input
                              maxLength={4}
                              placeholder="XXXX"
                              className="w-16 sm:w-24 text-center tracking-widest"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* EIN fields */}
                {watchTinType === "ein" && (
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-w9-label">
                      EIN:
                    </span>
                    <FormField
                      control={form.control}
                      name="ein1"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input
                              maxLength={2}
                              placeholder="XX"
                              className="w-12 sm:w-16 text-center tracking-widest"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-primary font-bold">–</span>
                    <FormField
                      control={form.control}
                      name="ein2"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input
                              maxLength={7}
                              placeholder="XXXXXXX"
                              className="w-24 sm:w-32 text-center tracking-widest"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── Part II — Certification ────────────────────────────────── */}
            <div>
              <div className="px-3 sm:px-6 py-3 border-b border-w9-section-border">
                <h2 className="text-lg font-bold text-primary">
                  Part II — Certification
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Under penalties of perjury, I certify that:
                </p>
              </div>

              <div className="px-3 sm:px-6 py-4 space-y-4">
                {certifications.map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-0 space-y-0">
                        <span className="text-primary font-semibold text-sm w-6 shrink-0 mt-0.5">
                          {item.num}.
                        </span>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5 shrink-0 border-primary data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                        <FormLabel className="text-xs sm:text-sm text-foreground leading-relaxed font-normal ml-2 sm:ml-3 cursor-pointer">
                          {item.text}
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <Separator className="bg-w9-section-border" />

            {/* ── Sign Here ──────────────────────────────────────────────── */}
            <div className="px-3 sm:px-6 py-6">
              <h3 className="text-sm font-bold text-primary mb-4">Sign Here</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-w9-label">
                    Signature of U.S. person
                  </Label>
                  <div className="mt-2 h-20 rounded-lg border-2 border-dashed border-primary/40 bg-w9-section-bg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground italic">
                      Electronic signature area
                    </p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="signatureDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-w9-label">
                        Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" className="mt-2 w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ── Submit / Reset ─────────────────────────────────────────── */}
            <div className="px-3 sm:px-6 py-4 sm:py-6 border-t border-w9-section-border bg-w9-section-bg rounded-b-lg flex justify-end gap-2 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="text-xs sm:text-sm px-3 sm:px-4"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                size="lg"
                className="text-xs sm:text-sm px-4 sm:px-8"
              >
                Submit W-9
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
