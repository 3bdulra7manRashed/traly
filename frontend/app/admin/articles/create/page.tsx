import React from "react";
import { ArticleForm } from "@/components/admin/ArticleForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "كتابة مقال جديد | لوحة التحكم",
};

export default function CreateArticlePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          كتابة مقال تربوي جديد
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          أدخل تفاصيل المقال، التصنيف المعرفي، والوسوم لنشره على منصة ترالي.
        </p>
      </div>

      <ArticleForm />
    </div>
  );
}
