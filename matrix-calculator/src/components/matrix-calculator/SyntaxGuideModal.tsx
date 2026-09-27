// components/matrix-calculator/SyntaxGuideModal.tsx
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  XIcon,
  BookOpenIcon,
  SparklesIcon,
  CalculatorIcon,
  HelpCircleIcon,
  LayersIcon,
  ArrowRightIcon,
} from "lucide-react"

interface SyntaxGuideModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectExample?: (expression: string) => void
  availableMatrices?: string[]
}

export const SyntaxGuideModal: React.FC<SyntaxGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectExample,
  availableMatrices = [],
}) => {
  const [activeTab, setActiveTab] = useState<"examples" | "operations" | "functions" | "rules">("examples")

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Generate dynamic examples based on available matrices, or fallback to A, B, C
  const mat1 = availableMatrices[0] || "A"
  const mat2 = availableMatrices[1] || "B"
  const mat3 = availableMatrices[2] || "C"

  const quickExamples = [
    {
      expression: `${mat1} + ${mat2}`,
      description: "Matrix Addition",
      note: "Requires matrices of the same dimensions",
    },
    {
      expression: `${mat1} * ${mat2}`,
      description: "Matrix Multiplication",
      note: "Cols of first must equal rows of second",
    },
    {
      expression: `2 * ${mat1} - 3 * ${mat2}`,
      description: "Linear Combination",
      note: "Scalar multiplication combined with subtraction",
    },
    {
      expression: `inv(${mat1}) * ${mat2}`,
      description: "Solve System (A⁻¹ * B)",
      note: "Computes inverse then multiplies",
    },
    {
      expression: `det(${mat1})`,
      description: "Determinant",
      note: "Returns scalar for square matrix",
    },
    {
      expression: `transpose(${mat1})`,
      description: "Transpose Matrix",
      note: "Flips rows into columns (or tr(A))",
    },
    {
      expression: `${mat1}^2`,
      description: "Matrix Power",
      note: "Multiplies square matrix by itself",
    },
    {
      expression: `ref(${mat1})`,
      description: "Row Echelon Form",
      note: "Gaussian elimination into triangular form",
    },
    {
      expression: `rank(${mat1})`,
      description: "Matrix Rank",
      note: "Number of linearly independent rows",
    },
    {
      expression: `(${mat1} + ${mat2}) * inv(${mat3})`,
      description: "Compound Expression",
      note: "Combines parentheses, addition, and inverse",
    },
  ]

  const operations = [
    {
      op: "+",
      name: "Addition",
      syntax: "A + B",
      rule: "Dimensions must match exactly (e.g., both 3x3)",
    },
    {
      op: "-",
      name: "Subtraction",
      syntax: "A - B",
      rule: "Dimensions must match exactly",
    },
    {
      op: "*",
      name: "Multiplication",
      syntax: "A * B or 3 * A",
      rule: "Matrix product or scalar multiplication",
    },
    {
      op: "/",
      name: "Division",
      syntax: "A / B",
      rule: "Equivalent to A * inv(B); B must be square & non-singular",
    },
    {
      op: "^",
      name: "Exponentiation",
      syntax: "A^2 or A^3",
      rule: "Square matrix raised to an integer power",
    },
    {
      op: "( )",
      name: "Parentheses",
      syntax: "(A + B) * C",
      rule: "Enforce custom evaluation order",
    },
  ]

  const functions = [
    {
      func: "inv(A)",
      name: "Inverse",
      desc: "Calculates the matrix inverse A⁻¹",
      req: "Square & non-zero determinant",
    },
    {
      func: "det(A)",
      name: "Determinant",
      desc: "Computes scalar determinant |A|",
      req: "Square matrix",
    },
    {
      func: "transpose(A)",
      name: "Transpose (tr)",
      desc: "Swaps matrix rows and columns (Aᵀ)",
      req: "Any matrix size",
    },
    {
      func: "trace(A)",
      name: "Trace (trc)",
      desc: "Sum of diagonal elements",
      req: "Square matrix",
    },
    {
      func: "ref(A)",
      name: "Row Echelon Form",
      desc: "Gaussian elimination to REF",
      req: "Any matrix size",
    },
    {
      func: "rank(A)",
      name: "Rank",
      desc: "Calculates the rank of the matrix",
      req: "Any matrix size",
    },
    {
      func: "adj(A)",
      name: "Adjoint",
      desc: "Transpose of cofactor matrix",
      req: "Square matrix",
    },
    {
      func: "cof(A)",
      name: "Cofactor",
      desc: "Matrix of cofactors",
      req: "Square matrix",
    },
    {
      func: "lu(A)",
      name: "LU Decomposition",
      desc: "Lower & Upper triangular decomposition",
      req: "Square matrix",
    },
    {
      func: "sin(A), cos(A)...",
      name: "Element-Wise Math",
      desc: "Applies sin, cos, tan, log to each cell",
      req: "Any matrix (log requires > 0)",
    },
  ]

  const handleApplyExample = (expr: string) => {
    if (onSelectExample) {
      onSelectExample(expr)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-slide-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="syntax-guide-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="syntax-guide-title" className="text-xl font-bold tracking-tight">
                Syntax & Formula Guide
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Learn how to write expressions, use functions, and chain matrix operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            aria-label="Close syntax guide"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 px-6 bg-gray-50/40 dark:bg-gray-850/40 text-sm font-medium overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("examples")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "examples"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            Examples (Click to Try)
          </button>
          <button
            onClick={() => setActiveTab("operations")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "operations"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <CalculatorIcon className="w-4 h-4" />
            Operators
          </button>
          <button
            onClick={() => setActiveTab("functions")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "functions"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <LayersIcon className="w-4 h-4" />
            Functions
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "rules"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <HelpCircleIcon className="w-4 h-4" />
            Rules & Tips
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {/* TAB 1: EXAMPLES */}
          {activeTab === "examples" && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Click any formula below to automatically insert it into your Equation bar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyExample(ex.expression)}
                    className="group relative p-3.5 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/40 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <code className="font-mono text-base font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                        {ex.expression}
                      </code>
                      <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 transition-opacity">
                        Try <ArrowRightIcon className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {ex.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {ex.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OPERATORS */}
          {activeTab === "operations" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Supported binary and unary arithmetic operators:
              </p>
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">
                    <tr>
                      <th className="py-2.5 px-4">Operator</th>
                      <th className="py-2.5 px-4">Name</th>
                      <th className="py-2.5 px-4">Example</th>
                      <th className="py-2.5 px-4">Requirements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 font-mono text-xs">
                    {operations.map((op, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-orange-600 dark:text-orange-400 text-base">
                          {op.op}
                        </td>
                        <td className="py-3 px-4 font-sans font-medium text-gray-800 dark:text-gray-200">
                          {op.name}
                        </td>
                        <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-bold">
                          {op.syntax}
                        </td>
                        <td className="py-3 px-4 font-sans text-gray-500 dark:text-gray-400">
                          {op.rule}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FUNCTIONS */}
          {activeTab === "functions" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Supported built-in matrix and scientific functions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {functions.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/40"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <code className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
                        {f.func}
                      </code>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {f.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-0.5">
                      {f.desc}
                    </div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500">
                      Req: {f.req}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RULES & TIPS */}
          {activeTab === "rules" && (
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  1. Matrix Identifiers are Case-Sensitive
                </h4>
                <p className="text-xs">
                  Matrices are identified by their uppercase labels: <code className="font-bold">A</code>,{" "}
                  <code className="font-bold">B</code>, <code className="font-bold">C</code>. If a matrix has not been created yet, the evaluator will report it as unknown.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                  2. Parentheses & Precedence
                </h4>
                <p className="text-xs">
                  Standard PEMDAS applies: Parentheses <code className="font-bold">()</code> first, then Exponents <code className="font-bold">^</code>, then Functions, then Multiplication/Division, then Addition/Subtraction.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-green-50/60 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                  3. Dimension Compatibility
                </h4>
                <p className="text-xs">
                  Addition requires identical rows & columns. For matrix multiplication (<code className="font-bold">A * B</code>), columns of <code className="font-bold">A</code> must equal rows of <code className="font-bold">B</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
                <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-1">
                  4. Reusing Results
                </h4>
                <p className="text-xs">
                  When you evaluate an expression resulting in a matrix, use the <strong>"Paste to Matrix"</strong> button on the result card below to store it into an existing matrix for further calculations!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/60 flex justify-between items-center text-xs text-gray-500">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono text-[10px]">Esc</kbd> to close</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium text-gray-800 dark:text-gray-200 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
