"use client"

// hooks/useMatrixState.ts

import { useState, useCallback } from "react"
import type { Matrix } from "../Utils/matrix/types"

export const useMatrixState = () => {
  const [matrices, setMatrices] = useState<Matrix[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

  const addMatrix = useCallback((matrix: Matrix) => {
    setMatrices((prev) => {
      const updated = [...prev, matrix]
      setActiveTabId(matrix.id)
      return updated
    })
  }, [])

  const removeMatrix = useCallback(
    (matrixId: string) => {
      setMatrices((prev) => {
        const updated = prev.filter((m) => m.id !== matrixId)
        if (activeTabId === matrixId) {
          setActiveTabId(updated.length > 0 ? updated[0].id : null)
        }
        return updated
      })
    },
    [activeTabId],
  )

  const updateMatrix = useCallback((matrixId: string, updates: Partial<Matrix>) => {
    setMatrices((prev) => prev.map((matrix) => (matrix.id === matrixId ? { ...matrix, ...updates } : matrix)))
  }, [])

  const updateMatrixCell = useCallback((matrixId: string, rowIndex: number, colIndex: number, value: number) => {
    setMatrices((prev) =>
      prev.map((matrix) =>
        matrix.id === matrixId
          ? {
              ...matrix,
              data: matrix.data.map((row, rIdx) =>
                rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row,
              ),
            }
          : matrix,
      ),
    )
  }, [])

  const selectMatrix = useCallback((matrixId: string, isSelected: boolean) => {
    setMatrices((prev) => prev.map((matrix) => (matrix.id === matrixId ? { ...matrix, isSelected } : matrix)))
  }, [])

  return {
    matrices,
    activeTabId,
    setActiveTabId,
    addMatrix,
    removeMatrix,
    updateMatrix,
    updateMatrixCell,
    selectMatrix,
  }
}
