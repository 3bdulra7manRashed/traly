"use client";

import React from "react";
import { FormField } from "@/types";
import { HelpCircle, AlertCircle } from "lucide-react";

interface FieldWrapperProps {
  field: FormField;
  error?: string;
  allValues: Record<string, any>;
  children: React.ReactNode;
}

export function FieldWrapper({
  field,
  error,
  allValues,
  children,
}: FieldWrapperProps) {
  // Check conditional visibility
  if (field.conditional_rules?.visible_if) {
    const rule = field.conditional_rules.visible_if;
    if (typeof rule === "object" && rule.field) {
      const targetVal = allValues[rule.field];
      if (rule.equals !== undefined && targetVal !== rule.equals) {
        return null;
      }
      if (rule.not_empty && (!targetVal || targetVal.length === 0)) {
        return null;
      }
    }
  }

  const isRequired = field.validation_rules?.includes("required");

  return (
    <div className="flex flex-col gap-2 transition-all duration-200">
      {/* Label & Help Text */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={field.name}
          className="text-sm font-semibold text-slate-200 flex items-center gap-1.5"
        >
          {field.label}
          {isRequired && (
            <span className="text-emerald-400 font-bold" title="حقل إجباري">
              *
            </span>
          )}
        </label>

        {field.help_text && (
          <span
            className="flex items-center gap-1 text-xs text-slate-400"
            title={field.help_text}
          >
            <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">{field.help_text}</span>
          </span>
        )}
      </div>

      {/* Input Control */}
      <div className="relative">{children}</div>

      {/* Mobile Help Text (if long) */}
      {field.help_text && (
        <p className="sm:hidden text-xs text-slate-400 leading-relaxed">
          {field.help_text}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 animate-fadeIn">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
