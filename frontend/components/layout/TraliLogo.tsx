"use client";

import React, { useId } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TraliLogoProps {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
}

export function TraliLogo({
  href = "/",
  size = "md",
  className,
  showSubtitle = true,
  subtitleText = "الذكاء الاصطناعي التربوي",
}: TraliLogoProps) {
  const gradientId = useId();

  // Size configurations
  const sizeStyles = {
    sm: {
      container: "gap-2.5",
      iconBox: "h-9 w-9 rounded-xl",
      svg: "w-5 h-5",
      latin: "text-lg",
      badge: "text-[10px] px-1.5 py-0.5 rounded",
      subtitle: "text-[9px]",
      dot: "h-2 w-2",
    },
    md: {
      container: "gap-3.5",
      iconBox: "h-11 w-11 rounded-2xl",
      svg: "w-6 h-6",
      latin: "text-2xl",
      badge: "text-xs px-2 py-0.5 rounded-md",
      subtitle: "text-[11px]",
      dot: "h-2.5 w-2.5",
    },
    lg: {
      container: "gap-4",
      iconBox: "h-14 w-14 rounded-2xl",
      svg: "w-8 h-8",
      latin: "text-3xl",
      badge: "text-sm px-2.5 py-1 rounded-lg",
      subtitle: "text-xs",
      dot: "h-3 w-3",
    },
  }[size];

  const content = (
    <>
      {/* Isometric 3D Faceted Icon */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        {/* Ambient Breathing Glow */}
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-md pointer-events-none transition-all duration-300 group-hover:bg-emerald-500/35 group-hover:blur-lg" />

        {/* Backlit Frosted Tile */}
        <div
          className={cn(
            "relative flex items-center justify-center bg-gradient-to-br from-[#0B1118]/90 via-[#101722]/80 to-[#070B11]/90 border border-emerald-500/35 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400/60 group-hover:shadow-[0_0_28px_-2px_rgba(16,185,129,0.5)]",
            sizeStyles.iconBox
          )}
        >
          {/* Isometric 3D SVG Geometry */}
          <svg
            viewBox="0 0 36 36"
            className={cn("drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]", sizeStyles.svg)}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Top Face Gradient: #34d399 to #059669 */}
              <linearGradient
                id={`${gradientId}-top`}
                x1="6"
                y1="4"
                x2="30"
                y2="18"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Left Face Gradient: #10b981 to #047857 */}
              <linearGradient
                id={`${gradientId}-left`}
                x1="6"
                y1="11"
                x2="18"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              {/* Right Face Gradient: #059669 to #064e3b */}
              <linearGradient
                id={`${gradientId}-right`}
                x1="18"
                y1="11"
                x2="30"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>

              {/* Core Point Glow Filter */}
              <radialGradient
                id={`${gradientId}-core-glow`}
                cx="18"
                cy="18"
                r="4"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#ecfdf5" stopOpacity="1" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 1. Top Face */}
            <path
              d="M 18,4 L 30,11 L 18,18 L 6,11 Z"
              fill={`url(#${gradientId}-top)`}
              stroke="rgba(236, 253, 245, 0.4)"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />

            {/* 2. Left Face */}
            <path
              d="M 6,11 L 18,18 L 18,32 L 6,25 Z"
              fill={`url(#${gradientId}-left)`}
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />

            {/* 3. Right Face */}
            <path
              d="M 18,18 L 30,11 L 30,25 L 18,32 Z"
              fill={`url(#${gradientId}-right)`}
              stroke="rgba(5, 150, 105, 0.3)"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />

            {/* Facet Ridge Highlights */}
            <line
              x1="18"
              y1="4"
              x2="18"
              y2="18"
              stroke="#ecfdf5"
              strokeWidth="0.75"
              strokeOpacity="0.45"
            />
            <line
              x1="6"
              y1="11"
              x2="18"
              y2="18"
              stroke="#ecfdf5"
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />
            <line
              x1="30"
              y1="11"
              x2="18"
              y2="18"
              stroke="#ecfdf5"
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />
            <line
              x1="18"
              y1="18"
              x2="18"
              y2="32"
              stroke="#a7f3d0"
              strokeWidth="0.75"
              strokeOpacity="0.4"
            />

            {/* Center Core Halo */}
            <circle
              cx="18"
              cy="18"
              r="4.5"
              fill={`url(#${gradientId}-core-glow)`}
            />

            {/* Center Core Point: #ecfdf5 */}
            <circle
              cx="18"
              cy="18"
              r="1.8"
              fill="#ecfdf5"
              className="drop-shadow-[0_0_4px_#ecfdf5]"
            />
          </svg>

          {/* Pulse Status Indicator */}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 flex",
              sizeStyles.dot
            )}
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
          </span>
        </div>
      </div>

      {/* Brand Typography & Lockup */}
      <div className="flex flex-col select-none">
        <div className="flex items-center gap-2">
          {/* Latin Text: Trali (Bold, High-Contrast White) */}
          <span
            className={cn(
              "font-extrabold tracking-tight text-white font-sans drop-shadow-sm leading-none",
              sizeStyles.latin
            )}
          >
            Trali
          </span>

          {/* Arabic Sub-badge: ترالي (Emerald Accent) */}
          <span
            className={cn(
              "font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 leading-none shadow-sm transition-colors group-hover:border-emerald-400/50 group-hover:bg-emerald-500/20",
              sizeStyles.badge
            )}
          >
            ترالي
          </span>
        </div>

        {/* Optional Subtitle */}
        {showSubtitle && subtitleText && (
          <span
            className={cn(
              "text-slate-400 font-medium tracking-wide mt-1 leading-tight",
              sizeStyles.subtitle
            )}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center transition-opacity hover:opacity-95",
          sizeStyles.container,
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
        "group flex items-center",
        sizeStyles.container,
        className
      )}
    >
      {content}
    </div>
  );
}
