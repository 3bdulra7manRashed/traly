import React from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { BookOpen } from "lucide-react";
import { Article, Category, PaginationMeta } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المدونة والمعرفة التربوية | ترالي",
  description: "مقالات وأدلة متخصصة في الذكاء الاصطناعي التربوي، تصميم التعليم، وبناء القيم والمبادرات.",
};

export const revalidate = 60;

interface ArticlesPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { category, search, page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  let articles: Article[] = [];
  let categories: Category[] = [];
  let meta: PaginationMeta | null = null;

  try {
    const [articlesRes, categoriesRes] = await Promise.all([
      api.getArticles({ category, search, page: currentPage }),
      api.getCategories().catch(() => []),
    ]);
    articles = articlesRes.data || [];
    meta = articlesRes.meta || null;
    categories = categoriesRes;
  } catch (err) {
    console.error("Error loading articles:", err);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 w-fit">
          <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
          <span>مركز المعرفة والمدونة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          المقالات والأدلة التربوية
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          دليلك الشامل لتوظيف التقنية والذكاء الاصطناعي في خدمة التعليم وصناعة الأثر القيمي.
        </p>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/articles"
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              !category
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            كافة المقالات
          </Link>
          {categories.map((cat) => {
            const isActive = category === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/articles?category=${cat.slug}`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <span>{cat.name}</span>
                {cat.articles_count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-emerald-700 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {cat.articles_count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          لم يتم العثور على مقالات تطابق هذا البحث.
        </div>
      )}
    </div>
  );
}
