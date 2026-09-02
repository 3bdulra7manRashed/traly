"use client";

import React, { useState } from "react";
import { PromptGenerationResult } from "@/types";
import {
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Bot,
  Zap,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface PromptResultModalProps {
  result: PromptGenerationResult | null;
  onClose: () => void;
  onReset: () => void;
}

export function PromptResultModal({
  result,
  onClose,
  onReset,
}: PromptResultModalProps) {
  const [copied, setCopied] = useState(false);
  const [geminiToast, setGeminiToast] = useState(false);

  if (!result) return null;

  const promptText = result.compiled_prompt;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleOpenGemini = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setGeminiToast(true);
      setTimeout(() => setGeminiToast(false), 4000);
      window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to copy for Gemini:", err);
      window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
    }
  };

  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptText)}`;
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(promptText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                تم توليد الأمر التربوي بنجاح!
              </h2>
              <p className="text-xs text-slate-400">
                أمرك الذكي جاهز للاستخدام المباشر في نماذج الذكاء الاصطناعي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Prompt Content Box */}
        <div className="my-5 flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/80 p-5">
          <pre className="font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-all font-normal">
            {promptText}
          </pre>
        </div>

        {/* Gemini Toast Notification */}
        {geminiToast && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-teal-900/40 border border-teal-500/40 px-4 py-2.5 text-xs text-teal-200 animate-fadeIn">
            <Check className="h-4 w-4 text-teal-400" />
            <span>تم نسخ الأمر تلقائياً للحافظة! يمكنك الآن لصقه مباشرة في Gemini.</span>
          </div>
        )}

        {/* Deep Linking Launchers & Copy Bar */}
        <div className="flex flex-col gap-4 pt-2">
          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-200" />
                  تم النسخ بنجاح!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  نسخ الأمر بالكامل
                </>
              )}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                تعديل الإجابات
              </button>

              <button
                onClick={onReset}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs font-medium text-slate-400 hover:text-rose-300 hover:border-rose-900/40 transition-colors"
                title="بدء أمر جديد من البداية"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                أمر جديد
              </button>
            </div>
          </div>

          {/* Quick AI Launchers */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
            <p className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-emerald-400" />
              تشغيل فوري في منصات الذكاء الاصطناعي:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={chatGptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:border-emerald-500/50 hover:bg-slate-850 hover:text-white transition-all"
              >
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                فتح في ChatGPT
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </a>

              <a
                href={claudeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:border-amber-500/50 hover:bg-slate-850 hover:text-white transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                فتح في Claude
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </a>

              <button
                type="button"
                onClick={handleOpenGemini}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:border-teal-500/50 hover:bg-slate-850 hover:text-white transition-all"
              >
                <Bot className="h-3.5 w-3.5 text-teal-400" />
                فتح في Gemini (نسخ ولصق)
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
