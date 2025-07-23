// components/matrix-calculator/ResultDisplay.tsx
"use client"

import type React from "react"
import { useCallback } from "react"
import { CopyIcon, XIcon } from "lucide-react" // Import XIcon
import type { OperationResult } from "../../Utils/matrix-utils" // Adjust path as needed

interface ResultDisplayProps {
  results: OperationResult[] // Now an array of results
  onRemoveResult: (resultId: string) => void // New prop for removing results
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, onRemoveResult }) => {
  const formatResultForCopy = useCallback(
    (resultData: string | number | number[][] | { L: number[][]; U: number[][] }) => {
      if (typeof resultData === "string" || typeof resultData === "number") {
        return String(resultData)
      } else if (Array.isArray(resultData) && resultData.every((row) => Array.isArray(row))) {
        // Format matrix as tab-separated values for rows, newline for new rows
        return resultData.map((row) => row.map((cell) => String(cell)).join("\t")).join("\n")
      } else if (typeof resultData === "object" && "L" in resultData && "U" in resultData) {
        // Format LU decomposition result
        const L_str = resultData.L.map((row) => row.map((cell) => String(cell)).join("\t")).join("\n")
        const U_str = resultData.U.map((row) => row.map((cell) => String(cell)).join("\t")).join("\n")
        return `L Matrix:\n${L_str}\n\nU Matrix:\n${U_str}`
      }
      return ""
    },
    [],
  )

  const handleCopyResult = useCallback(
    async (resultData: string | number | number[][] | { L: number[][]; U: number[][] }) => {
      try {
        await navigator.clipboard.writeText(formatResultForCopy(resultData))
        alert("Result copied to clipboard!")
      } catch (err) {
        console.error("Failed to copy result: ", err)
        alert("Failed to copy result.")
      }
    },
    [formatResultForCopy],
  )

  if (results.length === 0) {
    return null
  }

  return (
    <div className="bg-transparent backdrop-blur-sm p-6 rounded-lg shadow-md border border-border-light transition-colors duration-300 w-full">
      <h2 className="text-xl font-semibold text-text-secondary mb-4">Results</h2>
      <div className="flex flex-wrap gap-4 custom-scrollbar max-h-80 overflow-y-auto">
        {results.map((res) => (
          <div
            key={res.id}
            className="flex-1 min-w-[280px] bg-card-bg p-4 rounded-lg shadow-sm border border-border-light transition-colors duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-text-primary">
                {res.operation} on Matrix {res.matrixLabel}
              </h3>
              <div className="flex gap-2">
                {(Array.isArray(res.resultData) && res.resultData.every((row) => Array.isArray(row))) ||
                (typeof res.resultData === "object" && "L" in res.resultData && "U" in res.resultData) ? (
                  <button
                    onClick={() => handleCopyResult(res.resultData)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors duration-200"
                  >
                    <CopyIcon className="w-4 h-4" /> Copy
                  </button>
                ) : null}
                <button
                  onClick={() => onRemoveResult(res.id)}
                  className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                  aria-label={`Remove result for ${res.operation} on Matrix ${res.matrixLabel}`}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            {typeof res.resultData === "string" || typeof res.resultData === "number" ? (
              <p className="text-lg font-medium text-text-primary">{res.resultData}</p>
            ) : Array.isArray(res.resultData) && res.resultData.every((row) => Array.isArray(row)) ? (
              <div className="overflow-x-auto overflow-y-auto max-h-40">
                <table className="min-w-full bg-bg-secondary border border-border-light rounded-md">
                  <tbody>
                    {res.resultData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td
                            key={`${rowIndex}-${colIndex}`}
                            className="border border-border-light p-2 text-center text-text-secondary"
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
                  <h4 className="font-semibold text-text-primary mb-1">L Matrix:</h4>
                  <div className="overflow-x-auto overflow-y-auto max-h-40">
                    <table className="min-w-full bg-bg-secondary border border-border-light rounded-md">
                      <tbody>
                        {res.resultData.L.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                              <td
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-border-light p-2 text-center text-text-secondary"
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
                  <h4 className="font-semibold text-text-primary mb-1">U Matrix:</h4>
                  <div className="overflow-x-auto overflow-y-auto max-h-40">
                    <table className="min-w-full bg-bg-secondary border border-border-light rounded-md">
                      <tbody>
                        {res.resultData.U.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                              <td
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-border-light p-2 text-center text-text-secondary"
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
              <p className="text-lg font-medium text-gray-800">Invalid result format.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
