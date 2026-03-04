import { useState } from "react";
import { FormData, initialFormData } from "@/schemas/w9-form";

export function useW9Form() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    console.log("updated field:", field);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateField,
  };
}