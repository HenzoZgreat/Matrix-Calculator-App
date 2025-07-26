// Utils/syntax/config.ts

import type { HighlightConfig } from "./highlighting"

// Predefined color themes for syntax highlighting
export const SYNTAX_THEMES = {
  default: {
    matrixStyle: "font-bold text-blue-600 dark:text-blue-400",
    functionStyle: "font-semibold text-purple-600 dark:text-purple-400",
    operatorStyle: "font-medium text-orange-600 dark:text-orange-400",
    numberStyle: "text-green-600 dark:text-green-400",
    parenthesesStyle: "font-bold text-gray-600 dark:text-gray-400",
    defaultStyle: "text-gray-800 dark:text-gray-200",
  },
  vibrant: {
    matrixStyle: "font-bold text-cyan-600 dark:text-cyan-400",
    functionStyle: "font-semibold text-pink-600 dark:text-pink-400",
    operatorStyle: "font-medium text-yellow-600 dark:text-yellow-400",
    numberStyle: "text-emerald-600 dark:text-emerald-400",
    parenthesesStyle: "font-bold text-indigo-600 dark:text-indigo-400",
    defaultStyle: "text-gray-800 dark:text-gray-200",
  },
  monochrome: {
    matrixStyle: "font-bold text-gray-900 dark:text-gray-100",
    functionStyle: "font-semibold text-gray-700 dark:text-gray-300",
    operatorStyle: "font-medium text-gray-600 dark:text-gray-400",
    numberStyle: "text-gray-800 dark:text-gray-200",
    parenthesesStyle: "font-bold text-gray-500 dark:text-gray-500",
    defaultStyle: "text-gray-800 dark:text-gray-200",
  },
} as const

// Function categories for easy management
export const FUNCTION_CATEGORIES = {
  trigonometric: ["sin", "cos", "tan", "cot", "sec", "csc"],
  inverseTrigonometric: ["asin", "acos", "atan", "acot", "asec", "acsc"],
  hyperbolic: ["sinh", "cosh", "tanh", "coth", "sech", "csch"],
  logarithmic: ["log", "ln", "exp"],
  algebraic: ["sqrt", "abs", "pow"],
  matrixOperations: ["det", "inv", "trace", "trc", "transpose", "tr"],
  matrixDecomposition: ["cof", "cofactor", "adj", "adjoint", "ref", "rank"],
} as const

// Helper function to get all functions from categories
export const getAllFunctions = (): string[] => {
  return Object.values(FUNCTION_CATEGORIES).flat()
}

// Helper function to add custom functions to existing categories
export const addCustomFunctions = (category: keyof typeof FUNCTION_CATEGORIES, functions: string[]): string[] => {
  const existingFunctions = getAllFunctions()
  const newFunctions = functions.filter((f) => !existingFunctions.includes(f))
  return [...existingFunctions, ...newFunctions]
}

// Configuration manager for syntax highlighting
export class SyntaxConfig {
  private static instance: SyntaxConfig
  private theme: keyof typeof SYNTAX_THEMES = "default"
  private customFunctions: string[] = []

  private constructor() {}

  static getInstance(): SyntaxConfig {
    if (!SyntaxConfig.instance) {
      SyntaxConfig.instance = new SyntaxConfig()
    }
    return SyntaxConfig.instance
  }

  setTheme(theme: keyof typeof SYNTAX_THEMES): void {
    this.theme = theme
  }

  getTheme(): HighlightConfig {
    return SYNTAX_THEMES[this.theme]
  }

  addCustomFunctions(functions: string[]): void {
    this.customFunctions = [...new Set([...this.customFunctions, ...functions])]
  }

  removeCustomFunctions(functions: string[]): void {
    this.customFunctions = this.customFunctions.filter((f) => !functions.includes(f))
  }

  getAllFunctions(): string[] {
    return [...getAllFunctions(), ...this.customFunctions]
  }

  getCustomFunctions(): string[] {
    return [...this.customFunctions]
  }

  clearCustomFunctions(): void {
    this.customFunctions = []
  }
}
