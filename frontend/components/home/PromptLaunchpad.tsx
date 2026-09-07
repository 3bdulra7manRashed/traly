"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowUp,
  BookOpen,
  Building2,
  Target,
  SearchCheck,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryPill {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  slug: string;
}

const CATEGORIES: CategoryPill[] = [
  {
    id: "content",
    label: "محتوى تعليمي",
    icon: BookOpen,
    slug: "educational-content",
  },
  {
    id: "environment",
    label: "محضن تربوي",
    icon: Building2,
    slug: "educational-environment",
  },
  {
    id: "initiative",
    label: "مبادرة",
    icon: Target,
    slug: "educational-initiative",
  },
  {
    id: "review",
    label: "فحص مخرج AI",
    icon: SearchCheck,
    slug: "ai-output-review",
  },
];

const SUGGESTIONS = [
  {
    text: "خطة نشاط لغرس قيمة الصدق",
    categorySlug: "educational-content",
  },
  {
    text: "مبادرة تطوعية للمرحلة الثانوية",
    categorySlug: "educational-initiative",
  },
  {
    text: "مراجعة محتوى قصة تربوية بالأذكاء الاصطناعي",
    categorySlug: "ai-output-review",
  },
];

const PLACEHOLDERS = [
  "كيف أصمم محضناً تربوياً للناشئة؟",
  "أريد بناء درس تفاعلي لغرس قيمة الأمانة...",
  "صياغة مبادرة تطوعية موجهة لطلاب المرحلة الثانوية...",
  "مراجعة وفحص محتوى قصة تربوية بالذكاء الاصطناعي...",
];

export function PromptLaunchpad() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("content");
  const [promptText, setPromptText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fadePlaceholder, setFadePlaceholder] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cycling animated placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setFadePlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setFadePlaceholder(true);
      }, 300);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    const activeCat =
      CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
    const query = promptText.trim();
    if (query) {
      router.push(
        `/generators/${activeCat.slug}?topic=${encodeURIComponent(query)}`
      );
    } else {
      router.push(`/generators/${activeCat.slug}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectStarter = (text: string, categorySlug: string) => {
    setPromptText(text);
    const matched = CATEGORIES.find((c) => c.slug === categorySlug);
    if (matched) {
      setSelectedCategory(matched.id);
    }
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      {/* Main Frosted Launchpad Box */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border bg-[#0B1118]/85 p-5 sm:p-7 backdrop-blur-2xl transition-all duration-300 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7),0_0_35px_-8px_rgba(16,185,129,0.12)]",
          isFocused
            ? "border-emerald-500/50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_40px_-5px_rgba(16,185,129,0.22)] ring-1 ring-emerald-500/20"
            : "border-slate-800/90 hover:border-slate-700/80"
        )}
      >
        {/* Interior Muted Green Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-emerald-500/[0.05] via-emerald-950/[0.02] to-transparent pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-28 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Text Input Area */}
        <div className="relative min-h-[96px] sm:min-h-[110px] flex flex-col">
          <textarea
            ref={textareaRef}
            rows={3}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            className={cn(
              "w-full resize-none bg-transparent text-sm sm:text-base md:text-lg text-white font-sans placeholder:text-slate-500 focus:outline-none leading-relaxed transition-opacity duration-300",
              !promptText && !fadePlaceholder && "opacity-40"
            )}
          />
        </div>

        {/* Bottom Docked Toolbar */}
        <div className="relative mt-4 pt-4 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-3">
          {/* Category Filter Pills (Right RTL) */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "group flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 border",
                    isActive
                      ? "bg-forest-900/90 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/30"
                      : "bg-[#070B11]/70 border-slate-800/90 text-slate-400 hover:text-slate-200 hover:border-slate-700/80 hover:bg-slate-900/60"
                  )}
                >
                  {/* Glowing Emerald Token */}
                  <span
                    className={cn(
                      "flex h-2 w-2 rounded-full transition-all",
                      isActive
                        ? "bg-emerald-400 shadow-[0_0_8px_#10B981]"
                        : "bg-slate-600 group-hover:bg-slate-500"
                    )}
                  />
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 transition-colors",
                      isActive
                        ? "text-emerald-300"
                        : "text-slate-500 group-hover:text-slate-400"
                    )}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Send Circle Icon (Left RTL) */}
          <button
            type="button"
            onClick={handleSend}
            title="توليد الأمر التربوي"
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 active:scale-95",
              isFocused || promptText
                ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.4)] animate-pulse"
                : "bg-emerald-950/40 border-emerald-500/30 text-emerald-400/80 hover:bg-emerald-500/25 hover:border-emerald-500/60 hover:text-emerald-300"
            )}
          >
            <ArrowUp className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Suggestions Pill Starters */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1 px-1">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 ml-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400/70" />
          <span>مقترحات سريعة:</span>
        </span>

        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectStarter(item.text, item.categorySlug)}
            className="group flex items-center gap-2 rounded-full border border-slate-800/90 bg-[#0B1118]/60 px-4 py-1.5 text-xs text-slate-300 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-slate-900 hover:text-white hover:shadow-[0_4px_16px_rgba(16,185,129,0.12)]"
          >
            <Star className="h-3 w-3 text-emerald-400/80 group-hover:text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            <span>{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
