import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-900/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                تـرالـي
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              منصة هندسة الأوامر التربوية المتخصصة. نُمكّن المعلمين، المربين، وصناع الأثر من استثمار الذكاء الاصطناعي بكفاءة وبأعلى المعايير القيمية والتعليمية.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>محتوى تربوي موثوق ومفحوص بالكامل</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white tracking-wider">
              الأوامر الذكية
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link
                  href="/generators/educational-content"
                  className="hover:text-emerald-400 transition-colors"
                >
                  بناء محتوى تعليمي
                </Link>
              </li>
              <li>
                <Link
                  href="/generators/educational-initiative"
                  className="hover:text-emerald-400 transition-colors"
                >
                  بناء مبادرة تربوية
                </Link>
              </li>
              <li>
                <Link
                  href="/generators/educational-environment"
                  className="hover:text-emerald-400 transition-colors"
                >
                  بناء محضن تربوي
                </Link>
              </li>
              <li>
                <Link
                  href="/generators/ai-output-review"
                  className="hover:text-emerald-400 transition-colors"
                >
                  مراجعة مخرجات الذكاء
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white tracking-wider">
              المعرفة والتواصل
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link
                  href="/articles"
                  className="hover:text-emerald-400 transition-colors"
                >
                  المدونة التربوية
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@traly.sa"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="h-4 w-4 text-slate-500" />
                  contact@traly.sa
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} منصة ترالي (Trali). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1">
            <span>صُنع بعناية</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>لخدمة التعليم والمربين</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
