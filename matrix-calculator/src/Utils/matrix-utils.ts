// Utils/matrix-utils.ts

export interface Matrix {
  id: string
  label: string // A, B, C...
  data: number[][]
  rows: number
  cols: number
  isSelected: boolean
}

export interface OperationResult {
  id: string // Unique ID for this result entry
  matrixId: string // ID of the matrix it was applied to
  matrixLabel: string // Label of the matrix it was applied to
  operation: string // Name of the operation
  resultData: string | number | number[][] | { L: number[][]; U: number[][] } // The actual result
}

export const getNextMatrixLabel = (currentMatricesCount: number): string => {
  return String.fromCharCode(65 + currentMatricesCount) // A=65, B=66, etc.
}

export const generateRandomMatrix = (rows: number, cols: number): number[][] => {
  const matrix: number[][] = []
  for (let i = 0; i < rows; i++) {
    matrix[i] = []
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = Math.floor(Math.random() * 10) // Random integer between 0-9
    }
  }
  return matrix
}

export const createZeroMatrix = (rows: number, cols: number): number[][] => {
  return Array.from({ length: rows }, () => Array(cols).fill(0))
}

export const createIdentityMatrix = (size: number): number[][] => {
  if (size <= 0) return []
  const matrix: number[][] = []
  for (let i = 0; i < size; i++) {
    matrix[i] = Array(size).fill(0)
    matrix[i][i] = 1
  }
  return matrix
}

export const createDiagonalMatrix = (rows: number, cols: number, value = 1): number[][] => {
  const matrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0))
  const minDim = Math.min(rows, cols)
  for (let i = 0; i < minDim; i++) {
    matrix[i][i] = value
  }
  return matrix
}

export const createScalarMatrix = (size: number, scalar = 5): number[][] => {
  return createDiagonalMatrix(size, size, scalar)
}

export const createRowMatrix = (cols: number, value = 0): number[][] => {
  return [Array(cols).fill(value)]
}

export const createColumnMatrix = (rows: number, value = 0): number[][] => {
  return Array.from({ length: rows }, () => [value])
}

export const createUpperTriangularMatrix = (size: number): number[][] => {
  const matrix = generateRandomMatrix(size, size)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < i; j++) {
      matrix[i][j] = 0 // Set elements below diagonal to 0
    }
  }
  return matrix
}

export const createLowerTriangularMatrix = (size: number): number[][] => {
  const matrix = generateRandomMatrix(size, size)
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      matrix[i][j] = 0 // Set elements above diagonal to 0
    }
  }
  return matrix
}

export const createSymmetricMatrix = (size: number): number[][] => {
  const matrix = generateRandomMatrix(size, size)
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      matrix[j][i] = matrix[i][j] // Make it symmetric
    }
  }
  return matrix
}

export const createSkewSymmetricMatrix = (size: number): number[][] => {
  const matrix = generateRandomMatrix(size, size)
  for (let i = 0; i < size; i++) {
    matrix[i][i] = 0 // Diagonal elements must be 0
    for (let j = i + 1; j < size; j++) {
      matrix[j][i] = -matrix[i][j] // Make it skew-symmetric
    }
  }
  return matrix
}

export const createBooleanMatrix = (rows: number, cols: number): number[][] => {
  const matrix: number[][] = []
  for (let i = 0; i < rows; i++) {
    matrix[i] = []
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = Math.round(Math.random()) // 0 or 1
    }
  }
  return matrix
}

export const createSparseMatrix = (rows: number, cols: number, density = 0.2): number[][] => {
  const matrix: number[][] = createZeroMatrix(rows, cols)
  const totalElements = rows * cols
  const numNonZero = Math.floor(totalElements * density)

  for (let k = 0; k < numNonZero; k++) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    // Ensure unique positions for non-zero elements, or allow overwrites
    if (matrix[r][c] === 0) {
      matrix[r][c] = Math.floor(Math.random() * 10) + 1 // Non-zero random number
    } else {
      k-- // Try again if position already filled
    }
  }
  return matrix
}

// Placeholder for complex matrix types (difficult to generate randomly while maintaining properties)
export const createHermitianMatrix = (size: number): number[][] | null => {
  console.warn("Hermitian Matrix generation is a placeholder and not fully implemented.")
  return createZeroMatrix(size, size) // Placeholder: returns a zero matrix
}

export const createSkewHermitianMatrix = (size: number): number[][] | null => {
  console.warn("Skew-Hermitian Matrix generation is a placeholder and not fully implemented.")
  return createZeroMatrix(size, size) // Placeholder: returns a zero matrix
}

export const createOrthogonalMatrix = (size: number): number[][] | null => {
  console.warn("Orthogonal Matrix generation is a placeholder and not fully implemented.")
  return createIdentityMatrix(size) // Placeholder: returns an identity matrix
}

export const createIdempotentMatrix = (size: number): number[][] | null => {
  console.warn("Idempotent Matrix generation is a placeholder and not fully implemented.")
  return createZeroMatrix(size, size) // Placeholder: returns a zero matrix
}

export const createNilpotentMatrix = (size: number): number[][] | null => {
  console.warn("Nilpotent Matrix generation is a placeholder and not fully implemented.")
  return createZeroMatrix(size, size) // Placeholder: returns a zero matrix
}

export const createInvolutoryMatrix = (size: number): number[][] | null => {
  console.warn("Involutory Matrix generation is a placeholder and not fully implemented.")
  return createIdentityMatrix(size) // Placeholder: returns an identity matrix
}

export const createSingularMatrix = (size: number): number[][] | null => {
  console.warn("Singular Matrix generation is a placeholder and not fully implemented.")
  // A simple way to guarantee singularity is to make two rows identical
  const matrix = generateRandomMatrix(size, size)
  if (size >= 2) {
    matrix[1] = [...matrix[0]] // Make row 1 identical to row 0
  }
  return matrix
}

export const createNonSingularMatrix = (size: number): number[][] | null => {
  console.warn("Non-Singular Matrix generation is a placeholder and not fully implemented.")
  // For now, just return a random matrix, hoping it's non-singular
  return generateRandomMatrix(size, size)
}

export const createStochasticMatrix = (size: number): number[][] | null => {
  console.warn("Stochastic Matrix generation is a placeholder and not fully implemented.")
  return createZeroMatrix(size, size) // Placeholder
}

export const createRightStochasticMatrix = (size: number): number[][] | null => {
  console.warn("Right Stochastic Matrix generation is a placeholder and not fully implemented.")
  return createZeroMatrix(size, size) // Placeholder
}

export const createLeftStochasticMatrix = (size: number): number[][] | null => {
  console.warn("Left Stochastic Matrix generation is a placeholder and not fully implemented.")
  return createZeroMatrix(size, size) // Placeholder
}

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

export const traceMatrix = (matrix: number[][]): number | null => {
  if (matrix.length === 0 || matrix.length !== matrix[0].length) {
    return null // Not a square matrix
  }
  let trace = 0
  for (let i = 0; i < matrix.length; i++) {
    trace += matrix[i][i]
  }
  return trace
}

/**
 * Helper function to get a submatrix by excluding a specific row and column.
 * Used for determinant and cofactor calculations.
 */
const getSubmatrix = (matrix: number[][], excludeRow: number, excludeCol: number): number[][] => {
  return matrix.filter((_, rIdx) => rIdx !== excludeRow).map((row) => row.filter((_, cIdx) => cIdx !== excludeCol))
}

/**
 * Calculates the determinant of a square matrix.
 * @param matrix The input matrix.
 * @returns The determinant value, or null if the matrix is not square.
 */
export const findDeterminant = (matrix: number[][]): number | null => {
  const rows = matrix.length
  const cols = matrix[0]?.length

  if (rows === 0) return 0
  if (rows !== cols) {
    return null // Not a square matrix
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
    if (subDet === null) return null // Should not happen if logic is correct
    det += matrix[0][j] * subDet * (j % 2 === 0 ? 1 : -1) // Cofactor expansion along first row
  }
  return det
}

/**
 * Calculates the cofactor matrix of a square matrix.
 * @param matrix The input matrix.
 * @returns The cofactor matrix, or null if the matrix is not square.
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
      if (minor === null) return null // Should not happen if logic is correct
      cofactorMatrix[i][j] = minor * Math.pow(-1, i + j)
    }
  }
  return cofactorMatrix
}

/**
 * Calculates the adjoint of a square matrix.
 * @param matrix The input matrix.
 * @returns The adjoint matrix, or null if the matrix is not square.
 */
export const findAdjoint = (matrix: number[][]): number[][] | null => {
  const cofactorMatrix = findCofactor(matrix)
  if (cofactorMatrix === null) {
    return null // Not a square matrix
  }
  return transposeMatrix(cofactorMatrix)
}

/**
 * Calculates the inverse of a square matrix.
 * @param matrix The input matrix.
 * @returns The inverse matrix, or null if the matrix is not square or is singular.
 */
export const findInverse = (matrix: number[][]): number[][] | null => {
  const rows = matrix.length
  const cols = matrix[0]?.length

  if (rows === 0) return []
  if (rows !== cols) {
    return null // Not a square matrix
  }

  const det = findDeterminant(matrix)
  if (det === null) {
    return null // Not a square matrix
  }
  if (det === 0) {
    return null // Singular matrix, inverse does not exist
  }

  const adj = findAdjoint(matrix)
  if (adj === null) {
    return null // Should not happen if adjoint logic is correct
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
 * Converts a matrix to its Row Echelon Form (REF) using Gaussian elimination.
 * This implementation is basic and may have numerical stability issues for very large or ill-conditioned matrices.
 * @param matrix The input matrix.
 * @returns The matrix in REF, or null if input is invalid.
 */
export const toRowEchelonForm = (matrix: number[][]): number[][] | null => {
  if (matrix.length === 0 || matrix[0].length === 0) return []

  const rows = matrix.length
  const cols = matrix[0].length
  const refMatrix = matrix.map((row) => [...row]) // Create a deep copy

  let lead = 0 // Current leading column

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break // No more columns to process

    let i = r // Current row to pivot

    // Find row with non-zero element in current leading column
    while (i < rows && refMatrix[i][lead] === 0) {
      i++
    }

    if (i < rows) {
      // Swap rows if necessary
      ;[refMatrix[r], refMatrix[i]] = [refMatrix[i], refMatrix[r]]

      // Normalize the pivot row (make leading element 1)
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
      lead++ // Move to next leading column
    } else {
      // If all elements in current column are zero, move to next column
      lead++
      r-- // Re-process current row with next column
    }
  }

  // Round small numbers to zero to avoid floating point inaccuracies
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
 * Calculates the rank of a matrix.
 * The rank is the number of non-zero rows in its Row Echelon Form.
 * @param matrix The input matrix.
 * @returns The rank of the matrix, or null if the matrix is invalid.
 */
export const findRank = (matrix: number[][]): number | null => {
  if (matrix.length === 0) return 0
  if (matrix[0].length === 0) return 0

  const refMatrix = toRowEchelonForm(matrix)
  if (refMatrix === null) {
    return null // Invalid matrix for REF
  }

  let rank = 0
  for (let r = 0; r < refMatrix.length; r++) {
    // A row is non-zero if at least one element is not zero
    if (refMatrix[r].some((val) => Math.abs(val) > 1e-9)) {
      rank++
    }
  }
  return rank
}

/**
 * Placeholder for LU Decomposition.
 * This is a complex operation requiring careful handling of pivoting for numerical stability.
 * A full, robust implementation is beyond the scope of this immediate task.
 * @param matrix The input matrix.
 * @returns An object containing L and U matrices, or null if the matrix is not square or decomposition fails.
 */
export const luDecomposition = (matrix: number[][]): { L: number[][]; U: number[][] } | null => {
  const rows = matrix.length
  const cols = matrix[0]?.length

  if (rows === 0 || rows !== cols) {
    console.warn("LU Decomposition requires a non-empty square matrix.")
    return null
  }

  console.warn("LU Decomposition is a placeholder and not fully implemented for robust numerical stability.")
  console.warn("A basic implementation would involve Gaussian elimination to get U, and storing multipliers for L.")
  console.warn("For a robust solution, consider using a dedicated linear algebra library.")

  // Placeholder: return identity for L and the original matrix for U (very basic, often incorrect)
  const L = createIdentityMatrix(rows)
  const U = matrix.map((row) => [...row]) // Deep copy of original matrix

  return { L, U }
}


/**
 * Adds two matrices of the same dimensions.
 * @param matrix1 First matrix.
 * @param matrix2 Second matrix.
 * @returns The sum of the matrices, or null if dimensions are incompatible.
 */
export const addMatrices = (matrix1: number[][], matrix2: number[][]): number[][] | null => {
  const rows1 = matrix1.length;
  const cols1 = matrix1[0]?.length || 0;
  const rows2 = matrix2.length;
  const cols2 = matrix2[0]?.length || 0;

  if (rows1 !== rows2 || cols1 !== cols2) {
    return null;
  }

  const result: number[][] = Array.from({ length: rows1 }, () => Array(cols1).fill(0));
  for (let i = 0; i < rows1; i++) {
    for (let j = 0; j < cols1; j++) {
      result[i][j] = matrix1[i][j] + matrix2[i][j];
    }
  }
  return result;
};

/**
 * Multiplies two matrices.
 * @param matrix1 First matrix.
 * @param matrix2 Second matrix.
 * @returns The product of the matrices, or null if dimensions are incompatible.
 */
export const multiplyMatrices = (matrix1: number[][], matrix2: number[][]): number[][] | null => {
  const rows1 = matrix1.length;
  const cols1 = matrix1[0]?.length || 0;
  const rows2 = matrix2.length;
  const cols2 = matrix2[0]?.length || 0;

  if (cols1 !== rows2) {
    return null;
  }

  const result: number[][] = Array.from({ length: rows1 }, () => Array(cols2).fill(0));
  for (let i = 0; i < rows1; i++) {
    for (let j = 0; j < cols2; j++) {
      for (let k = 0; k < cols1; k++) {
        result[i][j] += matrix1[i][k] * matrix2[k][j];
      }
    }
  }
  return result;
};

/**
 * Multiplies a matrix by a scalar.
 * @param scalar The scalar value.
 * @param matrix The input matrix.
 * @returns The scaled matrix.
 */
export const scalarMultiplyMatrix = (scalar: number, matrix: number[][]): number[][] => {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  const result: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = scalar * matrix[i][j];
    }
  }
  return result;
};