import React from "react";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { DynamicFormRenderer } from "@/components/generator/DynamicFormRenderer";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface GeneratorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: GeneratorPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const generator = await api.getGenerator(slug);
    return {
      title: `${generator.title} | ترالي`,
      description:
        generator.short_description ||
        "قم بتخصيص وهندسة أمر تربوي عالي الجودة للذكاء الاصطناعي.",
    };
  } catch {
    return {
      title: "الأمر الذكي | ترالي",
    };
  }
}

export default async function GeneratorDetailPage({
  params,
}: GeneratorPageProps) {
  const { slug } = await params;

  let generator;
  try {
    generator = await api.getGenerator(slug);
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/generators" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
          <ArrowRight className="h-3.5 w-3.5" />
          مكتبة الأوامر
        </Link>
        <span>/</span>
        <span className="text-slate-200">{generator.title}</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-3 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300 mx-auto">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>معالج هندسة الأمر التربوي</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {generator.title}
        </h1>
        {generator.short_description && (
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {generator.short_description}
          </p>
        )}
      </div>

      {/* Dynamic Multi-Step Form Wizard */}
      <DynamicFormRenderer generator={generator} />
    </div>
  );
}
