"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endDate: Date | null;
  showEndDate?: boolean;
  compact?: boolean;
  isEmbed?: boolean;
}

/**
 * Reusable countdown timer component that displays time remaining until a target date.
 * Updates every second and shows years, months, days, hours, minutes, and seconds.
 */
export default function CountdownTimer({
  endDate,
  showEndDate = true,
  compact = false,
  isEmbed = false,
}: CountdownTimerProps) {
  const [countdownTime, setCountdownTime] = useState<{
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

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

  const containerClass = compact ? "p-4 sm:p-6" : "p-6 sm:p-8";
  const gridClass = compact
    ? "grid grid-cols-6 gap-2 sm:gap-3"
    : "grid grid-cols-6 gap-3 sm:gap-4";
  const numberClass = compact
    ? "text-2xl sm:text-3xl md:text-4xl"
    : "text-3xl sm:text-4xl md:text-5xl";

  return (
    <div className="relative mx-auto w-full">
      {/* Glow effect behind - hidden in embed mode */}
      {!isEmbed && (
        <div className="absolute inset-0 bg-linear-to-br from-red-600/20 via-orange-600/20 to-red-800/20 blur-3xl rounded-3xl -z-10"></div>
      )}

      <div
        className={`bg-linear-to-br from-slate-900 via-red-950 to-slate-900 rounded-2xl ${containerClass} border-2 border-red-500/50 ${
          isEmbed
            ? ""
            : "shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
        } relative`}
      >
        {/* End date label in top-right corner */}
        {showEndDate && endDate && (
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

        <div className={gridClass}>
          <div className="flex flex-col items-center">
            <div
              className={`${numberClass} font-bold text-white mb-1 tabular-nums`}
            >
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
            <div
              className={`${numberClass} font-bold text-white mb-1 tabular-nums`}
            >
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
            <div
              className={`${numberClass} font-bold text-white mb-1 tabular-nums`}
            >
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
            <div
              className={`${numberClass} font-bold text-white mb-1 tabular-nums`}
            >
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
            <div
              className={`${numberClass} font-bold text-white mb-1 tabular-nums`}
            >
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
              className={`${numberClass} font-bold mb-1 tabular-nums ${
                countdownTime ? "text-red-400 animate-pulse" : "text-white"
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
  );
}
