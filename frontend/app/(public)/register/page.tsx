"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, UserPlus, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/history";

  const { login } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const { token, user } = await api.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      login(token, user);
      toast("أهلاً بك في منصة ترالي! تم إنشاء حسابك بنجاح", "success");
      router.push(redirectPath);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const mapped: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(err.errors)) {
          mapped[k] = msgs[0];
        }
        setErrors(mapped);
      } else {
        toast(
          err instanceof Error ? err.message : "فشل إنشاء الحساب",
          "error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
      {/* Brand Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-900/40">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            إنشاء حساب جديد في ترالي
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            انضم إلى مجتمع المربين والمعلمين واستفد من هندسة الأوامر الذكية
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-200">
            الاسم الكامل <span className="text-emerald-400">*</span>
          </label>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: أ. محمد العتيبي"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {errors.name && (
            <span className="text-xs text-rose-400">{errors.name}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-200">
            البريد الإلكتروني <span className="text-emerald-400">*</span>
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {errors.email && (
            <span className="text-xs text-rose-400">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-200">
            كلمة المرور (8 أحرف على الأقل) <span className="text-emerald-400">*</span>
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {errors.password && (
            <span className="text-xs text-rose-400">{errors.password}</span>
          )}
        </div>

        {/* Password Confirmation */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-200">
            تأكيد كلمة المرور <span className="text-emerald-400">*</span>
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 py-1">
          <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>بياناتك محمية ومخصصة لحفظ سجلات أوامرك التربوية</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري إنشاء الحساب...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              إنشاء الحساب مجاناً
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
        لديك حساب بالفعل؟{" "}
        <Link
          href={`/login${redirectPath !== "/history" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
          className="font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
        >
          تسجيل الدخول
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-20 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-[500px] rounded-3xl border border-slate-800 bg-slate-900/60 animate-pulse" />
        }
      >
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
