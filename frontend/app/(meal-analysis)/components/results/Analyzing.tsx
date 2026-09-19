import { ANALYSIS_STEPS } from "@/lib/constants";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function AnalyzingPanel() {
  const [step, setStep] = useState(0);

  // Visual fake progress for the loading state
  useEffect(() => {
    if (step < ANALYSIS_STEPS.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), 1500);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
          <Loader2 size={16} className="text-emerald-600 animate-spin" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Analyzing Pinoy Ingredients
          </p>
          <p className="text-xs text-slate-400">
            Checking against clinical rules…
          </p>
        </div>
      </div>
      <div className="space-y-2.5">
        {ANALYSIS_STEPS.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${i < step ? "border-emerald-200 bg-emerald-50" : i === step ? "border-emerald-300 bg-emerald-50 shadow-sm" : "border-slate-100 bg-white"}`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i < step ? "bg-emerald-500" : i === step ? "bg-emerald-200" : "bg-slate-100"}`}
            >
              {i < step ? (
                <CheckCircle size={12} className="text-white" strokeWidth={3} />
              ) : i === step ? (
                <Loader2 size={10} className="text-emerald-700 animate-spin" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              )}
            </div>
            <p
              className={`text-xs leading-snug ${i <= step ? "text-slate-700 font-medium" : "text-slate-400"}`}
            >
              {s}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
