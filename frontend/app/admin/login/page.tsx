"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { api, ApiError } from "@/lib/api";
import { Sparkles, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("admin@traly.sa");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.login(email, password);
      login(data.token, data.user);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("فشل تسجيل الدخول. تحقق من الاتصال بالخادم.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-emerald-950/40">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-900/40">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              تسجيل دخول الإدارة
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              لوحة التحكم الخاصة بمنصة ترالي التربوية
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/20 p-3.5 text-xs text-rose-300 animate-fadeIn">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@traly.sa"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            بيانات الدخول التجريبية الافتراضية:
          </p>
          <p className="text-xs font-mono text-emerald-400 mt-1">
            admin@traly.sa / password
          </p>
        </div>
      </div>
    </div>
  );
}
