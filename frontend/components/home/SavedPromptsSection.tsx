"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { api } from "@/lib/api";
import { UserGenerationItem } from "@/types";
import { useToast } from "@/components/ui/Toast";
import {
  History,
  Sparkles,
  Search,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Download,
  Calendar,
  Layers,
  Eye,
  X,
  FileText,
  Bot,
  LogIn,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

// High-fidelity fallback/demo prompts for guests or initial preview
const DEMO_SAVED_PROMPTS: UserGenerationItem[] = [
  {
    id: 101,
    generator_id: 1,
    generator: {
      id: 1,
      title: "أمر بناء محتوى تعليمي وقيمي",
      slug: "educational-content",
      icon: "book-open",
      short_description: "خطة نشاط لغرس قيمة الأمانة والمراقبة الذاتية",
    },
    inputs_payload: {
      "المرحلة الدراسية": "المرحلة المتوسطة (12-15 سنة)",
      "الموضوع التربوي": "غرس قيمة الأمانة في المعاملات اليومية والتقنية",
      "أسلوب التقديم": "تعلُّم قائم على المشاريع وحل المشكلات التفاعلي",
      "المدة الزمنية": "45 دقيقة (حصة تفاعلية)",
    },
    compiled_prompt: `أنت خبير تصميم تعليمي وتربوي رفيع المستوى. مهمتك هي إعداد وصياغة محتوى تعليمي تفاعلي ومتكامل وفق البيانات التالية:

## بيانات المحتوى التعليمي:
- نوع المحتوى: خطة درس ونشاط قيمي
- عنوان الموضوع: غرس قيمة الأمانة في المعاملات اليومية والتقنية
- الفئة المستهدفة: المرحلة المتوسطة (12-15 سنة)
- أسلوب وطريقة التقديم: تعلُّم قائم على المشاريع وحل المشكلات التفاعلي

## الهدف التربوي والتعليمي:
تحويل مفهوم الأمانة من مجرد تعريف نظري إلى سلوك ومراقبة ذاتية في البيئة المدرسية، وحماية الممتلكات، واحترام الملكية الفكرية في الفضاء الرقمي.

## العناصر المطلوب تضمينها:
1. قصة استهلالية قصيرة تثير نقاشاً أخلاقياً (معضلة قيمية).
2. نشاط فرقي لحل معضلة استعارة هاتف أو حساب رقمي دون إذن.
3. ميثاق سلوكي يتفق عليه الطلاب يوضح ثمرات الأمانة على النفس والمجتمع.
4. أداة تقويم ذاتي (Rubric) يملأها المتعلم بصورة دورية.

## تعليمات الصياغة والمخرجات:
1. صياغة المخرجات بلغة عربية فصيحة، واضحة، وجذابة تناسب سن اليافعين.
2. مراعاة التدرج المعرفي والتفاعلي والبعد عن النبرة الوعظية المباشرة.
3. تقديم هيكل عملي للمربي يشمل توزيع الدقائق وأدوار المشاركين.`,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 102,
    generator_id: 2,
    generator: {
      id: 2,
      title: "تصميم مبادرة تطوعية للمرحلة الثانوية",
      slug: "educational-initiative",
      icon: "target",
      short_description: "مبادرة سفراء العطاء والمسؤولية المجتمعية",
    },
    inputs_payload: {
      "نطاق المبادرة": "المجتمع المدرسي والمحيط السكني",
      "المستهدفون": "طلاب المرحلة الثانوية (16-18 سنة)",
      "المجال": "العمل التطوعي والتكافل الاجتماعي",
      "مؤشر النجاح": "مشاركة 75% من الطلاب وإنجاز 200 ساعة تطوعية",
    },
    compiled_prompt: `أنت مستشار ريادة مجتمعية وتصميم مبادرات تربوية. الرجاء توليد وثيقة مبادرة ميدانية تنفيذية:

## عنوان المبادرة:
سفراء العطاء والمسؤولية المجتمعية لليافعين

## الأهداف الاستراتيجية:
1. تعزيز روح المبادرة والشعور بالمسؤولية الوطنية والمجتمعية لدى طلاب الثانوية.
2. إكساب الطلاب مهارات التخطيط والعمل الجماعي وإدارة الموارد.
3. تنفيذ مشاريع تطوعية ملموسة تخدم الفئات ذات الاحتياج في الحي المدرسي.

## الخطة الإجرائية ومؤشرات الأثر:
- مرحلة الإعداد وتدريب قادة الفرق (أسبوعان).
- مرحلة النزول الميداني وتنفيذ المبادرات (4 أسابيع).
- مرحلة التقييم وحفل التكريم واستخلاص الدروس (أسبوع).
- مؤشرات الأثر: عدد الساعات التطوعية الموثقة، نسبة رضا المستفيدين، تقييم الأثر السلوكي.`,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export function SavedPromptsSection() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [prompts, setPrompts] = useState<UserGenerationItem[]>(DEMO_SAVED_PROMPTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<UserGenerationItem | null>(null);
  const [showInputsForId, setShowInputsForId] = useState<number | null>(null);
  const [isLiveUser, setIsLiveUser] = useState(false);

  // If user is logged in, attempt to fetch their live saved generations
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      api
        .getUserGenerations({ search: searchQuery })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setPrompts(res.data);
            setIsLiveUser(true);
          } else {
            // Keep demo prompts as fallback with note
            setPrompts(DEMO_SAVED_PROMPTS);
            setIsLiveUser(false);
          }
        })
        .catch(() => {
          setPrompts(DEMO_SAVED_PROMPTS);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, searchQuery]);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast("تم نسخ الأمر التربوي بنجاح إلى الحافظة", "success");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExport = (item: UserGenerationItem, format: "txt" | "md") => {
    const filename = `${item.generator?.slug || "prompt"}-${item.id}.${format}`;
    const header = `# أمر تربوي من منصة ترالي\n# المولد: ${item.generator?.title || ""}\n# تاريخ التوليد: ${formatDate(item.created_at)}\n\n`;
    const content = format === "md" ? `${header}${item.compiled_prompt}` : `${item.compiled_prompt}`;

    // UTF-8 BOM ensures Arabic opens properly in Windows Notepad
    const blob = new Blob(["\uFEFF" + content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast(`تم تحميل الأمر كملف ${format.toUpperCase()} بنجاح`, "info");
  };

  const getAiUrl = (ai: "chatgpt" | "claude" | "gemini", prompt: string) => {
    const encoded = encodeURIComponent(prompt);
    switch (ai) {
      case "chatgpt":
        return `https://chatgpt.com/?q=${encoded}`;
      case "claude":
        return `https://claude.ai/new?q=${encoded}`;
      case "gemini":
        return `https://gemini.google.com/app`;
    }
  };

  const filteredPrompts = prompts.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.generator?.title?.toLowerCase().includes(q) ||
      item.compiled_prompt.toLowerCase().includes(q) ||
      Object.values(item.inputs_payload || {}).some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  });

  return (
    <section id="saved-prompts" className="w-full relative">
      {/* Header with Search and Badges */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <History className="h-4 w-4" />
            <span>لوحة التحكم المعرفية</span>
            <span className="rounded-full bg-forest-900/80 border border-emerald-500/30 px-3 py-0.5 text-[11px] font-bold text-emerald-300">
              {filteredPrompts.length} أمر محفوظ
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            أوامري المحفوظة
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            استعرض أوامرك التربوية السابقة، شغّلها بضغطة زر في نماذج الذكاء الاصطناعي المفضلة، أو أعد تحرير مدخلاتها.
          </p>
        </div>

        {/* Search Bar & Auth status note */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في الأوامر المحفوظة..."
              className="w-full rounded-2xl border border-slate-800 bg-[#0B1118]/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>

          {!user && (
            <Link
              href="/login?redirect=/#saved-prompts"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-[#0B1118]/80 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:border-emerald-500/40 hover:text-white transition-all whitespace-nowrap"
            >
              <LogIn className="h-3.5 w-3.5 text-emerald-400" />
              <span>تسجيل الدخول للمزامنة</span>
            </Link>
          )}
        </div>
      </div>

      {/* Guest Mode Explanatory Pill */}
      {!user && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-forest-700/40 bg-forest-950/40 px-5 py-3 text-xs text-slate-300 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>وضع المعاينة التفاعلي:</strong> يتم استعراض نماذج واقعية من الأوامر المحفوظة. سجّل دخولك لحفظ وتخصيص أوامرك الشخصية.
            </span>
          </div>
          <Link
            href="/register"
            className="text-emerald-400 hover:text-emerald-300 font-bold whitespace-nowrap underline underline-offset-4"
          >
            إنشاء حساب مجاني ←
          </Link>
        </div>
      )}

      {/* Grid of Saved Prompt Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrompts.map((item) => {
          const inputsEntries = Object.entries(item.inputs_payload || {});
          const isInputsExpanded = showInputsForId === item.id;

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0B1118]/80 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-slate-700/80 hover:bg-[#0E1520] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col gap-4">
                {/* Header: Generator Icon + Title + Date */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-900/70 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
                      <Bot className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.generator?.title || "أمر تربوي متقدم"}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <Calendar className="h-3 w-3 text-slate-600" />
                        <span>{formatDate(item.created_at)}</span>
                        <span className="text-slate-700">•</span>
                        <span className="text-emerald-400/80 font-medium">جاهز للتشغيل</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Inputs Payload Details */}
                  {inputsEntries.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowInputsForId(isInputsExpanded ? null : item.id)
                      }
                      className={cn(
                        "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-all",
                        isInputsExpanded
                          ? "bg-forest-900/90 border-emerald-500/40 text-emerald-300"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700"
                      )}
                    >
                      <SlidersHorizontal className="h-3 w-3" />
                      <span>المدخلات</span>
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-transform duration-200",
                          isInputsExpanded && "rotate-180"
                        )}
                      />
                    </button>
                  )}
                </div>

                {/* Summary Chips (Preview) */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {inputsEntries.slice(0, 3).map(([key, val], idx) => {
                    const displayVal =
                      typeof val === "string"
                        ? val
                        : Array.isArray(val)
                        ? val.join("، ")
                        : JSON.stringify(val);

                    return (
                      <span
                        key={idx}
                        className="max-w-[220px] truncate rounded-lg bg-slate-900/90 border border-slate-800/90 px-2.5 py-1 text-[11px] font-medium text-slate-300"
                        title={`${key}: ${displayVal}`}
                      >
                        <span className="text-emerald-400/70 ml-1">✦</span>
                        {displayVal}
                      </span>
                    );
                  })}
                </div>

                {/* Expandable Detailed Inputs Area */}
                {isInputsExpanded && (
                  <div className="rounded-2xl border border-forest-700/40 bg-[#070B11]/90 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-[11px] font-bold text-emerald-400 mb-2.5">
                      تفاصيل المدخلات والإجابات التربوية:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {inputsEntries.map(([key, val], idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-2.5 flex flex-col gap-0.5"
                        >
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {key}
                          </span>
                          <span className="text-slate-200 font-medium">
                            {String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compiled Prompt Snippet Monospace Container */}
                <div className="relative rounded-2xl border border-slate-800/90 bg-[#070B11] p-4 text-xs text-slate-300 font-mono leading-relaxed shadow-inner">
                  <p className="line-clamp-3 select-none text-slate-400">
                    {item.compiled_prompt}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedPrompt(item)}
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>عرض نص الأمر بالكامل والمحرر</span>
                    </button>
                    <span className="text-[10px] text-slate-600">
                      {item.compiled_prompt.length} حرف
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                {/* 1. Copy Prompt & Download Files */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.compiled_prompt, item.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-forest-900/90 border border-emerald-500/40 px-3.5 py-2 text-xs font-bold text-emerald-300 shadow-sm hover:bg-forest-800 hover:border-emerald-500/60 transition-all active:scale-95"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>نسخ الأمر</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExport(item, "txt")}
                    className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                    title="تحميل كملف نصي TXT"
                  >
                    <Download className="h-3 w-3" />
                    <span>TXT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExport(item, "md")}
                    className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                    title="تحميل كملف Markdown"
                  >
                    <FileText className="h-3 w-3" />
                    <span>MD</span>
                  </button>
                </div>

                {/* 2. Quick AI Runners + Edit Answers */}
                <div className="flex items-center gap-2">
                  <a
                    href={getAiUrl("chatgpt", item.compiled_prompt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-emerald-950/60 hover:border-emerald-500/40 hover:text-emerald-300 transition-all"
                    title="تشغيل مباشر في ChatGPT"
                  >
                    <span>ChatGPT</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>

                  <a
                    href={getAiUrl("claude", item.compiled_prompt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-emerald-950/60 hover:border-emerald-500/40 hover:text-emerald-300 transition-all"
                    title="تشغيل مباشر في Claude"
                  >
                    <span>Claude</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>

                  <a
                    href={getAiUrl("gemini", item.compiled_prompt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-emerald-950/60 hover:border-emerald-500/40 hover:text-emerald-300 transition-all"
                    title="تشغيل مباشر في Gemini"
                  >
                    <span>Gemini</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>

                  {item.generator?.slug && (
                    <Link
                      href={`/generators/${item.generator.slug}?repopulate_id=${item.id}`}
                      className="flex items-center gap-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/40 transition-all"
                      title="تعديل الإجابات وإعادة التوليد"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>تعديل</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Prompt Inspector Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B11]/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-[#0B1118] p-6 sm:p-8 shadow-2xl flex flex-col gap-5 max-h-[88vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-900/80 border border-emerald-500/30 text-emerald-400">
                  <Bot className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedPrompt.generator?.title || "الأمر التربوي المُولّد"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تاريخ التوليد: {formatDate(selectedPrompt.created_at)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPrompt(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Monospace Prompt Body */}
            <div className="flex-1 overflow-y-auto rounded-2xl bg-[#070B11] p-5 border border-slate-800/90 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {selectedPrompt.compiled_prompt}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(selectedPrompt.compiled_prompt, selectedPrompt.id)
                  }
                  className="flex items-center gap-2 rounded-xl bg-forest-900 border border-emerald-500/40 px-5 py-2.5 text-xs font-bold text-emerald-300 shadow-sm hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <Copy className="h-4 w-4" />
                  <span>نسخ الأمر كاملاً</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport(selectedPrompt, "md")}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>تحميل كملف Markdown</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getAiUrl("chatgpt", selectedPrompt.compiled_prompt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-emerald-950/70 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
                >
                  <span>تشغيل في ChatGPT</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
