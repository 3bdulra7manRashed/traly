"use client";

import React from "react";
import { FormField } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  hasError?: boolean;
}

export function SelectField({
  field,
  value,
  onChange,
  hasError,
}: SelectFieldProps) {
  const options = field.options || {};

  return (
    <div className="relative">
      <select
        id={field.name}
        name={field.name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-xl border bg-slate-900/90 px-4 py-3 pl-10 text-sm text-slate-100",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200 cursor-pointer",
          !value && "text-slate-500",
          hasError
            ? "border-rose-500/80 bg-rose-950/10 focus:ring-rose-500/30"
            : "border-slate-800 hover:border-slate-700"
        )}
      >
        <option value="" disabled className="bg-slate-900 text-slate-500">
          {field.placeholder || "اختر من القائمة..."}
        </option>
        {Object.entries(options).map(([optKey, optLabel]) => (
          <option
            key={optKey}
            value={optLabel}
            className="bg-slate-900 text-slate-100 py-2"
          >
            {optLabel}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    </div>
  );
}
