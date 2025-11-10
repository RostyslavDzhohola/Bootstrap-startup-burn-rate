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
import { saveClock, getUserClocks } from "@/app/actions";
import { Expense, Income } from "./calculator/types";
import InputSection from "./calculator/InputSection";
import ResultsSidebar from "./calculator/ResultsSidebar";
import LandingSections from "./calculator/LandingSections";
import SavedClocksIndicator from "./SavedClocksIndicator";

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
  const [countdownTime, setCountdownTime] = useState<{
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
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
        const userClocks = await getUserClocks();
        if (userClocks.length > 0 && userClocks[0].runwayEndDate) {
          setSavedClockEndDate(userClocks[0].runwayEndDate);
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
      setCountdownTime(null);
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

  // Update countdown every second
  useEffect(() => {
    if (!countdownEndTime) {
      setCountdownTime(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = countdownEndTime - now;

      if (diff <= 0) {
        setCountdownTime({
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      const totalMonths = Math.floor(totalDays / 30);
      const totalYears = Math.floor(totalMonths / 12);

      setCountdownTime({
        years: totalYears,
        months: totalMonths % 12,
        days: totalDays % 30,
        hours: totalHours % 24,
        minutes: totalMinutes % 60,
        seconds: totalSeconds % 60,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
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
      const scenarioName = trimmedCity
        ? `Runway - ${trimmedCity}`
        : `Burn Rate Scenario - ${new Date().toLocaleDateString()}`;

      // Calculate and save runway end date
      const endDateISO = runwayEndDate
        ? runwayEndDate.toISOString()
        : undefined;

      const result = await saveClock({
        name: scenarioName,
        city: trimmedCity || undefined,
        runwayEndDate: endDateISO,
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
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
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-linear-to-br from-red-600/20 via-orange-600/20 to-red-800/20 blur-3xl rounded-3xl -z-10"></div>

            <div className="bg-linear-to-br from-slate-900 via-red-950 to-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-red-500/50 shadow-2xl relative">
              {/* End date label in top-right corner */}
              {countdownEndTime && (
                <div className="absolute top-4 right-4 text-xs text-slate-400 font-medium">
                  {new Date(countdownEndTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}
              <div className="text-center mb-4">
                <div className="text-xs sm:text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">
                  Time until bankruptcy
                </div>
                <div className="h-px bg-linear-to-r from-transparent via-red-500/50 to-transparent"></div>
              </div>

              <div className="grid grid-cols-6 gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                    {countdownTime?.years ?? 0}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Years
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                    {countdownTime?.months ?? 0}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Months
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                    {countdownTime?.days ?? 0}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Days
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                    {String(countdownTime?.hours ?? 0).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Hours
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                    {String(countdownTime?.minutes ?? 0).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Minutes
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-1 tabular-nums ${
                      countdownTime
                        ? "text-red-400 animate-pulse"
                        : "text-white"
                    }`}
                  >
                    {String(countdownTime?.seconds ?? 0).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Seconds
                  </div>
                </div>
              </div>
            </div>
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

      {/* Saved Clocks Indicator */}
      <SavedClocksIndicator />
    </div>
  );
}
