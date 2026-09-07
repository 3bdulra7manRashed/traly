import React from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { PromptGenerator, Article } from "@/types";
import { PromptLaunchpad } from "@/components/home/PromptLaunchpad";
import { GeneratorsSection } from "@/components/home/GeneratorsSection";
import { SavedPromptsSection } from "@/components/home/SavedPromptsSection";
import { KnowledgeHubSection } from "@/components/home/KnowledgeHubSection";
import { CtaBanner } from "@/components/home/CtaBanner";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Compass,
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  let generators: PromptGenerator[] = [];
  let articles: Article[] = [];

  try {
    const [generatorsData, articlesResponse] = await Promise.all([
      api.getGenerators().catch(() => []),
      api.getArticles({ page: 1 }).catch(() => ({ success: true, data: [] })),
    ]);
    generators = generatorsData;
    articles = articlesResponse.data || [];
  } catch (err) {
    console.error("Error fetching homepage data:", err);
  }

  return (
    <div className="relative min-h-screen bg-[#070B11] text-slate-100 overflow-hidden flex flex-col gap-24 pb-24">
      {/* Background Matrix Pattern Texture (4% opacity across entire page) */}
      <div className="fixed inset-0 matrix-pattern pointer-events-none z-0" />

      {/* =========================================================================
          HERO SECTION: Neural Glow Mesh Gradient & LLM Prompt-Search Launchpad
          ========================================================================= */}
      <section className="relative pt-12 pb-8 md:pt-20 md:pb-14 overflow-hidden z-10">
        {/* Dynamic Neural Mesh Glow Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[550px] sm:h-[650px] neural-mesh-hero pointer-events-none animate-glow-slow" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] neural-orb-emerald blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[380px] h-[380px] neural-orb-cobalt blur-[140px] pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center max-w-5xl">
          {/* Subtle Dignified Pre-title Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-[#0B1118]/80 px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-md shadow-emerald-950/40 backdrop-blur-xl mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>المنصة الأولى لهندسة الأوامر التربوية المتخصصة</span>
          </div>

          {/* Main Headline (Bold, High-Contrast) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.2] mb-6">
            أدوات ذكية تصنع{" "}
            <span className="bg-gradient-to-l from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              أثراً تربوياً حقيقياً
            </span>
          </h1>

          {/* Subtitle from image_6.png text area */}
          <p className="text-sm sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mb-10 font-normal">
            منصة رائدة تمكّن المربين والمعلمين من هندسة وتوليد أوامر ذكاء اصطناعي موجهة بدقة للنماذج اللغوية الكبرى، لبناء المحتوى القيمي، وتأسيس المحاضن، وإطلاق المبادرات بأعلى المعايير التربوية.
          </p>

          {/* LLM Prompt-Search Launchpad with Suggestions Starters */}
          <PromptLaunchpad />

          {/* Micro Value Props Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 w-full max-w-4xl pt-8 border-t border-slate-800/80 text-right">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0B1118]/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-900/80 border border-emerald-500/30 text-emerald-400 flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">أصالة قيمية ومعرفية</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed">
                  أوامر مصممة خصيصاً لتراعي السياق التربوي والأخلاقي الموثوق.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0B1118]/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-900/80 border border-emerald-500/30 text-teal-400 flex-shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">تكامل مباشر مع LLMs</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed">
                  روابط تشغيل فورية بنقرة واحدة في ChatGPT و Claude و Gemini.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0B1118]/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-900/80 border border-emerald-500/30 text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">معالج إرشادي ذكي</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed">
                  خطوات تفاعلية تضمن دقة وشمولية مدخلاتك التربوية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GENERATORS SECTION: مهندسو الأثر... Detailed 4-Card Architecture
          ========================================================================= */}
      <section className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <GeneratorsSection initialGenerators={generators} />
      </section>

      {/* =========================================================================
          SAVED PROMPTS DASHBOARD: أوامري المحفوظة Complex Architecture
          ========================================================================= */}
      <section className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SavedPromptsSection />
      </section>

      {/* =========================================================================
          KNOWLEDGE HUB SECTION: أحدث المعارف والخبرات التربوية (16:9 Editorial)
          ========================================================================= */}
      <section className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <KnowledgeHubSection articles={articles} />
      </section>

      {/* =========================================================================
          MINIMAL CTA BANNER: Soft Emerald Glow Invitation
          ========================================================================= */}
      <section className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <CtaBanner />
      </section>
    </div>
  );
}

