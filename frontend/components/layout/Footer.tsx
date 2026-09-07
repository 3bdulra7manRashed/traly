import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Mail, ArrowUpRight, Compass, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-slate-800/80 bg-[#070B11] text-slate-400 overflow-hidden">
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 matrix-pattern pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-600/15 to-emerald-950/40 border border-emerald-500/35 text-emerald-400 shadow-[0_0_20px_-4px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  تـرالـي
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse"></span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  منصة هندسة الأوامر التربوية المتخصصة
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md pt-1">
              نُمكّن المعلمين، المربين، وصناع الأثر من استثمار الذكاء الاصطناعي بكفاءة وبأعلى المعايير القيمية والتعليمية لصياغة حلول تعليمية ذات أثر حقيقي ومستدام.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>أصالة قيمية ومعرفية معتمدة</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-slate-300">
                <Compass className="h-3.5 w-3.5 text-teal-400" />
                <span>مخرجات متوافقة مع النماذج الكبرى</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Generators */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              الأدوات والمولدات
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link
                  href="/generators/educational-content"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>بناء محتوى تعليمي</span>
                  <ArrowUpRight className="h-3 w-3 opacity-40" />
                </Link>
              </li>
              <li>
                <Link
                  href="/generators/educational-initiative"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>بناء مبادرة تربوية</span>
                  <ArrowUpRight className="h-3 w-3 opacity-40" />
                </Link>
              </li>
              <li>
                <Link
                  href="/generators/educational-environment"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>بناء محضن تربوي</span>
                  <ArrowUpRight className="h-3 w-3 opacity-40" />
                </Link>
              </li>
              <li>
                <Link
                  href="/generators/ai-output-review"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>مراجعة مخرجات الذكاء</span>
                  <ArrowUpRight className="h-3 w-3 opacity-40" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Knowledge & Articles */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              المعرفة التربوية
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link
                  href="/articles"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                  <span>المدونة والأدلة</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/articles?category=education-and-ai"
                  className="hover:text-emerald-400 transition-colors"
                >
                  التربية والذكاء الاصطناعي
                </Link>
              </li>
              <li>
                <Link
                  href="/articles?category=curriculum-and-instructional-design"
                  className="hover:text-emerald-400 transition-colors"
                >
                  بناء المناهج وتصميم التعليم
                </Link>
              </li>
              <li>
                <Link
                  href="/articles?category=educational-environments-management"
                  className="hover:text-emerald-400 transition-colors"
                >
                  إدارة المحاضن التربوية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Platform */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              التواصل والدعم
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <a
                  href="mailto:contact@traly.sa"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors text-slate-300"
                >
                  <Mail className="h-3.5 w-3.5 text-emerald-500" />
                  contact@traly.sa
                </a>
              </li>
              <li className="pt-2">
                <p className="text-[11px] text-slate-500 leading-normal">
                  فريق ترالي يسعد بالتعاون مع المؤسسات التعليمية والمراكز التربوية لتخصيص أدوات الذكاء الاصطناعي.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} منصة ترالي (Trali). جميع الحقوق محفوظة لخدمة التربية والتعليم.</p>
          <div className="flex items-center gap-1.5">
            <span>صُممت بعناية</span>
            <Heart className="h-3.5 w-3.5 text-rose-500/80 fill-rose-500/80" />
            <span>لصُنّاع الأثر التربوي الأصيل</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

