import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ترالي | منصة هندسة الأوامر التربوية المتخصصة",
  description:
    "ترالي هي المنصة الأولى المتخصصة في هندسة وتوليد أوامر الذكاء الاصطناعي للمربين، المعلمين، وصناع الأثر التعليمي.",
  keywords: [
    "ترالي",
    "ذكاء اصطناعي تربوي",
    "هندسة الأوامر",
    "تصميم التعليم",
    "مبادرات تربوية",
    "محاضن تربوية",
    "مراجعة مخرجات الذكاء الاصطناعي",
  ],
  authors: [{ name: "Trali Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
