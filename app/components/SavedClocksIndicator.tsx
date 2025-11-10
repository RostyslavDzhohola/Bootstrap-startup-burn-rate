"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { FaClock } from "react-icons/fa";
import { getUserClocks } from "@/app/actions";

export default function SavedClocksIndicator() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [scenarios, setScenarios] = useState<
    Array<{ id: string; name: string; runwayEndDate: string | null }>
  >([]);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    const fetchClocks = async () => {
      try {
        const userClocks = await getUserClocks();
        setScenarios(userClocks);
      } catch (error) {
        console.error("Failed to fetch clocks:", error);
      }
    };

    fetchClocks();
  }, [isSignedIn]);

  const handleClick = () => {
    if (scenarios.length > 0) {
      // Navigate to the most recent clock (first in the list)
      router.push(`/s/${scenarios[0].id}`);
    }
  };

  // Only show on home page
  if (pathname !== "/" || !isSignedIn || scenarios.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={handleClick}
          className="w-12 h-12 rounded-full bg-slate-900 text-white shadow-lg transition-all flex items-center justify-center cursor-pointer"
          aria-label="Saved clocks"
        >
          <FaClock className="text-lg" />
        </button>
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
            Go to your saved clock
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}
