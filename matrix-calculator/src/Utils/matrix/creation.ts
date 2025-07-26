import type { MatrixType, MatrixCreationResult } from "./types"
import { findDeterminant } from "./index" // Assuming this is where findDeterminant is exported

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
    if (matrix[r][c] === 0) {
      matrix[r][c] = Math.floor(Math.random() * 10) + 1 // Non-zero random number
    } else {
      k-- // Try again if position already filled
    }
  }
  return matrix
}

export const createOrthogonalMatrix = (size: number): number[][] => {
  if (size <= 0) return []
  // Simplified: Generate a random matrix and apply Gram-Schmidt orthonormalization
  const matrix = generateRandomMatrix(size, size)
  const ortho: number[][] = Array.from({ length: size }, () => Array(size).fill(0))

  // Gram-Schmidt process
  for (let j = 0; j < size; j++) {
    let v = matrix[j].slice()
    for (let i = 0; i < j; i++) {
      // Compute projection of v onto ortho[i]
      let proj = 0
      for (let k = 0; k < size; k++) {
        proj += ortho[i][k] * v[k]
      }
      for (let k = 0; k < size; k++) {
        v[k] -= proj * ortho[i][k]
      }
    }
    // Normalize v
    let norm = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0))
    if (norm < 1e-10) {
      return createIdentityMatrix(size) // Fallback if orthonormalization fails
    }
    for (let k = 0; k < size; k++) {
      ortho[j][k] = v[k] / norm
    }
  }
  return ortho
}

export const createIdempotentMatrix = (size: number): number[][] => {
  if (size <= 0) return []
  // Create a projection matrix: A = I - uu^T where u is a random unit vector
  const u = Array(size).fill(0).map(() => Math.random() - 0.5)
  const norm = Math.sqrt(u.reduce((sum, val) => sum + val * val, 0))
  if (norm < 1e-10) {
    return createIdentityMatrix(size) // Fallback
  }
  const unit = u.map((val) => val / norm)
  const matrix = createIdentityMatrix(size)
  // Compute A = I - uu^T
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      matrix[i][j] -= unit[i] * unit[j]
    }
  }
  return matrix
}

export const createNilpotentMatrix = (size: number): number[][] => {
  if (size <= 0) return []
  // Create a strict upper triangular matrix (zeros on and below diagonal)
  const matrix = createZeroMatrix(size, size)
  for (let i = 0; i < size - 1; i++) {
    for (let j = i + 1; j < size; j++) {
      matrix[i][j] = Math.floor(Math.random() * 5) + 1 // Random 1-5
    }
  }
  return matrix
}

export const createInvolutoryMatrix = (size: number): number[][] => {
  if (size <= 0) return []
  // Create a reflection matrix: A = I - 2uu^T / (u^T u)
  const u = Array(size).fill(0).map(() => Math.random() - 0.5)
  const normSq = u.reduce((sum, val) => sum + val * val, 0)
  if (normSq < 1e-10) {
    return createIdentityMatrix(size) // Fallback
  }
  const matrix = createIdentityMatrix(size)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      matrix[i][j] -= (2 * u[i] * u[j]) / normSq
    }
  }
  return matrix
}

export const createSingularMatrix = (size: number): number[][] => {
  if (size <= 0) return []
  let matrix = generateRandomMatrix(size, size)
  // Make it singular by setting one row as a linear combination of others
  if (size >= 2) {
    const coeff1 = Math.random() * 2 - 1
    const coeff2 = Math.random() * 2 - 1
    matrix[size - 1] = matrix[0].map((val, j) =>
      size > 2 ? coeff1 * val + coeff2 * matrix[1][j] : coeff1 * val,
    )
  }
  // Verify singularity
  const det = findDeterminant(matrix)
  if (det !== null && Math.abs(det) > 1e-10) {
    // Retry if not singular
    return createSingularMatrix(size)
  }
  return matrix
}

export const createNonSingularMatrix = (size: number): number[][] => {
  if (size <= 0) return []
  let matrix = generateRandomMatrix(size, size)
  // Ensure non-singular by checking determinant
  let det = findDeterminant(matrix)
  let attempts = 0
  while (det === null || Math.abs(det) < 1e-10) {
    matrix = generateRandomMatrix(size, size)
    det = findDeterminant(matrix)
    attempts++
    if (attempts > 10) {
      // Fallback to diagonal matrix with non-zero entries
      return createDiagonalMatrix(size, size, Math.random() * 9 + 1)
    }
  }
  return matrix
}

export const createStochasticMatrix = (size: number): number[][] => {
  if (size <= 0) return []
  const matrix: number[][] = []
  for (let i = 0; i < size; i++) {
    matrix[i] = []
    let sum = 0
    // Generate random positive entries
    for (let j = 0; j < size; j++) {
      matrix[i][j] = Math.random()
      sum += matrix[i][j]
    }
    // Normalize row to sum to 1
    if (sum > 0) {
      for (let j = 0; j < size; j++) {
        matrix[i][j] /= sum
      }
    }
  }
  return matrix
}

export const createRightStochasticMatrix = (size: number): number[][] => {
  return createStochasticMatrix(size) // Same as stochastic (row sums = 1)
}

export const createLeftStochasticMatrix = (size: number): number[][] => {
  if (size <= 0) return []
  const matrix: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  for (let j = 0; j < size; j++) {
    let sum = 0
    // Generate random positive entries for column
    for (let i = 0; i < size; i++) {
      matrix[i][j] = Math.random()
      sum += matrix[i][j]
    }
    // Normalize column to sum to 1
    if (sum > 0) {
      for (let i = 0; i < size; i++) {
        matrix[i][j] /= sum
      }
    }
  }
  return matrix
}

// Placeholder implementations (not implemented due to complex numbers)
export const createHermitianMatrix = (size: number): number[][] | null => {
  console.warn("Hermitian Matrix requires complex numbers, not supported.")
  return createZeroMatrix(size, size)
}

export const createSkewHermitianMatrix = (size: number): number[][] | null => {
  console.warn("Skew-Hermitian Matrix requires complex numbers, not supported.")
  return createZeroMatrix(size, size)
}

export const createMatrixByType = (rows: number, cols: number, type: MatrixType): MatrixCreationResult => {
  let data: number[][] | null = null
  let errorMessage: string | null = null

  switch (type) {
    case "random":
    case "dense":
      data = generateRandomMatrix(rows, cols)
      break
    case "zero":
      data = createZeroMatrix(rows, cols)
      break
    case "identity":
      if (rows !== cols) {
        errorMessage = "Identity matrix must be square. Created a square identity matrix with min(rows, cols)."
        data = createIdentityMatrix(Math.min(rows, cols))
      } else {
        data = createIdentityMatrix(rows)
      }
      break
    case "diagonal":
      data = createDiagonalMatrix(rows, cols)
      break
    case "scalar":
      if (rows !== cols) {
        errorMessage = "Scalar matrix must be square. Created a square scalar matrix with min(rows, cols)."
        data = createScalarMatrix(Math.min(rows, cols))
      } else {
        data = createScalarMatrix(rows)
      }
      break
    case "row":
      data = createRowMatrix(cols)
      break
    case "column":
      data = createColumnMatrix(rows)
      break
    case "upper-triangular":
      if (rows !== cols) {
        errorMessage =
          "Upper Triangular matrix must be square. Created a square upper triangular matrix with min(rows, cols)."
        data = createUpperTriangularMatrix(Math.min(rows, cols))
      } else {
        data = createUpperTriangularMatrix(rows)
      }
      break
    case "lower-triangular":
      if (rows !== cols) {
        errorMessage =
          "Lower Triangular matrix must be square. Created a square lower triangular matrix with min(rows, cols)."
        data = createLowerTriangularMatrix(Math.min(rows, cols))
      } else {
        data = createLowerTriangularMatrix(rows)
      }
      break
    case "symmetric":
      if (rows !== cols) {
        errorMessage = "Symmetric matrix must be square. Created a square symmetric matrix with min(rows, cols)."
        data = createSymmetricMatrix(Math.min(rows, cols))
      } else {
        data = createSymmetricMatrix(rows)
      }
      break
    case "skew-symmetric":
      if (rows !== cols) {
        errorMessage =
          "Skew-Symmetric matrix must be square. Created a square skew-symmetric matrix with min(rows, cols)."
        data = createSkewSymmetricMatrix(Math.min(rows, cols))
      } else {
        data = createSkewSymmetricMatrix(rows)
      }
      break
    case "boolean":
      data = createBooleanMatrix(rows, cols)
      break
    case "sparse":
      data = createSparseMatrix(rows, cols)
      break
    case "hermitian":
      errorMessage = "Hermitian Matrix requires complex numbers, not supported."
      data = createHermitianMatrix(Math.min(rows, cols))
      break
    case "skew-hermitian":
      errorMessage = "Skew-Hermitian Matrix requires complex numbers, not supported."
      data = createSkewHermitianMatrix(Math.min(rows, cols))
      break
    case "orthogonal":
      if (rows !== cols) {
        errorMessage = "Orthogonal matrix must be square. Created a square orthogonal matrix with min(rows, cols)."
        data = createOrthogonalMatrix(Math.min(rows, cols))
      } else {
        data = createOrthogonalMatrix(rows)
      }
      break
    case "idempotent":
      if (rows !== cols) {
        errorMessage = "Idempotent matrix must be square. Created a square idempotent matrix with min(rows, cols)."
        data = createIdempotentMatrix(Math.min(rows, cols))
      } else {
        data = createIdempotentMatrix(rows)
      }
      break
    case "nilpotent":
      if (rows !== cols) {
        errorMessage = "Nilpotent matrix must be square. Created a square nilpotent matrix with min(rows, cols)."
        data = createNilpotentMatrix(Math.min(rows, cols))
      } else {
        data = createNilpotentMatrix(rows)
      }
      break
    case "involutory":
      if (rows !== cols) {
        errorMessage = "Involutory matrix must be square. Created a square involutory matrix with min(rows, cols)."
        data = createInvolutoryMatrix(Math.min(rows, cols))
      } else {
        data = createInvolutoryMatrix(rows)
      }
      break
    case "singular":
      if (rows !== cols) {
        errorMessage = "Singular matrix must be square. Created a square singular matrix with min(rows, cols)."
        data = createSingularMatrix(Math.min(rows, cols))
      } else {
        data = createSingularMatrix(rows)
      }
      break
    case "non-singular":
      if (rows !== cols) {
        errorMessage = "Non-Singular matrix must be square. Created a square non-singular matrix with min(rows, cols)."
        data = createNonSingularMatrix(Math.min(rows, cols))
      } else {
        data = createNonSingularMatrix(rows)
      }
      break
    case "stochastic":
      if (rows !== cols) {
        errorMessage = "Stochastic matrix must be square. Created a square stochastic matrix with min(rows, cols)."
        data = createStochasticMatrix(Math.min(rows, cols))
      } else {
        data = createStochasticMatrix(rows)
      }
      break
    case "right-stochastic":
      if (rows !== cols) {
        errorMessage =
          "Right Stochastic matrix must be square. Created a square right stochastic matrix with min(rows, cols)."
        data = createRightStochasticMatrix(Math.min(rows, cols))
      } else {
        data = createRightStochasticMatrix(rows)
      }
      break
    case "left-stochastic":
      if (rows !== cols) {
        errorMessage =
          "Left Stochastic matrix must be square. Created a square left stochastic matrix with min(rows, cols)."
        data = createLeftStochasticMatrix(Math.min(rows, cols))
      } else {
        data = createLeftStochasticMatrix(rows)
      }
      break
    default:
      data = generateRandomMatrix(rows, cols)
      break
  }

  return { data, errorMessage }
}