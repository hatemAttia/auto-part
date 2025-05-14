// src/app/core/utils/format.utils.ts

/**
 * Formats a number as a price string with 3 decimal places and 'dt' suffix.
 * 
 * @param {number} price - The price value to format
 * @returns {string} The formatted price string (e.g., "123.456 dt")
 * @example
 * formatPrice(123.4567); // returns "123.457 dt"
 * formatPrice(10); // returns "10.000 dt"
 */
export function formatPrice(price: number): string {
    return price.toFixed(3) + ' dt';
}