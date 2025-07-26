// components/matrix-calculator/SyntaxHighlightedInput.tsx
"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { SyntaxHighlighter, DEFAULT_HIGHLIGHT_CONFIG, MATHEMATICAL_FUNCTIONS } from "../../Utils/syntax/highlighting"

interface SyntaxHighlightedInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  title?: string
  className?: string
  availableMatrices?: string[]
  customFunctions?: string[]
}

export const SyntaxHighlightedInput: React.FC<SyntaxHighlightedInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  title,
  className = "",
  availableMatrices = [],
  customFunctions,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Initialize syntax highlighter
  const highlighter = useRef(
    new SyntaxHighlighter(availableMatrices, customFunctions || MATHEMATICAL_FUNCTIONS, DEFAULT_HIGHLIGHT_CONFIG),
  )

  // Update highlighter when matrices or functions change
  useEffect(() => {
    highlighter.current.updateMatrices(availableMatrices)
  }, [availableMatrices])

  useEffect(() => {
    if (customFunctions) {
      highlighter.current.updateFunctions(customFunctions)
    }
  }, [customFunctions])

  // Generate highlighted HTML
  const highlightedHtml = highlighter.current.highlightExpression(value).html

  // Sync scroll positions
  const syncScroll = useCallback(() => {
    if (inputRef.current && highlightRef.current) {
      highlightRef.current.scrollLeft = inputRef.current.scrollLeft
      highlightRef.current.scrollTop = inputRef.current.scrollTop
    }
  }, [])

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  // Handle focus events
  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  // Handle key events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e)
    },
    [onKeyDown],
  )

  // Sync dimensions and positions
  useEffect(() => {
    const syncDimensions = () => {
      if (inputRef.current && highlightRef.current && containerRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect()
        // const containerRect = containerRef.current.getBoundingClientRect()

        highlightRef.current.style.width = `${inputRect.width}px`
        highlightRef.current.style.height = `${inputRect.height}px`
      }
    }

    syncDimensions()
    window.addEventListener("resize", syncDimensions)
    return () => window.removeEventListener("resize", syncDimensions)
  }, [])

  const baseInputClasses = `
    w-full bg-transparent border-0 outline-none resize-none
    font-mono text-lg leading-relaxed
    placeholder-gray-400 dark:placeholder-gray-500
    relative z-10
  `.trim()

  const highlightClasses = `
    absolute top-0 left-0 
    font-mono text-lg leading-relaxed
    pointer-events-none overflow-hidden
    whitespace-pre-wrap break-words
    z-0
  `.trim()

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Highlighted background layer */}
      <div
        ref={highlightRef}
        className={highlightClasses}
        style={{
          padding: inputRef.current ? getComputedStyle(inputRef.current).padding : "0.5rem",
          color: "transparent",
        }}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />

      {/* Actual input field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onScroll={syncScroll}
        placeholder={placeholder}
        title={title}
        className={`${baseInputClasses} ${isFocused ? "text-transparent" : "text-gray-800 dark:text-gray-200"}`}
        style={{
          caretColor: isFocused ? "#3b82f6" : "auto", // Blue caret when focused
        }}
      />

      {/* Focus overlay to show syntax highlighting */}
      {isFocused && (
        <div
          className={`${highlightClasses} text-gray-800 dark:text-gray-200`}
          style={{
            padding: inputRef.current ? getComputedStyle(inputRef.current).padding : "0.5rem",
          }}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      )}
    </div>
  )
}
