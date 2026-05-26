import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        accent: {
          purple: "#7c3aed",
          blue: "#2563eb",
          cyan: "#06b6d4",
          green: "#10b981",
          orange: "#f59e0b",
          red: "#ef4444",
          indigo: "#6366f1",
        },
        bg: {
          primary: "#0a0a0f",
          secondary: "#0f0f1a",
          card: "#12121f",
          "card-hover": "#1a1a2e",
          elevated: "#16162a",
        },
        border: {
          DEFAULT: "#1e1e3a",
          light: "#2a2a4a",
          glow: "rgba(124, 58, 237, 0.3)",
        },
        text: {
          primary: "#f8fafc",
          secondary: "#94a3b8",
          muted: "#475569",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
        "gradient-hero": "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
        "gradient-radial": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 58, 237, 0.4)",
        "glow-lg": "0 0 40px rgba(124, 58, 237, 0.6)",
        "glow-blue": "0 0 20px rgba(37, 99, 235, 0.4)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.4)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.6)",
        neon: "0 0 5px #7c3aed, 0 0 10px #7c3aed, 0 0 20px #7c3aed",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-delayed": "float-delayed 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        shimmer: "shimmer 2s linear infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "scale-pulse": "scale-pulse 2s ease-in-out infinite",
        "bounce-in": "bounce-in 0.6s ease forwards",
        "slide-up": "slide-up 0.5s ease forwards",
        "glow-ring": "glow-ring 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(180deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(124, 58, 237, 0.7)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "70%": { transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-ring": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(124, 58, 237, 0.5), 0 0 30px rgba(124, 58, 237, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.8), 0 0 60px rgba(124, 58, 237, 0.4)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
