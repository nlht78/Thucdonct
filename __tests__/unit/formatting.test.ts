/**
 * Unit tests for formatting utilities
 * Feature: shopping-expense-tracker
 */

import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatting';

describe('formatCurrency', () => {
  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('0 ₫');
  });

  it('should format single digit correctly', () => {
    expect(formatCurrency(1)).toBe('1 ₫');
  });

  it('should format hundreds without separator', () => {
    expect(formatCurrency(999)).toBe('999 ₫');
  });

  it('should format thousands with dot separator', () => {
    expect(formatCurrency(1000)).toBe('1.000 ₫');
  });

  it('should format millions with dot separators', () => {
    expect(formatCurrency(1000000)).toBe('1.000.000 ₫');
  });

  it('should format large numbers correctly', () => {
    expect(formatCurrency(123456789)).toBe('123.456.789 ₫');
  });

  it('should format numbers near 1 billion', () => {
    expect(formatCurrency(999999999)).toBe('999.999.999 ₫');
  });

  it('should throw error for negative numbers', () => {
    expect(() => formatCurrency(-1)).toThrow('Amount must be non-negative');
  });
});

describe('formatDate', () => {
  it('should format date as dd/mm/yyyy', () => {
    const date = new Date('2024-12-25T00:00:00Z');
    expect(formatDate(date)).toBe('25/12/2024');
  });

  it('should format first day of year', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    expect(formatDate(date)).toBe('01/01/2024');
  });

  it('should format last day of year', () => {
    const date = new Date('2024-12-31T00:00:00Z');
    expect(formatDate(date)).toBe('31/12/2024');
  });

  it('should format leap year date', () => {
    const date = new Date('2024-02-29T00:00:00Z');
    expect(formatDate(date)).toBe('29/02/2024');
  });

  it('should accept ISO string', () => {
    expect(formatDate('2024-06-15T12:30:00Z')).toBe('15/06/2024');
  });

  it('should pad single digit day and month', () => {
    const date = new Date('2024-03-05T00:00:00Z');
    expect(formatDate(date)).toBe('05/03/2024');
  });

  it('should throw error for invalid date', () => {
    expect(() => formatDate('invalid')).toThrow('Invalid date');
  });
});

describe('formatDateTime', () => {
  it('should format date and time as dd/mm/yyyy HH:MM', () => {
    const date = new Date('2024-12-25T14:30:00Z');
    expect(formatDateTime(date)).toBe('25/12/2024 14:30');
  });

  it('should format midnight correctly', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    expect(formatDateTime(date)).toBe('01/01/2024 00:00');
  });

  it('should format noon correctly', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    expect(formatDateTime(date)).toBe('15/06/2024 12:00');
  });

  it('should pad single digit hours and minutes', () => {
    const date = new Date('2024-03-05T09:05:00Z');
    expect(formatDateTime(date)).toBe('05/03/2024 09:05');
  });

  it('should format late evening time', () => {
    const date = new Date('2024-12-31T23:59:00Z');
    expect(formatDateTime(date)).toBe('31/12/2024 23:59');
  });

  it('should accept ISO string', () => {
    expect(formatDateTime('2024-07-20T16:45:00Z')).toBe('20/07/2024 16:45');
  });

  it('should throw error for invalid date', () => {
    expect(() => formatDateTime('not-a-date')).toThrow('Invalid date');
  });
});
