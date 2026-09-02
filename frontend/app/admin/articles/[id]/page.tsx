"use client";

import React, { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { Article } from "@/types";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Loader2 } from "lucide-react";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getAdminArticle(parseInt(id, 10))
      .then((data) => setArticle(data))
      .catch((err) => {
        console.error(err);
        setError("فشل تحميل بيانات المقال");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" />
        <span>جاري تحميل بيانات المقال...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="p-8 text-center text-rose-400">
        {error || "المقال غير موجود"}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          تعديل المقال: {article.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          تحديث المحتوى والوسوم أو تعديل حالة النشر.
        </p>
      </div>

      <ArticleForm initialData={article} />
    </div>
  );
}
