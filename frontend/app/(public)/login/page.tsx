"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, LogIn, Loader2, ArrowLeft } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/history";

  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const { token, user } = await api.userLogin({ email, password });
      login(token, user);
      toast("أهلاً بك مجدداً! تم تسجيل الدخول بنجاح", "success");
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
          err instanceof Error ? err.message : "فشل تسجيل الدخول",
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
            تسجيل الدخول إلى ترالي
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            مرحباً بك مجدداً! أدخل بيانات حسابك للوصول لسجل الأوامر
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {errors.email && (
            <span className="text-xs text-rose-400">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-200">
            كلمة المرور <span className="text-emerald-400">*</span>
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {errors.password && (
            <span className="text-xs text-rose-400">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري تسجيل الدخول...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
        ليس لديك حساب بعد؟{" "}
        <Link
          href={`/register${redirectPath !== "/history" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
          className="font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
        >
          إنشاء حساب جديد
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-[400px] rounded-3xl border border-slate-800 bg-slate-900/60 animate-pulse" />
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
