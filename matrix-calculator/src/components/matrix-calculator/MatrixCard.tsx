// components/matrix-calculator/MatrixCard.tsx
"use client"

import type React from "react"
import { useMemo } from "react"
import { CopyIcon, ClipboardPasteIcon as PasteIcon, Trash2Icon } from "lucide-react"
import type { Matrix } from "../../Utils/matrix-utils"
import { MatrixEditor } from "./MatrixEditor"
// Removed import for MatrixOperationDropdown

interface MatrixCardProps {
  matrix: Matrix
  onCellChange: (matrixId: string, rowIndex: number, colIndex: number, value: number) => void
  onSelectMatrix: (matrixId: string, isSelected: boolean) => void
  onCopyThisMatrix: (matrixId: string) => void
  onPasteToThisMatrix: (matrixId: string) => void
  onDeleteMatrix: (matrixId: string) => void
  onOperationSelect: (operation: string, matrixId: string) => void // <-- Add this line
  copiedMatrixData: number[][] | null
  copiedMatrixDims: { rows: number; cols: number } | null
}

export const MatrixCard: React.FC<MatrixCardProps> = ({
  matrix,
  onCellChange,
  onSelectMatrix,
  onCopyThisMatrix,
  onPasteToThisMatrix,
  onDeleteMatrix,
  // Removed onOperationSelect from destructuring
  copiedMatrixData,
  copiedMatrixDims,
}) => {
  const canPaste = useMemo(() => {
    return (
      copiedMatrixData !== null &&
      copiedMatrixDims !== null &&
      matrix.rows === copiedMatrixDims.rows &&
      matrix.cols === copiedMatrixDims.cols
    )
  }, [copiedMatrixData, copiedMatrixDims, matrix.rows, matrix.cols])

  return (
    <div
      className={`relative p-px rounded-lg overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0
      ${matrix.isSelected ? "ring-2 ring-blue-300 dark:ring-blue-600" : ""}
      hover:shadow-md hover:scale-[1.01]`}
    >
      <div className="bg-transparent backdrop-blur-sm p-4 rounded-lg h-full w-full relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary">
            Matrix {matrix.label} ({matrix.rows}x{matrix.cols})
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={matrix.isSelected}
              onChange={(e) => onSelectMatrix(matrix.id, e.target.checked)}
              className="h-5 w-5 text-blue-600 dark:text-blue-400 border-border-light rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-bg-secondary transition-colors duration-300"
            />
            {/* Removed MatrixOperationDropdown from here */}
            <button
              onClick={() => onDeleteMatrix(matrix.id)}
              className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
              aria-label={`Delete Matrix ${matrix.label}`}
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <MatrixEditor matrix={matrix} onCellChange={onCellChange} />
        </div>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <button
            onClick={() => onCopyThisMatrix(matrix.id)}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors duration-200"
          >
            <CopyIcon className="w-4 h-4" /> Copy
          </button>
          <button
            onClick={() => onPasteToThisMatrix(matrix.id)}
            disabled={!canPaste}
            className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PasteIcon className="w-4 h-4" /> Paste
          </button>
        </div>
      </div>
    </div>
  )
}
