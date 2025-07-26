// components/matrix-calculator/EquationInput.tsx
"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { SyntaxHighlightedInput } from "./SyntaxHighlightedInput"

interface EquationInputProps {
  onEvaluate: (expression: string) => void
  matrixLabels: string[] // e.g., ['A', 'B', 'C']
}

export const EquationInput: React.FC<EquationInputProps> = ({ onEvaluate, matrixLabels }) => {
  const [expression, setExpression] = useState("")

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

  const placeholderText = `e.g., A + B * inv(C), det(A), 2^3. Available matrices: ${matrixLabels.join(", ")}`

  return (
    <div className="relative z-20 bg-transparent backdrop-blur-md p-6 rounded-lg shadow-xl border-2 border-transparent animate-border-pulse transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-text-primary">Equation Input</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow bg-white dark:bg-[var(--color-bg-secondary)] border-b-2 border-blue-400 dark:border-blue-600 rounded-md p-2 h-12 transition-colors duration-300">
          <SyntaxHighlightedInput
            value={expression}
            onChange={setExpression}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            title={`Enter matrix operations or mathematical expressions here. ${placeholderText}`}
            availableMatrices={matrixLabels}
            className="h-full"
          />
        </div>
        <button
          onClick={handleEvaluate}
          disabled={!expression.trim()}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Evaluate
        </button>
      </div>

      {/* Legend for syntax highlighting */}
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex flex-wrap gap-4">
          <span className="flex items-center gap-1">
            <span className="font-bold text-blue-600 dark:text-blue-400">A B C</span>
            <span>Matrices</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-purple-600 dark:text-purple-400">sin cos det</span>
            <span>Functions</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium text-orange-600 dark:text-orange-400">+ - * /</span>
            <span>Operators</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-600 dark:text-green-400">123</span>
            <span>Numbers</span>
          </span>
        </div>
      </div>
    </div>
  )
}
