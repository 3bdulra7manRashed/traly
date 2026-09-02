"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, AdminStats } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import {
  Sparkles,
  BookOpen,
  Zap,
  Layers,
  PlusCircle,
  Clock,
  User,
  ArrowLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" />
        <span>جاري تحميل المؤشرات والإحصائيات...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            نظرة عامة على المنصة
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            متابعة إحصائيات الأوامر الذكية، المحتوى المنشور، وعمليات التوليد الحية.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadStats}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            تحديث
          </button>

          <Link
            href="/admin/generators/create"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-950/40 hover:bg-emerald-500 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            أمر ذكي جديد
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Generators KPI */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              الأوامر الذكية
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.total_generators ?? 0}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              ({stats?.active_generators ?? 0} مفعّل)
            </span>
          </div>
        </div>

        {/* Articles KPI */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              المقالات المنشورة
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.published_articles ?? 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              من أصل {stats?.total_articles ?? 0} مقال
            </span>
          </div>
        </div>

        {/* Prompt Generations KPI */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              إجمالي الأوامر المولدة
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.total_generations ?? 0}
            </span>
            <span className="text-xs text-amber-400 font-medium">
              عملية توليد ناجحة
            </span>
          </div>
        </div>

        {/* Categories KPI */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              التصنيفات المعرفية
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.total_categories ?? 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              تصنيفات رئيسية
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/generators"
          className="flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300">
                إدارة وبناء الأوامر الذكية
              </h3>
              <p className="text-xs text-slate-400">
                تعديل القوالب، الحقول، والخطوات التفاعلية
              </p>
            </div>
          </div>
          <ArrowLeft className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-[-3px] transition-all" />
        </Link>

        <Link
          href="/admin/articles"
          className="flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-teal-300">
                إدارة ونشر المقالات
              </h3>
              <p className="text-xs text-slate-400">
                كتابة مقالات جديدة، تعديل المحتوى والوسوم
              </p>
            </div>
          </div>
          <ArrowLeft className="h-4 w-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-[-3px] transition-all" />
        </Link>
      </div>

      {/* Recent Prompt Generations Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              أحدث عمليات التوليد الحية
            </h2>
          </div>
          <span className="text-xs text-slate-400">آخر 10 عمليات</span>
        </div>

        {stats?.recent_generations && stats.recent_generations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="text-slate-400 border-b border-slate-800/80">
                <tr>
                  <th className="pb-3 font-semibold">الأمر المستخدم</th>
                  <th className="pb-3 font-semibold">المستخدم</th>
                  <th className="pb-3 font-semibold">عينة المدخلات</th>
                  <th className="pb-3 font-semibold">الوقت والتاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recent_generations.map((gen) => (
                  <tr key={gen.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        {gen.generator_title}
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        {gen.user_name}
                      </div>
                    </td>
                    <td className="py-3 text-slate-400 max-w-xs truncate">
                      {JSON.stringify(gen.inputs_preview)}
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {formatDate(gen.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            لا توجد عمليات توليد مسجلة حتى الآن.
          </div>
        )}
      </div>
    </div>
  );
}
