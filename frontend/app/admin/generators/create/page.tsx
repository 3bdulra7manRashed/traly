import React from "react";
import { GeneratorBuilderForm } from "@/components/admin/GeneratorBuilderForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء أمر ذكي جديد | لوحة التحكم",
};

export default function CreateGeneratorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          إنشاء أمر ذكي تربوي جديد
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          قم بتحديد معلومات الأمر، إضافة الخطوات والحقول التفاعلية، وصياغة قالب الذكاء الاصطناعي.
        </p>
      </div>

      <GeneratorBuilderForm />
    </div>
  );
}
