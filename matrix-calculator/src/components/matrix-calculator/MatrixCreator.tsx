// components/matrix-calculator/MatrixCreator.tsx
"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { getNextMatrixLabel } from "../../Utils/matrix" // Adjust path as needed
import { MatrixTypeDropdown } from "./MatrixTypeDropdown"
// Removed: import { useNotifications } from "../../hooks/useNotifications" // Import useNotifications

interface MatrixCreatorProps {
  onCreateMatrix: (rows: number, cols: number, label: string, type: string) => void
  currentMatrixCount: number
  showNotification: (message: string, type: "success" | "error") => void // New prop
}

// Define maximum allowed dimensions
const MAX_ROWS = 10
const MAX_COLS = 10

export const MatrixCreator: React.FC<MatrixCreatorProps> = ({
  onCreateMatrix,
  currentMatrixCount,
  showNotification,
}) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [matrixType, setMatrixType] = useState<string>("random") // New state for matrix type
  // Removed: const { showNotification } = useNotifications() // Use the notification hook

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
    if (rows > MAX_ROWS || cols > MAX_COLS) {
      showNotification(`Dimensions exceed maximum allowed: Max Rows: ${MAX_ROWS}, Max Columns: ${MAX_COLS}.`, "error")
      return
    }
    if (rows < 1 || cols < 1) {
      showNotification("Dimensions must be at least 1x1.", "error")
      return
    }

    const label = getNextMatrixLabel(currentMatrixCount)
    onCreateMatrix(rows, cols, label, matrixType)
  }, [rows, cols, onCreateMatrix, currentMatrixCount, matrixType, showNotification])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCreate()
      }
    },
    [handleCreate],
  )

  return (
    <div className="relative z-30">
      <h2 className="text-lg font-bold mb-4 text-[var(--color-text-primary)] tracking-tight">Create New Matrix</h2>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="rows" className="text-[var(--color-text-secondary)] text-sm font-medium w-12">
              Rows:
            </label>
            <input
              id="rows"
              type="number"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              onKeyDown={handleKeyDown}
              min="1"
              max={MAX_ROWS}
              className="w-20 border-b-2 border-[var(--color-border-light)] bg-transparent text-[var(--color-text-primary)] p-2 focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors duration-300 rounded-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="cols" className="text-[var(--color-text-secondary)] text-sm font-medium w-12">
              Cols:
            </label>
            <input
              id="cols"
              type="number"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              onKeyDown={handleKeyDown}
              min="1"
              max={MAX_COLS}
              className="w-20 border-b-2 border-[var(--color-border-light)] bg-transparent text-[var(--color-text-primary)] p-2 focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors duration-300 rounded-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="matrixType" className="text-[var(--color-text-secondary)] text-sm font-medium">
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
        className="btn-accent w-full py-2.5 text-sm"
      >
        Create Matrix {getNextMatrixLabel(currentMatrixCount)}
      </button>
    </div>
  )
}
