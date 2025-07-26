/**
 * Adds two matrices of the same dimensions.
 */
export const addMatrices = (matrix1: number[][], matrix2: number[][]): number[][] | null => {
  const rows1 = matrix1.length
  const cols1 = matrix1[0]?.length || 0
  const rows2 = matrix2.length
  const cols2 = matrix2[0]?.length || 0

  if (rows1 !== rows2 || cols1 !== cols2) {
    return null
  }

  const result: number[][] = Array.from({ length: rows1 }, () => Array(cols1).fill(0))
  for (let i = 0; i < rows1; i++) {
    for (let j = 0; j < cols1; j++) {
      result[i][j] = matrix1[i][j] + matrix2[i][j]
    }
  }
  return result
}

/**
 * Subtracts two matrices of the same dimensions.
 */
export const subtractMatrices = (matrix1: number[][], matrix2: number[][]): number[][] | null => {
  const rows1 = matrix1.length
  const cols1 = matrix1[0]?.length || 0
  const rows2 = matrix2.length
  const cols2 = matrix2[0]?.length || 0

  if (rows1 !== rows2 || cols1 !== cols2) {
    return null
  }

  const result: number[][] = Array.from({ length: rows1 }, () => Array(cols1).fill(0))
  for (let i = 0; i < rows1; i++) {
    for (let j = 0; j < cols1; j++) {
      result[i][j] = matrix1[i][j] - matrix2[i][j]
    }
  }
  return result
}

/**
 * Multiplies two matrices.
 */
export const multiplyMatrices = (matrix1: number[][], matrix2: number[][]): number[][] | null => {
  const rows1 = matrix1.length
  const cols1 = matrix1[0]?.length || 0
  const rows2 = matrix2.length
  const cols2 = matrix2[0]?.length || 0

  if (cols1 !== rows2) {
    return null
  }

  const result: number[][] = Array.from({ length: rows1 }, () => Array(cols2).fill(0))
  for (let i = 0; i < rows1; i++) {
    for (let j = 0; j < cols2; j++) {
      for (let k = 0; k < cols1; k++) {
        result[i][j] += matrix1[i][k] * matrix2[k][j]
      }
    }
  }
  return result
}

/**
 * Multiplies a matrix by a scalar.
 */
export const scalarMultiplyMatrix = (scalar: number, matrix: number[][]): number[][] => {
  const rows = matrix.length
  const cols = matrix[0]?.length || 0
  const result: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0))
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = scalar * matrix[i][j]
    }
  }
  return result
}

/**
 * Element-wise operations on matrices.
 */
export const elementWiseOperation = (matrix: number[][], operation: string): number[][] | string => {
  const result = matrix.map((row) =>
    row.map((cell) => {
      try {
        switch (operation) {
          case "sin":
            return Math.sin(cell)
          case "cos":
            return Math.cos(cell)
          case "tan":
            return Math.abs(cell % Math.PI - Math.PI / 2) < 1e-9 ? NaN : Math.tan(cell)
          case "asin":
            return Math.abs(cell) <= 1 ? Math.asin(cell) : NaN
          case "acos":
            return Math.abs(cell) <= 1 ? Math.acos(cell) : NaN
          case "atan":
            return Math.atan(cell)
          case "sec":
            return Math.abs(Math.cos(cell)) < 1e-9 ? NaN : 1 / Math.cos(cell)
          case "csc":
            return Math.abs(Math.sin(cell)) < 1e-9 ? NaN : 1 / Math.sin(cell)
          case "cot":
            return Math.abs(cell % Math.PI) < 1e-9 ? NaN : 1 / Math.tan(cell)
          case "sinh":
            return Math.sinh(cell)
          case "cosh":
            return Math.cosh(cell)
          case "tanh":
            return Math.tanh(cell)
          case "log":
            return cell > 0 ? Math.log(cell) : NaN
          default:
            return NaN
        }
      } catch (e) {
        return NaN
      }
    }),
  )

  // Check for NaN in result
  if (result.some(row => row.some(cell => isNaN(cell)))) {
    return `Operation ${operation} failed: undefined values in result`
  }

  return result
}