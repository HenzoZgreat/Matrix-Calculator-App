"use client"

import type React from "react"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

interface MatrixTypeOption {
  value: string
  label: string
}

interface MatrixTypeCategory {
  category: string
  types: MatrixTypeOption[]
}

interface MatrixTypeDropdownProps {
  options: MatrixTypeCategory[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const MatrixTypeDropdown: React.FC<MatrixTypeDropdownProps> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedLabel = useMemo(() => {
    for (const category of options) {
      const found = category.types.find((opt) => opt.value === value)
      if (found) return found.label
    }
    return placeholder || "Select a matrix type"
  }, [value, options, placeholder])

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options

    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return options
      .map((category) => ({
        ...category,
        types: category.types.filter((opt) => opt.label.toLowerCase().includes(lowerCaseSearchTerm)),
      }))
      .filter((category) => category.types.length > 0)
  }, [options, searchTerm])

  const handleOptionClick = useCallback(
    (optionValue: string) => {
      onChange(optionValue)
      setIsOpen(false)
      setSearchTerm("") // Clear search term on selection
    },
    [onChange],
  )

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
      setSearchTerm("") // Clear search term when closing
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="flex justify-between items-center w-full border-b-2 border-border-light bg-transparent text-text-primary p-2 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-300"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedLabel}</span>
        {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1 w-full bg-bg-secondary border border-border-light rounded-md shadow-lg overflow-hidden
            ${isOpen ? "animate-fade-in-slide-up" : "animate-fade-out-slide-down"}`}
          role="listbox"
        >
          <div className="p-2 border-b border-border-light">
            <input
              type="text"
              placeholder="Search matrix types..."
              className="w-full p-2 bg-transparent text-text-primary border border-border-light rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar py-1" style={{ scrollBehavior: "smooth" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((category) => (
                <div key={category.category}>
                  <div className="px-4 py-2 text-sm font-semibold text-text-secondary sticky top-0 bg-bg-secondary border-b border-border-light">
                    {category.category}
                  </div>
                  {category.types.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200
                        ${option.value === value ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" : "text-text-primary hover:bg-gray-100/20 dark:hover:bg-gray-800/20"}`}
                      onClick={() => handleOptionClick(option.value)}
                      role="option"
                      aria-selected={option.value === value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No matching types found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
