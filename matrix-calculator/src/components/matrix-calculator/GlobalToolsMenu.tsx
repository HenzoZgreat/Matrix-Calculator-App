// components/matrix-calculator/GlobalToolsMenu.tsx
"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { SettingsIcon, ChevronDownIcon } from "lucide-react"
import type { Matrix } from "../../Utils/matrix" // Adjust path as needed

interface GlobalToolsMenuProps {
  onOperationSelect: (operation: string, matrixId: string) => void
  selectedMatrixIds: string[]
  matrices: Matrix[]
}

export const GlobalToolsMenu: React.FC<GlobalToolsMenuProps> = ({ onOperationSelect, selectedMatrixIds, matrices }) => {
  const [isOpen, setIsOpen] = useState(false)

  const operations = useMemo(
    () => [
      { name: "Transpose", value: "transpose" },
      { name: "Trace", value: "trace" },
      { name: "Determinant", value: "determinant" },
      { name: "Inverse", value: "inverse" },
      { name: "Cofactor", value: "cofactor" },
      { name: "Adjoint", value: "adjoint" },
      { name: "Row Echelon Form", value: "ref" }, // New operation
      { name: "Rank", value: "rank" }, // New operation
      { name: "LU Decomposition", value: "lu-decomposition" }, // New operation (placeholder)
      { name: "Sin (element-wise)", value: "sin" },
      { name: "Cos (element-wise)", value: "cos" },
      { name: "Log (element-wise)", value: "log" },
    ],
    [],
  )

  const handleSelectOperation = useCallback(
    (operation: string) => {
      if (selectedMatrixIds.length > 0) {
        selectedMatrixIds.forEach((matrixId) => {
          onOperationSelect(operation, matrixId)
        })
        setIsOpen(false) // Close dropdown after applying operation
      }
    },
    [onOperationSelect, selectedMatrixIds],
  )

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-end items-center">
      {isOpen && (
        <div className="absolute top-full right-4 mt-2 bg-bg-secondary border border-border-light rounded-lg shadow-xl w-64 animate-slide-in-up transition-colors duration-300">
          <div className="p-4">
            <h3 className="font-bold text-text-primary mb-2">Select Operation:</h3>
            {selectedMatrixIds.length === 0 ? (
              <p className="text-gray-400">Select one or more matrices first.</p>
            ) : (
              <div className="max-h-40 overflow-y-auto custom-scrollbar">
                {operations.map((op) => (
                  <button
                    key={op.value}
                    onClick={() => handleSelectOperation(op.value)}
                    className="text-sm text-text-secondary px-2 py-1 rounded-md hover:bg-gray-100/20 transition-colors duration-200 text-left w-full block"
                  >
                    {op.name}
                  </button>
                ))}
              </div>
            )}
            {selectedMatrixIds.length > 0 && (
              <div className="mt-4 pt-2 border-t border-border-light">
                <h3 className="font-bold text-text-primary mb-2">Selected Matrices:</h3>
                <ul className="text-sm text-text-secondary">
                  {selectedMatrixIds.map((id) => {
                    const matrix = matrices.find((m) => m.id === id)
                    return matrix ? <li key={id}>- Matrix {matrix.label}</li> : null
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Toggle global tools menu"
      >
        {isOpen ? <ChevronDownIcon className="w-6 h-6" /> : <SettingsIcon className="w-6 h-6" />}
      </button>
    </div>
  )
}
