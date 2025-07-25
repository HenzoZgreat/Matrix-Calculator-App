// components/matrix-calculator/MatrixCreator.tsx
"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { getNextMatrixLabel } from "../../Utils/matrix-utils" // Adjust path as needed
import { MatrixTypeDropdown } from "./MatrixTypeDropdown"

interface MatrixCreatorProps {
  onCreateMatrix: (rows: number, cols: number, label: string, type: string) => void
  currentMatrixCount: number
}

export const MatrixCreator: React.FC<MatrixCreatorProps> = ({ onCreateMatrix, currentMatrixCount }) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [matrixType, setMatrixType] = useState<string>("random") // New state for matrix type

  const matrixTypeOptions = useMemo(
    () => [
      {
        category: "Basic Shapes & Forms",
        types: [
          { value: "column", label: "Column Matrix" },
          { value: "dense", label: "Dense Matrix (Random)" },
          { value: "row", label: "Row Matrix" },
          { value: "sparse", label: "Sparse Matrix" },
          { value: "zero", label: "Zero (Null) Matrix" },
        ].sort((a, b) => a.label.localeCompare(b.label)),
      },
      {
        category: "Special Square Matrices",
        types: [
          { value: "diagonal", label: "Diagonal Matrix" },
          { value: "identity", label: "Identity Matrix" },
          { value: "lower-triangular", label: "Lower Triangular Matrix" },
          { value: "scalar", label: "Scalar Matrix" },
          { value: "skew-symmetric", label: "Skew-Symmetric Matrix" },
          { value: "symmetric", label: "Symmetric Matrix" },
          { value: "upper-triangular", label: "Upper Triangular Matrix" },
        ].sort((a, b) => a.label.localeCompare(b.label)),
      },
      {
        category: "Advanced Properties (Placeholder)",
        types: [
          { value: "boolean", label: "Boolean Matrix" },
          { value: "hermitian", label: "Hermitian Matrix" },
          { value: "idempotent", label: "Idempotent Matrix" },
          { value: "involutory", label: "Involutory Matrix" },
          { value: "left-stochastic", label: "Left Stochastic Matrix" },
          { value: "nilpotent", label: "Nilpotent Matrix" },
          { value: "non-singular", label: "Non-Singular (Invertible) Matrix" },
          { value: "orthogonal", label: "Orthogonal Matrix" },
          { value: "right-stochastic", label: "Right Stochastic Matrix" },
          { value: "singular", label: "Singular Matrix" },
          { value: "stochastic", label: "Stochastic Matrix" },
        ].sort((a, b) => a.label.localeCompare(b.label)),
      },
    ],
    [],
  )

  const handleCreate = useCallback(() => {
    const label = getNextMatrixLabel(currentMatrixCount)
    onCreateMatrix(rows, cols, label, matrixType)
  }, [rows, cols, onCreateMatrix, currentMatrixCount, matrixType])

  return (
    <div className="relative z-20 bg-transparent backdrop-blur-md p-6 rounded-lg shadow-xl border-2 border-transparent animate-border-pulse transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-text-primary">Create New Matrix</h2>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="rows" className="text-text-primary text-lg w-12">
              Rows:
            </label>
            <input
              id="rows"
              type="number"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              min="1"
              className="w-20 border-b-2 border-border-light bg-transparent text-text-primary p-2 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="cols" className="text-text-primary text-lg w-12">
              Cols:
            </label>
            <input
              id="cols"
              type="number"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              min="1"
              className="w-20 border-b-2 border-border-light bg-transparent text-text-primary p-2 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-300"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="matrixType" className="text-text-primary text-lg">
            Type:
          </label>
          <MatrixTypeDropdown
            options={matrixTypeOptions}
            value={matrixType}
            onChange={setMatrixType}
            placeholder="Select matrix type"
          />
        </div>
      </div>
      <button
        onClick={handleCreate}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
      >
        Create Matrix {getNextMatrixLabel(currentMatrixCount)}
      </button>
    </div>
  )
}
