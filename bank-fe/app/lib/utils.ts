import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Merges the class names for tailwind css
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
