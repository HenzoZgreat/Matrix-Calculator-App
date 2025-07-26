// Utils/matrix/transformations.ts

import { createIdentityMatrix } from "./creation"

export const transposeMatrix = (matrix: number[][]): number[][] => {
  if (matrix.length === 0) return []
  const rows = matrix.length
  const cols = matrix[0].length
  const transposed: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      transposed[j][i] = matrix[i][j]
    }
  }
  return transposed
}

/**
 * Helper function to get a submatrix by excluding a specific row and column.
 */
const getSubmatrix = (matrix: number[][], excludeRow: number, excludeCol: number): number[][] => {
  return matrix.filter((_, rIdx) => rIdx !== excludeRow).map((row) => row.filter((_, cIdx) => cIdx !== excludeCol))
}

/**
 * Calculates the cofactor matrix of a square matrix.
 */
export const findCofactor = (matrix: number[][]): number[][] | null => {
  const rows = matrix.length
  const cols = matrix[0]?.length

  if (rows === 0) return []
  if (rows !== cols) {
    return null // Not a square matrix
  }

  const cofactorMatrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0))

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const submatrix = getSubmatrix(matrix, i, j)
      const minor = findDeterminant(submatrix)
      if (minor === null) return null
      cofactorMatrix[i][j] = minor * Math.pow(-1, i + j)
    }
  }
  return cofactorMatrix
}

/**
 * Calculates the adjoint of a square matrix.
 */
export const findAdjoint = (matrix: number[][]): number[][] | null => {
  const cofactorMatrix = findCofactor(matrix)
  if (cofactorMatrix === null) {
    return null
  }
  return transposeMatrix(cofactorMatrix)
}

/**
 * Calculates the inverse of a square matrix.
 */
export const findInverse = (matrix: number[][]): number[][] | null => {
  const rows = matrix.length
  const cols = matrix[0]?.length

  if (rows === 0) return []
  if (rows !== cols) {
    return null
  }

  const det = findDeterminant(matrix)
  if (det === null || det === 0) {
    return null
  }

  const adj = findAdjoint(matrix)
  if (adj === null) {
    return null
  }

  const inverse: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0))
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      inverse[i][j] = adj[i][j] / det
    }
  }
  return inverse
}

/**
 * Converts a matrix to its Row Echelon Form (REF).
 */
export const toRowEchelonForm = (matrix: number[][]): number[][] | null => {
  if (matrix.length === 0 || matrix[0].length === 0) return []

  const rows = matrix.length
  const cols = matrix[0].length
  const refMatrix = matrix.map((row) => [...row]) // Deep copy

  let lead = 0

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break

    let i = r
    while (i < rows && refMatrix[i][lead] === 0) {
      i++
    }

    if (i < rows) {
      // Swap rows if necessary
      ;[refMatrix[r], refMatrix[i]] = [refMatrix[i], refMatrix[r]]

      // Normalize the pivot row
      const div = refMatrix[r][lead]
      for (let j = lead; j < cols; j++) {
        refMatrix[r][j] /= div
      }

      // Eliminate other rows
      for (let i_other = 0; i_other < rows; i_other++) {
        if (i_other !== r) {
          const mult = refMatrix[i_other][lead]
          for (let j = lead; j < cols; j++) {
            refMatrix[i_other][j] -= mult * refMatrix[r][j]
          }
        }
      }
      lead++
    } else {
      lead++
      r--
    }
  }

  // Round small numbers to zero
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.abs(refMatrix[r][c]) < 1e-9) {
        refMatrix[r][c] = 0
      }
    }
  }

  return refMatrix
}

/**
 * Placeholder for LU Decomposition.
 */
export const luDecomposition = (matrix: number[][]): { L: number[][]; U: number[][] } | null => {
  const rows = matrix.length
  const cols = matrix[0]?.length

  if (rows === 0 || rows !== cols) {
    return null
  }

  // Placeholder implementation
  const L = createIdentityMatrix(rows)
  const U = matrix.map((row) => [...row])

  return { L, U }
}

// Import findDeterminant from analysis.ts to avoid circular dependency
import { findDeterminant } from "./analysis"
