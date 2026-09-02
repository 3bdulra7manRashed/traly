"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Article, Category } from "@/types";
import { useToast } from "@/components/ui/Toast";
import {
  Sparkles,
  Save,
  ArrowRight,
  Loader2,
  Tag,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface ArticleFormProps {
  initialData?: Article;
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = Boolean(initialData);

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.category?.id?.toString() || ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [keywords, setKeywords] = useState<string[]>(
    initialData?.keywords || []
  );
  const [tagInput, setTagInput] = useState("");
  const [isPublished, setIsPublished] = useState(
    initialData ? initialData.is_published : true
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api
      .getCategories()
      .then((data) => {
        setCategories(data);
        if (!categoryId && data.length > 0) {
          setCategoryId(data[0].id.toString());
        }
      })
      .catch(console.error);
  }, [categoryId]);

  const handleGenerateSlug = () => {
    const generated = title
      .trim()
      .toLowerCase()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "");
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const payload = {
      title,
      slug: slug || undefined,
      category_id: categoryId ? parseInt(categoryId, 10) : undefined,
      image_url: imageUrl || null,
      excerpt: excerpt || null,
      content,
      keywords,
      is_published: isPublished,
    };

    try {
      if (isEditing && initialData) {
        await api.updateArticle(initialData.id, payload);
        toast("تم تحديث المقال بنجاح!", "success");
      } else {
        await api.createArticle(payload);
        toast("تم إنشاء المقال بنجاح!", "success");
      }
      router.push("/admin/articles");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const mapped: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(err.errors)) {
          mapped[k] = msgs[0];
        }
        setErrors(mapped);
      } else {
        toast(
          err instanceof Error ? err.message : "فشل حفظ المقال",
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          رجوع لقائمة المقالات
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditing ? "حفظ التعديلات" : "نشر المقال"}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Editor */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-200">
              عنوان المقال <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: استراتيجيات توظيف الذكاء الاصطناعي في التدريس..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            {errors.title && (
              <span className="text-xs text-rose-400">{errors.title}</span>
            )}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                الرابط الدائم (Slug)
              </label>
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                توليد تلقائي من العنوان
              </button>
            </div>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ai-strategies-in-education"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-mono text-slate-300 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
            {errors.slug && (
              <span className="text-xs text-rose-400">{errors.slug}</span>
            )}
          </div>

          {/* Excerpt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-200">
              نبذة مختصرة (Excerpt)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="ملخص قصير يظهر في بطاقات المقالات ومحركات البحث..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none resize-y"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-200">
              محتوى المقال بالكامل <span className="text-emerald-400">*</span>
            </label>
            <textarea
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب المحتوى التعليمي للمقال هنا..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none resize-y leading-relaxed"
            />
            {errors.content && (
              <span className="text-xs text-rose-400">{errors.content}</span>
            )}
          </div>
        </div>

        {/* Right Column: Settings & Metadata */}
        <div className="flex flex-col gap-5">
          {/* Category */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-200">
              التصنيف المعرفي <span className="text-emerald-400">*</span>
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Published Status Toggle */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">حالة النشر</div>
              <div className="text-[11px] text-slate-400">
                {isPublished ? "منشور للعامة على الموقع" : "مسودة خاصة"}
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isPublished}
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                isPublished ? "bg-emerald-500" : "bg-slate-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  isPublished ? "-translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Image URL & Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
              رابط الصورة البارزة
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none font-mono"
            />
            {imageUrl && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 mt-2 bg-slate-950">
                <Image
                  src={imageUrl}
                  alt="معاينة"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Keywords Tag Manager */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              الكلمات المفتاحية والوسوم
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="اكتب واضغط Enter..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <div className="flex flex-wrap gap-1.5 min-h-[30px]">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300"
                >
                  #{kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(kw)}
                    className="hover:text-rose-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
