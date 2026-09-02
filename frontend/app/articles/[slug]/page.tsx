import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Calendar, User, Tag, BookOpen, Share2 } from "lucide-react";
import type { Metadata } from "next";

interface ArticleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await api.getArticle(slug);
    return {
      title: `${article.title} | ترالي`,
      description: article.excerpt || article.title,
      keywords: article.keywords,
    };
  } catch {
    return {
      title: "المقال | ترالي",
    };
  }
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await api.getArticle(slug);
  } catch {
    notFound();
  }

  const relatedArticles = article.related_articles || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12 max-w-4xl">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link
          href="/articles"
          className="hover:text-emerald-400 transition-colors flex items-center gap-1"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          المدونة والمعرفة
        </Link>
        {article.category && (
          <>
            <span>/</span>
            <Link
              href={`/articles?category=${article.category.slug}`}
              className="hover:text-emerald-400 transition-colors"
            >
              {article.category.name}
            </Link>
          </>
        )}
      </div>

      {/* Article Header */}
      <header className="flex flex-col gap-4">
        {article.category && (
          <span className="inline-block w-fit rounded-lg bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            {article.category.name}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.25]">
          {article.title}
        </h1>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-6 pt-2 pb-6 border-b border-slate-800 text-xs text-slate-400">
          {article.author && (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                <User className="h-4 w-4" />
              </div>
              <span className="font-semibold text-slate-200">
                {article.author.name}
              </span>
            </div>
          )}

          {article.published_at && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>نُشر في {formatDate(article.published_at)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Hero Image */}
      {article.image_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      )}

      {/* Excerpt Lead */}
      {article.excerpt && (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 text-base sm:text-lg text-emerald-200/90 leading-relaxed font-medium">
          {article.excerpt}
        </div>
      )}

      {/* Main Content Body */}
      <article className="prose prose-invert prose-emerald max-w-none text-slate-200 text-base sm:text-lg leading-relaxed space-y-6">
        {article.content.split("\n\n").map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>

      {/* Tags / Keywords */}
      {article.keywords && article.keywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 ml-2">
            <Tag className="h-3.5 w-3.5 text-emerald-400" />
            الوسوم:
          </span>
          {article.keywords.map((kw, i) => (
            <span
              key={i}
              className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-300"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="mt-8 pt-10 border-t border-slate-800 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">مقالات ذات صلة</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
