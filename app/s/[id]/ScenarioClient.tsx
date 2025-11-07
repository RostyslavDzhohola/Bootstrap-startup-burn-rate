"use client";

import { useEffect, useState } from "react";
import {
  computeDailyBurnCents,
  computeRunwayDays,
  computeRunwayEndDate,
  sumMonthlyCents,
} from "@/lib/calc";

interface ScenarioPageProps {
  scenario: {
    id: string;
    name: string;
    currency: string;
    startingCashCents: number;
    createdAt: string;
    expenses: Array<{ name: string; amountMonthlyCents: number }>;
    incomes: Array<{ name: string; amountMonthlyCents: number }>;
  };
}

function Countdown({ endDate }: { endDate: Date | null }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!endDate) {
      setTimeLeft(null);
      return;
    }

    const update = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (!endDate || !timeLeft) {
    return (
      <div className="text-4xl font-bold text-green-600">∞ No burn rate</div>
    );
  }

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="text-4xl font-bold text-red-600">Time's up!</div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="text-6xl font-bold text-red-600">
        {String(timeLeft.days).padStart(2, "0")}:
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </div>
      <div className="text-sm text-gray-600">
        Days : Hours : Minutes : Seconds
      </div>
    </div>
  );
}

export default function ScenarioPage({ scenario }: ScenarioPageProps) {
  const expensesMonthlyCents = sumMonthlyCents(scenario.expenses);
  const incomesMonthlyCents = sumMonthlyCents(scenario.incomes);
  const dailyBurnCents = computeDailyBurnCents(
    expensesMonthlyCents,
    incomesMonthlyCents
  );
  const runwayDays = computeRunwayDays(
    scenario.startingCashCents,
    dailyBurnCents
  );
  const runwayEndDate = computeRunwayEndDate(new Date(), runwayDays);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: scenario.currency,
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{scenario.name}</h1>
        <p className="text-gray-600 mt-2">
          Created {new Date(scenario.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-red-50 border-2 border-red-200 p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Time Until You're Broke
        </h2>
        <Countdown endDate={runwayEndDate} />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Burn Rate Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Daily Burn Rate</div>
            <div className="text-2xl font-bold">
              {formatCurrency(dailyBurnCents)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Starting Cash</div>
            <div className="text-2xl font-bold">
              {formatCurrency(scenario.startingCashCents)}
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Expenses</h3>
          <div className="space-y-2">
            {scenario.expenses.length === 0 ? (
              <p className="text-gray-500">No expenses</p>
            ) : (
              scenario.expenses.map((expense, idx) => (
                <div
                  key={idx}
                  className="flex justify-between p-3 bg-white rounded border"
                >
                  <span>{expense.name}</span>
                  <span className="font-medium">
                    {formatCurrency(expense.amountMonthlyCents)}/mo
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total Expenses</span>
              <span>{formatCurrency(expensesMonthlyCents)}/mo</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Income</h3>
          <div className="space-y-2">
            {scenario.incomes.length === 0 ? (
              <p className="text-gray-500">No income</p>
            ) : (
              scenario.incomes.map((income, idx) => (
                <div
                  key={idx}
                  className="flex justify-between p-3 bg-white rounded border"
                >
                  <span>{income.name}</span>
                  <span className="font-medium">
                    {formatCurrency(income.amountMonthlyCents)}/mo
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total Income</span>
              <span>{formatCurrency(incomesMonthlyCents)}/mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

