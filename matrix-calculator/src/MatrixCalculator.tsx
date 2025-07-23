// app/page.tsx (or your main app file like src/App.tsx for Vite)
"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
  MatrixCreator,
  MatrixList, // This will now be the tabbed editor
  EquationInput,
  ResultDisplay,
  GlobalToolsMenu,
} from "./components/matrix-calculator" // Adjust path as needed
import {
  generateRandomMatrix,
  createZeroMatrix,
  createIdentityMatrix,
  createDiagonalMatrix,
  createRowMatrix,
  createColumnMatrix,
  createScalarMatrix,
  createUpperTriangularMatrix,
  createLowerTriangularMatrix,
  createSymmetricMatrix,
  createSkewSymmetricMatrix,
  createBooleanMatrix,
  createSparseMatrix,
  // Placeholders for complex types
  createHermitianMatrix,
  createSkewHermitianMatrix,
  createOrthogonalMatrix,
  createIdempotentMatrix,
  createNilpotentMatrix,
  createInvolutoryMatrix,
  createSingularMatrix,
  createNonSingularMatrix,
  createStochasticMatrix,
  createRightStochasticMatrix,
  createLeftStochasticMatrix,
  // Operations
  transposeMatrix,
  traceMatrix,
  findDeterminant,
  findInverse,
  findCofactor,
  findAdjoint,
  toRowEchelonForm, // Import new function
  findRank, // Import new function
  luDecomposition, // Import new function
  type Matrix,
  type OperationResult,
} from "./Utils/matrix-utils" // Adjust path as needed

export default function MatrixCalculatorApp() {
  const [matrices, setMatrices] = useState<Matrix[]>([])
  const [copiedMatrixData, setCopiedMatrixData] = useState<number[][] | null>(null)
  const [copiedMatrixDims, setCopiedMatrixDims] = useState<{ rows: number; cols: number } | null>(null)
  const [results, setResults] = useState<OperationResult[]>([]) // Now an array of results
  const [activeTabId, setActiveTabId] = useState<string | null>(null) // State for active tab

  const resultDisplayRef = useRef<HTMLDivElement>(null) // Ref for the ResultDisplay

  // Set initial active tab when matrices are created
  useEffect(() => {
    if (matrices.length > 0 && !activeTabId) {
      setActiveTabId(matrices[0].id)
    } else if (matrices.length === 0) {
      setActiveTabId(null)
    }
  }, [matrices, activeTabId])

  const handleCreateMatrix = useCallback((rows: number, cols: number, label: string, type: string) => {
    let newMatrixData: number[][] | null = null
    let errorMessage: string | null = null

    switch (type) {
      case "random":
      case "dense": // Treat dense as random for now
        newMatrixData = generateRandomMatrix(rows, cols)
        break
      case "zero":
        newMatrixData = createZeroMatrix(rows, cols)
        break
      case "identity":
        if (rows !== cols) {
          errorMessage = "Identity matrix must be square. Created a square identity matrix with min(rows, cols)."
          newMatrixData = createIdentityMatrix(Math.min(rows, cols))
        } else {
          newMatrixData = createIdentityMatrix(rows)
        }
        break
      case "diagonal":
        newMatrixData = createDiagonalMatrix(rows, cols)
        break
      case "scalar":
        if (rows !== cols) {
          errorMessage = "Scalar matrix must be square. Created a square scalar matrix with min(rows, cols)."
          newMatrixData = createScalarMatrix(Math.min(rows, cols))
        } else {
          newMatrixData = createScalarMatrix(rows)
        }
        break
      case "row":
        newMatrixData = createRowMatrix(cols)
        break
      case "column":
        newMatrixData = createColumnMatrix(rows)
        break
      case "upper-triangular":
        if (rows !== cols) {
          errorMessage =
            "Upper Triangular matrix must be square. Created a square upper triangular matrix with min(rows, cols)."
          newMatrixData = createUpperTriangularMatrix(Math.min(rows, cols))
        } else {
          newMatrixData = createUpperTriangularMatrix(rows)
        }
        break
      case "lower-triangular":
        if (rows !== cols) {
          errorMessage =
            "Lower Triangular matrix must be square. Created a square lower triangular matrix with min(rows, cols)."
          newMatrixData = createLowerTriangularMatrix(Math.min(rows, cols))
        } else {
          newMatrixData = createLowerTriangularMatrix(rows)
        }
        break
      case "symmetric":
        if (rows !== cols) {
          errorMessage = "Symmetric matrix must be square. Created a square symmetric matrix with min(rows, cols)."
          newMatrixData = createSymmetricMatrix(Math.min(rows, cols))
        } else {
          newMatrixData = createSymmetricMatrix(rows)
        }
        break
      case "skew-symmetric":
        if (rows !== cols) {
          errorMessage =
            "Skew-Symmetric matrix must be square. Created a square skew-symmetric matrix with min(rows, cols)."
          newMatrixData = createSkewSymmetricMatrix(Math.min(rows, cols))
        } else {
          newMatrixData = createSkewSymmetricMatrix(rows)
        }
        break
      case "boolean":
        newMatrixData = createBooleanMatrix(rows, cols)
        break
      case "sparse":
        newMatrixData = createSparseMatrix(rows, cols)
        break
      // Placeholders for complex types
      case "hermitian":
        errorMessage = "Hermitian Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createHermitianMatrix(Math.min(rows, cols))
        break
      case "skew-hermitian":
        errorMessage = "Skew-Hermitian Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createSkewHermitianMatrix(Math.min(rows, cols))
        break
      case "orthogonal":
        errorMessage = "Orthogonal Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createOrthogonalMatrix(Math.min(rows, cols))
        break
      case "idempotent":
        errorMessage = "Idempotent Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createIdempotentMatrix(Math.min(rows, cols))
        break
      case "nilpotent":
        errorMessage = "Nilpotent Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createNilpotentMatrix(Math.min(rows, cols))
        break
      case "involutory":
        errorMessage = "Involutory Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createInvolutoryMatrix(Math.min(rows, cols))
        break
      case "singular":
        errorMessage = "Singular Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createSingularMatrix(Math.min(rows, cols))
        break
      case "non-singular":
        errorMessage = "Non-Singular Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createNonSingularMatrix(Math.min(rows, cols))
        break
      case "stochastic":
        errorMessage = "Stochastic Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createStochasticMatrix(Math.min(rows, cols))
        break
      case "right-stochastic":
        errorMessage = "Right Stochastic Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createRightStochasticMatrix(Math.min(rows, cols))
        break
      case "left-stochastic":
        errorMessage = "Left Stochastic Matrix generation is a placeholder and not fully implemented."
        newMatrixData = createLeftStochasticMatrix(Math.min(rows, cols))
        break
      default:
        newMatrixData = generateRandomMatrix(rows, cols)
        break
    }

    if (newMatrixData) {
      const newMatrix: Matrix = {
        id: `matrix-${Date.now()}`,
        label,
        data: newMatrixData,
        rows: newMatrixData.length, // Use actual dimensions from generated matrix
        cols: newMatrixData[0]?.length || 0,
        isSelected: false,
      }
      setMatrices((prev) => {
        const updatedMatrices = [...prev, newMatrix]
        setActiveTabId(newMatrix.id) // Set newly created matrix as active tab
        return updatedMatrices
      })
      setResults((prev) => {
        const newResults = []
        if (errorMessage) {
          newResults.push({
            id: `res-${Date.now()}-error`,
            matrixId: newMatrix.id,
            matrixLabel: newMatrix.label,
            operation: "Create",
            resultData: `Warning: ${errorMessage}`,
          })
        }
        // Removed the "Matrix created" message here as per user request
        return [...prev, ...newResults]
      })
      // Scroll to results after adding a new matrix
      if (resultDisplayRef.current) {
        resultDisplayRef.current.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      setResults((prev) => [
        ...prev,
        {
          id: `res-${Date.now()}`,
          matrixId: "",
          matrixLabel: "",
          operation: "Create",
          resultData: errorMessage || `Failed to create matrix of type ${type}.`,
        },
      ])
    }
  }, [])

  const handleDeleteMatrix = useCallback(
    (matrixId: string) => {
      setMatrices((prev) => {
        const updatedMatrices = prev.filter((matrix) => matrix.id !== matrixId)
        // If the deleted matrix was the active tab, switch to the first available matrix
        if (activeTabId === matrixId) {
          setActiveTabId(updatedMatrices.length > 0 ? updatedMatrices[0].id : null)
        }
        return updatedMatrices
      })
      // Do not clear results here, as per user request for persistence
    },
    [activeTabId],
  )

  const handleRemoveResult = useCallback((resultId: string) => {
    setResults((prev) => prev.filter((result) => result.id !== resultId))
  }, [])

  const handleCellChange = useCallback((matrixId: string, rowIndex: number, colIndex: number, value: number) => {
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

  const handleSelectMatrix = useCallback((matrixId: string, isSelected: boolean) => {
    setMatrices((prev) => prev.map((matrix) => (matrix.id === matrixId ? { ...matrix, isSelected } : matrix)))
    // Do not clear results here, as per user request for persistence
  }, [])

  const handleCopyMatrix = useCallback(
    (matrixId: string) => {
      const matrixToCopy = matrices.find((m) => m.id === matrixId)
      if (matrixToCopy) {
        setCopiedMatrixData(matrixToCopy.data)
        setCopiedMatrixDims({ rows: matrixToCopy.rows, cols: matrixToCopy.cols })
        setResults((prev) => [
          ...prev, // Keep previous results
          {
            id: `res-${Date.now()}`,
            matrixId,
            matrixLabel: matrixToCopy.label,
            operation: "Copy",
            resultData: `Matrix ${matrixToCopy.label} copied!`,
          },
        ])
      } else {
        setResults((prev) => [
          ...prev, // Keep previous results
          {
            id: `res-${Date.now()}`,
            matrixId: "",
            matrixLabel: "",
            operation: "Copy",
            resultData: "Error: Matrix not found for copy.",
          },
        ])
      }
    },
    [matrices],
  )

  const handlePasteMatrix = useCallback(
    (matrixId: string) => {
      const targetMatrix = matrices.find((m) => m.id === matrixId)
      if (!targetMatrix) {
        setResults((prev) => [
          ...prev, // Keep previous results
          {
            id: `res-${Date.now()}`,
            matrixId: "",
            matrixLabel: "",
            operation: "Paste",
            resultData: "Error: Target matrix not found for paste.",
          },
        ])
        return
      }
      if (!copiedMatrixData || !copiedMatrixDims) {
        setResults((prev) => [
          ...prev, // Keep previous results
          {
            id: `res-${Date.now()}`,
            matrixId: "",
            matrixLabel: "",
            operation: "Paste",
            resultData: "No matrix data copied yet.",
          },
        ])
        return
      }
      if (targetMatrix.rows !== copiedMatrixDims.rows || targetMatrix.cols !== copiedMatrixDims.cols) {
        setResults((prev) => [
          ...prev, // Keep previous results
          {
            id: `res-${Date.now()}`,
            matrixId: targetMatrix.id,
            matrixLabel: targetMatrix.label,
            operation: "Paste",
            resultData: "Cannot paste: dimensions do not match.",
          },
        ])
        return
      }

      setMatrices((prev) =>
        prev.map((matrix) => (matrix.id === targetMatrix.id ? { ...matrix, data: copiedMatrixData } : matrix)),
      )
      setResults((prev) => [
        ...prev, // Keep previous results
        {
          id: `res-${Date.now()}`,
          matrixId: targetMatrix.id,
          matrixLabel: targetMatrix.label,
          operation: "Paste",
          resultData: `Matrix ${targetMatrix.label} pasted successfully!`,
        },
      ])
    },
    [matrices, copiedMatrixData, copiedMatrixDims],
  )

  const handleOperationSelect = useCallback(
    (operation: string, matrixId: string) => {
      const targetMatrix = matrices.find((m) => m.id === matrixId)
      if (!targetMatrix) {
        setResults((prev) => [
          ...prev,
          {
            id: `res-${Date.now()}`,
            matrixId: "",
            matrixLabel: "",
            operation,
            resultData: "Error: Matrix not found for operation.",
          },
        ])
        return
      }

      let opResult: string | number | number[][] | { L: number[][]; U: number[][] } | null = null
      let newMatrices = [...matrices]

      switch (operation) {
        case "transpose":
          opResult = transposeMatrix(targetMatrix.data)
          if (opResult) {
            // Replace the selected matrix with its transpose
            newMatrices = newMatrices.map((m) =>
              m.id === targetMatrix.id ? { ...m, data: opResult as number[][], rows: m.cols, cols: m.rows } : m,
            )
            setMatrices(newMatrices)
            opResult = opResult as number[][] // Ensure type for result display
          } else {
            opResult = "Transpose failed."
          }
          break
        case "trace":
          opResult = traceMatrix(targetMatrix.data)
          if (opResult === null) {
            opResult = "Trace requires a square matrix."
          }
          break
        case "determinant":
          opResult = findDeterminant(targetMatrix.data)
          if (opResult === null) {
            opResult = "Determinant requires a square matrix."
          }
          break
        case "inverse":
          opResult = findInverse(targetMatrix.data)
          if (opResult === null) {
            opResult = "Inverse requires a square, non-singular matrix."
          }
          break
        case "cofactor":
          opResult = findCofactor(targetMatrix.data)
          if (opResult === null) {
            opResult = "Cofactor requires a square matrix."
          }
          break
        case "adjoint":
          opResult = findAdjoint(targetMatrix.data)
          if (opResult === null) {
            opResult = "Adjoint requires a square matrix."
          }
          break
        case "ref": // New case for Row Echelon Form
          opResult = toRowEchelonForm(targetMatrix.data)
          if (opResult === null) {
            opResult = "Could not convert to Row Echelon Form."
          } else {
            // Optionally update the matrix in place with its REF
            newMatrices = newMatrices.map((m) =>
              m.id === targetMatrix.id ? { ...m, data: opResult as number[][] } : m,
            )
            setMatrices(newMatrices)
          }
          break
        case "rank": // New case for Rank
          opResult = findRank(targetMatrix.data)
          if (opResult === null) {
            opResult = "Could not calculate rank (matrix might be invalid)."
          } else {
            opResult = `Rank: ${opResult}`
          }
          break
        case "lu-decomposition": // New case for LU Decomposition
          opResult = luDecomposition(targetMatrix.data)
          if (opResult === null) {
            opResult = "LU Decomposition failed (requires square matrix, or is singular/placeholder)."
          } else {
            // Display L and U matrices
            opResult = {
              L: opResult.L,
              U: opResult.U,
            }
          }
          break
        case "sin":
        case "cos":
        case "log":
          // Element-wise operations
          opResult = targetMatrix.data.map((row) =>
            row.map((cell) => {
              if (operation === "sin") return Math.sin(cell)
              if (operation === "cos") return Math.cos(cell)
              if (operation === "log") return Math.log(cell)
              return cell
            }),
          )
          break
        default:
          opResult = "Unknown operation."
      }
      setResults((prev) => [
        ...prev,
        {
          id: `res-${Date.now()}`,
          matrixId,
          matrixLabel: targetMatrix.label,
          operation,
          resultData: opResult || "Operation failed.",
        },
      ])
      if (resultDisplayRef.current) {
        resultDisplayRef.current.scrollIntoView({ behavior: "smooth" })
      }
    },
    [matrices],
  )

  const handleEvaluateEquation = useCallback((expression: string) => {
    // This is where you would implement your expression parsing and evaluation logic.
    // For now, it's a placeholder.
    setResults((prev) => [
      ...prev,
      {
        id: `res-${Date.now()}`,
        matrixId: "",
        matrixLabel: "Equation",
        operation: "Evaluate",
        resultData: `Evaluating expression: "${expression}" (Parsing logic not implemented)`,
      },
    ])
    console.log("Expression to evaluate:", expression)
    if (resultDisplayRef.current) {
      resultDisplayRef.current.scrollIntoView({ behavior: "smooth" })
    }
    // You would typically parse 'expression', identify matrix labels (A, B, C),
    // retrieve their data from the 'matrices' state, perform operations,
    // and then set the result.
  }, [])

  const matrixLabels = matrices.map((m) => m.label)
  const selectedMatrixIds = matrices.filter((m) => m.isSelected).map((m) => m.id)

  return (
    <div
      className="min-h-screen bg-gray-100 dark:bg-[var(--color-bg-primary)] text-gray-900 dark:text-gray-100 transition-colors duration-300"
      style={{
        background: `
          url('https://static.vecteezy.com/system/resources/thumbnails/002/034/021/small_2x/abstract-dynamic-light-blue-overlap-square-shape-on-background-modern-and-minimal-concept-you-can-use-for-cover-brochure-template-poster-banner-web-print-ad-etc-illustration-vector.jpg') no-repeat top / 100% 400px, /* Image height increased to 400px */
          linear-gradient(to top, #8DBCC7, #A4CCD9, #C4E1E6) no-repeat 0px 200px / 100% calc(100% - 200px) /* Gradient starts at 200px, creating 200px overlap */
        `,
        backgroundAttachment: "fixed", // Keep background fixed relative to viewport
      }}
    >
      <GlobalToolsMenu
        onOperationSelect={handleOperationSelect}
        selectedMatrixIds={selectedMatrixIds}
        matrices={matrices}
      />
      <div className="container mx-auto p-4 space-y-6 backdrop-blur-sm bg-transparent min-h-screen pt-20">
        {" "}
        {/* Added pt-20 for fixed header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-text-primary">Matrix Calculator</h1> {/* Re-added title */}
        </div>
        {/* Top section for controls (MatrixCreator, EquationInput) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
          <MatrixCreator onCreateMatrix={handleCreateMatrix} currentMatrixCount={matrices.length} />
          <EquationInput onEvaluate={handleEvaluateEquation} matrixLabels={matrixLabels} />
        </div>
        {/* Bottom section for Matrix Editor (now tabbed) - visible on desktop */}
        <div className="mt-6 md:block hidden">
          <MatrixList
            matrices={matrices}
            onCellChange={handleCellChange}
            onSelectMatrix={handleSelectMatrix}
            onCopyMatrix={handleCopyMatrix}
            onPasteMatrix={handlePasteMatrix}
            onDeleteMatrix={handleDeleteMatrix}
            onOperationSelect={handleOperationSelect}
            copiedMatrixData={copiedMatrixData}
            copiedMatrixDims={copiedMatrixDims}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
          />
        </div>
        {/* Mobile-only Matrix List (original behavior) */}
        <div className="mt-6 md:hidden block">
          <MatrixList
            matrices={matrices}
            onCellChange={handleCellChange}
            onSelectMatrix={handleSelectMatrix}
            onCopyMatrix={handleCopyMatrix}
            onPasteMatrix={handlePasteMatrix}
            onDeleteMatrix={handleDeleteMatrix}
            onOperationSelect={handleOperationSelect}
            copiedMatrixData={copiedMatrixData}
            copiedMatrixDims={copiedMatrixDims}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
          />
        </div>
        {/* Result Display - now at the very bottom, full width */}
        <div className="mt-6 w-full" ref={resultDisplayRef}>
          <ResultDisplay results={results} onRemoveResult={handleRemoveResult} />
        </div>
      </div>
    </div>
  )
}
