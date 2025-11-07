"use client";

import { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  computeDailyBurnCents,
  computeRunwayDays,
  computeRunwayEndDate,
  sumMonthlyCents,
} from "@/lib/calc";
import { saveScenario } from "@/app/actions";

interface Expense {
  name: string;
  amountMonthlyCents: number;
}

interface Income {
  name: string;
  amountMonthlyCents: number;
}

export default function Calculator() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [startingCash, setStartingCash] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [expenses, setExpenses] = useState<Expense[]>([
    { name: "", amountMonthlyCents: 0 },
  ]);
  const [incomes, setIncomes] = useState<Income[]>([
    { name: "", amountMonthlyCents: 0 },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const expensesMonthlyCents = useMemo(
    () => sumMonthlyCents(expenses),
    [expenses]
  );
  const incomesMonthlyCents = useMemo(
    () => sumMonthlyCents(incomes),
    [incomes]
  );
  const dailyBurnCents = useMemo(
    () => computeDailyBurnCents(expensesMonthlyCents, incomesMonthlyCents),
    [expensesMonthlyCents, incomesMonthlyCents]
  );
  const startingCashCents = useMemo(() => {
    const parsed = parseFloat(startingCash);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100);
  }, [startingCash]);
  const runwayDays = useMemo(
    () => computeRunwayDays(startingCashCents, dailyBurnCents),
    [startingCashCents, dailyBurnCents]
  );
  const runwayEndDate = useMemo(
    () => computeRunwayEndDate(new Date(), runwayDays),
    [runwayDays]
  );

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const handleSave = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsSaving(true);
    try {
      const filteredExpenses = expenses.filter(
        (e) => e.name.trim() && e.amountMonthlyCents > 0
      );
      const filteredIncomes = incomes.filter(
        (i) => i.name.trim() && i.amountMonthlyCents > 0
      );

      const result = await saveScenario({
        name: `Burn Rate Scenario - ${new Date().toLocaleDateString()}`,
        currency,
        startingCashCents,
        expenses: filteredExpenses,
        incomes: filteredIncomes,
      });

      router.push(`/s/${result.id}`);
    } catch (error) {
      console.error("Failed to save scenario:", error);
      alert("Failed to save scenario. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Burn Rate Calculator</h1>
      <p className="text-gray-600">
        Calculate how long your savings will last based on your expenses and
        income.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Starting Cash ({currency})
          </label>
          <input
            type="number"
            step="0.01"
            value={startingCash}
            onChange={(e) => setStartingCash(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="THB">THB</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Expenses (Monthly)</label>
            <button
              onClick={() =>
                setExpenses([...expenses, { name: "", amountMonthlyCents: 0 }])
              }
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Expense
            </button>
          </div>
          <div className="space-y-2">
            {expenses.map((expense, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={expense.name}
                  onChange={(e) => {
                    const newExpenses = [...expenses];
                    newExpenses[idx].name = e.target.value;
                    setExpenses(newExpenses);
                  }}
                  className="flex-1 px-4 py-2 border rounded-md"
                  placeholder="Expense name"
                />
                <input
                  type="number"
                  step="0.01"
                  value={expense.amountMonthlyCents / 100}
                  onChange={(e) => {
                    const newExpenses = [...expenses];
                    newExpenses[idx].amountMonthlyCents = Math.round(
                      parseFloat(e.target.value || "0") * 100
                    );
                    setExpenses(newExpenses);
                  }}
                  className="w-32 px-4 py-2 border rounded-md"
                  placeholder="0.00"
                />
                {expenses.length > 1 && (
                  <button
                    onClick={() =>
                      setExpenses(expenses.filter((_, i) => i !== idx))
                    }
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Income (Monthly)</label>
            <button
              onClick={() =>
                setIncomes([...incomes, { name: "", amountMonthlyCents: 0 }])
              }
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Income
            </button>
          </div>
          <div className="space-y-2">
            {incomes.map((income, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={income.name}
                  onChange={(e) => {
                    const newIncomes = [...incomes];
                    newIncomes[idx].name = e.target.value;
                    setIncomes(newIncomes);
                  }}
                  className="flex-1 px-4 py-2 border rounded-md"
                  placeholder="Income name"
                />
                <input
                  type="number"
                  step="0.01"
                  value={income.amountMonthlyCents / 100}
                  onChange={(e) => {
                    const newIncomes = [...incomes];
                    newIncomes[idx].amountMonthlyCents = Math.round(
                      parseFloat(e.target.value || "0") * 100
                    );
                    setIncomes(newIncomes);
                  }}
                  className="w-32 px-4 py-2 border rounded-md"
                  placeholder="0.00"
                />
                {incomes.length > 1 && (
                  <button
                    onClick={() =>
                      setIncomes(incomes.filter((_, i) => i !== idx))
                    }
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Daily Burn Rate</div>
            <div className="text-2xl font-bold">
              {formatCurrency(dailyBurnCents)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Runway</div>
            <div className="text-2xl font-bold">
              {isFinite(runwayDays)
                ? `${Math.floor(runwayDays)} days`
                : "∞ (No burn)"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Runway End Date</div>
            <div className="text-2xl font-bold">
              {runwayEndDate
                ? runwayEndDate.toLocaleDateString()
                : "Never"}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving || startingCashCents === 0}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSaving
          ? "Saving..."
          : isSignedIn
          ? "Save Scenario"
          : "Sign In to Save"}
      </button>
    </div>
  );
}

