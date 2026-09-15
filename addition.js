/**
 * addition.js — Clean, composable addition utilities
 */

/**
 * Add two numbers together.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError(`add() expects numbers, got: ${typeof a}, ${typeof b}`);
  }
  return a + b;
}

/**
 * Sum an array of numbers.
 * @param {number[]} nums
 * @returns {number}
 */
function sum(nums) {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new TypeError("sum() expects a non-empty array of numbers");
  }
  return nums.reduce((acc, n) => add(acc, n), 0);
}

/**
 * Increment a value by a step (default 1).
 * @param {number} n
 * @param {number} [step=1]
 * @returns {number}
 */
function increment(n, step = 1) {
  return add(n, step);
}

module.exports = { add, sum, increment };
