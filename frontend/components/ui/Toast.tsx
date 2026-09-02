"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Render Area */}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md animate-fadeIn text-sm font-medium transition-all",
              t.type === "success" &&
                "bg-slate-900/95 border-emerald-500/50 text-emerald-200 shadow-emerald-950/40",
              t.type === "error" &&
                "bg-slate-900/95 border-rose-500/50 text-rose-200 shadow-rose-950/40",
              t.type === "info" &&
                "bg-slate-900/95 border-teal-500/50 text-teal-200 shadow-teal-950/40"
            )}
          >
            <div className="flex items-center gap-2.5">
              {t.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              )}
              {t.type === "error" && (
                <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
              )}
              {t.type === "info" && (
                <Info className="h-5 w-5 text-teal-400 flex-shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
