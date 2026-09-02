"use client";

import React from "react";
import { FormField } from "@/types";
import { cn } from "@/lib/utils";

interface TextareaFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  hasError?: boolean;
}

export function TextareaField({
  field,
  value,
  onChange,
  hasError,
}: TextareaFieldProps) {
  return (
    <textarea
      id={field.name}
      name={field.name}
      rows={4}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder ?? undefined}
      className={cn(
        "w-full rounded-xl border bg-slate-900/90 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200 resize-y min-h-[100px]",
        hasError
          ? "border-rose-500/80 bg-rose-950/10 focus:ring-rose-500/30"
          : "border-slate-800 hover:border-slate-700"
      )}
    />
  );
}
