export interface FormData {
  name: string;
  businessName: string;
  taxClassification: string;
  llcClassification: string;
  otherClassification: string;
  exemptPayeeCode: string;
  fatcaCode: string;
  hasForeignPartners: boolean;
  address: string;
  cityStateZip: string;
  accountNumbers: string;
  ssn: string;
  ein: string;
  tinType: "ssn" | "ein";
  signatureDate: string;
}

export const taxClassifications = [
  { value: "individual", label: "Individual/sole proprietor" },
  { value: "c_corp", label: "C corporation" },
  { value: "s_corp", label: "S corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "trust", label: "Trust/estate" },
  { value: "llc", label: "LLC" },
  { value: "other", label: "Other (see instructions)" },
];

export const initialFormData: FormData = {
  name: "",
  businessName: "",
  taxClassification: "",
  llcClassification: "",
  otherClassification: "",
  exemptPayeeCode: "",
  fatcaCode: "",
  hasForeignPartners: false,
  address: "",
  cityStateZip: "",
  accountNumbers: "",
  ssn: "",
  ein: "",
  tinType: "ssn",
  signatureDate: "",
};

export const formatSSN = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

export const formatEIN = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
};