"use client"

import type React from "react"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { SettingsIcon, ChevronUpIcon } from "lucide-react" // <--- Add this line

interface MatrixOperationDropdownProps {
  matrixId: string
  matrixLabel: string
  onOperationSelect: (operation: string, matrixId: string) => void
}

export const MatrixOperationDropdown: React.FC<MatrixOperationDropdownProps> = ({
  matrixId,
  matrixLabel,
  onOperationSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const operations = useMemo(
    () => [
      { name: "Transpose", value: "transpose" },
      { name: "Trace", value: "trace" },
      { name: "Determinant", value: "determinant" },
      { name: "Inverse", value: "inverse" },
      { name: "Cofactor", value: "cofactor" },
      { name: "Adjoint", value: "adjoint" },
      { name: "Row Echelon Form", value: "ref" },
      { name: "Rank", value: "rank" },
      { name: "LU Decomposition", value: "lu-decomposition" },
      { name: "Sin (element-wise)", value: "sin" },
      { name: "Cos (element-wise)", value: "cos" },
      { name: "Log (element-wise)", value: "log" },
    ],
    [],
  )

  const handleSelect = useCallback(
    (operation: string) => {
      onOperationSelect(operation, matrixId)
      setIsOpen(false)
    },
    [onOperationSelect, matrixId],
  )

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Operations for Matrix ${matrixLabel}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Perform operations on Matrix ${matrixLabel}`}
      >
        {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <SettingsIcon className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div
          className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-bg-secondary ring-1 ring-black ring-opacity-5 focus:outline-none z-10
          ${isOpen ? "animate-fade-in-slide-up" : "animate-fade-out-slide-down"}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1 max-h-80 overflow-y-auto custom-scrollbar" role="none">
            {operations.map((op) => (
              <button
                key={op.value}
                onClick={() => handleSelect(op.value)}
                className="text-text-primary block px-4 py-2 text-sm w-full text-left hover:bg-gray-100/20 dark:hover:bg-gray-800/20 transition-colors duration-200"
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
