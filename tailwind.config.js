/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        /** 手账色板（设计系统命名） */
        paper: "#FFFDF8",
        paperDark: "#F7F3E9",
        ink: "#4A4A48",
        inkLight: "#8C8C89",
        mint: "#A8D5BA",
        coral: "#FFB7B2",
        butter: "#FFDAC1",
        sky: "#A0C4FF",
        lavender: "#CDB4DB",
        pencil: "#E8E4D9",
        /** 兼容旧类名 */
        "paper-dark": "#F7F3E9",
        "ink-light": "#8C8C89",
        "pencil-line": "#E8E4D9",
        /** WanderAI 色板 */
        wander: {
          bg: "#0F0F0F",
          card: "#1A1A1A",
          surface: "#242424",
          border: "#27272A",
          muted: "#71717A",
          secondary: "#A1A1AA",
          brand: "#6366F1",
          violet: "#8B5CF6",
          lilac: "#A78BFA",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      fontFamily: {
        hand: ["ZCOOL KuaiLe", "cursive"],
        serif: ["Noto Serif SC", "serif"],
        script: ["Caveat", "cursive"],
      },
      borderRadius: {
        paper: "16px",
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 2px 8px rgba(139, 125, 107, 0.08)",
        warm: "0 4px 20px rgba(139, 125, 107, 0.12), 0 1px 3px rgba(139, 125, 107, 0.08)",
        stamp: "2px 2px 0px rgba(139, 125, 107, 0.15)",
        handcraft:
          "0 4px 20px rgba(139, 125, 107, 0.12), 0 1px 3px rgba(139, 125, 107, 0.08)",
        "warm-lg":
          "0 4px 20px rgba(139, 125, 107, 0.12), 0 1px 3px rgba(139, 125, 107, 0.08), 0 12px 36px rgba(139, 125, 107, 0.14)",
        "wander-glow": "0 8px 30px rgba(99, 102, 241, 0.3)",
        "wander-glow-lg": "0 12px 40px rgba(99, 102, 241, 0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "polaroid-enter": {
          "0%": {
            transform: "scale(0.8) rotate(-5deg)",
            opacity: "0.85",
          },
          "65%": {
            transform: "scale(1.03) rotate(1deg)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "1",
          },
        },
        "journal-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "15%": { transform: "translateX(-8px) rotate(-2deg)" },
          "30%": { transform: "translateX(8px) rotate(2deg)" },
          "45%": { transform: "translateX(-5px)" },
          "60%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-2px)" },
        },
        "decor-drift": {
          "0%": {
            transform: "translateY(0) rotate(0deg) scale(1)",
            opacity: "0.9",
          },
          "100%": {
            transform: "translateY(36px) rotate(22deg) scale(0.92)",
            opacity: "0",
          },
        },
        "seal-ripple": {
          "0%": { transform: "scale(0.35)", opacity: "0.45" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "results-rise": {
          "0%": {
            transform: "translateY(28px) rotate(3deg)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0) rotate(0deg)",
            opacity: "1",
          },
        },
        "page-fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "wander-pulse-ring": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
        "wander-tab-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.6))" },
          "50%": { filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.9))" },
        },
        /** 决策首页：星球光点、轨道、CTA 涟漪与铃铛光晕 */
        "wander-city-blink": {
          "0%": { opacity: "0.28" },
          "100%": { opacity: "1" },
        },
        "wander-star-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.35" },
          "50%": { transform: "translate(3px, -5px) scale(1.1)", opacity: "0.85" },
        },
        "wander-sparkle-glint": {
          "0%, 100%": { opacity: "0.75", filter: "drop-shadow(0 0 2px rgba(255,255,255,0.35))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 6px rgba(255,255,255,0.65))" },
        },
        "wander-bell-halo": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.12)" },
        },
        "wander-cta-ripple": {
          "0%": { transform: "scale(0)", opacity: "0.42" },
          "100%": { transform: "scale(4.2)", opacity: "0" },
        },
        "wander-dice-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        /** 主 CTA 阴影呼吸 */
        "wander-cta-breathe": {
          "0%, 100%": {
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.22), 0 8px 28px rgba(99,102,241,0.38), 0 0 0 1px rgba(99,102,241,0.12)",
          },
          "50%": {
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.3), 0 14px 44px rgba(139,92,246,0.48), 0 0 28px rgba(99,102,241,0.22)",
          },
        },
        /** AI 助手底部按钮：在线脉冲环 */
        "wander-assistant-halo": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.12)" },
        },
        "wander-assistant-halo-outer": {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(1.22)" },
        },
        "wander-typing-bounce": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.45" },
          "40%": { transform: "translateY(-5px)", opacity: "1" },
        },
        "wander-ai-avatar-shimmer": {
          "0%, 100%": { opacity: "0.5", transform: "translateX(-30%) skewX(-12deg)" },
          "50%": { opacity: "0.85", transform: "translateX(120%) skewX(-12deg)" },
        },
        "wander-send-plane": {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "35%": { transform: "translate(4px, -5px) rotate(-8deg)" },
          "100%": { transform: "translate(0, 0) rotate(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "polaroid-enter": "polaroid-enter 0.5s cubic-bezier(0.34, 1.45, 0.64, 1) both",
        "journal-shake": "journal-shake 0.55s ease-in-out",
        "decor-drift": "decor-drift 1s ease-in forwards",
        "seal-ripple": "seal-ripple 0.65s ease-out forwards",
        "results-rise": "results-rise 0.55s ease-out backwards",
        "page-fade-in": "page-fade-in 0.38s ease-out both",
        "wander-pulse-ring": "wander-pulse-ring 2s ease-in-out infinite",
        "wander-tab-glow": "wander-tab-glow 2.2s ease-in-out infinite",
        "wander-city-blink": "wander-city-blink 3s ease-in-out infinite alternate",
        "wander-star-drift": "wander-star-drift 7s ease-in-out infinite alternate",
        "wander-sparkle-glint": "wander-sparkle-glint 2.5s ease-in-out infinite",
        "wander-bell-halo": "wander-bell-halo 2s ease-in-out infinite",
        "wander-cta-ripple": "wander-cta-ripple 0.55s ease-out forwards",
        "wander-dice-float": "wander-dice-float 3.2s ease-in-out infinite",
        "wander-cta-breathe": "wander-cta-breathe 4s ease-in-out infinite",
        "wander-assistant-halo": "wander-assistant-halo 2.2s ease-in-out infinite",
        "wander-assistant-halo-outer": "wander-assistant-halo-outer 2.8s ease-in-out infinite",
        "wander-typing-bounce": "wander-typing-bounce 1s ease-in-out infinite",
        "wander-ai-avatar-shimmer": "wander-ai-avatar-shimmer 2.8s ease-in-out infinite",
        "wander-send-plane": "wander-send-plane 0.45s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
