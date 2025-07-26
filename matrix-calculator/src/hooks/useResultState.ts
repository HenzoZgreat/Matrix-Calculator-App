"use client"

// hooks/useResultState.ts

import { useState, useCallback } from "react"
import type { OperationResult } from "../Utils/matrix/types"

export const useResultState = () => {
  const [results, setResults] = useState<OperationResult[]>([])

  const addResult = useCallback((result: Omit<OperationResult, "id">) => {
    const newResult: OperationResult = {
      ...result,
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    // Add new results to the end of the array (they'll be displayed at the top due to reverse in component)
    setResults((prev) => [...prev, newResult])
    return newResult
  }, [])

  const removeResult = useCallback((resultId: string) => {
    setResults((prev) => prev.filter((result) => result.id !== resultId))
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  return {
    results,
    addResult,
    removeResult,
    clearResults,
  }
}
