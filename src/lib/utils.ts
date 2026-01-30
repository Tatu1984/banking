import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function generateAccountNumber(): string {
  const prefix = "1234"
  const random = Math.floor(Math.random() * 100000000).toString().padStart(8, "0")
  return `${prefix}${random}`
}

export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber
  return "XXXX" + accountNumber.slice(-4)
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    processing: "bg-blue-100 text-blue-800",
    dormant: "bg-gray-100 text-gray-800",
    frozen: "bg-purple-100 text-purple-800",
    closed: "bg-gray-100 text-gray-800",
  }
  return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"
}
