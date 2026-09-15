/**
 * subtraction.js — Clean, composable subtraction utilities
 */

/**
 * Subtract b from a.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function subtract(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError(`subtract() expects numbers, got: ${typeof a}, ${typeof b}`);
  }
  return a - b;
}

/**
 * Reduce an array by subtracting all subsequent values from the first.
 * e.g. difference([10, 2, 3]) → 5  (10 - 2 - 3)
 * @param {number[]} nums
 * @returns {number}
 */
function difference(nums) {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new TypeError("difference() expects a non-empty array of numbers");
  }
  return nums.slice(1).reduce((acc, n) => subtract(acc, n), nums[0]);
}

/**
 * Decrement a value by a step (default 1).
 * @param {number} n
 * @param {number} [step=1]
 * @returns {number}
 */
function decrement(n, step = 1) {
  return subtract(n, step);
}

module.exports = { subtract, difference, decrement };
