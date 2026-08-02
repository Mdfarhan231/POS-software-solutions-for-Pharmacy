"use client";

import { useEffect, useState } from "react";
import { Delete, X } from "lucide-react";

const OPERATORS = {
  "+": (left, right) => left + right,
  "−": (left, right) => left - right,
  "×": (left, right) => left * right,
  "÷": (left, right) => (right === 0 ? Number.NaN : left / right),
};

function formatDisplay(value) {
  if (!Number.isFinite(value)) return "Error";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10,
    useGrouping: false,
  }).format(value);
}

export default function CalculatorModal({ onClose }) {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [replaceDisplay, setReplaceDisplay] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function inputDigit(digit) {
    if (display === "Error" || replaceDisplay) {
      setDisplay(digit);
      setReplaceDisplay(false);
      return;
    }

    setDisplay((current) => (current === "0" ? digit : `${current}${digit}`));
  }

  function inputDecimal() {
    if (display === "Error" || replaceDisplay) {
      setDisplay("0.");
      setReplaceDisplay(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay((current) => `${current}.`);
    }
  }

  function clearCalculator() {
    setDisplay("0");
    setStoredValue(null);
    setPendingOperator(null);
    setReplaceDisplay(false);
  }

  function backspace() {
    if (display === "Error" || replaceDisplay) {
      setDisplay("0");
      setReplaceDisplay(false);
      return;
    }

    setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
  }

  function calculate(left, right, operator) {
    const operation = OPERATORS[operator];
    return operation ? operation(left, right) : right;
  }

  function selectOperator(operator) {
    const currentValue = Number(display);

    if (!Number.isFinite(currentValue)) {
      clearCalculator();
      return;
    }

    if (storedValue !== null && pendingOperator && !replaceDisplay) {
      const result = calculate(storedValue, currentValue, pendingOperator);
      setDisplay(formatDisplay(result));
      setStoredValue(result);
    } else {
      setStoredValue(currentValue);
    }

    setPendingOperator(operator);
    setReplaceDisplay(true);
  }

  function calculateResult() {
    if (storedValue === null || !pendingOperator) return;

    const result = calculate(storedValue, Number(display), pendingOperator);
    setDisplay(formatDisplay(result));
    setStoredValue(null);
    setPendingOperator(null);
    setReplaceDisplay(true);
  }

  const buttons = [
    { label: "C", action: clearCalculator, className: "text-rose-700" },
    { label: "⌫", action: backspace, icon: Delete },
    { label: "÷", action: () => selectOperator("÷"), operator: true },
    { label: "7", action: () => inputDigit("7") },
    { label: "8", action: () => inputDigit("8") },
    { label: "9", action: () => inputDigit("9") },
    { label: "×", action: () => selectOperator("×"), operator: true },
    { label: "4", action: () => inputDigit("4") },
    { label: "5", action: () => inputDigit("5") },
    { label: "6", action: () => inputDigit("6") },
    { label: "−", action: () => selectOperator("−"), operator: true },
    { label: "1", action: () => inputDigit("1") },
    { label: "2", action: () => inputDigit("2") },
    { label: "3", action: () => inputDigit("3") },
    { label: "+", action: () => selectOperator("+"), operator: true },
    { label: "0", action: () => inputDigit("0"), wide: true },
    { label: ".", action: inputDecimal },
    { label: "=", action: calculateResult, equals: true },
  ];

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calculator-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 id="calculator-title" className="font-bold text-slate-900">
              Quick Calculator
            </h2>
            <p className="text-xs text-slate-500">Use during billing and cash counting</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close calculator"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-slate-950 px-4 py-5 text-right">
          <p className="min-h-4 text-xs text-slate-400">
            {storedValue !== null && pendingOperator
              ? `${formatDisplay(storedValue)} ${pendingOperator}`
              : "Ready"}
          </p>
          <p className="mt-1 truncate text-3xl font-black tracking-tight text-white">
            {display}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((button) => {
            const Icon = button.icon;

            return (
              <button
                key={button.label}
                type="button"
                onClick={button.action}
                className={`flex h-12 items-center justify-center rounded-xl border text-base font-bold transition active:scale-95 ${
                  button.wide ? "col-span-2" : ""
                } ${
                  button.equals
                    ? "border-[#7a1528] bg-[#7a1528] text-white hover:bg-[#610f1e]"
                    : button.operator
                      ? "border-rose-200 bg-rose-50 text-[#7a1528] hover:bg-rose-100"
                      : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                } ${button.className || ""}`}
              >
                {Icon ? <Icon className="h-5 w-5" /> : button.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
