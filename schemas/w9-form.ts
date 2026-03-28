import * as z from "zod";

export const w9Schema = z.object({
  name: z.string().min(1, "Name is required"),
  businessName: z.string().optional(),
  taxClassification: z.string().min(1, "Federal tax classification is required"),
  llcClassification: z.string().optional(),
  otherClassification: z.string().optional(),
  isForeignLLC: z.boolean().optional(),
  exemptPayeeCode: z.string().optional(),
  fatcaExemptionCode: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  cityStateZip: z.string().min(1, "City, state, and ZIP code are required"),
  requesterName: z.string().optional(),
  accountNumbers: z.string().optional(),
  tinType: z.enum(["ssn", "ein"]),
  ssn1: z.string().optional(),
  ssn2: z.string().optional(),
  ssn3: z.string().optional(),
  ein1: z.string().optional(),
  ein2: z.string().optional(),
  certify1: z.boolean().refine((val) => val === true, "You must certify this"),
  certify2: z.boolean().refine((val) => val === true, "You must certify this"),
  certify3: z.boolean().refine((val) => val === true, "You must certify this"),
  certify4: z.boolean().refine((val) => val === true, "You must certify this"),
  signatureDate: z.string().min(1, "Date is required"),
});

export type W9FormValues = z.infer<typeof w9Schema>;

export const taxClassifications = [
  { value: "individual", label: "Individual/sole proprietor or single-member LLC" },
  { value: "c_corp",     label: "C Corporation" },
  { value: "s_corp",     label: "S Corporation" },
  { value: "partnership",label: "Partnership" },
  { value: "trust_estate",label: "Trust/estate" },
  { value: "llc",        label: "Limited liability company" },
  { value: "other",      label: "Other (see instructions)" },
];

export const certifications = [
  {
    name: "certify1" as const,
    num: "1",
    text: "The number shown on this form is my correct taxpayer identification number (or I am waiting for a number to be issued to me); and",
  },
  {
    name: "certify2" as const,
    num: "2",
    text: "I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding; and",
  },
  {
    name: "certify3" as const,
    num: "3",
    text: "I am a U.S. citizen or other U.S. person (defined in the instructions); and",
  },
  {
    name: "certify4" as const,
    num: "4",
    text: "The FATCA code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting is correct.",
  },
];