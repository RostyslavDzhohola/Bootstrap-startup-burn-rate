"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

interface ScenarioPageProps {
  scenario: {
    id: string;
    name: string;
    city?: string | null;
    runwayEndDate: string | null;
    createdAt: string;
  };
  isSignedIn: boolean;
}

export default function ScenarioPage({
  scenario,
  isSignedIn,
}: ScenarioPageProps) {
  const [countdownTime, setCountdownTime] = useState<{
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Parse saved runway end date from database - memoized to prevent infinite loops
  const endDate = useMemo(() => {
    if (!scenario.runwayEndDate) return null;
    const date = new Date(scenario.runwayEndDate);
    return isNaN(date.getTime()) ? null : date;
  }, [scenario.runwayEndDate]);

  // Show toast notification if user is signed in and scenario doesn't have end date
  useEffect(() => {
    if (isSignedIn && !endDate) {
      toast.error(
        "Please create a new clock by entering your information and saving it",
        {
          duration: 5000,
        }
      );
    }
  }, [isSignedIn, endDate]);

  // Update countdown every second
  useEffect(() => {
    if (!endDate) {
      // Clear countdown when endDate becomes null - use setTimeout to avoid synchronous setState
      const timeoutId = setTimeout(() => {
        setCountdownTime(null);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = endDate.getTime();

      // Validate dates
      if (isNaN(now) || isNaN(endTime)) {
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

      const diff = endTime - now;

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
        years: isNaN(totalYears) ? 0 : totalYears,
        months: isNaN(totalMonths % 12) ? 0 : totalMonths % 12,
        days: isNaN(totalDays % 30) ? 0 : totalDays % 30,
        hours: isNaN(totalHours % 24) ? 0 : totalHours % 24,
        minutes: isNaN(totalMinutes % 60) ? 0 : totalMinutes % 60,
        seconds: isNaN(totalSeconds % 60) ? 0 : totalSeconds % 60,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="h-[calc(100vh-4rem)] bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center overflow-hidden">
      <div className="max-w-5xl w-full px-4 sm:px-6 lg:px-8">
        {/* Calculator Focus */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
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
              {endDate && (
                <div className="absolute top-4 right-4 text-xs text-slate-400 font-medium">
                  {endDate.toLocaleDateString("en-US", {
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
                    {countdownTime
                      ? isNaN(countdownTime.years)
                        ? 0
                        : countdownTime.years
                      : 0}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Years
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                    {countdownTime
                      ? isNaN(countdownTime.months)
                        ? 0
                        : countdownTime.months
                      : 0}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Months
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                    {countdownTime
                      ? isNaN(countdownTime.days)
                        ? 0
                        : countdownTime.days
                      : 0}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Days
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                    {String(
                      countdownTime
                        ? isNaN(countdownTime.hours)
                          ? 0
                          : countdownTime.hours
                        : 0
                    ).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Hours
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                    {String(
                      countdownTime
                        ? isNaN(countdownTime.minutes)
                          ? 0
                          : countdownTime.minutes
                        : 0
                    ).padStart(2, "0")}
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
                    {String(
                      countdownTime
                        ? isNaN(countdownTime.seconds)
                          ? 0
                          : countdownTime.seconds
                        : 0
                    ).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Seconds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
