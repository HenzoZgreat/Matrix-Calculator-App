// Utils/syntax/highlighting.ts

export interface HighlightConfig {
  matrixStyle: string
  functionStyle: string
  operatorStyle: string
  numberStyle: string
  parenthesesStyle: string
  defaultStyle: string
}

export const DEFAULT_HIGHLIGHT_CONFIG: HighlightConfig = {
  matrixStyle: "font-bold text-blue-600 dark:text-blue-400",
  functionStyle: "font-semibold text-purple-600 dark:text-purple-400",
  operatorStyle: "font-medium text-orange-600 dark:text-orange-400",
  numberStyle: "text-green-600 dark:text-green-400",
  parenthesesStyle: "font-bold text-gray-600 dark:text-gray-400",
  defaultStyle: "text-gray-800 dark:text-gray-200",
}

// Mathematical functions that should be highlighted
export const MATHEMATICAL_FUNCTIONS = [
  "sin",
  "cos",
  "tan",
  "cot",
  "sec",
  "csc",
  "asin",
  "acos",
  "atan",
  "acot",
  "asec",
  "acsc",
  "sinh",
  "cosh",
  "tanh",
  "coth",
  "sech",
  "csch",
  "log",
  "ln",
  "exp",
  "sqrt",
  "det",
  "inv",
  "cof",
  "cofactor",
  "trace",
  "trc",
  "adj",
  "adjoint",
  "ref",
  "rank",
  "transpose",
  "tr",
]

// Mathematical operators
export const MATHEMATICAL_OPERATORS = ["+", "-", "*", "/", "^", "="]

export interface HighlightToken {
  type: "matrix" | "function" | "operator" | "number" | "parenthesis" | "default"
  value: string
  start: number
  end: number
}

export class SyntaxHighlighter {
  private config: HighlightConfig
  private availableMatrices: string[]
  private functions: string[]

  constructor(
    availableMatrices: string[] = [],
    functions: string[] = MATHEMATICAL_FUNCTIONS,
    config: HighlightConfig = DEFAULT_HIGHLIGHT_CONFIG,
  ) {
    this.availableMatrices = availableMatrices
    this.functions = functions
    this.config = config
  }

  updateMatrices(matrices: string[]): void {
    this.availableMatrices = matrices
  }

  updateFunctions(functions: string[]): void {
    this.functions = functions
  }

  updateConfig(config: Partial<HighlightConfig>): void {
    this.config = { ...this.config, ...config }
  }

  tokenize(expression: string): HighlightToken[] {
    const tokens: HighlightToken[] = []
    let i = 0

    while (i < expression.length) {
      const char = expression[i]

      // Skip whitespace but preserve it
      if (/\s/.test(char)) {
        tokens.push({
          type: "default",
          value: char,
          start: i,
          end: i + 1,
        })
        i++
        continue
      }

      // Check for numbers (including decimals)
      if (/[0-9]/.test(char)) {
        let number = char
        const start = i
        i++
        while (i < expression.length && /[0-9.]/.test(expression[i])) {
          number += expression[i]
          i++
        }
        tokens.push({
          type: "number",
          value: number,
          start,
          end: i,
        })
        continue
      }

      // Check for letters (potential matrices or functions)
      if (/[A-Za-z]/.test(char)) {
        let identifier = char
        const start = i
        i++
        while (i < expression.length && /[A-Za-z0-9]/.test(expression[i])) {
          identifier += expression[i]
          i++
        }

        // Determine if it's a matrix, function, or default
        let type: HighlightToken["type"] = "default"
        if (this.availableMatrices.includes(identifier)) {
          type = "matrix"
        } else if (this.functions.includes(identifier.toLowerCase())) {
          type = "function"
        }

        tokens.push({
          type,
          value: identifier,
          start,
          end: i,
        })
        continue
      }

      // Check for operators
      if (MATHEMATICAL_OPERATORS.includes(char)) {
        tokens.push({
          type: "operator",
          value: char,
          start: i,
          end: i + 1,
        })
        i++
        continue
      }

      // Check for parentheses
      if ("()".includes(char)) {
        tokens.push({
          type: "parenthesis",
          value: char,
          start: i,
          end: i + 1,
        })
        i++
        continue
      }

      // Default case
      tokens.push({
        type: "default",
        value: char,
        start: i,
        end: i + 1,
      })
      i++
    }

    return tokens
  }

  getStyleForToken(token: HighlightToken): string {
    switch (token.type) {
      case "matrix":
        return this.config.matrixStyle
      case "function":
        return this.config.functionStyle
      case "operator":
        return this.config.operatorStyle
      case "number":
        return this.config.numberStyle
      case "parenthesis":
        return this.config.parenthesesStyle
      default:
        return this.config.defaultStyle
    }
  }

  highlightExpression(expression: string): { tokens: HighlightToken[]; html: string } {
    const tokens = this.tokenize(expression)
    const html = tokens
      .map((token) => {
        const style = this.getStyleForToken(token)
        return `<span class="${style}">${this.escapeHtml(token.value)}</span>`
      })
      .join("")

    return { tokens, html }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}
