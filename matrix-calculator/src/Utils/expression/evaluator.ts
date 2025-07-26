import type { Matrix } from "../matrix/types"
import type { Token } from "./parser"
import { MatrixOperationService } from "../services/matrixOperations"
import { addMatrices, subtractMatrices, multiplyMatrices, scalarMultiplyMatrix } from "../matrix"

export interface EvaluationContext {
  matrices: Matrix[]
}

export interface EvaluationResult {
  success: boolean
  result?: any
  error?: string
}

export class ExpressionEvaluator {
  private context: EvaluationContext
  private tokens: Token[]
  private position: number

  constructor(context: EvaluationContext) {
    this.context = context
    this.tokens = []
    this.position = 0
  }

  evaluate(tokens: Token[]): EvaluationResult {
    this.tokens = tokens
    this.position = 0

    try {
      const result = this.parseExpression()
      if (this.position < this.tokens.length) {
        throw new Error("Unexpected tokens after expression")
      }
      console.log("Evaluator result:", result)
      return { success: true, result }
    } catch (error) {
      console.error("Evaluator error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown evaluation error",
      }
    }
  }

  private parseExpression(): any {
    return this.parseAddSub()
  }

  private parseAddSub(): any {
    let left = this.parseMulDiv()

    while (this.position < this.tokens.length) {
      const token = this.tokens[this.position]
      if (token.type !== "operator" || (token.value !== "+" && token.value !== "-")) {
        break
      }
      this.position++
      const right = this.parseMulDiv()

      if (token.value === "+") {
        if (left?.data && right?.data) {
          const result = addMatrices(left.data, right.data)
          if (!result) throw new Error("Matrix addition failed: incompatible dimensions")
          left = { data: result }
        } else if (typeof left === "number" && typeof right === "number") {
          left = left + right
        } else {
          throw new Error("Addition requires two matrices or two scalars")
        }
      } else {
        if (left?.data && right?.data) {
          const result = subtractMatrices(left.data, right.data)
          if (!result) throw new Error("Matrix subtraction failed: incompatible dimensions")
          left = { data: result }
        } else if (typeof left === "number" && typeof right === "number") {
          left = left - right
        } else {
          throw new Error("Subtraction requires two matrices or two scalars")
        }
      }
    }

    return left
  }

  private parseMulDiv(): any {
    let left = this.parsePower()

    while (this.position < this.tokens.length) {
      const token = this.tokens[this.position]
      if (token.type !== "operator" || (token.value !== "*" && token.value !== "/")) {
        break
      }
      this.position++
      const right = this.parsePower()

      if (token.value === "*") {
        if (typeof left === "number" && right?.data) {
          left = { data: scalarMultiplyMatrix(left, right.data) }
        } else if (left?.data && typeof right === "number") {
          left = { data: scalarMultiplyMatrix(right, left.data) }
        } else if (left?.data && right?.data) {
          const result = multiplyMatrices(left.data, right.data)
          if (!result) throw new Error("Matrix multiplication failed: incompatible dimensions")
          left = { data: result }
        } else if (typeof left === "number" && typeof right === "number") {
          left = left * right
        } else {
          throw new Error("Invalid operands for multiplication")
        }
      } else {
        if (left?.data && right?.data) {
          const inverse = MatrixOperationService.performOperation("inv", right).result
          if (typeof inverse === "string") throw new Error(inverse)
          const result = multiplyMatrices(left.data, inverse)
          if (!result) throw new Error("Matrix division failed: incompatible dimensions")
          left = { data: result }
        } else if (typeof left === "number" && typeof right === "number") {
          if (right === 0) throw new Error("Division by zero")
          left = left / right
        } else {
          throw new Error("Division requires two matrices or two scalars")
        }
      }
    }

    return left
  }

  private parsePower(): any {
    let left = this.parseFactor()

    while (this.position < this.tokens.length) {
      const token = this.tokens[this.position]
      if (token.type !== "operator" || token.value !== "^") {
        break
      }
      this.position++
      const right = this.parseFactor()

      if (left?.data && typeof right === "number") {
        const result = MatrixOperationService.matrixPower(left.data, right)
        if (typeof result === "string") throw new Error(result)
        left = { data: result }
      } else if (typeof left === "number" && typeof right === "number") {
        left = Math.pow(left, right)
      } else {
        throw new Error("Exponentiation requires matrix^scalar or scalar^scalar")
      }
    }

    return left
  }

  private parseFactor(): any {
    const token = this.tokens[this.position]
    if (!token) throw new Error("Unexpected end of expression")

    if (token.type === "number") {
      this.position++
      return Number.parseFloat(token.value)
    }

    if (token.type === "identifier") {
      const matrix = this.context.matrices.find((m) => m.label === token.value)
      if (!matrix) throw new Error(`Unknown matrix: ${token.value}`)
      this.position++
      return matrix
    }

    if (token.type === "function") {
      return this.parseFunction()
    }

    if (token.type === "parenthesis" && token.value === "(") {
      this.position++
      const result = this.parseExpression()
      const closingToken = this.tokens[this.position]
      if (!closingToken || closingToken.type !== "parenthesis" || closingToken.value !== ")") {
        throw new Error("Expected closing parenthesis")
      }
      this.position++
      return result
    }

    throw new Error(`Unexpected token: ${token.value}`)
  }

  private parseFunction(): any {
    const functionToken = this.tokens[this.position]
    this.position++

    const openParen = this.tokens[this.position]
    if (!openParen || openParen.type !== "parenthesis" || openParen.value !== "(") {
      throw new Error(`Expected '(' after function ${functionToken.value}`)
    }
    this.position++

    const arg = this.parseExpression()

    const closeParen = this.tokens[this.position]
    if (!closeParen || closeParen.type !== "parenthesis" || closeParen.value !== ")") {
      throw new Error(`Expected ')' after function argument`)
    }
    this.position++

    console.log("Function:", functionToken.value, "Arg:", arg)
    const input = arg
    const { result } = MatrixOperationService.performOperation(functionToken.value.toLowerCase(), input)
    console.log("Operation result:", result)
    if (result === undefined || result === null) {
      throw new Error(`Operation ${functionToken.value} returned invalid result`)
    }
    if (typeof result === "string") throw new Error(result)
    return typeof result === "number" ? result : { data: result }
  }
}