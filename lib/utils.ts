import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Generate a unique order number like TN-20240501-A3F2 */
export function generateOrderNumber(): string {
  const date = new Date()
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `TN-${datePart}-${randomPart}`
}

/** Format a date string for display */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Format a date-time string for display */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Get minimum selectable date (tomorrow) */
export function getMinDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

/** Validate image file type */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  return validTypes.includes(file.type)
}

/** Format file size for display */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}
