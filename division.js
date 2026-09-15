/**
 * division.js — Clean, composable division utilities
 */

/**
 * Divide a by b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function divide(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError(`divide() expects numbers, got: ${typeof a}, ${typeof b}`);
  }
  if (b === 0) {
    throw new RangeError("divide() cannot divide by zero");
  }
  return a / b;
}

/**
 * Integer (floor) division — drops the remainder.
 * e.g. intDivide(7, 2) → 3
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function intDivide(a, b) {
  return Math.floor(divide(a, b));
}

/**
 * Modulo — remainder after division.
 * e.g. remainder(7, 3) → 1
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function remainder(a, b) {
  if (b === 0) throw new RangeError("remainder() cannot divide by zero");
  return a % b;
}

/**
 * Reduce an array by dividing the first element by each subsequent one.
 * e.g. quotient([100, 2, 5]) → 10  (100 / 2 / 5)
 * @param {number[]} nums
 * @returns {number}
 */
function quotient(nums) {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new TypeError("quotient() expects a non-empty array of numbers");
  }
  return nums.slice(1).reduce((acc, n) => divide(acc, n), nums[0]);
}

module.exports = { divide, intDivide, remainder, quotient };
