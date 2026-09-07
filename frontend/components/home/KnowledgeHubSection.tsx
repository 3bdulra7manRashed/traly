"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import {
  BookOpen,
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface KnowledgeHubSectionProps {
  articles?: Article[];
}

const FALLBACK_ARTICLES: Partial<Article>[] = [
  {
    id: 1,
    slug: "effective-prompt-engineering-in-education",
    title: "كيف نصمم أوامر ذكاء اصطناعي (Prompts) فعالة في السياق التربوي؟",
    excerpt:
      "دليل عملي للمربين والمعلمين حول هندسة الأوامر الذكية لبناء خطط دروس وأنشطة قيمية ملهمة ومحكمة.",
    image_url:
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80",
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    category: {
      id: 1,
      name: "التربية والذكاء الاصطناعي",
      slug: "education-and-ai",
    },
    author: {
      id: 1,
      name: "د. عبد الرحمن راشد",
    },
  },
  {
    id: 2,
    slug: "values-matrix-in-educational-curricula",
    title: "مصفوفة بناء القيم في المناهج التعليمية: من المعرفة إلى السلوك اليومي",
    excerpt:
      "كيف ننتقل بالقيمة من مجرد مفهوم نظري يُحفظ إلى ممارسة وجدانية وسلوكية متأصلة لدى اليافعين؟",
    image_url:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    category: {
      id: 2,
      name: "تصميم التعليم والمناهج",
      slug: "curriculum-design",
    },
    author: {
      id: 1,
      name: "أ. سارة المنصور",
    },
  },
  {
    id: 3,
    slug: "pillars-of-attractive-educational-environments",
    title: "أركان البيئة التربوية الجاذبة: قواعد بناء المحضن الشبابي الفعّال",
    excerpt:
      "عوامل الاستقرار والجاذبية في النوادي الشبابية والمحاضن التربوية وكيفية تفعيل دور المربي القدوة.",
    image_url:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    published_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    category: {
      id: 3,
      name: "إدارة المحاضن التربوية",
      slug: "environments-management",
    },
    author: {
      id: 1,
      name: "م. فهد التميمي",
    },
  },
];

export function KnowledgeHubSection({
  articles = [],
}: KnowledgeHubSectionProps) {
  // Use live articles if provided, otherwise rich editorial fallbacks
  const displayArticles =
    articles.length > 0 ? articles.slice(0, 3) : (FALLBACK_ARTICLES as Article[]);

  // Estimate read time based on excerpt length
  const getReadTime = (article: Article) => {
    const len = (article.content || article.excerpt || "").length;
    const minutes = Math.max(3, Math.min(8, Math.ceil(len / 350)));
    return `${minutes} دقائق قراءة`;
  };

  return (
    <section id="knowledge-hub" className="w-full relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <BookOpen className="h-4 w-4" />
            <span>المعرفة والأدلة التربوية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            أحدث المعارف والخبرات التربوية
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            مقالات، دراسات، وأدلة إرشادية مُحكّمة تساعدك على فهم أبعاد التربية الحديثة والتوظيف الأمثل للتقنية.
          </p>
        </div>

        {/* View All Button */}
        <Link
          href="/articles"
          className="group inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-[#0B1118]/90 px-5 py-2.5 text-xs font-bold text-emerald-300 hover:border-emerald-500/50 hover:bg-forest-900/80 hover:text-white transition-all whitespace-nowrap shadow-sm"
        >
          <span>تصفح الكل</span>
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-[-3px]" />
        </Link>
      </div>

      {/* Editorial Cards (16:9 Aspect Ratio) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-[#0B1118]/75 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:bg-[#0E1520] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.18)]"
          >
            {/* 16:9 Aspect Ratio Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              {article.image_url ? (
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-forest-950/60 text-emerald-500/50">
                  <BookOpen className="h-12 w-12" />
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1118] via-transparent to-transparent opacity-80" />

              {/* Category Tag Badge */}
              {article.category && (
                <span className="absolute top-3.5 right-3.5 rounded-xl bg-[#070B11]/85 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 shadow-md">
                  {article.category.name}
                </span>
              )}

              {/* Read Time Tag Badge */}
              <span className="absolute bottom-3 right-3.5 flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-950/75 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-slate-800">
                <Clock className="h-3 w-3 text-emerald-400" />
                <span>{getReadTime(article)}</span>
              </span>
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                {/* Meta: Date & Author */}
                <div className="flex items-center gap-3.5 text-xs text-slate-400 mb-3">
                  {article.published_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span>{formatDate(article.published_at)}</span>
                    </span>
                  )}
                  {article.author && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-500" />
                      <span>{article.author.name}</span>
                    </span>
                  )}
                </div>

                {/* Article Title */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {article.title}
                </h3>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>

              {/* Read Article Action */}
              <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>قراءة المقال والتحليل</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-900/90 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:translate-x-[-3px] transition-all">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
