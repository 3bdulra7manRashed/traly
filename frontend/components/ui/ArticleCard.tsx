import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-emerald-950/20"
    >
      {/* Image Banner */}
      {article.image_url ? (
        <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {article.category && (
            <span className="absolute top-3 right-3 rounded-lg bg-slate-950/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-300 border border-slate-700/50">
              {article.category.name}
            </span>
          )}
        </div>
      ) : (
        article.category && (
          <div className="p-5 pb-0">
            <span className="inline-block rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              {article.category.name}
            </span>
          </div>
        )
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
            {article.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                {formatDate(article.published_at)}
              </span>
            )}
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                {article.author.name}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="mt-2.5 text-sm text-slate-400 leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-emerald-400">
          <span>قراءة المقال بالكامل</span>
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-[-4px]" />
        </div>
      </div>
    </Link>
  );
}
