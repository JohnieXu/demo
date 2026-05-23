/**
 * Formatting utilities
 */

/**
 * Format number as currency
 */
export function formatCurrency(
  value: number,
  currency = 'CNY',
  locale = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format number with commas
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Pad number with leading zeros
 */
export function padZero(num: number, length = 2): string {
  return String(num).padStart(length, '0');
}

/**
 * Format date to locale string
 */
export function formatDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const d = typeof date === 'object' ? date : new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  });
}

/**
 * Format time to locale string
 */
export function formatTime(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const d = typeof date === 'object' ? date : new Date(date);
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}
