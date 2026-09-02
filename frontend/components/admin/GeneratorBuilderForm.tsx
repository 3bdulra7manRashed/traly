"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { FormFieldType, PromptGenerator } from "@/types";
import { useToast } from "@/components/ui/Toast";
import {
  Sparkles,
  Save,
  ArrowRight,
  Plus,
  Trash2,
  Layers,
  HelpCircle,
  Loader2,
  Code,
  Tag,
  Check,
} from "lucide-react";

interface FieldDraft {
  id?: number;
  name: string;
  label: string;
  type: FormFieldType;
  placeholder: string;
  help_text: string;
  optionsText: string; // newline or comma separated
  isRequired: boolean;
}

interface StepDraft {
  id?: number;
  title: string;
  description: string;
  fields: FieldDraft[];
}

interface GeneratorBuilderFormProps {
  initialData?: PromptGenerator;
}

export function GeneratorBuilderForm({ initialData }: GeneratorBuilderFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = Boolean(initialData);

  // General state
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [icon, setIcon] = useState(initialData?.icon || "sparkles");
  const [shortDescription, setShortDescription] = useState(
    initialData?.short_description || ""
  );
  const [promptTemplate, setPromptTemplate] = useState(
    initialData?.prompt_template ||
      "أنت خبير تربوي متميز. قم بإعداد المحتوى بناءً على البيانات التالية:\n- الموضوع: {{topic}}\n\n{{#if notes}}\nملاحظات: {{notes}}\n{{/if}}"
  );
  const [isActive, setIsActive] = useState(
    initialData ? initialData.is_active : true
  );
  const [order, setOrder] = useState<number>(initialData?.order || 0);

  // Steps state
  const [steps, setSteps] = useState<StepDraft[]>(() => {
    if (initialData?.steps && initialData.steps.length > 0) {
      return initialData.steps.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description || "",
        fields: (s.fields || []).map((f) => {
          let optsText = "";
          if (f.options) {
            optsText = Object.values(f.options).join("\n");
          }
          return {
            id: f.id,
            name: f.name,
            label: f.label,
            type: f.type,
            placeholder: f.placeholder || "",
            help_text: f.help_text || "",
            optionsText: optsText,
            isRequired: f.validation_rules?.includes("required") ?? false,
          };
        }),
      }));
    }
    return [
      {
        title: "البيانات الأساسية",
        description: "المعلومات المركزية للأمر التربوي",
        fields: [
          {
            name: "topic",
            label: "عنوان الموضوع التربوي",
            type: "text",
            placeholder: "مثال: مهارات القيادة لدى اليافعين",
            help_text: "المحور الأساسي للمحتوى",
            optionsText: "",
            isRequired: true,
          },
        ],
      },
    ];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const templateTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-generate slug
  const handleGenerateSlug = () => {
    const generated = title
      .trim()
      .toLowerCase()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  // Step operations
  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        title: `الخطوة ${prev.length + 1}`,
        description: "",
        fields: [
          {
            name: `field_${Date.now().toString().slice(-4)}`,
            label: "حقل جديد",
            type: "text",
            placeholder: "",
            help_text: "",
            optionsText: "",
            isRequired: false,
          },
        ],
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      toast("يجب أن يحتوي الأمر على خطوة واحدة على الأقل", "error");
      return;
    }
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStepChange = (
    index: number,
    field: "title" | "description",
    val: string
  ) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  // Field operations
  const handleAddField = (stepIndex: number) => {
    setSteps((prev) => {
      const next = [...prev];
      const targetStep = next[stepIndex];
      targetStep.fields = [
        ...targetStep.fields,
        {
          name: `field_${Date.now().toString().slice(-4)}`,
          label: "حقل جديد",
          type: "text",
          placeholder: "",
          help_text: "",
          optionsText: "",
          isRequired: false,
        },
      ];
      return next;
    });
  };

  const handleRemoveField = (stepIndex: number, fieldIndex: number) => {
    setSteps((prev) => {
      const next = [...prev];
      const targetStep = next[stepIndex];
      if (targetStep.fields.length <= 1) {
        toast("يجب أن تحتوي كل خطوة على حقل واحد على الأقل", "error");
        return prev;
      }
      targetStep.fields = targetStep.fields.filter((_, i) => i !== fieldIndex);
      return next;
    });
  };

  const handleFieldPropChange = (
    stepIndex: number,
    fieldIndex: number,
    prop: keyof FieldDraft,
    val: any
  ) => {
    setSteps((prev) => {
      const next = [...prev];
      const targetStep = next[stepIndex];
      const targetField = { ...targetStep.fields[fieldIndex], [prop]: val };
      targetStep.fields[fieldIndex] = targetField;
      return next;
    });
  };

  // Insert variable tag into template at cursor position
  const handleInsertTag = (tagText: string) => {
    const textarea = templateTextareaRef.current;
    if (!textarea) {
      setPromptTemplate((prev) => prev + " " + tagText);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = promptTemplate;

    const updated = current.substring(0, start) + tagText + current.substring(end);
    setPromptTemplate(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + tagText.length,
        start + tagText.length
      );
    }, 0);
  };

  // Extract all active field names across steps
  const allFieldNames = steps.flatMap((s) =>
    s.fields.map((f) => f.name.trim()).filter(Boolean)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Build structured payload
    const formattedSteps = steps.map((s, sIdx) => ({
      title: s.title,
      description: s.description || null,
      step_order: sIdx + 1,
      fields: s.fields.map((f, fIdx) => {
        const optionsList = f.optionsText
          .split(/[\n,]/)
          .map((o) => o.trim())
          .filter(Boolean);

        return {
          name: f.name.trim().toLowerCase().replace(/[\s\W-]+/g, "_"),
          label: f.label,
          type: f.type,
          placeholder: f.placeholder || null,
          help_text: f.help_text || null,
          options: optionsList.length > 0 ? optionsList : null,
          validation_rules: f.isRequired ? ["required"] : ["nullable"],
          field_order: fIdx + 1,
        };
      }),
    }));

    const payload = {
      title,
      slug: slug || undefined,
      icon: icon || "sparkles",
      short_description: shortDescription || null,
      prompt_template: promptTemplate,
      is_active: isActive,
      order: order || 0,
      steps: formattedSteps,
    };

    try {
      if (isEditing && initialData) {
        await api.updateGenerator(initialData.id, payload);
        toast("تم تحديث الأمر الذكي بنجاح!", "success");
      } else {
        await api.createGenerator(payload);
        toast("تم إنشاء الأمر الذكي بنجاح!", "success");
      }
      router.push("/admin/generators");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const mapped: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(err.errors)) {
          mapped[k] = msgs[0];
        }
        setErrors(mapped);
      } else {
        toast(
          err instanceof Error ? err.message : "فشل حفظ الأمر الذكي",
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-5xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          رجوع لقائمة الأوامر
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
              {isEditing ? "حفظ تعديلات الأمر" : "نشر الأمر الذكي"}
            </>
          )}
        </button>
      </div>

      {/* SECTION 1: General Info Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col gap-6 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            1. المعلومات الأساسية للأمر
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Title */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-200">
              عنوان الأمر الذكي <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: أمر بناء ورشة عمل تربوية تفاعلية"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
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
                توليد من العنوان
              </button>
            </div>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="workshop-generator"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-mono text-slate-300 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
            {errors.slug && (
              <span className="text-xs text-rose-400">{errors.slug}</span>
            )}
          </div>

          {/* Icon Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-200">
              اسم الأيقونة (Lucide Icon)
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="sparkles">✨ sparkles (افتراضي)</option>
              <option value="book-open">📖 book-open (محتوى/دروس)</option>
              <option value="light-bulb">💡 light-bulb (مبادرات/أفكار)</option>
              <option value="home">🏠 home (محاضن/نوادي)</option>
              <option value="check-badge">🛡️ check-badge (مراجعة وتدقيق)</option>
            </select>
          </div>

          {/* Short Description */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-200">
              وصف مختصر
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="شرح موجز يوضح فائدة ومجال هذا الأمر للمستخدم..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none resize-y"
            />
          </div>

          {/* Active & Order */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950">
            <div>
              <div className="text-xs font-bold text-white">حالة التفعيل</div>
              <div className="text-[10px] text-slate-400">
                {isActive ? "متاح للجمهور في الموقع" : "معطل ومخفي"}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                isActive ? "bg-emerald-500" : "bg-slate-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  isActive ? "-translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950">
            <label className="text-xs font-bold text-slate-200">
              ترتيب الظهور في القائمة
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-center text-white"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Steps & Fields Builder */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col gap-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              2. الخطوات والحقول التفاعلية ({steps.length} خطوات)
            </h2>
          </div>

          <button
            type="button"
            onClick={handleAddStep}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            إضافة خطوة
          </button>
        </div>

        {/* Steps Stack */}
        <div className="flex flex-col gap-6">
          {steps.map((step, sIdx) => (
            <div
              key={sIdx}
              className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-5 sm:p-6 flex flex-col gap-4"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                    {sIdx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    value={step.title}
                    onChange={(e) =>
                      handleStepChange(sIdx, "title", e.target.value)
                    }
                    placeholder="عنوان الخطوة..."
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm font-bold text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveStep(sIdx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                  title="حذف هذه الخطوة"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Step Description */}
              <input
                type="text"
                value={step.description}
                onChange={(e) =>
                  handleStepChange(sIdx, "description", e.target.value)
                }
                placeholder="وصف أو تعليمات توضيحية للخطوة (اختياري)..."
                className="w-full rounded-xl border border-slate-850 bg-slate-900/90 px-3.5 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
              />

              {/* Fields inside Step */}
              <div className="flex flex-col gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-400">
                  حقول هذه الخطوة ({step.fields.length}):
                </span>

                {step.fields.map((field, fIdx) => {
                  const hasOptions = ["select", "radio", "multi_checkbox"].includes(
                    field.type
                  );

                  return (
                    <div
                      key={fIdx}
                      className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex flex-col gap-3.5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* Field Variable Name */}
                        <div className="sm:col-span-3 flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <span>اسم المتغير (Key)</span>
                            <span className="text-emerald-400 font-mono text-[9px]">
                              {`{{${field.name}}}`}
                            </span>
                          </label>
                          <input
                            type="text"
                            required
                            value={field.name}
                            onChange={(e) =>
                              handleFieldPropChange(
                                sIdx,
                                fIdx,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="topic_title"
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-mono text-emerald-300 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        {/* Field Label */}
                        <div className="sm:col-span-4 flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400">
                            عنوان الحقل (Label)
                          </label>
                          <input
                            type="text"
                            required
                            value={field.label}
                            onChange={(e) =>
                              handleFieldPropChange(
                                sIdx,
                                fIdx,
                                "label",
                                e.target.value
                              )
                            }
                            placeholder="عنوان الموضوع التعليمي"
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        {/* Field Type */}
                        <div className="sm:col-span-3 flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400">
                            نوع الحقل
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              handleFieldPropChange(
                                sIdx,
                                fIdx,
                                "type",
                                e.target.value as FormFieldType
                              )
                            }
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
                          >
                            <option value="text">نص قصير (text)</option>
                            <option value="textarea">نص متعدد الأسطر (textarea)</option>
                            <option value="select">قائمة منسدلة (select)</option>
                            <option value="radio">خيارات أحادية (radio)</option>
                            <option value="multi_checkbox">خيارات متعددة (multi_checkbox)</option>
                            <option value="number">رقمي (number)</option>
                            <option value="boolean">تبديل نعم/لا (boolean)</option>
                          </select>
                        </div>

                        {/* Required Toggle & Delete */}
                        <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
                          <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={field.isRequired}
                              onChange={(e) =>
                                handleFieldPropChange(
                                  sIdx,
                                  fIdx,
                                  "isRequired",
                                  e.target.checked
                                )
                              }
                              className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                            />
                            <span>إجباري</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveField(sIdx, fIdx)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded-md transition-colors"
                            title="حذف الحقل"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Additional Details (Placeholder, Help text, Options) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/60">
                        <input
                          type="text"
                          value={field.placeholder}
                          onChange={(e) =>
                            handleFieldPropChange(
                              sIdx,
                              fIdx,
                              "placeholder",
                              e.target.value
                            )
                          }
                          placeholder="نص توضيحي بداخل الحقل (Placeholder)..."
                          className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-1.5 text-[11px] text-slate-300 placeholder:text-slate-600 focus:outline-none"
                        />

                        <input
                          type="text"
                          value={field.help_text}
                          onChange={(e) =>
                            handleFieldPropChange(
                              sIdx,
                              fIdx,
                              "help_text",
                              e.target.value
                            )
                          }
                          placeholder="تلميح مساعد أسفل الحقل (Help Text)..."
                          className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-1.5 text-[11px] text-slate-300 placeholder:text-slate-600 focus:outline-none"
                        />
                      </div>

                      {/* Options Input for Select/Radio/Checkbox */}
                      {hasOptions && (
                        <div className="flex flex-col gap-1 pt-1 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                          <label className="text-[10px] font-bold text-emerald-300">
                            خيارات القائمة (افصل بين الخيارات بسطر جديد أو فاصلة):
                          </label>
                          <textarea
                            rows={2}
                            value={field.optionsText}
                            onChange={(e) =>
                              handleFieldPropChange(
                                sIdx,
                                fIdx,
                                "optionsText",
                                e.target.value
                              )
                            }
                            placeholder="الخيار الأول&#10;الخيار الثاني&#10;الخيار الثالث"
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handleAddField(sIdx)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 py-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  إضافة حقل جديد في هذه الخطوة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Prompt Template Editor */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col gap-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              3. محرر قالب الأمر الذكي (Prompt Template)
            </h2>
          </div>
        </div>

        {/* Available Variable Badges */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-emerald-400" />
            المتغيرات المتاحة للإدراج السريع (انقر لإدراج المتغير في مكان المؤشر):
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {allFieldNames.map((name) => (
              <div key={name} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleInsertTag(`{{${name}}}`)}
                  className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono text-emerald-300 hover:bg-emerald-500/25 transition-all"
                  title="إدراج متغير مباشر"
                >
                  {`{{${name}}}`}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertTag(`\n{{#if ${name}}}\n{{${name}}}\n{{/if}}\n`)
                  }
                  className="rounded-lg bg-teal-500/10 border border-teal-500/30 px-2 py-1 text-[11px] font-mono text-teal-300 hover:bg-teal-500/25 transition-all"
                  title="إدراج كتلة شرطية"
                >
                  {`{{#if ${name}}}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Template Textarea */}
        <div className="flex flex-col gap-1.5">
          <textarea
            ref={templateTextareaRef}
            rows={12}
            required
            value={promptTemplate}
            onChange={(e) => setPromptTemplate(e.target.value)}
            placeholder="أنت خبير تربوي... اكتب قالب الأمر واستخدم {{tags}} لتمثيل المدخلات"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none resize-y leading-relaxed"
          />
          {errors.prompt_template && (
            <span className="text-xs text-rose-400">
              {errors.prompt_template}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
