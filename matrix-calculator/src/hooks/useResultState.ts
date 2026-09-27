"use client"

// hooks/useResultState.ts

import { useState, useCallback, useEffect } from "react"
import type { OperationResult } from "../Utils/matrix/types"

interface StoredResultsEnvelope {
  timestamp: number
  results: OperationResult[]
}

const DEFAULT_EXPIRY_MS = 24 * 60 * 60 * 1000 // 1 day

const getInitialResults = (key?: string, expiryMs: number = DEFAULT_EXPIRY_MS): OperationResult[] => {
  if (typeof window === "undefined" || !key) return []
  try {
    const raw = sessionStorage.getItem(key)
    if (raw) {
      const parsed: StoredResultsEnvelope = JSON.parse(raw)
      if (parsed && typeof parsed.timestamp === "number" && Array.isArray(parsed.results)) {
        const isExpired = Date.now() - parsed.timestamp > expiryMs
        if (isExpired) {
          sessionStorage.removeItem(key)
          return []
        }
        return parsed.results
      }
    }
  } catch (error) {
    console.error("Failed to load results from sessionStorage:", error)
  }
  return []
}

export const useResultState = (
  storageKey: string = "matrix_calc_results_history",
  expiryMs: number = DEFAULT_EXPIRY_MS,
) => {
  const [results, setResults] = useState<OperationResult[]>(() => getInitialResults(storageKey, expiryMs))

  // Synchronize results to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined" || !storageKey) return
    try {
      if (results.length === 0) {
        sessionStorage.removeItem(storageKey)
      } else {
        // Preserve existing session timestamp if still within expiry period, otherwise use now
        let timestamp = Date.now()
        const existingRaw = sessionStorage.getItem(storageKey)
        if (existingRaw) {
          try {
            const existingParsed: StoredResultsEnvelope = JSON.parse(existingRaw)
            if (
              existingParsed &&
              typeof existingParsed.timestamp === "number" &&
              Date.now() - existingParsed.timestamp < expiryMs
            ) {
              timestamp = existingParsed.timestamp
            }
          } catch {
            // Ignore parse errors, fallback to Date.now()
          }
        }

        const envelope: StoredResultsEnvelope = {
          timestamp,
          results,
        }
        sessionStorage.setItem(storageKey, JSON.stringify(envelope))
      }
    } catch (error) {
      console.error("Failed to persist results to sessionStorage:", error)
    }
  }, [results, storageKey, expiryMs])

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
