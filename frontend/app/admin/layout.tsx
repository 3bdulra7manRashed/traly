"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import {
  Sparkles,
  LayoutDashboard,
  BookOpen,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, token } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If on login page, render clean container without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-slate-950 flex flex-col">{children}</div>;
  }

  // If not logged in yet, show minimal loader while redirecting
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        جاري التحقق من الصلاحيات...
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
    { href: "/admin/generators", label: "إدارة الأوامر الذكية", icon: Sparkles },
    { href: "/admin/articles", label: "إدارة المقالات", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-l border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-2xl">
        <div className="flex flex-col gap-8">
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-900/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">ترالي</span>
                <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  لوحة التحكم
                </span>
              </div>
              <p className="text-xs text-slate-400">إدارة المنصة والمحتوى</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-emerald-400" : "text-slate-500")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="flex flex-col gap-4 pt-6 border-t border-slate-800/80">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-slate-800/40 transition-colors"
          >
            <span>زيارة الموقع العام</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          {user && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-white truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">ترالي | الإدارة</span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">لوحة التحكم</span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = link.exact
                    ? pathname === link.href
                    : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium",
                        isActive
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-slate-800">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between text-sm text-slate-400 py-2"
              >
                <span>زيارة الموقع العام</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 text-rose-400 text-sm font-semibold py-2"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ToastProvider>
    </AdminAuthProvider>
  );
}
