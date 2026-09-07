import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-readex",
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
    <html lang="ar" dir="rtl" className={readexPro.variable}>
      <body className="min-h-screen bg-[#070B11] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200 font-sans">
        {children}
      </body>
    </html>
  );
}

