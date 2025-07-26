// Utils/matrix/types.ts

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
  equation?: string // Optional: store the original equation for display
}

export type MatrixType =
  | "random"
  | "dense"
  | "zero"
  | "identity"
  | "diagonal"
  | "scalar"
  | "row"
  | "column"
  | "upper-triangular"
  | "lower-triangular"
  | "symmetric"
  | "skew-symmetric"
  | "boolean"
  | "sparse"
  | "hermitian"
  | "skew-hermitian"
  | "orthogonal"
  | "idempotent"
  | "nilpotent"
  | "involutory"
  | "singular"
  | "non-singular"
  | "stochastic"
  | "right-stochastic"
  | "left-stochastic"

export interface MatrixCreationResult {
  data: number[][] | null
  errorMessage: string | null
}
