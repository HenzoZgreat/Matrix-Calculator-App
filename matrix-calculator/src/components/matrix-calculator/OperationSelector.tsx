// components/matrix-calculator/OperationSelector.tsx
// This component is now integrated directly into MatrixCard.tsx
// It is kept here for completeness but not directly used by app/page.tsx anymore.
// If you need a global operation selector for multiple matrices, you would re-introduce it.
"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { ChevronDownIcon } from "lucide-react"
import type { Matrix } from "../../Utils/matrix-utils" // Adjust path as needed

interface OperationSelectorProps {
  onOperationSelect: (operation: string, matrixId: string) => void
  selectedMatrixId: string | null // For single-matrix operations
  matrices: Matrix[] // To display matrix labels in dropdown
}

export const OperationSelector: React.FC<OperationSelectorProps> = ({
  onOperationSelect,
  selectedMatrixId,
  matrices,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const operations = useMemo(
    () => [
      { name: "Transpose", value: "transpose" },
      { name: "Trace", value: "trace" },
      { name: "Determinant", value: "determinant" },
      { name: "Inverse", value: "inverse" },
      { name: "Cofactor", value: "cofactor" },
      { name: "Adjoint", value: "adjoint" },
      { name: "Sin (element-wise)", value: "sin" },
      { name: "Cos (element-wise)", value: "cos" },
      { name: "Log (element-wise)", value: "log" },
    ],
    [],
  )

  const handleSelect = useCallback(
    (operation: string) => {
      if (selectedMatrixId) {
        onOperationSelect(operation, selectedMatrixId)
        setIsOpen(false)
      }
    },
    [onOperationSelect, selectedMatrixId],
  )

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
          disabled={!selectedMatrixId}
        >
          {selectedMatrixId
            ? `Operations for ${matrices.find((m) => m.id === selectedMatrixId)?.label}`
            : "Select a Matrix for Operations"}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-all duration-200 animate-fade-in-scale"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {operations.map((op) => (
              <button
                key={op.value}
                onClick={() => handleSelect(op.value)}
                className="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                role="menuitem"
              >
                {op.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
