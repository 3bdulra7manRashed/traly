import Link from "next/link";
import { api } from "@/lib/api";
import { GeneratorCard } from "@/components/ui/GeneratorCard";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Article, PromptGenerator } from "@/types";
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Zap,
  BookOpen,
  CheckCircle2,
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
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Background Gradient Mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-sm shadow-emerald-950/40 backdrop-blur-md mb-6 animate-fadeIn">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>المنصة الأولى لهندسة الأوامر التربوية المتخصصة</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.2] mb-6">
            نوظف الذكاء الاصطناعي{" "}
            <span className="bg-gradient-to-l from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              في خدمة المربين وصناع الأثر
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mb-10">
            توليد أوامر ذكية، دقيقة، وموجهة للنماذج اللغوية الكبرى لإعداد الخطط التعليمية، المبادرات، وتأسيس المحاضن التربوية بأعلى المعايير القيمية.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/generators"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-emerald-950/60 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              استكشف الأوامر الذكية
            </Link>

            <Link
              href="/articles"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-7 py-3.5 text-base font-semibold text-slate-200 hover:border-slate-700 hover:bg-slate-850 hover:text-white transition-all"
            >
              <BookOpen className="h-5 w-5 text-slate-400" />
              المدونة والمعرفة
            </Link>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-3xl pt-10 border-t border-slate-800/80 text-right">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">أصالة قيمية</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  مصممة خصيصاً لتراعي السياق التربوي والأخلاقي
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Zap className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">تكامل فوري</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  روابط تشغيل مباشرة في ChatGPT و Claude و Gemini
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">نماذج تفاعلية</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  معالج إرشادي خطوة بخطوة يضمن شمولية المدخلات
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Generators Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              الأدوات الرئيسية
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              أوامر الذكاء الاصطناعي الجاهزة
            </h2>
          </div>

          <Link
            href="/generators"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            عرض كافة الأوامر
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {generators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generators.map((gen) => (
              <GeneratorCard key={gen.id} generator={gen} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
            جاري تهيئة الأوامر الذكية...
          </div>
        )}
      </section>

      {/* Latest Articles Section */}
      {articles.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <BookOpen className="h-4 w-4" />
                المعرفة والمدونة
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                أحدث المقالات والأدلة التربوية
              </h2>
            </div>

            <Link
              href="/articles"
              className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              استعراض كافة المقالات
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Call To Action Banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-8 sm:p-12 text-center">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-6">
              <Sparkles className="h-6 w-6" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              جاهز للارتقاء بإنتاجيتك التربوية؟
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
              اختر الأمر التربوي المناسب، املأ البيانات في ثوانٍ، واحصل على مخرج متكامل مصمم خصيصاً لأهدافك.
            </p>

            <Link
              href="/generators"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 active:scale-95 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              ابدأ الآن مجاناً
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
