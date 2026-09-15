/**
 * multiplication.js — Clean, composable multiplication utilities
 */

/**
 * Multiply two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function multiply(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError(`multiply() expects numbers, got: ${typeof a}, ${typeof b}`);
  }
  return a * b;
}

/**
 * Multiply all numbers in an array together (product).
 * e.g. product([2, 3, 4]) → 24
 * @param {number[]} nums
 * @returns {number}
 */
function product(nums) {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new TypeError("product() expects a non-empty array of numbers");
  }
  return nums.reduce((acc, n) => multiply(acc, n), 1);
}

/**
 * Raise base to an integer power using repeated multiplication.
 * @param {number} base
 * @param {number} exp — must be a non-negative integer
 * @returns {number}
 */
function power(base, exp) {
  if (!Number.isInteger(exp) || exp < 0) {
    throw new RangeError("power() exponent must be a non-negative integer");
  }
  if (exp === 0) return 1;
  return Array.from({ length: exp }, () => base).reduce((acc, n) => multiply(acc, n), 1);
}

module.exports = { multiply, product, power };
