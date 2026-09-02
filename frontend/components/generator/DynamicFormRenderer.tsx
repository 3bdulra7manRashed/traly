"use client";

import React, { useState, useEffect } from "react";
import { PromptGenerator, PromptGenerationResult } from "@/types";
import { FieldRenderer } from "./FieldRenderer";
import { PromptResultModal } from "./PromptResultModal";
import { api, ApiError } from "@/lib/api";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicFormRendererProps {
  generator: PromptGenerator;
}

export function DynamicFormRenderer({ generator }: DynamicFormRendererProps) {
  const steps = generator.steps || [];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationResult, setGenerationResult] =
    useState<PromptGenerationResult | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const storageKey = `traly_draft_${generator.slug}`;

  // 1. Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormValues(parsed.values || {});
        if (typeof parsed.stepIndex === "number") {
          setCurrentStepIndex(
            Math.min(parsed.stepIndex, Math.max(0, steps.length - 1))
          );
        }
      }
    } catch (e) {
      console.warn("Failed to load draft from localStorage", e);
    } finally {
      setIsDraftLoaded(true);
    }
  }, [storageKey, steps.length]);

  // 2. Auto-save draft to localStorage whenever values or step change
  useEffect(() => {
    if (!isDraftLoaded) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          values: formValues,
          stepIndex: currentStepIndex,
          updatedAt: new Date().toISOString(),
        })
      );
      setSaveStatus("تم حفظ المسودة تلقائياً");
      const timer = setTimeout(() => setSaveStatus(null), 3000);
      return () => clearTimeout(timer);
    } catch (e) {
      console.warn("Failed to save draft to localStorage", e);
    }
  }, [formValues, currentStepIndex, storageKey, isDraftLoaded]);

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const progressPercentage =
    totalSteps > 0
      ? Math.round(((currentStepIndex + 1) / totalSteps) * 100)
      : 0;

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error for field if user modifies it
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Validate fields in current step before moving forward
  const validateCurrentStep = (): boolean => {
    if (!currentStep || !currentStep.fields) return true;

    const stepErrors: Record<string, string> = {};

    for (const field of currentStep.fields) {
      // Check conditional visibility
      if (field.conditional_rules?.visible_if) {
        const rule = field.conditional_rules.visible_if;
        if (typeof rule === "object" && rule.field) {
          const targetVal = formValues[rule.field];
          if (rule.equals !== undefined && targetVal !== rule.equals) {
            continue; // Skip validation if field is hidden
          }
        }
      }

      const val = formValues[field.name];
      const isRequired = field.validation_rules?.includes("required");

      if (isRequired) {
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0)
        ) {
          stepErrors[field.name] = `حقل "${field.label}" مطلوب`;
        }
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await api.generatePrompt(generator.slug, formValues);
      setGenerationResult(result);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        // Map backend validation errors (e.g., 'inputs.topic_title' -> 'topic_title')
        const mappedErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.errors)) {
          const fieldKey = key.replace(/^inputs\./, "");
          mappedErrors[fieldKey] = msgs[0];
        }
        setErrors(mappedErrors);
      } else {
        alert(
          err instanceof Error
            ? err.message
            : "حدث خطأ غير متوقع أثناء توليد الأمر"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (confirm("هل أنت متأكد من رغبتك في تفريغ النموذج والبدء من جديد؟")) {
      setFormValues({});
      setCurrentStepIndex(0);
      setErrors({});
      setGenerationResult(null);
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  if (!currentStep) {
    return (
      <div className="p-8 text-center text-slate-400">
        لا توجد خطوات متاحة لهذا الأمر الذكي حالياً.
      </div>
    );
  }

  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Wizard Progress & Steps Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-950/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              الخطوة {currentStepIndex + 1} من {totalSteps}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {currentStep.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus && (
              <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full">
                <Save className="h-3 w-3 text-emerald-400" />
                {saveStatus}
              </span>
            )}
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-l from-emerald-500 to-teal-400 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-slate-800/60">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (idx < currentStepIndex || validateCurrentStep()) {
                    setCurrentStepIndex(idx);
                  }
                }}
                className={cn(
                  "flex items-center gap-2.5 p-2 rounded-xl text-right transition-all text-xs font-medium",
                  isCurrent
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                    : isCompleted
                    ? "text-slate-300 hover:bg-slate-800/60"
                    : "text-slate-500 hover:text-slate-400"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all",
                    isCurrent
                      ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-500"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="truncate">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Fields Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-slate-950/50 flex flex-col gap-6"
      >
        {currentStep.description && (
          <p className="text-sm text-slate-400 pb-2 border-b border-slate-800">
            {currentStep.description}
          </p>
        )}

        {/* Dynamic Fields */}
        <div className="flex flex-col gap-6">
          {currentStep.fields?.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={formValues[field.name]}
              onChange={(val) => handleFieldChange(field.name, val)}
              error={errors[field.name]}
              allValues={formValues}
            />
          ))}
        </div>

        {/* Navigation & Submit Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
              >
                <ArrowRight className="h-4 w-4" />
                السابق
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-400 transition-colors"
              title="تفريغ الحقول والبدء من جديد"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              تفريغ
            </button>
          </div>

          <div>
            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-950/40 hover:bg-emerald-500 active:scale-95 transition-all"
              >
                التالي
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-base font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري هندسة الأمر التربوي...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    توليد الأمر الآن
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Output Modal / Deep Link Drawer */}
      <PromptResultModal
        result={generationResult}
        onClose={() => setGenerationResult(null)}
        onReset={() => {
          setGenerationResult(null);
          handleReset();
        }}
      />
    </div>
  );
}
