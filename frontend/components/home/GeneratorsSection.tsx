"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PromptGenerator } from "@/types";
import {
  Sparkles,
  Search,
  BookOpen,
  Target,
  Home,
  ShieldCheck,
  ArrowLeft,
  Layers,
  Calendar,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratorsSectionProps {
  initialGenerators?: PromptGenerator[];
}

interface GeneratorMeta {
  slug: string;
  defaultTitle: string;
  category: "all" | "content" | "initiative" | "environment" | "review";
  categoryLabel: string;
  stepCount: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  description: string;
  versionDate: string;
}

const GENERATOR_METAS: Record<string, GeneratorMeta> = {
  "educational-content": {
    slug: "educational-content",
    defaultTitle: "بناء محتوى تعليمي وقيمي",
    category: "content",
    categoryLabel: "محتوى تعليمي",
    stepCount: "3 خطوات",
    icon: BookOpen,
    tags: ["خطط دروس تفاعلية", "غرس القيم", "قصص تربوية", "أساليب تقويم"],
    description:
      "هندسة وصياغة محتوى تعليمي متكامل الأركان يدمج بين المعرفة والسلوك القيمي وفق مراحل المتعلمين.",
    versionDate: "تحديث معتمد",
  },
  "educational-initiative": {
    slug: "educational-initiative",
    defaultTitle: "تصميم مبادرة تربوية متكاملة",
    category: "initiative",
    categoryLabel: "مبادرات ومشاريع",
    stepCount: "2 خطوات",
    icon: Target,
    tags: ["مؤشرات الأثر", "خطة تنفيذية", "تحليل الاحتياج", "إدارة المخاطر"],
    description:
      "بناء وثيقة مبادرة ميدانية جاهزة للتطبيق مع آليات قياس الأثر وجداول الأنشطة التفصيلية.",
    versionDate: "تحديث معتمد",
  },
  "educational-environment": {
    slug: "educational-environment",
    defaultTitle: "تأسيس وإدارة محضن تربوي",
    category: "environment",
    categoryLabel: "بيئات ومحاضن",
    stepCount: "2 خطوات",
    icon: Home,
    tags: ["نوادي شبابية", "لقاءات دورية", "احتواء وجداني", "بناء قدوات"],
    description:
      "تصميم خطة تشغيلية متكاملة لبيئة تربوية جاذبة تراعي الخصائص العمرية وتنمي الانتماء والمهارات.",
    versionDate: "تحديث معتمد",
  },
  "ai-output-review": {
    slug: "ai-output-review",
    defaultTitle: "فحص وتدقيق مخرجات الذكاء الاصطناعي",
    category: "review",
    categoryLabel: "فحص وتدقيق AI",
    stepCount: "2 خطوات",
    icon: ShieldCheck,
    tags: ["أصالة قيمية", "سلامة تربوية", "فحص التحيزات", "توصيات تحسين"],
    description:
      "مراجعة نقدية دقيقة لأي محتوى مُولد بواسطة نماذج الذكاء الاصطناعي لضمان ملاءمته الأخلاقية والتربوية.",
    versionDate: "تحديث معتمد",
  },
};

const TABS = [
  { id: "all", label: "كافة المولدات" },
  { id: "content", label: "محتوى تعليمي" },
  { id: "initiative", label: "مبادرات تربوية" },
  { id: "environment", label: "محاضن وبيئات" },
  { id: "review", label: "فحص مخرجات AI" },
];

export function GeneratorsSection({
  initialGenerators = [],
}: GeneratorsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Merge API generator models with rich presentation metadata
  const cards = useMemo(() => {
    // If backend provided generators, match by slug; otherwise use defaults
    const list = Object.values(GENERATOR_METAS);
    return list.map((meta) => {
      const live = initialGenerators.find((g) => g.slug === meta.slug);
      return {
        slug: meta.slug,
        title: live?.title || meta.defaultTitle,
        short_description: live?.short_description || meta.description,
        stepCount: meta.stepCount,
        category: meta.category,
        categoryLabel: meta.categoryLabel,
        IconComponent: meta.icon,
        tags: meta.tags,
        versionDate: meta.versionDate,
      };
    });
  }, [initialGenerators]);

  // Filter based on tab and search
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesTab = activeTab === "all" || card.category === activeTab;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        card.title.toLowerCase().includes(q) ||
        card.short_description.toLowerCase().includes(q) ||
        card.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTab && matchesSearch;
    });
  }, [cards, activeTab, searchQuery]);

  return (
    <section id="generators" className="w-full relative">
      {/* Section Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              <span>مهندسو الأثر التربوي</span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                4 مولدات متخصصة
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              أدوات ذكية متخصصة لصياغة الأثر
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
              اختر المولد المناسب لاحتياجك، وأجب عن الأسئلة الإرشادية للحصول على أمر هندسي متكامل موجه لأقوى نماذج الذكاء الاصطناعي.
            </p>
          </div>

          {/* Search Input Filter */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في المولدات..."
              className="w-full rounded-2xl border border-slate-800 bg-[#0B1118]/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 border",
                  isActive
                    ? "bg-forest-900/90 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/30"
                    : "bg-[#0B1118]/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700/80 hover:bg-slate-900/60"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of 4 Cards */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCards.map((card) => {
            const Icon = card.IconComponent;

            return (
              <div
                key={card.slug}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0B1118]/75 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:bg-[#0E1520] hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.2),0_0_25px_-5px_rgba(16,185,129,0.15)]"
              >
                {/* Top Subtle Edge Illumination on Hover */}
                <div className="absolute top-0 right-10 left-10 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Bar: Backlit Icon in Frosted Square + Step Count Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    {/* Backlit Frosted Square Icon */}
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)] group-hover:scale-105 group-hover:border-emerald-400/60 group-hover:shadow-[0_0_25px_-2px_rgba(16,185,129,0.45)] transition-all duration-300">
                      <Icon className="h-6 w-6 text-emerald-300" />
                    </div>

                    {/* Step Count & Type Pill */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-1.5 rounded-full bg-forest-950/80 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
                        <Layers className="h-3 w-3 text-emerald-400" />
                        <span>{card.stepCount}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {card.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {card.title}
                  </h3>

                  {/* Short Description */}
                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {card.short_description}
                  </p>

                  {/* Summary Chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {card.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 group-hover:border-slate-700/60 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Version Date + [تخصيص الأمر مجاناً] Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="h-3 w-3 text-slate-600" />
                    <span>{card.versionDate}</span>
                  </div>

                  <Link
                    href={`/generators/${card.slug}`}
                    className="flex items-center gap-2 rounded-xl bg-forest-900/90 border border-emerald-500/40 px-3.5 py-2 text-xs font-bold text-emerald-300 shadow-sm shadow-emerald-950/40 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 active:scale-95 transition-all group-hover:shadow-[0_0_18px_rgba(16,185,129,0.3)]"
                  >
                    <span>تخصيص الأمر مجاناً</span>
                    <ArrowLeft className="h-3.5 w-3.5 group-hover:translate-x-[-3px] transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-[#0B1118]/50 p-12 text-center text-slate-400">
          لم يتم العثور على مولدات مطابقة لبحثك.
        </div>
      )}
    </section>
  );
}
