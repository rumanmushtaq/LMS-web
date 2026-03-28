import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { W9FormValues, w9Schema } from "@/schemas/w9-form";
// import { W9FormValues } from "@/schemas/w9-form"; 


export function useW9Form() {
  const form = useForm<W9FormValues>({
    resolver: zodResolver(w9Schema),
    defaultValues: {
      name: "",
      businessName: "",
      taxClassification: "",
      llcClassification: "",
      otherClassification: "",
      isForeignLLC: false,
      exemptPayeeCode: "",
      fatcaExemptionCode: "",
      address: "",
      cityStateZip: "",
      requesterName: "",
      accountNumbers: "",
      tinType: "ssn",
      ssn1: "",
      ssn2: "",
      ssn3: "",
      ein1: "",
      ein2: "",
      certify1: false,
      certify2: false,
      certify3: false,
      certify4: false,
      signatureDate: new Date().toISOString().split("T")[0],
    },
  });

  const watchTaxClass = form.watch("taxClassification");
  const watchTinType = form.watch("tinType");

  const onSubmit = (data: W9FormValues) => {
    console.log("W-9 Form Data:", data);
    toast.success("W-9 form submitted successfully!");
  };

  const handleReset = () => form.reset();

  return {
    form,
    watchTaxClass,
    watchTinType,
    onSubmit,
    handleReset,
  };
}