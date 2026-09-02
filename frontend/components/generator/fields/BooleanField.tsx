"use client";

import React from "react";
import { FormField } from "@/types";
import { cn } from "@/lib/utils";

interface BooleanFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  hasError?: boolean;
}

export function BooleanField({
  field,
  value,
  onChange,
  hasError,
}: BooleanFieldProps) {
  const isChecked = Boolean(value);

  return (
    <div className="flex items-center gap-3 pt-1">
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={() => onChange(!isChecked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
          isChecked ? "bg-emerald-500" : "bg-slate-800"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            isChecked ? "-translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      <span className="text-sm font-medium text-slate-300 select-none">
        {isChecked ? "مفعّل / نعم" : "معطل / لا"}
      </span>
    </div>
  );
}
