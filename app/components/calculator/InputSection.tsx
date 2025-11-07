"use client";

import { Expense, Income } from "./types";

interface InputSectionProps {
  currency: string;
  startingCash: string;
  setStartingCash: (value: string) => void;
  setCurrency: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  expenseMode: "total" | "brokenDown";
  setExpenseMode: (mode: "total" | "brokenDown") => void;
  totalExpense: string;
  setTotalExpense: (value: string) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  incomes: Income[];
  setIncomes: (incomes: Income[]) => void;
}

export default function InputSection({
  currency,
  startingCash,
  setStartingCash,
  setCurrency,
  city,
  setCity,
  expenseMode,
  setExpenseMode,
  totalExpense,
  setTotalExpense,
  expenses,
  setExpenses,
  incomes,
  setIncomes,
}: InputSectionProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Starting Cash Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Starting Cash
            </label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                {currency}
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={startingCash === "0" || startingCash === "" ? "" : startingCash}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) >= 0) {
                    setStartingCash(val);
                  }
                }}
                onFocus={(e) => {
                  if (startingCash === "0") {
                    setStartingCash("");
                  }
                }}
                className="w-full pl-3 pr-14 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-right text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900 text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_0.75rem_center] bg-no-repeat"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="THB">THB</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              City or region
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-sm"
              placeholder="e.g., Lisbon"
            />
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Expenses (Monthly)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setExpenseMode("total")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                expenseMode === "total"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Total
            </button>
            <button
              onClick={() => setExpenseMode("brokenDown")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                expenseMode === "brokenDown"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Broken Down
            </button>
          </div>
        </div>
        
        {expenseMode === "total" ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Total Expenses
            </label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                {currency}
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={totalExpense === "0" || totalExpense === "" ? "" : totalExpense}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) >= 0) {
                    setTotalExpense(val);
                  }
                }}
                onFocus={(e) => {
                  if (totalExpense === "0") {
                    setTotalExpense("");
                  }
                }}
                className="w-full pl-3 pr-14 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-right text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {expenses.map((expense, idx) => {
              const categoryLabels: Record<string, string> = {
                rent: "Rent",
                food: "Food",
                internet: "Internet",
                transportation: "Transportation",
                miscellaneous: "Miscellaneous",
              };
              const label = categoryLabels[expense.category] || expense.category;
              
              return (
                <div key={idx} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {label}
                  </label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                      {currency}
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={expense.amountMonthlyCents === 0 ? "" : expense.amountMonthlyCents / 100}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numVal = parseFloat(val || "0");
                        if (val === "" || numVal >= 0) {
                          const newExpenses = [...expenses];
                          newExpenses[idx].amountMonthlyCents = Math.round(numVal * 100);
                          setExpenses(newExpenses);
                        }
                      }}
                      className="w-full pl-3 pr-14 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-right text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Income Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Income (Monthly)
          </h2>
          <button
            onClick={() =>
              setIncomes([...incomes, { name: "", amountMonthlyCents: 0 }])
            }
            className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            + Add Income
          </button>
        </div>
        {incomes.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">No income sources added yet.</p>
            <p className="text-xs mt-1">Click "+ Add Income" to get started.</p>
          </div>
        )}
        <div className="space-y-3">
          {incomes.map((income, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <input
                type="text"
                value={income.name}
                onChange={(e) => {
                  const newIncomes = [...incomes];
                  newIncomes[idx].name = e.target.value;
                  setIncomes(newIncomes);
                }}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-sm"
                placeholder="Income name (e.g., Salary, Freelance)"
              />
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  {currency}
                </span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={income.amountMonthlyCents === 0 ? "" : income.amountMonthlyCents / 100}
                  onChange={(e) => {
                    const val = e.target.value;
                    const numVal = parseFloat(val || "0");
                    if (val === "" || numVal >= 0) {
                      const newIncomes = [...incomes];
                      newIncomes[idx].amountMonthlyCents = Math.round(numVal * 100);
                      setIncomes(newIncomes);
                    }
                  }}
                  className="w-32 pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-right text-sm"
                  placeholder="0.00"
                />
              </div>
              {incomes.length > 1 && (
                <button
                  onClick={() =>
                    setIncomes(incomes.filter((_, i) => i !== idx))
                  }
                  className="px-3 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  aria-label="Remove income"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

