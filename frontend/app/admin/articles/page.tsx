"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Article, Category } from "@/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import {
  BookOpen,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        api.getAdminArticles({
          search: search || undefined,
          category_id: selectedCategory ? Number(selectedCategory) : undefined,
        }),
        api.getCategories().catch(() => []),
      ]);
      setArticles(articlesRes.data || []);
      setCategories(categoriesRes);
    } catch (err) {
      console.error(err);
      toast("فشل تحميل قائمة المقالات", "error");
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, toast]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleTogglePublish = async (article: Article) => {
    setTogglingId(article.id);
    try {
      const updated = await api.togglePublishArticle(article.id);
      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id ? { ...a, is_published: updated.is_published } : a
        )
      );
      toast(
        updated.is_published
          ? "تم نشر المقال بنجاح"
          : "تم تحويل المقال إلى مسودة",
        "success"
      );
    } catch {
      toast("فشل تحديث حالة النشر", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف المقال "${title}"؟`)) return;

    setDeletingId(id);
    try {
      await api.deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast("تم حذف المقال بنجاح", "success");
    } catch {
      toast("فشل حذف المقال", "error");
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
            <BookOpen className="h-4 w-4" />
            إدارة المحتوى
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            المقالات التربوية
          </h1>
        </div>

        <Link
          href="/admin/articles/create"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-950/40 hover:bg-emerald-500 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          كتابة مقال جديد
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في العناوين والنبذة..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 pl-10 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
        >
          <option value="">كافة التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={loadArticles}
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
          title="تحديث"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" />
            <span>جاري تحميل المقالات...</span>
          </div>
        ) : articles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="p-4">عنوان المقال</th>
                  <th className="p-4">التصنيف</th>
                  <th className="p-4">الكاتب</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">تاريخ النشر</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-slate-850/40 transition-colors"
                  >
                    <td className="p-4 font-bold text-white max-w-sm">
                      <div className="truncate">{article.title}</div>
                      <div className="text-[11px] font-normal text-slate-500 font-mono mt-0.5">
                        /{article.slug}
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">
                      {article.category?.name ? (
                        <span className="inline-block rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300 font-medium">
                          {article.category.name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="p-4 text-slate-300">
                      {article.author?.name || "مدير النظام"}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(article)}
                        disabled={togglingId === article.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          article.is_published
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                            : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        {togglingId === article.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : article.is_published ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <X className="h-3 w-3 text-slate-500" />
                        )}
                        <span>{article.is_published ? "منشور" : "مسودة"}</span>
                      </button>
                    </td>

                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {article.published_at
                        ? formatDate(article.published_at)
                        : "—"}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800"
                          title="عرض في الموقع"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="p-1.5 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-800"
                          title="تعديل المقال"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(article.id, article.title)
                          }
                          disabled={deletingId === article.id}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                          title="حذف المقال"
                        >
                          {deletingId === article.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            لا توجد مقالات مسجلة. انقر على &quot;كتابة مقال جديد&quot; للبدء.
          </div>
        )}
      </div>
    </div>
  );
}
