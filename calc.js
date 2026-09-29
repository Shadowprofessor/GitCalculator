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

const _addMod = typeof require !== "undefined" ? require("./addition") : { add: window.add, sum: window.sum, increment: window.increment };
const _subMod = typeof require !== "undefined" ? require("./subtraction") : { subtract: window.subtract, difference: window.difference, decrement: window.decrement };
const _mulMod = typeof require !== "undefined" ? require("./multiplication") : { multiply: window.multiply, product: window.product, power: window.power };
const _divMod = typeof require !== "undefined" ? require("./division") : { divide: window.divide, intDivide: window.intDivide, remainder: window.remainder, quotient: window.quotient };

const { add, sum, increment }         = _addMod;
const { subtract, difference, decrement } = _subMod;
const { multiply, product, power }    = _mulMod;
const { divide, intDivide, remainder, quotient } = _divMod;

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

// ─── Interactive CLI Menu ───────────────────────────────────────────────────

const readline = typeof require !== "undefined" ? require("readline") : null;

function askQuestion(rl, query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function runInteractiveMenu() {
  if (!readline) return runDemo();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let keepRunning = true;

  while (keepRunning) {
    console.log(`\n${C.bold}${C.cyan}================================================${C.reset}`);
    console.log(`${C.bold}${C.magenta}       ✦ CALC.JS — Interactive Calculator ✦       ${C.reset}`);
    console.log(`${C.bold}${C.cyan}================================================${C.reset}`);
    console.log(`  ${C.bold}Select operation:${C.reset}`);
    console.log(`  ${C.yellow}1.${C.reset} Addition        (${C.dim}+, sum array, increment${C.reset})`);
    console.log(`  ${C.yellow}2.${C.reset} Subtraction     (${C.dim}-, difference array, decrement${C.reset})`);
    console.log(`  ${C.yellow}3.${C.reset} Multiplication  (${C.dim}*, product array, power ^${C.reset})`);
    console.log(`  ${C.yellow}4.${C.reset} Division        (${C.dim}/, floor div //, remainder %${C.reset})`);
    console.log(`  ${C.yellow}5.${C.reset} Array / List Operations (${C.dim}sum, product, quotient${C.reset})`);
    console.log(`  ${C.yellow}6.${C.reset} Expression Evaluator    (${C.dim}e.g., "12 * (8 + 3)"${C.reset})`);
    console.log(`  ${C.yellow}7.${C.reset} Launch Web UI Server    (${C.dim}Open browser interface${C.reset})`);
    console.log(`  ${C.yellow}8.${C.reset} Run Built-in Demo & Benchmark`);
    console.log(`  ${C.yellow}9.${C.reset} Exit`);
    console.log(`${C.cyan}------------------------------------------------${C.reset}`);

    const choice = (await askQuestion(rl, `${C.bold}Enter choice (1-9): ${C.reset}`)).trim();

    switch (choice) {
      case "1": {
        console.log(`\n${C.bold}${C.cyan}--- Addition Menu ---${C.reset}`);
        console.log(`  1. Add two numbers (a + b)`);
        console.log(`  2. Sum an array of numbers`);
        console.log(`  3. Increment a number`);
        const sub = (await askQuestion(rl, `${C.bold}Select sub-option (1-3): ${C.reset}`)).trim();
        if (sub === "1") {
          const a = parseFloat(await askQuestion(rl, "Enter first number (a): "));
          const b = parseFloat(await askQuestion(rl, "Enter second number (b): "));
          if (isNaN(a) || isNaN(b)) {
            console.log(`${C.red}Invalid input! Please enter valid numbers.${C.reset}`);
          } else {
            console.log(`\n  ${C.yellow}${a} + ${b}${C.reset}  ${C.bold}${C.green}= ${calc.add(a, b)}${C.reset}`);
          }
        } else if (sub === "2") {
          const input = await askQuestion(rl, "Enter comma-separated numbers (e.g. 10, 20, 30): ");
          const nums = input.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
          if (nums.length === 0) {
            console.log(`${C.red}No valid numbers provided!${C.reset}`);
          } else {
            console.log(`\n  ${C.yellow}sum([${nums.join(", ")}])${C.reset}  ${C.bold}${C.green}= ${calc.sum(nums)}${C.reset}`);
          }
        } else if (sub === "3") {
          const n = parseFloat(await askQuestion(rl, "Enter number: "));
          const stepInput = await askQuestion(rl, "Enter step (press Enter for default 1): ");
          const step = stepInput.trim() ? parseFloat(stepInput) : 1;
          if (isNaN(n) || isNaN(step)) {
            console.log(`${C.red}Invalid input!${C.reset}`);
          } else {
            console.log(`\n  ${C.yellow}increment(${n}, step=${step})${C.reset}  ${C.bold}${C.green}= ${calc.increment(n, step)}${C.reset}`);
          }
        }
        break;
      }
      case "2": {
        console.log(`\n${C.bold}${C.cyan}--- Subtraction Menu ---${C.reset}`);
        console.log(`  1. Subtract two numbers (a - b)`);
        console.log(`  2. Difference of an array`);
        console.log(`  3. Decrement a number`);
        const sub = (await askQuestion(rl, `${C.bold}Select sub-option (1-3): ${C.reset}`)).trim();
        if (sub === "1") {
          const a = parseFloat(await askQuestion(rl, "Enter first number (a): "));
          const b = parseFloat(await askQuestion(rl, "Enter second number (b): "));
          if (isNaN(a) || isNaN(b)) {
            console.log(`${C.red}Invalid input! Please enter valid numbers.${C.reset}`);
          } else {
            console.log(`\n  ${C.yellow}${a} - ${b}${C.reset}  ${C.bold}${C.green}= ${calc.subtract(a, b)}${C.reset}`);
          }
        } else if (sub === "2") {
          const input = await askQuestion(rl, "Enter comma-separated numbers: ");
          const nums = input.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
          if (nums.length === 0) {
            console.log(`${C.red}No valid numbers provided!${C.reset}`);
          } else {
            console.log(`\n  ${C.yellow}difference([${nums.join(", ")}])${C.reset}  ${C.bold}${C.green}= ${calc.difference(nums)}${C.reset}`);
          }
        } else if (sub === "3") {
          const n = parseFloat(await askQuestion(rl, "Enter number: "));
          const stepInput = await askQuestion(rl, "Enter step (press Enter for default 1): ");
          const step = stepInput.trim() ? parseFloat(stepInput) : 1;
          if (isNaN(n) || isNaN(step)) {
            console.log(`${C.red}Invalid input!${C.reset}`);
          } else {
            console.log(`\n  ${C.yellow}decrement(${n}, step=${step})${C.reset}  ${C.bold}${C.green}= ${calc.decrement(n, step)}${C.reset}`);
          }
        }
        break;
      }
      case "3": {
        console.log(`\n${C.bold}${C.cyan}--- Multiplication Menu ---${C.reset}`);
        console.log(`  1. Multiply two numbers (a * b)`);
        console.log(`  2. Product of an array`);
        console.log(`  3. Power (base ^ exp)`);
        const sub = (await askQuestion(rl, `${C.bold}Select sub-option (1-3): ${C.reset}`)).trim();
        if (sub === "1") {
          const a = parseFloat(await askQuestion(rl, "Enter first number (a): "));
          const b = parseFloat(await askQuestion(rl, "Enter second number (b): "));
          if (isNaN(a) || isNaN(b)) {
            console.log(`${C.red}Invalid input!${C.reset}`);
          } else {
            console.log(`\n  ${C.yellow}${a} * ${b}${C.reset}  ${C.bold}${C.green}= ${calc.multiply(a, b)}${C.reset}`);
          }
        } else if (sub === "2") {
          const input = await askQuestion(rl, "Enter comma-separated numbers: ");
          const nums = input.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
          if (nums.length === 0) {
            console.log(`${C.red}No valid numbers provided!${C.reset}`);
          } else {
            console.log(`\n  ${C.yellow}product([${nums.join(", ")}])${C.reset}  ${C.bold}${C.green}= ${calc.product(nums)}${C.reset}`);
          }
        } else if (sub === "3") {
          const base = parseFloat(await askQuestion(rl, "Enter base: "));
          const exp = parseInt(await askQuestion(rl, "Enter integer exponent: "));
          if (isNaN(base) || isNaN(exp)) {
            console.log(`${C.red}Invalid input!${C.reset}`);
          } else {
            try {
              console.log(`\n  ${C.yellow}${base} ^ ${exp}${C.reset}  ${C.bold}${C.green}= ${calc.power(base, exp)}${C.reset}`);
            } catch (err) {
              console.log(`${C.red}Error: ${err.message}${C.reset}`);
            }
          }
        }
        break;
      }
      case "4": {
        console.log(`\n${C.bold}${C.cyan}--- Division Menu ---${C.reset}`);
        console.log(`  1. Divide (a / b)`);
        console.log(`  2. Integer Floor Division (a // b)`);
        console.log(`  3. Remainder / Modulo (a % b)`);
        console.log(`  4. Quotient of array`);
        const sub = (await askQuestion(rl, `${C.bold}Select sub-option (1-4): ${C.reset}`)).trim();
        if (sub === "1" || sub === "2" || sub === "3") {
          const a = parseFloat(await askQuestion(rl, "Enter numerator (a): "));
          const b = parseFloat(await askQuestion(rl, "Enter denominator (b): "));
          if (isNaN(a) || isNaN(b)) {
            console.log(`${C.red}Invalid input!${C.reset}`);
          } else {
            try {
              let res, opSymbol;
              if (sub === "1") { res = calc.divide(a, b); opSymbol = "/"; }
              else if (sub === "2") { res = calc.intDivide(a, b); opSymbol = "//"; }
              else if (sub === "3") { res = calc.remainder(a, b); opSymbol = "%"; }
              console.log(`\n  ${C.yellow}${a} ${opSymbol} ${b}${C.reset}  ${C.bold}${C.green}= ${res}${C.reset}`);
            } catch (err) {
              console.log(`${C.red}Error: ${err.message}${C.reset}`);
            }
          }
        } else if (sub === "4") {
          const input = await askQuestion(rl, "Enter comma-separated numbers: ");
          const nums = input.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
          if (nums.length === 0) {
            console.log(`${C.red}No valid numbers provided!${C.reset}`);
          } else {
            try {
              console.log(`\n  ${C.yellow}quotient([${nums.join(", ")}])${C.reset}  ${C.bold}${C.green}= ${calc.quotient(nums)}${C.reset}`);
            } catch (err) {
              console.log(`${C.red}Error: ${err.message}${C.reset}`);
            }
          }
        }
        break;
      }
      case "5": {
        console.log(`\n${C.bold}${C.cyan}--- Array / List Operations ---${C.reset}`);
        const input = await askQuestion(rl, "Enter comma-separated numbers (e.g. 10, 20, 30): ");
        const nums = input.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        if (nums.length === 0) {
          console.log(`${C.red}No valid numbers entered!${C.reset}`);
        } else {
          console.log(`  Numbers: [${nums.join(", ")}]`);
          console.log(`  1. Sum       = ${calc.sum(nums)}`);
          console.log(`  2. Product   = ${calc.product(nums)}`);
          console.log(`  3. Difference= ${calc.difference(nums)}`);
          try {
            console.log(`  4. Quotient  = ${calc.quotient(nums)}`);
          } catch (err) {
            console.log(`  4. Quotient  = Error: ${err.message}`);
          }
        }
        break;
      }
      case "6": {
        console.log(`\n${C.bold}${C.cyan}--- Expression Evaluator ---${C.reset}`);
        const expr = await askQuestion(rl, 'Enter expression (e.g. "42 * 3" or "100 // 4" or "3 ^ 5"): ');
        if (!expr.trim()) {
          console.log(`${C.red}Expression cannot be empty!${C.reset}`);
        } else {
          try {
            const res = calc.evaluate(expr);
            console.log(`\n  ${C.yellow}"${expr}"${C.reset}  ${C.bold}${C.green}= ${res}${C.reset}`);
          } catch (err) {
            console.log(`${C.red}Error: ${err.message}${C.reset}`);
          }
        }
        break;
      }
      case "7": {
        console.log(`\n${C.bold}${C.green}Launching Web UI...${C.reset}`);
        const open = require("child_process");
        const url = `file:///${__dirname.replace(/\\/g, "/")}/index.html`;
        console.log(`  Opening: ${url}`);
        open.exec(`start "" "${url}"`);
        break;
      }
      case "8": {
        runDemo();
        break;
      }
      case "9": {
        console.log(`\n${C.bold}${C.magenta}Thank you for using Calc.js! Goodbye! ✦${C.reset}\n`);
        keepRunning = false;
        rl.close();
        process.exit(0);
      }
      default: {
        console.log(`${C.red}Invalid choice! Please enter a number between 1 and 9.${C.reset}`);
      }
    }

    if (keepRunning) {
      const cont = await askQuestion(rl, `\n${C.bold}Let's do next calculation? (yes/no): ${C.reset}`);
      if (cont.trim().toLowerCase() === "no" || cont.trim().toLowerCase() === "n") {
        console.log(`\n${C.bold}${C.magenta}Thank you for using Calc.js! Goodbye! ✦${C.reset}\n`);
        keepRunning = false;
        rl.close();
        process.exit(0);
      }
    }
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

if (typeof process !== "undefined" && process.argv && (typeof require !== "undefined" && require.main === module)) {
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
    runInteractiveMenu();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = calc;
}
if (typeof window !== "undefined") {
  window.calc = calc;
}
