/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "bg-tertiary": "var(--color-bg-tertiary)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        "border-light": "var(--color-border-light)",
        "border-dark": "var(--color-border-dark)",
        "card-bg": "var(--color-card-bg)",
        "accent-primary": "var(--color-accent-primary)",
        "accent-secondary": "var(--color-accent-secondary)",
      },
      keyframes: {
        "text-glow": {
          "0%, 100%": { "text-shadow": "0 0 5px rgba(99, 102, 241, 0.4)" },
          "50%": { "text-shadow": "0 0 20px rgba(139, 92, 246, 0.6)" },
        },
        "slide-in-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out-down": {
          from: { transform: "translateY(0)", opacity: "1" },
          to: { transform: "translateY(20px)", opacity: "0" },
        },
        "fade-in-scale": {
          from: { transform: "scale(0.97)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "text-glow": "text-glow 3s infinite alternate",
        "slide-in-up": "slide-in-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-out-down": "slide-out-down 0.25s ease-in forwards",
        "fade-in-scale": "fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "border-glow-cycle": "border-glow-cycle 5s linear infinite",
      },
      borderRadius: {
        lg: "var(--radius, 12px)",
        md: "calc(var(--radius, 12px) - 2px)",
        sm: "calc(var(--radius, 12px) - 4px)",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.06)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.1)",
        "glow": "0 0 40px rgba(99, 102, 241, 0.08)",
        "glow-lg": "0 0 60px rgba(99, 102, 241, 0.12)",
      },
    },
  },
  plugins: [],
}
