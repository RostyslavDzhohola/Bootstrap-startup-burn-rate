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
 * No wrappers, no padding, no background - just the clock element.
 */
export default function EmbedClient({
  endDate,
  compact = false,
}: EmbedClientProps) {
  // Parse saved runway end date from database - memoized to prevent infinite loops
  const parsedDate = useMemo(() => {
    if (!endDate) return null;
    const date = new Date(endDate);
    return isNaN(date.getTime()) ? null : date;
  }, [endDate]);

  // Return just the clock component - no wrappers, no padding, no background, no shadows
  return (
    <CountdownTimer
      endDate={parsedDate}
      showEndDate={true}
      compact={compact}
      isEmbed={true}
    />
  );
}
