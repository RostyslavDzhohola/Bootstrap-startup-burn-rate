"use client";

interface ResultsSidebarProps {
  currency: string;
  netDailyCents: number;
  netMonthlyCents: number;
  isProfitable: boolean;
  runwayDays: number;
  runwayEndDate: Date | null;
  trimmedCity: string;
  financialSummary: string;
  goAllInGuidance: string;
  riskLevel: "low" | "sweet" | "risky" | "maybe" | "critical";
  isSignedIn: boolean;
  isSaving: boolean;
  startingCashCents: number;
  onSave: () => void;
}

function formatCurrency(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function getRunwayColor(runwayDays: number) {
  if (!isFinite(runwayDays) || runwayDays <= 0) {
    return "text-white";
  }
  if (runwayDays < 90) {
    return "text-red-400";
  }
  if (runwayDays < 180) {
    return "text-orange-400";
  }
  return "text-green-400";
}

function getRiskColor(riskLevel: "low" | "sweet" | "risky" | "maybe" | "critical") {
  switch (riskLevel) {
    case "low":
      return { text: "text-green-400", border: "border-green-400/30" };
    case "sweet":
      return { text: "text-blue-400", border: "border-blue-400/30" };
    case "risky":
      return { text: "text-orange-400", border: "border-orange-400/30" };
    case "maybe":
      return { text: "text-yellow-400", border: "border-yellow-400/30" };
    case "critical":
      return { text: "text-red-400", border: "border-red-400/30" };
    default:
      return { text: "text-slate-200", border: "border-white/10" };
  }
}

function getRiskLabel(riskLevel: "low" | "sweet" | "risky" | "maybe" | "critical") {
  switch (riskLevel) {
    case "low":
      return "Go all-in";
    case "sweet":
      return "Go all-in";
    case "risky":
      return "Risky";
    case "maybe":
      return "Maybe";
    case "critical":
      return "No";
    default:
      return "Go all-in";
  }
}

export default function ResultsSidebar({
  currency,
  netDailyCents,
  netMonthlyCents,
  isProfitable,
  runwayDays,
  runwayEndDate,
  trimmedCity,
  financialSummary,
  goAllInGuidance,
  riskLevel,
  isSignedIn,
  isSaving,
  startingCashCents,
  onSave,
}: ResultsSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl p-4 space-y-4 sticky top-8">
        <h2 className="text-lg font-bold text-white">Results</h2>
        <div className="space-y-3">
          {/* Expenses - Daily and Monthly side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="text-xs font-medium text-slate-300 mb-0.5">
                Expenses (Daily)
              </div>
              <div
                className={`text-xl font-bold ${
                  netDailyCents < 0
                    ? "text-green-400"
                    : netDailyCents > 0
                    ? "text-red-400"
                    : "text-white"
                }`}
              >
                {netDailyCents > 0 ? "-" : ""}
                {formatCurrency(Math.abs(netDailyCents), currency)}
                {isProfitable && (
                  <span className="text-xs ml-1 text-green-300">profit</span>
                )}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="text-xs font-medium text-slate-300 mb-0.5">
                Expenses (Monthly)
              </div>
              <div
                className={`text-xl font-bold ${
                  netMonthlyCents < 0
                    ? "text-green-400"
                    : netMonthlyCents > 0
                    ? "text-red-400"
                    : "text-white"
                }`}
              >
                {netMonthlyCents > 0 ? "-" : ""}
                {formatCurrency(Math.abs(netMonthlyCents), currency)}
                {isProfitable && (
                  <span className="text-xs ml-1 text-green-300">profit</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Runway - Months and Days side by side */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
            <div className="text-xs font-medium text-slate-300 mb-0.5">Runway</div>
            <div className="flex items-baseline gap-3">
              {isFinite(runwayDays) && runwayDays > 0 ? (
                <>
                  <div className={`text-xl font-bold ${getRunwayColor(runwayDays)}`}>
                    {Math.floor(runwayDays / 30)} months
                  </div>
                  <div className="text-sm text-slate-400">
                    ({Math.floor(runwayDays)} days)
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold text-white">∞ (No burn)</div>
              )}
            </div>
          </div>
          
          {/* Runway End Date */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
            <div className="text-xs font-medium text-slate-300 mb-0.5">
              Runway End Date
            </div>
            <div className="text-xl font-bold text-white">
              {runwayEndDate
                ? runwayEndDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Never"}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-slate-200 space-y-2">
          {trimmedCity && (
            <div className="text-xs uppercase tracking-[0.3em] text-blue-200">
              Focus: {trimmedCity}
            </div>
          )}
          <p className="text-xs leading-relaxed">{financialSummary}</p>
        </div>
        <div className={`rounded-lg border ${getRiskColor(riskLevel).border} bg-white/5 p-3 text-slate-200 space-y-2`}>
          <h3 className={`text-xs font-semibold ${getRiskColor(riskLevel).text}`}>
            Decision compass
          </h3>
          <p className="text-xs leading-relaxed">
            <span className={`font-semibold ${getRiskColor(riskLevel).text}`}>
              {getRiskLabel(riskLevel)}:
            </span>{" "}
            {goAllInGuidance}
          </p>
        </div>
        <button
          onClick={onSave}
          disabled={isSaving || startingCashCents === 0}
          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isSaving
            ? "Saving..."
            : isSignedIn
            ? "Save Scenario"
            : "Sign in to save the countdown"}
        </button>
      </div>
    </div>
  );
}

