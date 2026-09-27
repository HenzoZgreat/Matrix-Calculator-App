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
  DarkModeToggle,
} from "./components/matrix-calculator"
import { useMatrixState } from "./hooks/useMatrixState"
import { useResultState } from "./hooks/useResultState"
import { useNotifications } from "./hooks/useNotifications"
import { createMatrixByType, type Matrix, type MatrixType } from "./Utils/matrix"
import { MatrixOperationService } from "./Utils/services/matrixOperations"
import { tokenize, validateTokens, ExpressionEvaluator } from "./Utils/expression"
import { GridIcon } from "lucide-react"

// ============================================================================
// PERSISTENCE & STORAGE CONFIGURATION
// You can easily locate and modify the storage keys and expiration time below:
// ============================================================================
/** LocalStorage key for storing the list of created matrices */
export const MATRICES_STORAGE_KEY = "matrix_calc_matrices"

/** SessionStorage key for calculation results history */
export const RESULTS_STORAGE_KEY = "matrix_calc_results_history"

/** Expiration time for results history in milliseconds (default: 24 hours / 1 day) */
export const RESULTS_EXPIRY_TIME_MS = 24 * 60 * 60 * 1000 // 1 day (86,400,000 ms)

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
  } = useMatrixState(MATRICES_STORAGE_KEY)

  const { results, addResult, removeResult, clearResults } = useResultState(
    RESULTS_STORAGE_KEY,
    RESULTS_EXPIRY_TIME_MS,
  )
  const { notifications, showNotification, removeNotification } = useNotifications() // Main notification instance

  const resultDisplayRef = useRef<HTMLDivElement>(null)
  const matrixListDesktopRef = useRef<HTMLDivElement>(null) // Ref for desktop MatrixList
  const matrixListMobileRef = useRef<HTMLDivElement>(null) // Ref for mobile MatrixList

  const [lastCreatedMatrixId, setLastCreatedMatrixId] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [navbarScrolled, setNavbarScrolled] = useState(false)

  // Determine if desktop or mobile
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768) // Tailwind's 'md' breakpoint
    }
    checkIsDesktop()
    window.addEventListener("resize", checkIsDesktop)
    return () => window.removeEventListener("resize", checkIsDesktop)
  }, [])

  // Navbar scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
      setLastCreatedMatrixId(newMatrix.id) // Set the ID of the newly created matrix

      if (errorMessage) {
        showNotification(errorMessage, "error")
      } else {
        showNotification(`Matrix ${label} created successfully!`, "success")
      }

      // Scroll to the MatrixList (matrix editor) only on success
      if (!errorMessage) {
        if (isDesktop && matrixListDesktopRef.current) {
          matrixListDesktopRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        } else if (!isDesktop && matrixListMobileRef.current) {
          matrixListMobileRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
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
    let evaluationSuccess = false // Flag to track evaluation success
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
        evaluationSuccess = true // Set flag to true on success
      } else {
        showNotification(evaluation.error || "Evaluation failed", "error")
      }
    } catch (error) {
      console.error("HandleEvaluateEquation error:", error)
      showNotification(error instanceof Error ? error.message : "Unknown error", "error")
    }

    // Only scroll to results if evaluation was successful
    if (evaluationSuccess && resultDisplayRef.current) {
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
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-500">
      {/* Ambient Background Mesh */}
      <div className="bg-mesh" />

      {/* ============================================================= */}
      {/*  NAVBAR — Sticky glass bar with logo, tools menu, dark toggle */}
      {/* ============================================================= */}
      <nav
        className={`navbar-glass fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navbarScrolled ? "scrolled" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] shadow-md">
                <GridIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
                  Matrix Calculator
                </h1>
                <span className="text-[10px] font-medium text-[var(--color-text-muted)] tracking-wide uppercase hidden sm:block">
                  Compute • Evaluate • Visualize
                </span>
              </div>
            </div>

            {/* Right: Global Tools + Dark Mode Toggle */}
            <div className="flex items-center gap-2">
              <GlobalToolsMenu
                onOperationSelect={handleOperationSelect}
                selectedMatrixIds={selectedMatrixIds}
                matrices={matrices}
              />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* ===================== */}
      {/*  NOTIFICATIONS        */}
      {/* ===================== */}
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

      {/* ===================== */}
      {/*  MAIN CONTENT         */}
      {/* ===================== */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">

        {/* ————————————————————— */}
        {/*  ROW 1: Create + Equation Input  */}
        {/* ————————————————————— */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-scale relative z-20">
          {/* Matrix Creator Card - Elevated z-index so dropdown floats above equation box on smaller screens */}
          <div className="section-card p-6 relative z-30">
            <MatrixCreator
              onCreateMatrix={handleCreateMatrix}
              currentMatrixCount={matrices.length}
              showNotification={showNotification}
            />
          </div>

          {/* Equation Input Card */}
          <div className="section-card p-6 relative z-10">
            <EquationInput onEvaluate={handleEvaluateEquation} matrixLabels={matrixLabels} />
          </div>
        </section>

        {/* ————————————————————— */}
        {/*  ROW 2: Matrix Editor */}
        {/* ————————————————————— */}
        <section className="animate-fade-in-scale stagger-2">
          {/* Desktop Matrix List */}
          <div className="md:block hidden" ref={matrixListDesktopRef}>
            <div className="section-card p-6">
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
                scrollTargetId={lastCreatedMatrixId}
              />
            </div>
          </div>

          {/* Mobile Matrix List */}
          <div className="md:hidden block" ref={matrixListMobileRef}>
            <div className="section-card p-6">
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
                scrollTargetId={lastCreatedMatrixId}
              />
            </div>
          </div>
        </section>

        {/* ————————————————————— */}
        {/*  ROW 3: Results       */}
        {/* ————————————————————— */}
        <section className="animate-fade-in-scale stagger-3" ref={resultDisplayRef}>
          <ResultDisplay
            results={results}
            onRemoveResult={removeResult}
            onClearResults={clearResults}
            matrices={matrices}
            onPasteResultToMatrix={handlePasteResultToMatrix}
            onShowNotification={showNotification}
          />
        </section>
      </main>

      {/* ===================== */}
      {/*  FOOTER               */}
      {/* ===================== */}
      <footer className="relative z-10 border-t border-[var(--color-border-light)] py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Matrix Calculator — Built for students & engineers
          </p>
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <span>Powered by</span>
            <span className="text-accent-gradient font-semibold">React + TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
