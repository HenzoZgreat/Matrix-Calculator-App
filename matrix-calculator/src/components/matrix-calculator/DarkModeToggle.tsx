// components/matrix-calculator/DarkModeToggle.tsx
"use client"

import { useCallback } from "react"
import type React from "react"
import { useState, useEffect } from "react"
import { SunIcon, MoonIcon } from "lucide-react"

export const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev
      if (newMode) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
      return newMode
    })
  }, [])

  return (
    <button
      onClick={toggleDarkMode}
      className="group relative flex items-center justify-center w-10 h-10 rounded-xl
                 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent-glow)]
                 border border-[var(--color-border-light)]
                 transition-all duration-300 ease-out
                 hover:border-[var(--color-accent-primary)] hover:shadow-md
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <SunIcon
          className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-500 ease-out
            ${darkMode
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50"
            }`}
        />
        {/* Moon icon */}
        <MoonIcon
          className={`absolute inset-0 w-5 h-5 text-indigo-400 transition-all duration-500 ease-out
            ${darkMode
              ? "opacity-0 rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100"
            }`}
        />
      </div>
    </button>
  )
}
