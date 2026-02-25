"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* -------------------- Patterns -------------------- */
const datePattern = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/;
const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;

/* -------------------- Schema -------------------- */
const w8benSchema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  country: z.string().trim().min(1, "Country is required"),
  permanentAddress: z.string().trim().min(1, "Permanent address is required"),
  cityStateProvince: z.string().trim().min(1, "City/State is required"),
  addressCountry: z.string().trim().min(1, "Country is required"),

  mailingAddress: z.string().optional(),
  mailingCityState: z.string().optional(),
  mailingCountry: z.string().optional(),

  usTaxId: z
    .string()
    .optional()
    .refine((v) => !v || ssnPattern.test(v), {
      message: "Format: XXX-XX-XXXX",
    }),

  foreignTaxId: z.string().optional(),
  ftinNotRequired: z.boolean(),

  referenceNumbers: z.string().optional(),

  dateOfBirth: z.string().refine((v) => datePattern.test(v), {
    message: "Format: MM-DD-YYYY",
  }),

  treatyCountry: z.string().optional(),
  articleParagraph: z.string().optional(),

  withholdingRate: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v ||
        (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100),
      { message: "Enter number between 0-100" }
    ),

  incomeType: z.string().optional(),
  additionalConditions: z.string().optional(),

  signatureDate: z.string().refine((v) => datePattern.test(v), {
    message: "Format: MM-DD-YYYY",
  }),

  printName: z.string().trim().min(1, "Printed name is required"),

  certify: z.boolean().refine((v) => v === true, {
    message: "You must certify",
  }),
});

export type W8BENFormValues = z.infer<typeof w8benSchema>;

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