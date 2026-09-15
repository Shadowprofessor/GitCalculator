/**
 * calc.js — Full-featured calculator
 *
 * Imports all math modules and exposes a unified API plus a
 * human-readable expression evaluator and demo runner.
 *
 * Usage:
 *   node calc.js              → runs the built-in demo
 *   node calc.js "12 + 7"     → evaluates a single expression
 *   node calc.js "100 / 4"
 *   node calc.js "3 ^ 5"      → power (uses multiply internally)
 *   node calc.js "17 % 5"     → remainder
 */

"use strict";

const { add, sum, increment }         = require("./addition");
const { subtract, difference, decrement } = require("./subtraction");
const { multiply, product, power }    = require("./multiplication");
const { divide, intDivide, remainder, quotient } = require("./division");

// ─── Unified API ────────────────────────────────────────────────────────────

const calc = {
  // Core ops
  add,
  subtract,
  multiply,
  divide,

  // Array ops
  sum,
  difference,
  product,
  quotient,

  // Extras
  increment,
  decrement,
  power,
  intDivide,
  remainder,

  /**
   * Evaluate a simple two-operand expression string.
   * Supported operators: +  -  *  /  ^  %  //
   * e.g. calc.evaluate("42 * 3")  → 126
   * @param {string} expr
   * @returns {number}
   */
  evaluate(expr) {
    const trimmed = expr.trim();
    // Try two-char operator first (//)
    const twoChar = trimmed.match(/^(-?[\d.]+)\s*(\/\/|\*\*|\^)\s*(-?[\d.]+)$/);
    if (twoChar) {
      const [, a, op, b] = twoChar;
      const [x, y] = [parseFloat(a), parseFloat(b)];
      if (op === "//")  return intDivide(x, y);
      if (op === "**" || op === "^") return power(x, Math.floor(y));
    }
    // Single-char operator
    const oneChar = trimmed.match(/^(-?[\d.]+)\s*([+\-*/%])\s*(-?[\d.]+)$/);
    if (oneChar) {
      const [, a, op, b] = oneChar;
      const [x, y] = [parseFloat(a), parseFloat(b)];
      switch (op) {
        case "+": return add(x, y);
        case "-": return subtract(x, y);
        case "*": return multiply(x, y);
        case "/": return divide(x, y);
        case "%": return remainder(x, y);
      }
    }
    throw new SyntaxError(`Could not parse expression: "${expr}"`);
  },
};

// ─── Pretty printer ──────────────────────────────────────────────────────────

const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  cyan:   "\x1b[36m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  magenta:"\x1b[35m",
  red:    "\x1b[31m",
};

function header(title) {
  const line = "─".repeat(48);
  console.log(`\n${C.bold}${C.cyan}${line}${C.reset}`);
  console.log(`${C.bold}${C.cyan}  ${title}${C.reset}`);
  console.log(`${C.cyan}${line}${C.reset}`);
}

function row(label, expr, result) {
  const lPad = label.padEnd(22);
  const ePad = String(expr).padEnd(18);
  console.log(
    `  ${C.dim}${lPad}${C.reset}` +
    `${C.yellow}${ePad}${C.reset}` +
    `${C.bold}${C.green}= ${result}${C.reset}`
  );
}

function err(label, fn) {
  try { fn(); }
  catch (e) {
    console.log(`  ${C.dim}${label.padEnd(22)}${C.reset}${C.red}⚠  ${e.message}${C.reset}`);
  }
}

// ─── Demo ────────────────────────────────────────────────────────────────────

function runDemo() {
  console.log(`\n${C.bold}${C.magenta}  ✦ CALC.JS — Node Calculator Demo ✦${C.reset}`);

  header("Addition");
  row("add",        "8 + 5",               calc.add(8, 5));
  row("sum array",  "[1,2,3,4,5]",         calc.sum([1, 2, 3, 4, 5]));
  row("increment",  "99 + 1",              calc.increment(99));
  row("increment ×10", "0 + 10",           calc.increment(0, 10));

  header("Subtraction");
  row("subtract",   "100 - 37",            calc.subtract(100, 37));
  row("difference", "[50, 10, 5, 3]",      calc.difference([50, 10, 5, 3]));
  row("decrement",  "7 - 1",               calc.decrement(7));
  row("decrement ×3", "20 - 3",            calc.decrement(20, 3));

  header("Multiplication");
  row("multiply",   "6 × 7",               calc.multiply(6, 7));
  row("product",    "[2, 3, 4, 5]",        calc.product([2, 3, 4, 5]));
  row("power 2^10", "2 ^ 10",              calc.power(2, 10));
  row("power 3^4",  "3 ^ 4",              calc.power(3, 4));

  header("Division");
  row("divide",     "144 ÷ 12",            calc.divide(144, 12));
  row("divide float","22 ÷ 7",             calc.divide(22, 7).toFixed(6));
  row("intDivide",  "17 // 5",             calc.intDivide(17, 5));
  row("remainder",  "17 % 5",              calc.remainder(17, 5));
  row("quotient",   "[1000, 4, 5]",        calc.quotient([1000, 4, 5]));

  header("Expression Evaluator");
  const exprs = [
    "99 + 1", "200 - 87", "13 * 7", "256 / 8",
    "2 ^ 8", "100 % 33", "99 // 10",
  ];
  exprs.forEach(e => row(`"${e}"`, e, calc.evaluate(e)));

  header("Error Handling");
  err("divide by zero",  () => calc.divide(5, 0));
  err("bad type add",    () => calc.add("x", 2));
  err("empty sum",       () => calc.sum([]));
  err("negative power",  () => calc.power(2, -1));
  err("bad expression",  () => calc.evaluate("what is 2 + 2?"));

  const line = "─".repeat(48);
  console.log(`\n${C.cyan}${line}${C.reset}`);
  console.log(`${C.bold}  All operations complete.${C.reset}\n`);
}

// ─── Entry point ─────────────────────────────────────────────────────────────

const [,, ...args] = process.argv;

if (args.length > 0) {
  const expr = args.join(" ");
  try {
    const result = calc.evaluate(expr);
    console.log(`\n  ${C.yellow}${expr}${C.reset}  ${C.bold}${C.green}= ${result}${C.reset}\n`);
  } catch (e) {
    console.error(`\n  ${C.red}Error: ${e.message}${C.reset}\n`);
    process.exit(1);
  }
} else {
  runDemo();
}

module.exports = calc;
