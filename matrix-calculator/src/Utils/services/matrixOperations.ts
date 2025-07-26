import type { Matrix } from "../matrix/types"
import {
  transposeMatrix,
  traceMatrix,
  findDeterminant,
  findInverse,
  findCofactor,
  findAdjoint,
  toRowEchelonForm,
  findRank,
  luDecomposition,
  elementWiseOperation,
  multiplyMatrices,
} from "../matrix"

export class MatrixOperationService {
  static matrixPower(matrix: number[][], n: number): number[][] | string {
    const rows = matrix.length
    const cols = matrix[0]?.length || 0

    if (rows !== cols) {
      return "Matrix must be square for exponentiation"
    }
    if (!Number.isInteger(n)) {
      return "Exponent must be an integer"
    }

    // Identity matrix for n = 0
    if (n === 0) {
      const identity = Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => (i === j ? 1 : 0)),
      )
      return identity
    }

    // Positive powers
    if (n > 0) {
      let result = matrix
      for (let i = 1; i < n; i++) {
        const next = multiplyMatrices(result, matrix)
        if (!next) return "Matrix multiplication failed"
        result = next
      }
      return result
    }

    // Negative powers: A^(-n) = (A^-1)^n
    const inverse = findInverse(matrix)
    if (!inverse) {
      return "Matrix is not invertible for negative exponent"
    }
    let result = inverse
    for (let i = 1; i < -n; i++) {
      const next = multiplyMatrices(result, inverse)
      if (!next) return "Matrix multiplication failed"
      result = next
    }
    return result
  }

  static performOperation(
    operation: string,
    input: Matrix | number,
  ): { result: any; shouldUpdateMatrix?: boolean; newMatrixData?: number[][] } {
    const op = operation.toLowerCase()

    // Handle scalar inputs
    if (typeof input === "number") {
      try {
        switch (op) {
          case "sin":
            return { result: Math.sin(input) }
          case "cos":
            return { result: Math.cos(input) }
          case "tan":
            return Math.abs(input % Math.PI - Math.PI / 2) < 1e-9
              ? { result: `Operation ${op} failed: undefined value` }
              : { result: Math.tan(input) }
          case "asin":
            return Math.abs(input) <= 1
              ? { result: Math.asin(input) }
              : { result: `Operation ${op} failed: input out of domain [-1, 1]` }
          case "acos":
            return Math.abs(input) <= 1
              ? { result: Math.acos(input) }
              : { result: `Operation ${op} failed: input out of domain [-1, 1]` }
          case "atan":
            return { result: Math.atan(input) }
          case "sec":
            return Math.abs(Math.cos(input)) < 1e-9
              ? { result: `Operation ${op} failed: undefined value` }
              : { result: 1 / Math.cos(input) }
          case "csc":
            return Math.abs(Math.sin(input)) < 1e-9
              ? { result: `Operation ${op} failed: undefined value` }
              : { result: 1 / Math.sin(input) }
          case "cot":
            return Math.abs(input % Math.PI) < 1e-9
              ? { result: `Operation ${op} failed: undefined value` }
              : { result: 1 / Math.tan(input) }
          case "sinh":
            return { result: Math.sinh(input) }
          case "cosh":
            return { result: Math.cosh(input) }
          case "tanh":
            return { result: Math.tanh(input) }
          case "log":
            return input > 0
              ? { result: Math.log(input) }
              : { result: `Operation ${op} failed: input must be positive` }
          default:
            return { result: `Operation ${op} not supported for scalars` }
        }
      } catch (e) {
        return { result: `Operation ${op} failed: ${e instanceof Error ? e.message : "unknown error"}` }
      }
    }

    // Handle matrix inputs
    const matrix = input as Matrix
    if (!matrix.data) {
      return { result: "Invalid matrix: no data provided" }
    }
    switch (op) {
      case "transpose":
        const transposed = transposeMatrix(matrix.data)
        return {
          result: transposed,
          shouldUpdateMatrix: true,
          newMatrixData: transposed,
        }

      case "trc":
      case "trace":
        const trace = traceMatrix(matrix.data)
        return {
          result: trace !== null ? trace : "Trace requires a square matrix.",
        }

      case "det":
      case "determinant":
        const det = findDeterminant(matrix.data)
        return {
          result: det !== null ? det : "Determinant requires a square matrix.",
        }

      case "inv":
      case "inverse":
        const inverse = findInverse(matrix.data)
        return {
          result: inverse || "Inverse requires a square, non-singular matrix.",
        }

      case "cof":
      case "cofactor":
        const cofactor = findCofactor(matrix.data)
        return {
          result: cofactor || "Cofactor requires a square matrix.",
        }

      case "adj":
      case "adjoint":
        const adjoint = findAdjoint(matrix.data)
        return {
          result: adjoint || "Adjoint requires a square matrix.",
        }

      case "ref":
        const ref = toRowEchelonForm(matrix.data)
        return {
          result: ref || "Could not convert to Row Echelon Form.",
          shouldUpdateMatrix: !!ref,
          newMatrixData: ref || undefined,
        }

      case "rank":
        const rank = findRank(matrix.data)
        return {
          result: rank !== null ? `Rank: ${rank}` : "Could not calculate rank.",
        }

      case "lu":
      case "lu-decomposition":
        const lu = luDecomposition(matrix.data)
        return {
          result: lu || "LU Decomposition failed (requires square matrix).",
        }

      case "sin":
      case "cos":
      case "tan":
      case "asin":
      case "acos":
      case "atan":
      case "sec":
      case "csc":
      case "cot":
      case "sinh":
      case "cosh":
      case "tanh":
      case "log":
        const elementWise = elementWiseOperation(matrix.data, op)
        return {
          result: typeof elementWise === "string" ? elementWise : elementWise,
          shouldUpdateMatrix: typeof elementWise !== "string",
          newMatrixData: typeof elementWise !== "string" ? elementWise : undefined,
        }

      default:
        return { result: `Unknown operation: ${op}.` }
    }
  }
}