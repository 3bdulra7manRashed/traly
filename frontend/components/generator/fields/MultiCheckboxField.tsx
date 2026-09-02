"use client";

import React from "react";
import { FormField } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface MultiCheckboxFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  hasError?: boolean;
}

export function MultiCheckboxField({
  field,
  value,
  onChange,
  hasError,
}: MultiCheckboxFieldProps) {
  const options = field.options || {};
  const currentSelected: string[] = Array.isArray(value) ? value : [];

  const handleToggle = (optLabel: string) => {
    if (currentSelected.includes(optLabel)) {
      onChange(currentSelected.filter((item) => item !== optLabel));
    } else {
      onChange([...currentSelected, optLabel]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
      {Object.entries(options).map(([optKey, optLabel]) => {
        const isSelected = currentSelected.includes(optLabel);

        return (
          <label
            key={optKey}
            className={cn(
              "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
              isSelected
                ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-200 shadow-sm"
                : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850",
              hasError && !isSelected && "border-rose-900/40"
            )}
          >
            <input
              type="checkbox"
              name={field.name}
              value={optLabel}
              checked={isSelected}
              onChange={() => handleToggle(optLabel)}
              className="sr-only"
            />
            <div
              className={cn(
                "h-4 w-4 rounded-md border flex items-center justify-center transition-all",
                isSelected
                  ? "border-emerald-500 bg-emerald-500 text-slate-950"
                  : "border-slate-600 bg-slate-900"
              )}
            >
              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <span className="text-sm font-medium select-none">{optLabel}</span>
          </label>
        );
      })}
    </div>
  );
}
