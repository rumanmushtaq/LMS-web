"use client";

import React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div className="mb-6">
      <div className="bg-form-header px-4 py-2">
        <h2 className="text-sm font-bold tracking-wide uppercase text-form-header-foreground font-serif">
          {title}
        </h2>
      </div>
      <div className="border border-form-border border-t-0 bg-card p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;