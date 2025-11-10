"use client";

import { useMemo } from "react";
import CountdownTimer from "@/app/components/calculator/CountdownTimer";

interface EmbedClientProps {
  endDate: string | null;
  name: string;
  transparent?: boolean;
  compact?: boolean;
}

/**
 * Client component for the embed route.
 * Renders ONLY the countdown timer with proper compact/transparent modes.
 * No headers, no page chrome, just the clock component.
 */
export default function EmbedClient({
  endDate,
  name,
  transparent = false,
  compact = false,
}: EmbedClientProps) {
  // Parse saved runway end date from database - memoized to prevent infinite loops
  const parsedDate = useMemo(() => {
    if (!endDate) return null;
    const date = new Date(endDate);
    return isNaN(date.getTime()) ? null : date;
  }, [endDate]);

  // Regular embed: Just clock with minimal padding
  if (!transparent && !compact) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        <CountdownTimer endDate={parsedDate} showEndDate={true} compact={false} />
      </div>
    );
  }

  // Compact mode: Smaller padding, compact clock
  if (!transparent && compact) {
    return (
      <div className="p-2 flex items-center justify-center min-h-[150px]">
        <CountdownTimer endDate={parsedDate} showEndDate={true} compact={true} />
      </div>
    );
  }

  // Transparent & Compact: No wrapper, just clock, transparent background
  if (transparent && compact) {
    return (
      <div className="p-1 flex items-center justify-center">
        <CountdownTimer endDate={parsedDate} showEndDate={true} compact={true} />
      </div>
    );
  }

  // Transparent only (no compact): Minimal padding, transparent background
  return (
    <div className="p-2 flex items-center justify-center min-h-[200px]">
      <CountdownTimer endDate={parsedDate} showEndDate={true} compact={false} />
    </div>
  );
}
