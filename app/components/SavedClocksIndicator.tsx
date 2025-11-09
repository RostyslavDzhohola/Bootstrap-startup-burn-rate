"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import { getUserScenarios } from "@/app/actions";

export default function SavedClocksIndicator() {
  const { isSignedIn } = useUser();
  const [scenarios, setScenarios] = useState<
    Array<{ id: string; name: string; runwayEndDate: string | null }>
  >([]);
  const [showList, setShowList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    const fetchScenarios = async () => {
      setIsLoading(true);
      try {
        const userScenarios = await getUserScenarios();
        setScenarios(userScenarios);
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, [isSignedIn]);

  if (!isSignedIn || scenarios.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="relative"
        onMouseEnter={() => setShowList(true)}
        onMouseLeave={() => setShowList(false)}
      >
        <button
          className="w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          aria-label="Saved clocks"
        >
          <FaClock className="text-lg" />
        </button>

        {showList && scenarios.length > 0 && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Saved Clocks
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  Loading...
                </div>
              ) : scenarios.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No saved clocks
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {scenarios.map((scenario) => (
                    <li key={scenario.id}>
                      <Link
                        href={`/s/${scenario.id}`}
                        className="block p-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="text-sm font-medium text-slate-900">
                          {scenario.name}
                        </div>
                        {scenario.runwayEndDate && (
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(
                              scenario.runwayEndDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
