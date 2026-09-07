import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        nocturnal: {
          950: "#070B11",
          900: "#0B1118",
          850: "#101722",
          800: "#16202E",
          750: "#1B283A",
          700: "#223247",
        },
        forest: {
          950: "#081310",
          900: "#0D211B",
          850: "#142E26",
          800: "#1E3D34",
          700: "#2F4F4F",
          600: "#3D6B5E",
          500: "#4D8374",
        },
        slate: {
          850: "#101722",
          900: "#0B1118",
          950: "#070B11",
        },
      },
      fontFamily: {
        sans: ["var(--font-readex)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-slow": "glow 6s ease-in-out infinite alternate",
        "float-slow": "float 5s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%": { opacity: "0.4", transform: "scale(0.98)" },
          "100%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

