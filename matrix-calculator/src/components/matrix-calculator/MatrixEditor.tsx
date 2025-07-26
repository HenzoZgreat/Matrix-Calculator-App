// components/matrix-calculator/MatrixEditor.tsx
"use client"

import type React from "react"
import { useRef, useCallback } from "react"
import type { Matrix } from "../../Utils/matrix" // Adjust path as needed

interface MatrixEditorProps {
  matrix: Matrix
  onCellChange: (matrixId: string, rowIndex: number, colIndex: number, value: number) => void
}

export const MatrixEditor: React.FC<MatrixEditorProps> = ({ matrix, onCellChange }) => {
  // Use a Map to store refs for each input element, keyed by "rowIndex-colIndex"
  const inputRefs = useRef(new Map<string, HTMLInputElement>())

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
      if (e.key === "Enter") {
        e.preventDefault() // Prevent form submission

        const rows = matrix.rows
        const cols = matrix.cols

        let nextRowIndex = rowIndex
        let nextColIndex = colIndex + 1

        // Move to the next column, or next row if at end of current row
        if (nextColIndex >= cols) {
          nextColIndex = 0
          nextRowIndex++
        }

        // Loop back to the first element if at the end of the matrix
        if (nextRowIndex >= rows) {
          nextRowIndex = 0
          nextColIndex = 0
        }

        // Get the next input element and focus it
        const nextInputKey = `${nextRowIndex}-${nextColIndex}`
        const nextInputElement = inputRefs.current.get(nextInputKey)
        if (nextInputElement) {
          nextInputElement.focus()
        }
      }
    },
    [matrix.rows, matrix.cols],
  )

  return (
    <div className="grid gap-2">
      {matrix.data.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              value={cell}
              onChange={(e) => onCellChange(matrix.id, rowIndex, colIndex, Number(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              ref={(el) => {
                // Store the ref in the map
                if (el) {
                  inputRefs.current.set(`${rowIndex}-${colIndex}`, el)
                } else {
                  inputRefs.current.delete(`${rowIndex}-${colIndex}`)
                }
              }}
              className="w-16 text-center border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 p-2 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-300"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
