/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Enable dark mode based on 'dark' class
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Add any other paths where your Tailwind classes are used
  ],
  theme: {
    extend: {
      // Define custom colors using CSS variables from globals.css
      colors: {
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "border-light": "var(--color-border-light)",
        "border-dark": "var(--color-border-dark)",
        "card-bg": "var(--color-card-bg)",
        // These HSL colors were in your previous config.
        // If you are not using them, you can remove them.
        // Otherwise, ensure their CSS variables are defined in globals.css.
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // Define custom keyframes for animations
      keyframes: {
        "border-color-pulse": {
          "0%, 100%": { "border-color": "#60a5fa" }, // blue-400
          "50%": { "border-color": "#a78bfa" }, // purple-400
        },
        "text-glow": {
          "0%, 100%": { "text-shadow": "0 0 5px rgba(59, 130, 246, 0.5)" }, // blue-500
          "50%": { "text-shadow": "0 0 15px rgba(99, 102, 241, 0.8)" }, // indigo-500
        },
        "slide-in-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out-down": {
          from: { transform: "translateY(0)", opacity: "1" },
          to: { transform: "translateY(100%)", opacity: "0" },
        },
      },
      // Map keyframes to animation utilities
      animation: {
        "border-pulse": "border-color-pulse 4s infinite alternate",
        "text-glow": "text-glow 3s infinite alternate",
        "slide-in-up": "slide-in-up 0.3s ease-out forwards",
        "slide-out-down": "slide-out-down 0.3s ease-in forwards",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [], // Removed require("tailwindcss-animate")
}
