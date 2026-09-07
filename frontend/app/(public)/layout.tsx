"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-[#070B11] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
