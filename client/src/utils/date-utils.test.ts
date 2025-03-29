import { describe, it, expect } from 'vitest';
import { formatDate, formatDateRange, daysBetweenDates } from './date-utils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('formats date string to human-readable format', () => {
      expect(formatDate('2023-01-15')).toBe('Jan 15, 2023');
    });

    it('returns original string for invalid date', () => {
      const invalidDate = 'not-a-date';
      expect(formatDate(invalidDate)).toBe(invalidDate);
    });
  });

  describe('formatDateRange', () => {
    it('formats a date range properly', () => {
      expect(formatDateRange('2023-01-15', '2023-01-20')).toBe('Jan 15, 2023 - Jan 20, 2023');
    });
  });

  describe('daysBetweenDates', () => {
    it('calculates days between two dates (inclusive)', () => {
      expect(daysBetweenDates('2023-01-15', '2023-01-20')).toBe(6);
    });

    it('returns 1 for same date', () => {
      expect(daysBetweenDates('2023-01-15', '2023-01-15')).toBe(1);
    });

    it('works with different date formats', () => {
      expect(daysBetweenDates('2023/01/15', '2023/01/20')).toBe(6);
    });

    it('handles dates in reverse order', () => {
      expect(daysBetweenDates('2023-01-20', '2023-01-15')).toBe(6);
    });
  });
}); 