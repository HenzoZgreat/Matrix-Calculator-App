// components/matrix-calculator/EquationInput.tsx
"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { HelpCircleIcon, Trash2Icon } from "lucide-react"
import { SyntaxHighlightedInput } from "./SyntaxHighlightedInput"
import { SyntaxGuideModal } from "./SyntaxGuideModal"

interface EquationInputProps {
  onEvaluate: (expression: string) => void
  matrixLabels: string[] // e.g., ['A', 'B', 'C']
}

export const EquationInput: React.FC<EquationInputProps> = ({ onEvaluate, matrixLabels }) => {
  const [expression, setExpression] = useState("")
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleEvaluate = useCallback(() => {
    if (expression.trim()) {
      onEvaluate(expression)
    }
  }, [expression, onEvaluate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleEvaluate()
      }
    },
    [handleEvaluate],
  )

  // Smart token insertion that handles cursor position, selections, and parentheses
  const handleInsertToken = useCallback(
    (token: string) => {
      const input = inputRef.current
      if (!input) {
        setExpression((prev) => prev + token)
        return
      }

      const start = input.selectionStart ?? expression.length
      const end = input.selectionEnd ?? expression.length
      const selectedText = expression.substring(start, end)

      let insertedText = token
      let nextCursorPos = start + token.length

      // If text is selected and user clicks a function like "inv()", wrap the selection: "inv(selected)"
      if (selectedText && token.endsWith("()")) {
        const funcName = token.slice(0, -2)
        insertedText = `${funcName}(${selectedText})`
        nextCursorPos = start + insertedText.length
      } else if (token.endsWith("()")) {
        // Place cursor inside parentheses: "inv(|)"
        insertedText = token
        nextCursorPos = start + token.length - 1
      } else if (["+", "-", "*", "/", "^"].includes(token)) {
        // Add single friendly spacing around operators if not already spaced
        const charBefore = expression[start - 1]
        const charAfter = expression[end]
        const padBefore = charBefore && charBefore !== " " ? " " : ""
        const padAfter = charAfter && charAfter !== " " ? " " : ""
        insertedText = `${padBefore}${token}${padAfter}`
        nextCursorPos = start + insertedText.length
      }

      const newExpression = expression.substring(0, start) + insertedText + expression.substring(end)
      setExpression(newExpression)

      // Restore focus and update cursor position
      setTimeout(() => {
        input.focus()
        input.setSelectionRange(nextCursorPos, nextCursorPos)
      }, 0)
    },
    [expression],
  )

  const handleClear = useCallback(() => {
    setExpression("")
    inputRef.current?.focus()
  }, [])

  const placeholderText = matrixLabels.length > 0
    ? `e.g., A + B * inv(C), det(A), 2^3 (Matrices: ${matrixLabels.join(", ")})`
    : "Create a matrix first, then type or click expressions here..."

  const quickOperators = ["+", "-", "*", "/", "^", "(", ")"]
  const quickFunctions = [
    { label: "inv()", insert: "inv()", title: "Matrix Inverse" },
    { label: "det()", insert: "det()", title: "Determinant" },
    { label: "transpose()", insert: "transpose()", title: "Matrix Transpose" },
    { label: "ref()", insert: "ref()", title: "Row Echelon Form" },
    { label: "rank()", insert: "rank()", title: "Matrix Rank" },
    { label: "trace()", insert: "trace()", title: "Matrix Trace" },
  ]

  return (
    <div className="relative z-20 bg-transparent backdrop-blur-md p-6 rounded-lg shadow-xl border-2 border-transparent animate-border-glow-cycle transition-colors duration-300">
      {/* Header with Title and Syntax Guide Trigger */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-text-primary">Equation Input</h2>
        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-950/70 dark:hover:bg-blue-900/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700/80 transition-all shadow-sm transform hover:scale-105"
          title="Open syntax and formula cheat sheet"
        >
          <HelpCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Syntax Guide</span>
        </button>
      </div>

      {/* Input Bar & Evaluate Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-3">
        <div className="flex-grow bg-white dark:bg-[var(--color-bg-secondary)] border-b-2 border-blue-400 dark:border-blue-600 rounded-md p-2 h-12 transition-colors duration-300">
          <SyntaxHighlightedInput
            ref={inputRef}
            value={expression}
            onChange={setExpression}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            title={`Enter matrix operations or mathematical expressions here. ${placeholderText}`}
            availableMatrices={matrixLabels}
            className="h-full"
          />
        </div>
        <div className="flex items-center gap-2">
          {expression.trim() && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2.5 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
              title="Clear input"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={!expression.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-bold py-2 px-5 rounded-md transition-colors duration-200 shadow-md whitespace-nowrap"
          >
            Evaluate
          </button>
        </div>
      </div>

      {/* Clickable Expression Pills Keypad */}
      <div className="space-y-2.5 pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
        {/* Row 1: Available Matrices */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[55px]">
            Matrices:
          </span>
          {matrixLabels.length > 0 ? (
            matrixLabels.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => handleInsertToken(label)}
                className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700/80 hover:bg-blue-200 dark:hover:bg-blue-900 hover:shadow transition-all transform active:scale-95"
                title={`Insert Matrix ${label}`}
              >
                + {label}
              </button>
            ))
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
              No matrices created yet (create one on the left)
            </span>
          )}
        </div>

        {/* Row 2: Operators & Parentheses */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[55px]">
            Ops:
          </span>
          {quickOperators.map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => handleInsertToken(op)}
              className="px-2.5 py-0.5 text-xs font-bold font-mono rounded bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-all transform active:scale-95"
              title={`Insert operator ${op}`}
            >
              {op}
            </button>
          ))}
        </div>

        {/* Row 3: Common Functions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[55px]">
            Funcs:
          </span>
          {quickFunctions.map((fn) => (
            <button
              key={fn.label}
              type="button"
              onClick={() => handleInsertToken(fn.insert)}
              className="px-2 py-0.5 text-xs font-semibold font-mono rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all transform active:scale-95"
              title={fn.title}
            >
              {fn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Syntax Highlighting Legend */}
      <div className="mt-3 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/40 dark:border-gray-700/40">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-semibold text-gray-400">Legend:</span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-blue-600 dark:text-blue-400">A B C</span>
            <span>Matrices</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-purple-600 dark:text-purple-400">inv det sin</span>
            <span>Functions</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium text-orange-600 dark:text-orange-400">+ - * / ^</span>
            <span>Operators</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-600 dark:text-green-400">123</span>
            <span>Numbers</span>
          </span>
        </div>
      </div>

      {/* Syntax & Formula Guide Modal */}
      <SyntaxGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectExample={(exampleExpr) => {
          setExpression(exampleExpr)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 0)
        }}
        availableMatrices={matrixLabels}
      />
    </div>
  )
}
