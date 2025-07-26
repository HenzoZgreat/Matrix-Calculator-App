// Utils/expression/parser.ts

export interface Token {
  type: "identifier" | "number" | "operator" | "function" | "parenthesis"
  value: string
}

export const tokenize = (expression: string): Token[] => {
  const tokens: Token[] = []
  let i = 0
  const expr = expression.replace(/\s/g, "") // Remove whitespace

  while (i < expr.length) {
    const char = expr[i]

    if (/[A-Za-z]/.test(char)) {
      let identifier = char
      while (i + 1 < expr.length && /[A-Za-z0-9]/.test(expr[i + 1])) {
        identifier += expr[i + 1]
        i++
      }

      // Check if it's a function (followed by parenthesis)
      const nextChar = expr[i + 1]
      if (nextChar === "(") {
        tokens.push({ type: "function", value: identifier.toLowerCase() })
      } else {
        tokens.push({ type: "identifier", value: identifier })
      }
    } else if (/[0-9]/.test(char)) {
      let number = char
      while (i + 1 < expr.length && (/[0-9.]/.test(expr[i + 1]) || expr[i + 1] === ".")) {
        number += expr[i + 1]
        i++
      }
      tokens.push({ type: "number", value: number })
    } else if ("+-*/^".includes(char)) {
      tokens.push({ type: "operator", value: char })
    } else if ("()".includes(char)) {
      tokens.push({ type: "parenthesis", value: char })
    } else {
      throw new Error(`Invalid character in expression: ${char}`)
    }
    i++
  }

  return tokens
}

export const validateTokens = (tokens: Token[]): boolean => {
  let parenthesesCount = 0

  for (const token of tokens) {
    if (token.type === "parenthesis") {
      if (token.value === "(") {
        parenthesesCount++
      } else {
        parenthesesCount--
        if (parenthesesCount < 0) return false
      }
    }
  }

  return parenthesesCount === 0
}
