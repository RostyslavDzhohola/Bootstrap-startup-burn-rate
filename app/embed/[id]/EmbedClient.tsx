"use client";

import CountdownTimer from "@/app/components/calculator/CountdownTimer";

interface EmbedClientProps {
  endDate: string | null;
  name: string;
  transparent?: boolean;
  compact?: boolean;
}

/**
 * Client component for the embed route.
 * Renders the countdown timer with optional transparent background and compact sizing.
 */
export default function EmbedClient({
  endDate,
  name,
  transparent = false,
  compact = false,
}: EmbedClientProps) {
  const parsedDate = endDate ? new Date(endDate) : null;

  const bgClass = transparent
    ? ""
    : "bg-linear-to-br from-slate-50 via-white to-blue-50";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${bgClass}`}
    >
      <div className="w-full max-w-3xl">
        {!transparent && (
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
            {name}
          </h2>
        )}
        <CountdownTimer
          endDate={parsedDate}
          showEndDate={!transparent}
          compact={compact}
        />
      </div>
    </div>
  );
}
