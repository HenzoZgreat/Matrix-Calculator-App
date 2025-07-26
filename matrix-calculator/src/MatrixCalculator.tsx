"use client"

import { useState } from "react"

import { useEffect, useRef } from "react"
import {
  MatrixCreator,
  MatrixList,
  EquationInput,
  ResultDisplay,
  GlobalToolsMenu,
  ErrorNotification,
  SuccessNotification,
} from "./components/matrix-calculator"
import { useMatrixState } from "./hooks/useMatrixState"
import { useResultState } from "./hooks/useResultState"
import { useNotifications } from "./hooks/useNotifications"
import { createMatrixByType, type Matrix, type MatrixType } from "./Utils/matrix"
import { MatrixOperationService } from "./Utils/services/matrixOperations"
import { tokenize, validateTokens, ExpressionEvaluator } from "./Utils/expression"

export default function MatrixCalculatorApp() {
  const {
    matrices,
    activeTabId,
    setActiveTabId,
    addMatrix,
    removeMatrix,
    updateMatrix,
    updateMatrixCell,
    selectMatrix,
  } = useMatrixState()

  const { results, addResult, removeResult, clearResults } = useResultState()
  const { notifications, showNotification, removeNotification } = useNotifications()

  const resultDisplayRef = useRef<HTMLDivElement>(null)
  const matrixListRef = useRef<HTMLDivElement>(null) // New ref for MatrixList

  // Set initial active tab when matrices are created
  useEffect(() => {
    if (matrices.length > 0 && !activeTabId) {
      setActiveTabId(matrices[0].id)
    } else if (matrices.length === 0) {
      setActiveTabId(null)
    }
  }, [matrices, activeTabId, setActiveTabId])

  const handleCreateMatrix = (rows: number, cols: number, label: string, type: string) => {
    const { data, errorMessage } = createMatrixByType(rows, cols, type as MatrixType)

    if (data) {
      const newMatrix: Matrix = {
        id: `matrix-${Date.now()}`,
        label,
        data,
        rows: data.length,
        cols: data[0]?.length || 0,
        isSelected: false,
      }

      addMatrix(newMatrix)

      if (errorMessage) {
        showNotification(errorMessage, "error")
      } else {
        showNotification(`Matrix ${label} created successfully!`, "success")
      }

      // Scroll to the MatrixList (matrix editor) instead of results
      if (matrixListRef.current) {
        matrixListRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } else {
      showNotification(errorMessage || `Failed to create matrix of type ${type}.`, "error")
    }
  }

  const handleOperationSelect = (operation: string, matrixId: string) => {
    const targetMatrix = matrices.find((m) => m.id === matrixId)
    if (!targetMatrix) {
      showNotification("Matrix not found for operation.", "error")
      return
    }

    const { result, shouldUpdateMatrix, newMatrixData } = MatrixOperationService.performOperation(
      operation,
      targetMatrix,
    )

    if (shouldUpdateMatrix && newMatrixData) {
      updateMatrix(matrixId, {
        data: newMatrixData,
        rows: newMatrixData.length,
        cols: newMatrixData[0]?.length || 0,
      })
    }

    // Check if result is an error
    if (typeof result === "string") {
      const errorKeywords = ["error", "failed", "invalid", "cannot", "requires", "unknown"]
      const isError = errorKeywords.some((keyword) => result.toLowerCase().includes(keyword))

      if (isError) {
        showNotification(result, "error")
        return
      }
    }

    // Add successful results to display
    addResult({
      matrixId,
      matrixLabel: targetMatrix.label,
      operation,
      resultData: result || "Operation completed.",
    })

    if (resultDisplayRef.current) {
      resultDisplayRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleEvaluateEquation = (expression: string) => {
    try {
      const tokens = tokenize(expression)

      if (!validateTokens(tokens)) {
        throw new Error("Invalid expression: mismatched parentheses")
      }

      const evaluator = new ExpressionEvaluator({ matrices })
      const evaluation = evaluator.evaluate(tokens)

      if (evaluation.success) {
        const result = evaluation.result?.data || evaluation.result
        if (result === undefined || result === null) {
          throw new Error("Invalid result from evaluation")
        }
        addResult({
          matrixId: "",
          matrixLabel: "Equation",
          operation: "Evaluate",
          resultData: Array.isArray(result) && result.every((row) => Array.isArray(row)) ? result : result,
          equation: expression, // Store the original equation
        })
      } else {
        showNotification(evaluation.error || "Evaluation failed", "error")
      }
    } catch (error) {
      console.error("HandleEvaluateEquation error:", error)
      showNotification(error instanceof Error ? error.message : "Unknown error", "error")
    }

    if (resultDisplayRef.current) {
      resultDisplayRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Copy/Paste functionality (simplified)
  const [copiedMatrixData, setCopiedMatrixData] = useState<number[][] | null>(null)
  const [copiedMatrixDims, setCopiedMatrixDims] = useState<{ rows: number; cols: number } | null>(null)

  const handleCopyMatrix = (matrixId: string) => {
    const matrix = matrices.find((m) => m.id === matrixId)
    if (matrix) {
      setCopiedMatrixData(matrix.data)
      setCopiedMatrixDims({ rows: matrix.rows, cols: matrix.cols })
      showNotification(`Matrix ${matrix.label} copied!`, "success")
    }
  }

  const handlePasteMatrix = (matrixId: string) => {
    const matrix = matrices.find((m) => m.id === matrixId)
    if (!matrix || !copiedMatrixData || !copiedMatrixDims) return

    if (matrix.rows === copiedMatrixDims.rows && matrix.cols === copiedMatrixDims.cols) {
      updateMatrix(matrixId, { data: copiedMatrixData })
      showNotification(`Matrix ${matrix.label} pasted successfully!`, "success")
    } else {
      showNotification("Cannot paste: dimensions do not match.", "error")
    }
  }

  const handlePasteResultToMatrix = (resultData: number[][], matrixId: string) => {
    updateMatrix(matrixId, {
      data: resultData,
      rows: resultData.length,
      cols: resultData[0]?.length || 0,
    })
  }

  const matrixLabels = matrices.map((m) => m.label)
  const selectedMatrixIds = matrices.filter((m) => m.isSelected).map((m) => m.id)

  return (
    <div
      className="min-h-screen bg-gray-100 dark:bg-[var(--color-bg-primary)] text-gray-900 dark:text-gray-100 transition-colors duration-300"
      style={{
        background: `
          linear-gradient(to bottom, transparent 0%, rgba(156, 169, 175, 1) 500px),
          url('https://static.vecteezy.com/system/resources/previews/059/500/705/non_2x/an-abstract-geometric-background-with-a-low-poly-triangular-pattern-in-shades-of-gray-and-blue-creating-a-modern-and-stylish-digital-design-vector.jpg') no-repeat top / 100% 500px
        `,
        backgroundAttachment: "fixed",
      }}
    >
      <GlobalToolsMenu
        onOperationSelect={handleOperationSelect}
        selectedMatrixIds={selectedMatrixIds}
        matrices={matrices}
      />

      {/* Notifications */}
      {notifications.map((notification) =>
        notification.type === "error" ? (
          <ErrorNotification
            key={notification.id}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ) : (
          <SuccessNotification
            key={notification.id}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ),
      )}

      <div className="container mx-auto p-4 space-y-6 bg-transparent min-h-screen pt-20">
        <h1 className="text-4xl font-extrabold text-text-primary mb-8">Matrix Calculator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
          <MatrixCreator onCreateMatrix={handleCreateMatrix} currentMatrixCount={matrices.length} />
          <EquationInput onEvaluate={handleEvaluateEquation} matrixLabels={matrixLabels} />
        </div>

        <div className="mt-6 md:block hidden" ref={matrixListRef}>
          {" "}
          {/* Added ref here */}
          <MatrixList
            matrices={matrices}
            onCellChange={updateMatrixCell}
            onSelectMatrix={selectMatrix}
            onCopyMatrix={handleCopyMatrix}
            onPasteMatrix={handlePasteMatrix}
            onDeleteMatrix={removeMatrix}
            onOperationSelect={handleOperationSelect}
            copiedMatrixData={copiedMatrixData}
            copiedMatrixDims={copiedMatrixDims}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
          />
        </div>

        <div className="mt-6 md:hidden block">
          {" "}
          {/* Mobile view, also needs ref if it's the target */}
          <MatrixList
            matrices={matrices}
            onCellChange={updateMatrixCell}
            onSelectMatrix={selectMatrix}
            onCopyMatrix={handleCopyMatrix}
            onPasteMatrix={handlePasteMatrix}
            onDeleteMatrix={removeMatrix}
            onOperationSelect={handleOperationSelect}
            copiedMatrixData={copiedMatrixData}
            copiedMatrixDims={copiedMatrixDims}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
          />
        </div>

        <div className="mt-6 w-full" ref={resultDisplayRef}>
          <ResultDisplay
            results={results}
            onRemoveResult={removeResult}
            onClearResults={clearResults}
            matrices={matrices}
            onPasteResultToMatrix={handlePasteResultToMatrix}
            onShowNotification={showNotification}
          />
        </div>
      </div>
    </div>
  )
}
