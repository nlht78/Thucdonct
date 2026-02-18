/**
 * Formatting utilities for Vietnamese locale
 * Feature: shopping-expense-tracker
 */

/**
 * Format a number as Vietnamese currency
 * @param amount - The amount to format (must be >= 0)
 * @returns Formatted string with thousand separators and ₫ symbol (e.g., "1.000.000 ₫")
 * @example
 * formatCurrency(1000000) // "1.000.000 ₫"
 * formatCurrency(0) // "0 ₫"
 * formatCurrency(999) // "999 ₫"
 */
export function formatCurrency(amount: number): string {
  if (amount < 0) {
    throw new Error('Amount must be non-negative');
  }
  
  // Convert to string and add thousand separators (dots)
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formatted} ₫`;
}

/**
 * Format a date as dd/mm/yyyy
 * @param date - Date object or ISO string to format
 * @returns Formatted date string (e.g., "25/12/2024")
 * @example
 * formatDate(new Date('2024-12-25')) // "25/12/2024"
 * formatDate('2024-01-01T00:00:00Z') // "01/01/2024"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Format a date and time as dd/mm/yyyy HH:MM
 * @param date - Date object or ISO string to format
 * @returns Formatted date-time string (e.g., "25/12/2024 14:30")
 * @example
 * formatDateTime(new Date('2024-12-25T14:30:00')) // "25/12/2024 14:30"
 * formatDateTime('2024-01-01T09:05:00Z') // "01/01/2024 09:05"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
