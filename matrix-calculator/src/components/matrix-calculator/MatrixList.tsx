// components/matrix-calculator/MatrixList.tsx
"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import type { Matrix } from "../../Utils/matrix-utils"
import { MatrixCard } from "./MatrixCard"

interface MatrixListProps {
  matrices: Matrix[]
  onCellChange: (matrixId: string, rowIndex: number, colIndex: number, value: number) => void
  onSelectMatrix: (matrixId: string, isSelected: boolean) => void
  onCopyMatrix: (matrixId: string) => void
  onPasteMatrix: (matrixId: string) => void
  onDeleteMatrix: (matrixId: string) => void
  onOperationSelect: (operation: string, matrixId: string) => void
  copiedMatrixData: number[][] | null
  copiedMatrixDims: { rows: number; cols: number } | null
  activeTabId: string | null
  setActiveTabId: (id: string | null) => void
}

export const MatrixList: React.FC<MatrixListProps> = ({
  matrices,
  onCellChange,
  onSelectMatrix,
  onCopyMatrix,
  onPasteMatrix,
  onDeleteMatrix,
  onOperationSelect,
  copiedMatrixData,
  copiedMatrixDims,
  activeTabId,
  setActiveTabId,
}) => {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768) // Tailwind's 'md' breakpoint
    }
    checkIsDesktop()
    window.addEventListener("resize", checkIsDesktop)
    return () => window.removeEventListener("resize", checkIsDesktop)
  }, [])

  const handleTabClick = useCallback(
    (matrixId: string) => {
      setActiveTabId(matrixId)
    },
    [setActiveTabId],
  )

  const activeMatrix = matrices.find((m) => m.id === activeTabId)

  if (isDesktop) {
    return (
      <div className="bg-transparent backdrop-blur-sm p-6 rounded-lg shadow-xl transition-colors duration-300 w-full h-auto">
        <h2 className="text-xl font-semibold mb-4 text-text-secondary">Matrix Editor</h2>
        {matrices.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No matrices created yet. Use the "Create New Matrix" section above.
          </p>
        ) : (
          <>
            {/* Tab Buttons (Chrome-like) */}
            <div className="flex flex-wrap gap-1 mb-4 border-b border-border-light custom-scrollbar overflow-x-auto">
              {matrices.map((matrix) => (
                <button
                  key={matrix.id}
                  onClick={() => handleTabClick(matrix.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-t-lg
                    ${
                      activeTabId === matrix.id
                        ? "bg-card-bg text-text-primary border-b-2 border-blue-500 dark:border-blue-400 z-10 -mb-px"
                        : "bg-transparent text-text-secondary hover:bg-gray-100/20 dark:hover:bg-gray-800/20"
                    }`}
                >
                  Matrix {matrix.label}
                </button>
              ))}
            </div>

            {/* Active Matrix Content */}
            {activeMatrix ? (
              <div className="animate-fade-in-scale">
                <MatrixCard
                  matrix={activeMatrix}
                  onCellChange={onCellChange}
                  onSelectMatrix={onSelectMatrix}
                  onCopyThisMatrix={onCopyMatrix}
                  onPasteToThisMatrix={onPasteMatrix}
                  onDeleteMatrix={onDeleteMatrix}
                  onOperationSelect={onOperationSelect}
                  copiedMatrixData={copiedMatrixData}
                  copiedMatrixDims={copiedMatrixDims}
                />
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Select a matrix tab to view and edit.</p>
            )}
          </>
        )}
      </div>
    )
  } else {
    // Mobile view: original horizontal scrolling list
    return (
      <div
        className="bg-transparent backdrop-blur-sm p-6 rounded-lg shadow-xl transition-colors duration-300
                   w-full h-auto overflow-x-auto overflow-y-hidden"
      >
        <h2 className="text-xl font-semibold mb-4 text-text-secondary">Your Matrices</h2>
        {matrices.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No matrices created yet. Use the "Create New Matrix" section above.
          </p>
        ) : (
          <div className="flex flex-nowrap gap-6 pb-4 md:flex-col md:flex-wrap md:justify-start md:overflow-x-hidden">
            {matrices.map((matrix) => (
              <MatrixCard
                key={matrix.id}
                matrix={matrix}
                onCellChange={onCellChange}
                onSelectMatrix={onSelectMatrix}
                onCopyThisMatrix={onCopyMatrix}
                onPasteToThisMatrix={onPasteMatrix}
                onDeleteMatrix={onDeleteMatrix}
                onOperationSelect={onOperationSelect}
                copiedMatrixData={copiedMatrixData}
                copiedMatrixDims={copiedMatrixDims}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
}
