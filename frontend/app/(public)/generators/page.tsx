import React from "react";
import { api } from "@/lib/api";
import { GeneratorCard } from "@/components/ui/GeneratorCard";
import { Sparkles } from "lucide-react";
import { PromptGenerator } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأوامر الذكية | منصة ترالي",
  description: "استعرض كافة أوامر الذكاء الاصطناعي التربوية المتخصصة لبناء المحتوى، المبادرات، والمحاضن.",
};

export const revalidate = 60;

export default async function GeneratorsPage() {
  let generators: PromptGenerator[] = [];

  try {
    generators = await api.getGenerators();
  } catch (err) {
    console.error("Error fetching generators:", err);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 w-fit">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>مكتبة الأوامر التربوية</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          أوامر الذكاء الاصطناعي المتخصصة
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          اختر الأمر التربوي المناسب لاحتياجك، واتبع المعالج الإرشادي لتوليد أمر متقن وجاهز للاستخدام الفوري.
        </p>
      </div>

      {/* Grid */}
      {generators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generators.map((gen) => (
            <GeneratorCard key={gen.id} generator={gen} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          لا توجد أوامر متاحة حالياً.
        </div>
      )}
    </div>
  );
}
