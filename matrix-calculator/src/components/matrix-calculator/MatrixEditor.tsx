// components/matrix-calculator/MatrixEditor.tsx
"use client"

import type React from "react"
import type { Matrix } from "../../Utils/matrix-utils" // Adjust path as needed

interface MatrixEditorProps {
  matrix: Matrix
  onCellChange: (matrixId: string, rowIndex: number, colIndex: number, value: number) => void
}

export const MatrixEditor: React.FC<MatrixEditorProps> = ({ matrix, onCellChange }) => {
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
              className="w-16 text-center border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 p-2 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-300"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
