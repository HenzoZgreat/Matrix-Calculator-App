// components/matrix-calculator/GlobalToolsMenu.tsx
"use client"

import type React from "react"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { SettingsIcon, ChevronDownIcon } from "lucide-react"
import type { Matrix } from "../../Utils/matrix" // Adjust path as needed

interface GlobalToolsMenuProps {
  onOperationSelect: (operation: string, matrixId: string) => void
  selectedMatrixIds: string[]
  matrices: Matrix[]
}

export const GlobalToolsMenu: React.FC<GlobalToolsMenuProps> = ({ onOperationSelect, selectedMatrixIds, matrices }) => {
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

  // Close on outside click
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
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button — styled to match navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-2 h-10 px-3 rounded-xl
                   bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent-glow)]
                   border border-[var(--color-border-light)]
                   transition-all duration-300 ease-out
                   hover:border-[var(--color-accent-primary)] hover:shadow-md
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2
                   ${isOpen ? "border-[var(--color-accent-primary)] shadow-md" : ""}`}
        aria-label="Toggle global tools menu"
        aria-expanded={isOpen}
        title={selectedMatrixIds.length > 0
          ? `Apply operations to ${selectedMatrixIds.length} selected matrix(es)`
          : "Select matrices first (use checkboxes in the editor)"
        }
      >
        <SettingsIcon className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform duration-500 ${isOpen ? "rotate-90" : ""}`} />
        <span className="text-sm font-medium text-[var(--color-text-secondary)] hidden sm:inline">Tools</span>
        {selectedMatrixIds.length > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-[var(--color-accent-primary)] text-white">
            {selectedMatrixIds.length}
          </span>
        )}
        <ChevronDownIcon className={`w-3.5 h-3.5 text-[var(--color-text-muted)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] shadow-xl animate-fade-in-slide-up overflow-hidden z-50"
             style={{ backdropFilter: "blur(16px)" }}
        >
          <div className="p-4 border-b border-[var(--color-border-light)]">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">Batch Operations</h3>
            {selectedMatrixIds.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)]">Select one or more matrices first (use the checkboxes in the Matrix Editor below).</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {selectedMatrixIds.map((id) => {
                  const matrix = matrices.find((m) => m.id === id)
                  return matrix ? (
                    <span
                      key={id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)] border border-[var(--color-border-light)]"
                    >
                      {matrix.label}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto custom-scrollbar p-1.5">
            {operations.map((op) => (
              <button
                key={op.value}
                onClick={() => handleSelectOperation(op.value)}
                disabled={selectedMatrixIds.length === 0}
                className="w-full text-left px-3 py-2 text-sm rounded-lg
                          text-[var(--color-text-secondary)]
                          hover:bg-[var(--color-accent-glow)] hover:text-[var(--color-accent-primary)]
                          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                          transition-colors duration-150"
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
