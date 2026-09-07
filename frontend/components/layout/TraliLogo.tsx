"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface TraliLogoProps {
  variant?: "navbar" | "footer";
  href?: string | null;
  className?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
}

export function TraliLogo({
  variant = "navbar",
  href = "/",
  className,
  showSubtitle = true,
  subtitleText = "الذكاء الاصطناعي التربوي",
}: TraliLogoProps) {
  const isFooter = variant === "footer";

  const content = (
    <div className={cn("flex items-center gap-3", isFooter ? "gap-3.5" : "gap-3")}>
      {/* Icon Wrapper */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        {/* Inner Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md pointer-events-none transition-all duration-300 group-hover:bg-emerald-500/35 group-hover:blur-lg" />

        {/* Backlit Tile */}
        <div
          className={cn(
            "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1118]/95 via-[#101722]/85 to-[#070B11]/95 border border-emerald-500/35 shadow-[0_0_18px_-3px_rgba(16,185,129,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400/60 group-hover:shadow-[0_0_25px_-2px_rgba(16,185,129,0.45)] overflow-hidden",
            isFooter ? "h-13 w-13 p-1.5" : "h-10 w-10 sm:h-11 sm:w-11 p-1"
          )}
        >
          <Image
            src="/images/logo.png"
            alt="ترالي Trali"
            width={isFooter ? 48 : 38}
            height={isFooter ? 48 : 38}
            priority
            className="w-full h-full object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
          />

          {/* Subtle status pulse indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
          </span>
        </div>
      </div>

      {/* Text Brand Styling */}
      <div className="flex flex-col select-none justify-center">
        <div className="flex items-center gap-2">
          {/* Main Title: ترالي (Arabic in Readex Pro, Crisp High-Contrast) */}
          <span
            className={cn(
              "font-extrabold tracking-tight text-white font-sans drop-shadow-sm leading-none",
              isFooter ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            )}
          >
            ترالي
          </span>

          {/* English Subtitle/Badge: Trali (Muted Emerald) */}
          <span
            className={cn(
              "font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 tracking-wide leading-none shadow-sm transition-colors group-hover:border-emerald-400/50 group-hover:bg-emerald-500/20",
              isFooter
                ? "text-xs px-2.5 py-0.5 rounded-md"
                : "text-[11px] px-2 py-0.5 rounded-md"
            )}
          >
            Trali
          </span>
        </div>

        {/* Optional Subtitle */}
        {showSubtitle && subtitleText && (
          <span
            className={cn(
              "text-slate-400 font-medium tracking-wide leading-tight",
              isFooter ? "text-xs mt-1.5" : "text-[10px] sm:text-[11px] mt-1"
            )}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "group inline-flex items-center transition-opacity hover:opacity-95",
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "group inline-flex items-center",
        className
      )}
    >
      {content}
    </div>
  );
}
