"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import CountdownTimer from "@/app/components/calculator/CountdownTimer";

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
  const [showEmbedCode, setShowEmbedCode] = useState(false);

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

  // Generate embed URL
  const generateEmbedUrl = (options: {
    transparent?: boolean;
    compact?: boolean;
  }) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams();
    if (options.transparent) params.set("transparent", "true");
    if (options.compact) params.set("compact", "true");
    const queryString = params.toString();
    return `${baseUrl}/embed/${scenario.id}${
      queryString ? `?${queryString}` : ""
    }`;
  };

  // Generate embed code for iframe (for websites/HTML editors)
  const generateEmbedCode = (options: {
    transparent?: boolean;
    compact?: boolean;
  }) => {
    const embedUrl = generateEmbedUrl(options);
    return `<iframe src="${embedUrl}" width="100%" height="300" frameborder="0" style="border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></iframe>`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center overflow-hidden py-8">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        {/* Calculator Focus */}
        <div className="text-center space-y-6 w-full">
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
          <div className="relative mx-auto w-full flex justify-center">
            <CountdownTimer endDate={endDate} showEndDate={true} />
          </div>

          {/* Embed Code Generator */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowEmbedCode(!showEmbedCode)}
              className="px-6 py-3 bg-linear-to-br from-slate-900 via-red-950 to-slate-900 text-white rounded-lg font-medium transition-all duration-300 border-2 border-red-500/50 shadow-[0_8px_24px_rgba(0,0,0,0.4),0_0_20px_rgba(239,68,68,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_30px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
            >
              {showEmbedCode ? "Hide" : "Get"} Embed Code
            </button>

            {showEmbedCode && (
              <div className="mt-4 space-y-4">
                {/* Notion Embed Section */}
                <div className="bg-slate-800 rounded-lg p-4 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400 font-semibold">
                      For Notion (Copy URL)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          generateEmbedUrl({
                            transparent: false,
                            compact: false,
                          })
                        );
                        toast.success(
                          "Embed URL copied! Paste into Notion's embed block."
                        );
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Copy URL
                    </button>
                  </div>
                  <code className="text-xs text-slate-300 break-all block mb-2">
                    {generateEmbedUrl({ transparent: false, compact: false })}
                  </code>
                  <p className="text-xs text-slate-500 mt-2">
                    In Notion: Type &quot;/embed&quot; → Paste this URL → Press
                    Enter
                  </p>
                </div>

                {/* HTML iframe for websites */}
                <div className="bg-slate-800 rounded-lg p-4 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400 font-semibold">
                      For Websites (HTML iframe)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          generateEmbedCode({
                            transparent: false,
                            compact: false,
                          })
                        );
                        toast.success("HTML code copied to clipboard!");
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Copy HTML
                    </button>
                  </div>
                  <code className="text-xs text-slate-300 break-all block">
                    {generateEmbedCode({ transparent: false, compact: false })}
                  </code>
                </div>

                <p className="text-sm text-slate-600">
                  For Notion: Copy the URL and paste it into Notion&apos;s embed
                  block (type &quot;/embed&quot;). For websites: Copy the HTML
                  iframe code.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
