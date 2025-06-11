import { describe, expect, it } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('sums numbers separated by newlines', () => {
    const input = '10\n20\n30';
    expect(calculateTotal(input)).toBe(60);
  });

  it('sums numbers separated by commas', () => {
    const input = '5,15,25';
    expect(calculateTotal(input)).toBe(45);
  });

  it('handles mixed newlines and commas', () => {
    const input = '1,2\n3,4\n5';
    expect(calculateTotal(input)).toBe(15);
  });

  it('ignores empty strings and whitespace', () => {
    const input = '10, ,\n20\n,30';
    expect(calculateTotal(input)).toBe(60);
  });

  it('ignores non-numeric values', () => {
    const input = '10,abc,20\nhello,30';
    expect(calculateTotal(input)).toBe(60);
  });

  it('returns 0 for an empty string', () => {
    expect(calculateTotal('')).toBe(0);
  });
  it('ignore invalid numbers', () => {
    expect(calculateTotal('abc,30,def,30')).toBe(60);
    expect(calculateTotal('12three\n45')).toBe(45);
  });
});
