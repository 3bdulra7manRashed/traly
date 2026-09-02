"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { PromptGenerator } from "@/types";
import { useToast } from "@/components/ui/Toast";
import {
  Sparkles,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  X,
  Layers,
  RefreshCw,
} from "lucide-react";

export default function AdminGeneratorsPage() {
  const [generators, setGenerators] = useState<PromptGenerator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const loadGenerators = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminGenerators({
        search: search || undefined,
      });
      setGenerators(data);
    } catch (err) {
      console.error(err);
      toast("فشل تحميل قائمة الأوامر الذكية", "error");
    } finally {
      setIsLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    loadGenerators();
  }, [loadGenerators]);

  const handleToggleActive = async (gen: PromptGenerator) => {
    setTogglingId(gen.id);
    try {
      const updated = await api.toggleActiveGenerator(gen.id);
      setGenerators((prev) =>
        prev.map((g) =>
          g.id === gen.id ? { ...g, is_active: updated.is_active } : g
        )
      );
      toast(
        updated.is_active
          ? "تم تفعيل الأمر الذكي بنجاح"
          : "تم تعطيل الأمر الذكي",
        "success"
      );
    } catch {
      toast("فشل تحديث حالة التفعيل", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (
      !confirm(
        `هل أنت متأكد من حذف الأمر "${title}"؟ سيتم حذف جميع الخطوات والحقول المرتبطة به.`
      )
    )
      return;

    setDeletingId(id);
    try {
      await api.deleteGenerator(id);
      setGenerators((prev) => prev.filter((g) => g.id !== id));
      toast("تم حذف الأمر الذكي بنجاح", "success");
    } catch {
      toast("فشل حذف الأمر الذكي", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            منشئ الأوامر الذكية
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            إدارة وبناء الأوامر التربوية
          </h1>
        </div>

        <Link
          href="/admin/generators/create"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-950/40 hover:bg-emerald-500 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          إنشاء أمر ذكي جديد
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في عناوين الأوامر والوصف..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 pl-10 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
        </div>

        <button
          onClick={loadGenerators}
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
          title="تحديث"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Generators Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" />
            <span>جاري تحميل الأوامر الذكية...</span>
          </div>
        ) : generators.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="p-4">اسم الأمر الذكي</th>
                  <th className="p-4">الهيكل والخطوات</th>
                  <th className="p-4">الترتيب</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {generators.map((gen) => {
                  const stepCount = gen.steps?.length || 0;
                  const fieldCount =
                    gen.steps?.reduce(
                      (acc, s) => acc + (s.fields?.length || 0),
                      0
                    ) || 0;

                  return (
                    <tr
                      key={gen.id}
                      className="hover:bg-slate-850/40 transition-colors"
                    >
                      <td className="p-4 font-bold text-white max-w-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                          <span className="truncate">{gen.title}</span>
                        </div>
                        <div className="text-[11px] font-normal text-slate-500 font-mono mt-0.5">
                          /{gen.slug}
                        </div>
                      </td>

                      <td className="p-4 text-slate-300">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-300">
                            <Layers className="h-3 w-3 text-emerald-400" />
                            {stepCount} خطوات
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-300">
                            {fieldCount} حقول
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-400 font-mono">
                        {gen.order ?? 0}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(gen)}
                          disabled={togglingId === gen.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            gen.is_active
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {togglingId === gen.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : gen.is_active ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <X className="h-3 w-3 text-slate-500" />
                          )}
                          <span>{gen.is_active ? "مفعّل" : "معطل"}</span>
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/generators/${gen.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800"
                            title="تجربة الأمر في الموقع"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          <Link
                            href={`/admin/generators/${gen.id}`}
                            className="p-1.5 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-800"
                            title="تعديل الأمر والخطوات"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(gen.id, gen.title)}
                            disabled={deletingId === gen.id}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                            title="حذف الأمر"
                          >
                            {deletingId === gen.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            لا توجد أوامر مسجلة. انقر على &quot;إنشاء أمر ذكي جديد&quot; للبدء.
          </div>
        )}
      </div>
    </div>
  );
}
