/**
 * Utility functions for consistent date formatting across the application
 * to prevent hydration mismatches between server and client
 */

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateLong(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
