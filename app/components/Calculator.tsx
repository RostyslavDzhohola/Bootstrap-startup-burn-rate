"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  computeDailyBurnCents,
  computeRunwayDays,
  computeRunwayEndDate,
  sumMonthlyCents,
} from "@/lib/calc";
import { saveClock, getUserClock } from "@/app/actions";
import { Expense, Income } from "./calculator/types";
import InputSection from "./calculator/InputSection";
import ResultsSidebar from "./calculator/ResultsSidebar";
import LandingSections from "./calculator/LandingSections";
import SavedClocksIndicator from "./SavedClocksIndicator";
import Footer from "./Footer";
import CountdownTimer from "./calculator/CountdownTimer";

export default function Calculator() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [startingCash, setStartingCash] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [city, setCity] = useState("");
  const [expenseMode, setExpenseMode] = useState<"total" | "brokenDown">(
    "brokenDown"
  );
  const [totalExpense, setTotalExpense] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([
    { category: "rent", amountMonthlyCents: 0 },
    { category: "food", amountMonthlyCents: 0 },
    { category: "internet", amountMonthlyCents: 0 },
    { category: "transportation", amountMonthlyCents: 0 },
    { category: "miscellaneous", amountMonthlyCents: 0 },
  ]);
  const [incomes, setIncomes] = useState<Income[]>([
    { name: "", amountMonthlyCents: 0 },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const expensesMonthlyCents = useMemo(() => {
    if (expenseMode === "total") {
      const parsed = parseFloat(totalExpense);
      return isNaN(parsed) ? 0 : Math.round(parsed * 100);
    }
    return sumMonthlyCents(expenses);
  }, [expenseMode, totalExpense, expenses]);
  const incomesMonthlyCents = useMemo(
    () => sumMonthlyCents(incomes),
    [incomes]
  );
  const dailyBurnCents = useMemo(
    () => computeDailyBurnCents(expensesMonthlyCents, incomesMonthlyCents),
    [expensesMonthlyCents, incomesMonthlyCents]
  );
  const netMonthlyCents = useMemo(
    () => expensesMonthlyCents - incomesMonthlyCents,
    [expensesMonthlyCents, incomesMonthlyCents]
  );
  const netDailyCents = useMemo(() => netMonthlyCents / 30, [netMonthlyCents]);
  const isProfitable = netMonthlyCents < 0;
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

  const formatCurrency = useCallback(
    (cents: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
      }).format(cents / 100);
    },
    [currency]
  );

  const trimmedCity = city.trim();
  const locationLabel = trimmedCity || "your current plan";

  // Check if all inputs are zero/empty
  const hasNoInputs = useMemo(
    () =>
      startingCashCents === 0 &&
      expensesMonthlyCents === 0 &&
      incomesMonthlyCents === 0,
    [startingCashCents, expensesMonthlyCents, incomesMonthlyCents]
  );

  // Countdown timer state
  const [countdownEndTime, setCountdownEndTime] = useState<number | null>(null);
  const [savedClockEndDate, setSavedClockEndDate] = useState<string | null>(
    null
  );

  // Load saved clock end date when signed in
  useEffect(() => {
    if (!isSignedIn) {
      setSavedClockEndDate(null);
      return;
    }

    const fetchSavedClock = async () => {
      try {
        const userClock = await getUserClock();
        if (userClock?.runwayEndDate) {
          setSavedClockEndDate(userClock.runwayEndDate);
        } else {
          setSavedClockEndDate(null);
        }
      } catch (error) {
        console.error("Failed to fetch saved clock:", error);
        setSavedClockEndDate(null);
      }
    };

    fetchSavedClock();
  }, [isSignedIn]);

  // Update countdown end time when runwayDays changes or saved clock is available
  useEffect(() => {
    // If inputs are empty and saved clock exists, use saved clock end date
    if (hasNoInputs && savedClockEndDate) {
      const savedDate = new Date(savedClockEndDate);
      const now = new Date();
      if (savedDate > now) {
        setCountdownEndTime(savedDate.getTime());
        return;
      }
    }

    // Otherwise, use computed runway end date
    if (
      !isFinite(runwayDays) ||
      runwayDays <= 0 ||
      dailyBurnCents <= 0 ||
      isProfitable
    ) {
      setCountdownEndTime(null);
      return;
    }

    const now = new Date();
    setCountdownEndTime(now.getTime() + runwayDays * 24 * 60 * 60 * 1000);
  }, [
    runwayDays,
    dailyBurnCents,
    isProfitable,
    hasNoInputs,
    savedClockEndDate,
  ]);

  // Convert countdown end time to Date object for CountdownTimer
  const countdownEndDate = useMemo(() => {
    if (!countdownEndTime) return null;
    return new Date(countdownEndTime);
  }, [countdownEndTime]);

  const financialSummary = useMemo(() => {
    if (hasNoInputs) {
      return "Please enter your numbers.";
    }

    if (netMonthlyCents > 0 && isFinite(runwayDays) && runwayDays > 0) {
      return `In ${locationLabel}, you are burning ${formatCurrency(
        netMonthlyCents
      )} each month. At this pace, cash covers about ${Math.floor(
        runwayDays
      )} days of operations.`;
    }
    if (netMonthlyCents > 0 && (!isFinite(runwayDays) || runwayDays <= 0)) {
      return "Your expenses outpace income, and savings are depleted. Reducing spend restores runway instantly.";
    }
    if (netMonthlyCents < 0) {
      return `In ${locationLabel}, you are generating ${formatCurrency(
        Math.abs(netMonthlyCents)
      )} in surplus every month—consider reinvesting to extend your lead.`;
    }
    return "Your income currently matches expenses. A small buffer can protect against unexpected costs.";
  }, [netMonthlyCents, runwayDays, locationLabel, formatCurrency, hasNoInputs]);

  const goAllInGuidance = useMemo(() => {
    if (isProfitable) {
      return "Cash flow is positive. Going all-in is sustainable because each month adds to your reserves.";
    }

    if (netMonthlyCents === 0) {
      return "You are breaking even. Going all-in means keeping a close eye on new costs to avoid slipping into burn.";
    }

    if (!isFinite(runwayDays) || runwayDays <= 0) {
      return "You are out of runway. Hit pause on going all-in until you adjust expenses or unlock new income.";
    }

    const runwayMonths = runwayDays / 30;
    if (runwayMonths >= 24) {
      return "This is the best place to be. With 24+ months of runway, you can commit with confidence and schedule quarterly reviews to track progress.";
    }
    if (runwayMonths >= 12) {
      return "This is the sweet spot. With 12-24 months of runway, going all-in is reasonable as long as you monitor hiring and large purchases.";
    }
    if (runwayMonths >= 6) {
      return "Maybe proceed. With 6-12 months of runway, proceed with caution and focus on extending your runway before making major commitments. Consider cutting your expenses, moving to a cheaper city, or saving more before going all-in.";
    }
    if (runwayMonths >= 3) {
      return "Risky territory. With only 3-6 months of runway, we recommend you get more cash before going all-in.";
    }
    return "Critical risk. With less than 3 months of runway, find a way to lower your expenses or consider moving to a cheaper city to extend your runway.";
  }, [isProfitable, netMonthlyCents, runwayDays]);

  const riskLevel = useMemo(() => {
    if (isProfitable || !isFinite(runwayDays) || runwayDays <= 0) {
      return "low" as const;
    }
    const runwayMonths = runwayDays / 30;
    if (runwayMonths >= 24) {
      return "low" as const;
    }
    if (runwayMonths >= 12) {
      return "sweet" as const;
    }
    if (runwayMonths >= 6) {
      return "maybe" as const;
    }
    if (runwayMonths >= 3) {
      return "risky" as const;
    }
    return "critical" as const;
  }, [isProfitable, runwayDays]);

  const handleSave = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsSaving(true);
    try {
      const clockName = trimmedCity
        ? `Runway - ${trimmedCity}`
        : `Burn Rate Clock - ${new Date().toLocaleDateString()}`;

      // Calculate and save runway end date
      const endDateISO = runwayEndDate
        ? runwayEndDate.toISOString()
        : undefined;

      const result = await saveClock({
        name: clockName,
        city: trimmedCity || undefined,
        runwayEndDate: endDateISO,
      });

      router.push(`/s/${result.id}`);
    } catch (error) {
      console.error("Failed to save clock:", error);
      alert("Failed to save clock. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Calculator Focus */}
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold leading-normal">
            <span className="relative inline-block">
              {/* Glow shadow layer */}
              <span
                className="absolute inset-0 bg-linear-to-r from-red-600 via-rose-500 to-pink-500 blur-2xl opacity-50 -z-10"
                aria-hidden="true"
              >
                How many days do you have to make it?
              </span>
              {/* Main gradient text with shadow */}
              <span className="relative bg-linear-to-r from-red-700 via-rose-600 to-pink-600 bg-clip-text text-transparent filter-[drop-shadow(0_4px_12px_rgba(220,38,38,0.5))]">
                How many days do you have to make it?
              </span>
            </span>
          </h1>

          {/* Prominent Countdown Timer - Always Visible */}
          <div className="relative mx-auto w-full">
            <CountdownTimer endDate={countdownEndDate} showEndDate={true} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          id="calculator"
          className="grid lg:grid-cols-3 gap-8"
          suppressHydrationWarning
        >
          <InputSection
            currency={currency}
            startingCash={startingCash}
            setStartingCash={setStartingCash}
            setCurrency={setCurrency}
            city={city}
            setCity={setCity}
            expenseMode={expenseMode}
            setExpenseMode={setExpenseMode}
            totalExpense={totalExpense}
            setTotalExpense={setTotalExpense}
            expenses={expenses}
            setExpenses={setExpenses}
            incomes={incomes}
            setIncomes={setIncomes}
          />

          <ResultsSidebar
            currency={currency}
            netDailyCents={netDailyCents}
            netMonthlyCents={netMonthlyCents}
            isProfitable={isProfitable}
            runwayDays={runwayDays}
            runwayEndDate={runwayEndDate}
            trimmedCity={trimmedCity}
            financialSummary={financialSummary}
            goAllInGuidance={goAllInGuidance}
            riskLevel={riskLevel}
            isSignedIn={isSignedIn ?? false}
            isSaving={isSaving}
            startingCashCents={startingCashCents}
            onSave={handleSave}
          />
        </div>

        <LandingSections />
      </div>

      {/* Footer */}
      <Footer />

      {/* Saved Clocks Indicator */}
      <SavedClocksIndicator />
    </div>
  );
}
