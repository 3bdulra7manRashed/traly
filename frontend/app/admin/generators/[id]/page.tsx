"use client";

import React, { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { PromptGenerator } from "@/types";
import { GeneratorBuilderForm } from "@/components/admin/GeneratorBuilderForm";
import { Loader2 } from "lucide-react";

interface EditGeneratorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditGeneratorPage({ params }: EditGeneratorPageProps) {
  const { id } = use(params);
  const [generator, setGenerator] = useState<PromptGenerator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getAdminGenerator(parseInt(id, 10))
      .then((data) => setGenerator(data))
      .catch((err) => {
        console.error(err);
        setError("فشل تحميل بيانات الأمر الذكي");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" />
        <span>جاري تحميل بيانات الأمر والخطوات...</span>
      </div>
    );
  }

  if (error || !generator) {
    return (
      <div className="p-8 text-center text-rose-400">
        {error || "الأمر الذكي غير موجود"}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          تعديل الأمر الذكي: {generator.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          تعديل خطوات المعالج، إضافة أو حذف الحقول، وصياغة قالب الذكاء الاصطناعي.
        </p>
      </div>

      <GeneratorBuilderForm initialData={generator} />
    </div>
  );
}
