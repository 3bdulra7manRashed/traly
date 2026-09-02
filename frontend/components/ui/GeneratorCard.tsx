import React from "react";
import Link from "next/link";
import { PromptGenerator } from "@/types";
import {
  BookOpen,
  Lightbulb,
  Home,
  BadgeCheck,
  Sparkles,
  ArrowLeft,
  Layers,
} from "lucide-react";

interface GeneratorCardProps {
  generator: PromptGenerator;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "book-open": BookOpen,
  "light-bulb": Lightbulb,
  home: Home,
  "check-badge": BadgeCheck,
  sparkles: Sparkles,
};

export function GeneratorCard({ generator }: GeneratorCardProps) {
  const IconComponent =
    (generator.icon && iconMap[generator.icon]) || Sparkles;

  return (
    <Link
      href={`/generators/${generator.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-emerald-950/30"
    >
      {/* Top Accent Glow */}
      <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header with Icon and Badge */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 group-hover:border-emerald-500/60 group-hover:scale-105 transition-all">
            <IconComponent className="h-6 w-6" />
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-700/60">
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            <span>جاهز للاستخدام</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
          {generator.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-400 leading-relaxed line-clamp-2">
          {generator.short_description ||
            "قم بتخصيص وتوليد أمر تربوي عالي الجودة للذكاء الاصطناعي."}
        </p>
      </div>

      {/* Footer Action */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
        <span>بدء هندسة الأمر</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:translate-x-[-4px] transition-all">
          <ArrowLeft className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
