"use client";

import React, { useState, useEffect, useTransition } from "react";
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
  Trash2,
  Calendar,
  Layers,
  Eye,
  X,
  FileText,
  Bot,
  AlertCircle,
  LogIn,
  UserPlus,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  const [generations, setGenerations] = useState<UserGenerationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<UserGenerationItem | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [generationToDelete, setGenerationToDelete] = useState<UserGenerationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch generations
  const loadGenerations = async (search = "") => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.getUserGenerations({ search });
      setGenerations(res.data || []);
      setTotalCount(res.meta?.total || (res.data || []).length);
    } catch (err) {
      console.error("Failed to load prompt generations:", err);
      toast("فشل تحميل سجل الأوامر", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadGenerations(searchQuery);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadGenerations(searchQuery);
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast("تم نسخ الأمر التربوي إلى الحافظة بنجاح!", "success");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExport = (item: UserGenerationItem, format: "txt" | "md") => {
    const filename = `${item.generator?.slug || "prompt"}-${item.id}.${format}`;
    const header = `# أمر تربوي من منصة ترالي\n# المولد: ${item.generator?.title || ""}\n# تاريخ التوليد: ${formatDate(item.created_at)}\n\n`;
    const content = format === "md" ? `${header}${item.compiled_prompt}` : `${item.compiled_prompt}`;

    // UTF-8 BOM ensures Arabic opens correctly in Windows Notepad
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

    toast(`تم تصدير الأمر كملف ${format.toUpperCase()} بنجاح`, "info");
  };

  const handleDelete = async () => {
    if (!generationToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteUserGeneration(generationToDelete.id);
      setGenerations((prev) => prev.filter((g) => g.id !== generationToDelete.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      toast("تم حذف الأمر من سجلك بنجاح", "success");
      setGenerationToDelete(null);
    } catch (err) {
      toast("فشل حذف الأمر من السجل", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Launch links
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

  // If still checking auth
  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span className="text-sm">جاري التحقق من الحساب...</span>
        </div>
      </div>
    );
  }

  // 1. Guest View (Not Authenticated CTA)
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-14 text-center backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl shadow-emerald-950/50">
            <History className="h-8 w-8" />
          </div>

          <div className="max-w-xl flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              سجل الأوامر التربوية المحفوظة
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              سجّل دخولك أو أنشئ حساباً مجانياً لحفظ جميع أوامرك الذكية، والرجوع إليها في أي وقت، وتعديل إجاباتها، أو تصديرها بنقرة واحدة.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/login?redirect=/history"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
            >
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </Link>
            <Link
              href="/register?redirect=/history"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <UserPlus className="h-4 w-4" />
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Educator View
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 max-w-6xl">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <History className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              سجل الأوامر التربوية
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-300">
              {totalCount} أمر محفوظ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            استعرض الأوامر التي قمت بتوليدها مسبقاً، وشغلها في الذكاء الاصطناعي أو أعد تحريرها.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الأوامر المحفوظة..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 animate-pulse"
            />
          ))}
        </div>
      ) : generations.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto my-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
            <Sparkles className="h-8 w-8 text-emerald-400/60" />
          </div>
          <h2 className="text-lg font-bold text-white">لا توجد أوامر محفوظة حتى الآن</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {searchQuery
              ? `لم يتم العثور على نتائج مطابقة لـ "${searchQuery}". جرب البحث بكلمات أخرى.`
              : "لم تقم بتوليد أوامر ذكية بعد. اختر أحد المولدات المتخصصة لتصميم أمرك الأول وحفظه هنا."}
          </p>
          <Link
            href="/generators"
            className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            استكشف مولدات الأوامر
          </Link>
        </div>
      ) : (
        /* Grid of Generation Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {generations.map((item) => {
            const inputsEntries = Object.entries(item.inputs_payload || {}).slice(0, 3);

            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all duration-200 flex flex-col justify-between gap-5"
              >
                <div className="flex flex-col gap-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">
                          {item.generator?.title || "أمر تربوي مخصص"}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGenerationToDelete(item)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="حذف من السجل"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Input Summary Chips */}
                  {inputsEntries.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {inputsEntries.map(([key, val], idx) => {
                        const displayVal =
                          typeof val === "string"
                            ? val
                            : Array.isArray(val)
                            ? val.join("، ")
                            : JSON.stringify(val);

                        return (
                          <span
                            key={idx}
                            className="max-w-[200px] truncate rounded-lg bg-slate-950/80 border border-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300"
                            title={displayVal}
                          >
                            {displayVal}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Prompt Preview Snippet */}
                  <div className="relative rounded-xl border border-slate-800/80 bg-slate-950 p-3 text-xs text-slate-300 leading-relaxed font-mono">
                    <p className="line-clamp-3">
                      {item.compiled_prompt}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedPrompt(item)}
                      className="mt-2 text-[11px] font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      عرض الأمر بالكامل
                    </button>
                  </div>
                </div>

                {/* Card Action Toolbar */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* 1. Copy Prompt */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item.compiled_prompt, item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          تم النسخ
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          نسخ الأمر
                        </>
                      )}
                    </button>

                    {/* 2. Export options */}
                    <button
                      type="button"
                      onClick={() => handleExport(item, "txt")}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="تصدير كملف TXT"
                    >
                      <Download className="h-3.5 w-3.5" />
                      TXT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport(item, "md")}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="تصدير كملف Markdown"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      MD
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* 3. AI Quick Launch Dropdown/Buttons */}
                    <a
                      href={getAiUrl("chatgpt", item.compiled_prompt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-200 hover:bg-emerald-600 hover:text-white transition-colors"
                      title="تشغيل في ChatGPT"
                    >
                      <span>ChatGPT</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <a
                      href={getAiUrl("claude", item.compiled_prompt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-200 hover:bg-emerald-600 hover:text-white transition-colors"
                      title="تشغيل في Claude"
                    >
                      <span>Claude</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    {/* 4. Edit & Re-run */}
                    {item.generator?.slug && (
                      <Link
                        href={`/generators/${item.generator.slug}?repopulate_id=${item.id}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="تعديل الإجابات وإعادة التوليد"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        تعديل
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Prompt Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedPrompt.generator?.title || "الأمر التربوي المُولّد"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    تم التوليد في {formatDate(selectedPrompt.created_at)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPrompt(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-950 p-4 sm:p-6 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {selectedPrompt.compiled_prompt}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(selectedPrompt.compiled_prompt, selectedPrompt.id)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
                >
                  <Copy className="h-4 w-4" />
                  نسخ الأمر بالكامل
                </button>
                <button
                  type="button"
                  onClick={() => handleExport(selectedPrompt, "md")}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  تحميل كملف Markdown
                </button>
              </div>

              {selectedPrompt.generator?.slug && (
                <Link
                  href={`/generators/${selectedPrompt.generator.slug}?repopulate_id=${selectedPrompt.id}`}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <Edit3 className="h-4 w-4" />
                  تعديل الإجابات وإعادة التوليد
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {generationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">تأكيد حذف الأمر من السجل</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا الأمر من سجلك التربوي؟ لا يمكن التراجع عن هذه الخطوة.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setGenerationToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "جاري الحذف..." : "نعم، احذف الأمر"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
