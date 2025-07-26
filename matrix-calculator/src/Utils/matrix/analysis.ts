// Utils/matrix/analysis.ts

import { toRowEchelonForm } from "./transformations"

export const traceMatrix = (matrix: number[][]): number | null => {
  if (matrix.length === 0 || matrix.length !== matrix[0].length) {
    return null
  }
  let trace = 0
  for (let i = 0; i < matrix.length; i++) {
    trace += matrix[i][i]
  }
  return trace
}

/**
 * Helper function to get a submatrix by excluding a specific row and column.
 */
const getSubmatrix = (matrix: number[][], excludeRow: number, excludeCol: number): number[][] => {
  return matrix.filter((_, rIdx) => rIdx !== excludeRow).map((row) => row.filter((_, cIdx) => cIdx !== excludeCol))
}

/**
 * Calculates the determinant of a square matrix.
 */
export const findDeterminant = (matrix: number[][]): number | null => {
  const rows = matrix.length
  const cols = matrix[0]?.length

  if (rows === 0) return 0
  if (rows !== cols) {
    return null
  }

  if (rows === 1) {
    return matrix[0][0]
  }

  if (rows === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  }

  let det = 0
  for (let j = 0; j < cols; j++) {
    const submatrix = getSubmatrix(matrix, 0, j)
    const subDet = findDeterminant(submatrix)
    if (subDet === null) return null
    det += matrix[0][j] * subDet * (j % 2 === 0 ? 1 : -1)
  }
  return det
}

/**
 * Calculates the rank of a matrix.
 */
export const findRank = (matrix: number[][]): number | null => {
  if (matrix.length === 0) return 0
  if (matrix[0].length === 0) return 0

  const refMatrix = toRowEchelonForm(matrix)
  if (refMatrix === null) {
    return null
  }

  let rank = 0
  for (let r = 0; r < refMatrix.length; r++) {
    if (refMatrix[r].some((val) => Math.abs(val) > 1e-9)) {
      rank++
    }
  }
  return rank
}
