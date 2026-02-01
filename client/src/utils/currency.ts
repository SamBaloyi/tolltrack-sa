/**
 * Format a number as currency
 * If it's a whole number, display without decimals
 * If it has decimals, display with 2 decimal places
 */
export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  // Check if it's a whole number
  if (num % 1 === 0) {
    return num.toString();
  }
  
  // Has decimals, format to 2 decimal places
  return num.toFixed(2);
}
