"use client";

import { useState } from "react";
import { z } from "zod";
// import FormSection from "@/w8Page/FormSection.tsx";
// import FormField from "@views/w8Page/FormField.tsx";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
// import { toast } from "@/hooks/use-toast";

const datePattern = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/;
const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;

const w8benSchema = z.object({
  name: z.string().trim().min(1),
  country: z.string().trim().min(1),
  permanentAddress: z.string().trim().min(1),
  cityStateProvince: z.string().trim().min(1),
  addressCountry: z.string().trim().min(1),
  mailingAddress: z.string().optional(),
  mailingCityState: z.string().optional(),
  mailingCountry: z.string().optional(),
  usTaxId: z
    .string()
    .refine((v) => v === "" || ssnPattern.test(v), {
      message: "Format: XXX-XX-XXXX",
    })
    .optional(),
  foreignTaxId: z.string().optional(),
  ftinNotRequired: z.boolean(),
  referenceNumbers: z.string().optional(),
  dateOfBirth: z
    .string()
    .refine((v) => datePattern.test(v), {
      message: "Format: MM-DD-YYYY",
    }),
  treatyCountry: z.string().optional(),
  articleParagraph: z.string().optional(),
  withholdingRate: z
    .string()
    .refine(
      (v) =>
        v === "" ||
        (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100),
      { message: "Enter 0-100" }
    )
    .optional(),
  incomeType: z.string().optional(),
  additionalConditions: z.string().optional(),
  signatureDate: z
    .string()
    .refine((v) => datePattern.test(v), {
      message: "Format: MM-DD-YYYY",
    }),
  printName: z.string().trim().min(1),
  certify: z.boolean().refine((v) => v === true, {
    message: "You must certify",
  }),
});

type W8BENData = z.infer<typeof w8benSchema>;

const initialFormData: W8BENData = {
  name: "",
  country: "",
  permanentAddress: "",
  cityStateProvince: "",
  addressCountry: "",
  mailingAddress: "",
  mailingCityState: "",
  mailingCountry: "",
  usTaxId: "",
  foreignTaxId: "",
  ftinNotRequired: false,
  referenceNumbers: "",
  dateOfBirth: "",
  treatyCountry: "",
  articleParagraph: "",
  withholdingRate: "",
  incomeType: "",
  additionalConditions: "",
  signatureDate: "",
  printName: "",
  certify: false,
};

export default function W8BENForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof W8BENData, string>>
  >({});

  const update =
    (field: keyof W8BENData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      if (errors[field]) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[field];
          return copy;
        });
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = w8benSchema.safeParse(formData);

    // if (!result.success) {
    //   const fieldErrors: any = {};
    //   result.error.errors.forEach((err) => {
    //     const key = err.path[0] as keyof W8BENData;
    //     fieldErrors[key] = err.message;
    //   });
    //   setErrors(fieldErrors);

    //   toast({
    //     title: "Validation Error",
    //     description: "Please fix highlighted fields",
    //     variant: "destructive",
    //   });

    //   return;
    }

    setErrors({});
    // toast({
    //   title: "Form Submitted",
    //   description: "W-8BEN submitted successfully",
    // });
  };

  return (
    <div className="container mx-auto py-10">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Form W-8BEN
        </h1>

        <FormField label="Full Name"
        //  error={errors.name}
        >
          <Input
            // value={formData.name}
            onChange={update("name")}
          />
        </FormField>

        <FormField label="Country" 
        // error={errors.country}
        >
          <Input
            // value={formData.country}
            onChange={update("country")}
          />
        </FormField>

        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            // checked={formData.certify}
            // onCheckedChange={(v) =>
            //   setFormData((p) => ({
            //     ...p,
            //     certify: !!v,
            //   }))
            // }
          />
          <span>I certify the information</span>
        </div>

        {/* {errors.certify && (
          <p className="text-red-500 text-sm mt-1">
            {errors.certify}
          </p>
        )} */}

        <Button type="submit" className="mt-6">
          Submit
        </Button>
      </form>
    </div>
  );
}