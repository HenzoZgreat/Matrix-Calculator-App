"use client"

// hooks/useNotifications.ts

import { useState, useCallback } from "react"

interface Notification {
  id: string
  message: string
  type: "success" | "error"
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((message: string, type: "success" | "error") => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const notification: Notification = { id, message, type }

    setNotifications((prev) => [...prev, notification])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return {
    notifications,
    showNotification,
    removeNotification,
  }
}
