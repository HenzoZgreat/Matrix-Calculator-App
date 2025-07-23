// components/matrix-calculator/EquationInput.tsx
"use client"

import type React from "react"
import { useState, useCallback } from "react"

interface EquationInputProps {
  onEvaluate: (expression: string) => void
  matrixLabels: string[] // e.g., ['A', 'B', 'C']
}

export const EquationInput: React.FC<EquationInputProps> = ({ onEvaluate, matrixLabels }) => {
  const [expression, setExpression] = useState("")

  const handleEvaluate = useCallback(() => {
    onEvaluate(expression)
  }, [expression, onEvaluate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleEvaluate()
      }
    },
    [handleEvaluate],
  )

  return (
    <div className="bg-transparent backdrop-blur-sm p-6 rounded-lg shadow-md border-2 border-transparent animate-border-pulse transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-text-secondary">Equation Input</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`e.g., A + B * inv(C), det(A). Available matrices: ${matrixLabels.join(", ")}`}
          className="flex-grow bg-transparent border-b-2 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 font-mono p-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 placeholder-[var(--color-placeholder-light-mode)] dark:placeholder-[var(--color-placeholder-dark-mode)] animate-text-glow transition-colors duration-300"
        />
        <button
          onClick={handleEvaluate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Evaluate
        </button>
      </div>
    </div>
  )
}
