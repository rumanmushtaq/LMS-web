"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { W8BENFormValues, w8benSchema } from "@/schemas/w8-ben";



/* -------------------- Custom Hook -------------------- */
export const useW8BENForm = () => {
  const form = useForm<W8BENFormValues>({
    resolver: zodResolver(w8benSchema),
    defaultValues: {
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
    },
  });

  const onSubmit = async (values: W8BENFormValues) => {
    try {
      console.log("W8BEN Submitted:", values);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    form,
    onSubmit,
  };
};