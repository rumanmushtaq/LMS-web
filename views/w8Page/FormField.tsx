"use client";

import React from "react";

interface FormFieldProps {
  label: string;
  number?: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
  className?: string;
}

const FormField = ({
  label,
  number,
  children,
  hint,
  error,
  className = "",
}: FormFieldProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-xs font-semibold text-form-label mb-1.5">
        {number && (
          <span className="inline-block min-w-[1.5rem] font-bold text-foreground">
            {number}
          </span>
        )}
        {label}
      </label>

      {hint && (
        <p className="text-[11px] text-muted-foreground mb-1.5 italic">
          {hint}
        </p>
      )}

      {children}

      {error && (
        <p className="text-[11px] text-destructive mt-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;