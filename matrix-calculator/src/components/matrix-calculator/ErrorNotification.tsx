// components/matrix-calculator/ErrorNotification.tsx
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { XIcon, AlertTriangleIcon } from "lucide-react"

interface ErrorNotificationProps {
  message: string
  onClose: () => void
  duration?: number // Auto-close duration in milliseconds
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for fade out animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`fixed top-20 right-4 z-50 max-w-md bg-red-500 text-white p-4 rounded-lg shadow-lg border border-red-600 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold mb-1">Error</h4>
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-red-600 rounded-full transition-colors duration-200"
          aria-label="Close error notification"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
