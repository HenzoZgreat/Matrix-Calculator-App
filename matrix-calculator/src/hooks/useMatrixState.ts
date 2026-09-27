"use client"

// hooks/useMatrixState.ts

import { useState, useCallback, useEffect } from "react"
import type { Matrix } from "../Utils/matrix/types"

const getInitialMatrices = (key?: string): Matrix[] => {
  if (typeof window === "undefined" || !key) return []
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error("Failed to load matrices from localStorage:", error)
  }
  return []
}

export const useMatrixState = (storageKey: string = "matrix_calc_matrices") => {
  const [matrices, setMatrices] = useState<Matrix[]>(() => getInitialMatrices(storageKey))
  const [activeTabId, setActiveTabId] = useState<string | null>(() => {
    const initial = getInitialMatrices(storageKey)
    return initial.length > 0 ? initial[0].id : null
  })

  // Synchronize matrices to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined" || !storageKey) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(matrices))
    } catch (error) {
      console.error("Failed to persist matrices to localStorage:", error)
    }
  }, [matrices, storageKey])

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
        const filteredMatrices = prev.filter((m) => m.id !== matrixId)

        // Re-label the remaining matrices sequentially from 'A'
        const reLabeledMatrices = filteredMatrices.map((matrix, index) => ({
          ...matrix,
          label: String.fromCharCode(65 + index), // Assign new label 'A', 'B', 'C', ...
        }))

        // Handle activeTabId if the deleted matrix was active
        if (activeTabId === matrixId) {
          setActiveTabId(reLabeledMatrices.length > 0 ? reLabeledMatrices[0].id : null)
        } else if (activeTabId) {
          // If the active tab was not deleted, ensure its label is updated if it changed
          const currentActiveMatrix = reLabeledMatrices.find((m) => m.id === activeTabId)
          if (!currentActiveMatrix) {
            // If active matrix was somehow removed or not found in re-labeled list
            setActiveTabId(reLabeledMatrices.length > 0 ? reLabeledMatrices[0].id : null)
          }
        }

        return reLabeledMatrices
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
