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
    <div className="relative w-full z-30" ref={dropdownRef}>
      <button
        type="button"
        className="flex justify-between items-center w-full border-b-2 border-[var(--color-border-light)] bg-transparent text-[var(--color-text-primary)] p-2 focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors duration-300"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedLabel}</span>
        {isOpen ? <ChevronUpIcon className="w-4 h-4 text-[var(--color-accent-primary)]" /> : <ChevronDownIcon className="w-4 h-4 text-[var(--color-text-muted)]" />}
      </button>

      {isOpen && (
        <div
          className={`absolute z-[100] mt-1 w-full bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl
            ${isOpen ? "animate-fade-in-slide-up" : "animate-fade-out-slide-down"}`}
          role="listbox"
        >
          <div className="p-2 border-b border-[var(--color-border-light)]">
            <input
              type="text"
              placeholder="Search matrix types..."
              className="w-full p-2 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:border-[var(--color-accent-primary)] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar py-1" style={{ scrollBehavior: "smooth" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((category) => (
                <div key={category.category}>
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] sticky top-0 bg-[var(--color-card-bg)] backdrop-blur-md border-b border-[var(--color-border-light)]">
                    {category.category}
                  </div>
                  {category.types.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200
                        ${
                          option.value === value
                            ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent-primary)] font-semibold"
                            : "text-[var(--color-text-primary)] hover:bg-[var(--glass-hover)]"
                        }`}
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
              <div className="px-4 py-2 text-sm text-[var(--color-text-muted)]">No matching types found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
