// components/matrix-calculator/ResultDisplay.tsx
"use client"

import type React from "react"
import { useCallback, useMemo } from "react"
import { XIcon, Trash2Icon, ClipboardIcon } from "lucide-react" // Removed CopyIcon
import type { OperationResult } from "../../Utils/matrix"
import type { Matrix } from "../../Utils/matrix"

interface ResultDisplayProps {
  results: OperationResult[] // Now an array of results
  onRemoveResult: (resultId: string) => void // New prop for removing results
  onClearResults: () => void // New prop for clearing all results
  matrices: Matrix[] // Available matrices for pasting
  onPasteResultToMatrix: (resultData: number[][], matrixId: string) => void // New prop for pasting results
  onShowNotification: (message: string, type: "success" | "error") => void // New prop for notifications
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  results,
  onRemoveResult,
  onClearResults,
  matrices,
  onPasteResultToMatrix,
  onShowNotification,
}) => {
  // Removed formatResultForCopy and handleCopyResult as the copy button is removed

  const getCompatibleMatrices = useCallback(
    (resultData: number[][]) => {
      const resultRows = resultData.length
      const resultCols = resultData[0]?.length || 0

      return matrices.filter((matrix) => matrix.rows === resultRows && matrix.cols === resultCols)
    },
    [matrices],
  )

  const handlePasteToMatrix = useCallback(
    (resultData: number[][], matrixId: string) => {
      onPasteResultToMatrix(resultData, matrixId)
      const matrix = matrices.find((m) => m.id === matrixId)
      onShowNotification(`Result pasted to Matrix ${matrix?.label}!`, "success")
    },
    [onPasteResultToMatrix, matrices, onShowNotification],
  )

  // Helper function to generate the display title
  const getResultTitle = useCallback((result: OperationResult) => {
    if (result.operation === "Evaluate" && result.matrixLabel === "Equation") {
      return result.equation || "Expression Evaluation"
    } else {
      return `${result.operation} on Matrix ${result.matrixLabel}`
    }
  }, [])

  // Filter out error results (they should be shown as notifications instead)
  const validResults = useMemo(() => {
    return results.filter((result) => {
      // Filter out error messages that should be notifications
      if (typeof result.resultData === "string") {
        const errorKeywords = ["error", "failed", "invalid", "cannot", "requires", "unknown"]
        const isError = errorKeywords.some((keyword) => result.resultData.toString().toLowerCase().includes(keyword))
        return !isError
      }
      return true
    })
  }, [results])

  if (validResults.length === 0) {
    return null
  }

  // Reverse the results array to show newest first
  const reversedResults = [...validResults].reverse()

  return (
    <div
      className="bg-transparent p-6 rounded-lg w-full shadow-xl backdrop-blur-md"
      style={{
        boxShadow:
          "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text-secondary">Results</h2>
        <button
          onClick={onClearResults}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 shadow-lg"
          title="Clear all results"
        >
          <Trash2Icon className="w-4 h-4" />
          Clear All
        </button>
      </div>
      <div className="flex flex-col gap-4 custom-scrollbar max-h-80 overflow-y-auto">
        {reversedResults.map((res) => {
          const isMatrixResult = Array.isArray(res.resultData) && res.resultData.every((row) => Array.isArray(row))
          const compatibleMatrices = isMatrixResult ? getCompatibleMatrices(res.resultData as number[][]) : []

          return (
            <div
              key={res.id}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 animate-slide-in-up hover:shadow-xl"
              style={{
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex-1 mr-2">{getResultTitle(res)}</h3>
                <div className="flex gap-2 flex-shrink-0">
                  {/* Removed Copy Button */}
                  <button
                    onClick={() => onRemoveResult(res.id)}
                    className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 shadow-md"
                    aria-label={`Remove result for ${getResultTitle(res)}`}
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Paste to Matrix buttons for matrix results */}
              {isMatrixResult && compatibleMatrices.length > 0 && (
                <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md shadow-inner">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Paste to compatible matrices:</p>
                  <div className="flex flex-wrap gap-1">
                    {compatibleMatrices.map((matrix) => (
                      <button
                        key={matrix.id}
                        onClick={() => handlePasteToMatrix(res.resultData as number[][], matrix.id)}
                        className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-2 rounded text-xs transition-colors duration-200 shadow-md"
                      >
                        <ClipboardIcon className="w-3 h-3" />
                        Matrix {matrix.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {typeof res.resultData === "string" || typeof res.resultData === "number" ? (
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{res.resultData}</p>
              ) : Array.isArray(res.resultData) && res.resultData.every((row) => Array.isArray(row)) ? (
                <div className="overflow-x-auto overflow-y-auto max-h-40 shadow-inner rounded-md">
                  <table className="min-w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md">
                    <tbody>
                      {res.resultData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td
                              key={`${rowIndex}-${colIndex}`}
                              className="border border-gray-300 dark:border-gray-500 p-2 text-center text-gray-700 dark:text-gray-200"
                            >
                              {typeof cell === "number" ? cell.toFixed(2) : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : typeof res.resultData === "object" && "L" in res.resultData && "U" in res.resultData ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">L Matrix:</h4>
                    <div className="overflow-x-auto overflow-y-auto max-h-40 shadow-inner rounded-md">
                      <table className="min-w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md">
                        <tbody>
                          {res.resultData.L.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, colIndex) => (
                                <td
                                  key={`${rowIndex}-${colIndex}`}
                                  className="border border-gray-300 dark:border-gray-500 p-2 text-center text-gray-700 dark:text-gray-200"
                                >
                                  {typeof cell === "number" ? cell.toFixed(2) : String(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">U Matrix:</h4>
                    <div className="overflow-x-auto overflow-y-auto max-h-40 shadow-inner rounded-md">
                      <table className="min-w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md">
                        <tbody>
                          {res.resultData.U.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, colIndex) => (
                                <td
                                  key={`${rowIndex}-${colIndex}`}
                                  className="border border-gray-300 dark:border-gray-500 p-2 text-center text-gray-700 dark:text-gray-200"
                                >
                                  {typeof cell === "number" ? cell.toFixed(2) : String(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Invalid result format.</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
