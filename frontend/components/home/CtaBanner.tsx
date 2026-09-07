"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck, Zap, Layers } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="w-full relative">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0B1118] via-[#0E1722] to-forest-950/70 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)]">
        {/* Soft Emerald Glow Orbs */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-80 h-80 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 matrix-pattern pointer-events-none opacity-[0.03]" />

        {/* Top Edge Highlight */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        <div className="relative max-w-2xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-forest-900/80 px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-md shadow-emerald-950/50 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>ابدأ مجاناً اليوم وانضم لنخبة المربين</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 leading-snug">
            ارتقِ بتجربتك التعليمية مع الذكاء الاصطناعي
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-xl">
            أنشئ حسابك المجاني في منصة ترالي لحفظ جميع أوامرك، وإعادة تحريرها، وتصديرها بصيغ متعددة بنقرة واحدة.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-950/60 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4 text-emerald-200" />
              <span>أنشئ حسابك مجاناً</span>
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-[-3px]" />
            </Link>

            <Link
              href="/generators"
              className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-[#070B11]/80 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-700 hover:bg-slate-900 hover:text-white transition-all"
            >
              <span>استكشف المولدات</span>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>بدون بطاقة ائتمان</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>تكامل مباشر مع النماذج الكبرى</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>حفظ غير محدود للأوامر</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
