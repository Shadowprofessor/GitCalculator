/**
 * app.js — Web UI driver for calc.js
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const exprDisplay = document.getElementById("expr-display");
  const mainDisplay = document.getElementById("main-display");
  const historyList = document.getElementById("history-list");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const toast = document.getElementById("toast");

  // Mode Switcher Elements
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabViews = document.querySelectorAll(".tab-view");

  // Array / Extras Tool Elements
  const arrayFnSelect = document.getElementById("array-fn-select");
  const arrayInput = document.getElementById("array-input");
  const arrayComputeBtn = document.getElementById("array-compute-btn");
  const arrayResultOutput = document.getElementById("array-result-output");

  // Freeform Expression Evaluator Elements
  const freeformExprInput = document.getElementById("freeform-expr-input");
  const evalExprBtn = document.getElementById("eval-expr-btn");
  const evalResultOutput = document.getElementById("eval-result-output");

  // Calculator State
  let currentExpr = "";
  let lastResult = null;
  let history = [];

  // --- Tab Switching ---
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabViews.forEach(v => v.classList.remove("active"));
      btn.classList.add("active");
      const targetView = document.getElementById(btn.dataset.target);
      if (targetView) targetView.classList.add("active");
    });
  });

  // --- Display Helper Functions ---
  function updateDisplay() {
    mainDisplay.textContent = currentExpr || "0";
    if (lastResult !== null && !currentExpr) {
      mainDisplay.textContent = String(lastResult);
    }
  }

  function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.className = `toast ${isError ? "error" : "success"} show`;
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  function addToHistory(expression, result) {
    const item = { expression, result: String(result), timestamp: new Date().toLocaleTimeString() };
    history.unshift(item);
    renderHistory();
  }

  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = `<div class="history-empty">No calculations yet</div>`;
      return;
    }
    historyList.innerHTML = history
      .map(
        (h, index) => `
      <div class="history-item" data-index="${index}">
        <div class="history-expr">${escapeHtml(h.expression)}</div>
        <div class="history-res">= ${escapeHtml(h.result)}</div>
      </div>
    `
      )
      .join("");

    // Add click event to populate display
    document.querySelectorAll(".history-item").forEach(item => {
      item.addEventListener("click", () => {
        const idx = item.dataset.index;
        const entry = history[idx];
        currentExpr = entry.result;
        exprDisplay.textContent = entry.expression + " =";
        updateDisplay();
        showToast("Loaded result into calculator");
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  clearHistoryBtn.addEventListener("click", () => {
    history = [];
    renderHistory();
    showToast("History cleared");
  });

  // --- Calculator Logic ---
  function handleInput(val) {
    if (val === "AC") {
      currentExpr = "";
      lastResult = null;
      exprDisplay.textContent = "";
      updateDisplay();
      return;
    }

    if (val === "DEL") {
      currentExpr = currentExpr.slice(0, -1);
      updateDisplay();
      return;
    }

    if (val === "±") {
      if (!currentExpr && lastResult !== null) {
        currentExpr = String(-lastResult);
      } else if (currentExpr.startsWith("-")) {
        currentExpr = currentExpr.slice(1);
      } else if (currentExpr) {
        currentExpr = "-" + currentExpr;
      }
      updateDisplay();
      return;
    }

    if (val === "+1") {
      const num = currentExpr ? parseFloat(currentExpr) : (lastResult !== null ? lastResult : 0);
      if (isNaN(num)) {
        showToast("Invalid number for increment", true);
        return;
      }
      const res = window.calc ? window.calc.increment(num) : num + 1;
      exprDisplay.textContent = `increment(${num})`;
      currentExpr = "";
      lastResult = res;
      updateDisplay();
      addToHistory(`increment(${num})`, res);
      return;
    }

    if (val === "-1") {
      const num = currentExpr ? parseFloat(currentExpr) : (lastResult !== null ? lastResult : 0);
      if (isNaN(num)) {
        showToast("Invalid number for decrement", true);
        return;
      }
      const res = window.calc ? window.calc.decrement(num) : num - 1;
      exprDisplay.textContent = `decrement(${num})`;
      currentExpr = "";
      lastResult = res;
      updateDisplay();
      addToHistory(`decrement(${num})`, res);
      return;
    }

    if (val === "=") {
      calculateResult();
      return;
    }

    // Append to expression
    currentExpr += val;
    updateDisplay();
  }

  function calculateResult() {
    if (!currentExpr) return;
    const rawExpr = currentExpr;

    try {
      let result;
      if (window.calc && typeof window.calc.evaluate === "function") {
        // Try calc.evaluate first
        try {
          result = window.calc.evaluate(rawExpr);
        } catch (e) {
          // Fallback to JS Function evaluation for multi-term expressions e.g. 5 + 3 + 2
          const sanitized = rawExpr
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/\/\//g, " Math.floor($1/$2) ")
            .replace(/\^/g, "**");
          
          result = Function(`"use strict"; return (${sanitized})`)();
        }
      } else {
        const sanitized = rawExpr.replace(/×/g, "*").replace(/÷/g, "/");
        result = Function(`"use strict"; return (${sanitized})`)();
      }

      if (typeof result === "number" && !isFinite(result)) {
        throw new RangeError("Division by zero or overflow");
      }

      exprDisplay.textContent = rawExpr + " =";
      lastResult = result;
      addToHistory(rawExpr, result);
      currentExpr = String(result);
      updateDisplay();
      currentExpr = ""; // Clear so next keypress starts fresh or appends
    } catch (err) {
      showToast(err.message || "Invalid Expression", true);
      exprDisplay.textContent = "Error";
    }
  }

  // Bind key buttons
  document.querySelectorAll(".key").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.val || btn.textContent.trim();
      handleInput(val);
      btn.classList.add("pressed");
      setTimeout(() => btn.classList.remove("pressed"), 150);
    });
  });

  // --- Keyboard Shortcuts ---
  window.addEventListener("keydown", e => {
    // Only intercept keypress if not focused on inputs
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "SELECT") {
      return;
    }

    const key = e.key;

    if (key >= "0" && key <= "9") handleInput(key);
    else if (key === ".") handleInput(".");
    else if (key === "+") handleInput("+");
    else if (key === "-") handleInput("-");
    else if (key === "*") handleInput("*");
    else if (key === "/") handleInput("/");
    else if (key === "%") handleInput("%");
    else if (key === "^") handleInput("^");
    else if (key === "(") handleInput("(");
    else if (key === ")") handleInput(")");
    else if (key === "Enter" || key === "=") {
      e.preventDefault();
      handleInput("=");
    } else if (key === "Backspace") {
      e.preventDefault();
      handleInput("DEL");
    } else if (key === "Escape" || key.toLowerCase() === "c") {
      handleInput("AC");
    }
  });

  // --- Copy Result to Clipboard ---
  const copyBtn = document.getElementById("copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const textToCopy = mainDisplay.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        showToast("Failed to copy", true);
      });
    });
  }

  // --- Array / Extras Tool Compute ---
  arrayComputeBtn.addEventListener("click", () => {
    const fnName = arrayFnSelect.value;
    const rawVal = arrayInput.value.trim();

    if (!rawVal) {
      showToast("Please enter numbers separated by commas", true);
      return;
    }

    const nums = rawVal.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

    if (nums.length === 0) {
      showToast("No valid numbers found", true);
      return;
    }

    try {
      let res;
      if (!window.calc) throw new Error("calc.js library not loaded");

      if (fnName === "sum") {
        res = window.calc.sum(nums);
      } else if (fnName === "difference") {
        res = window.calc.difference(nums);
      } else if (fnName === "product") {
        res = window.calc.product(nums);
      } else if (fnName === "quotient") {
        res = window.calc.quotient(nums);
      } else if (fnName === "power") {
        if (nums.length < 2) throw new Error("power() requires 2 numbers: base, exp");
        res = window.calc.power(nums[0], nums[1]);
      } else if (fnName === "intDivide") {
        if (nums.length < 2) throw new Error("intDivide() requires 2 numbers: a, b");
        res = window.calc.intDivide(nums[0], nums[1]);
      } else if (fnName === "remainder") {
        if (nums.length < 2) throw new Error("remainder() requires 2 numbers: a, b");
        res = window.calc.remainder(nums[0], nums[1]);
      }

      arrayResultOutput.textContent = `= ${res}`;
      addToHistory(`${fnName}([${nums.join(", ")}])`, res);
      showToast("Computed successfully");
    } catch (err) {
      arrayResultOutput.textContent = `Error: ${err.message}`;
      showToast(err.message, true);
    }
  });

  // --- Freeform Expression Evaluator ---
  evalExprBtn.addEventListener("click", () => {
    const expr = freeformExprInput.value.trim();
    if (!expr) {
      showToast("Please enter an expression", true);
      return;
    }

    try {
      if (!window.calc || !window.calc.evaluate) throw new Error("calc.js not loaded");
      const res = window.calc.evaluate(expr);
      evalResultOutput.textContent = `= ${res}`;
      addToHistory(expr, res);
      showToast("Expression evaluated!");
    } catch (err) {
      evalResultOutput.textContent = `Error: ${err.message}`;
      showToast(err.message, true);
    }
  });
});
