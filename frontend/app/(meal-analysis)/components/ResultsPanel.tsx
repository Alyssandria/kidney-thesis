import { Skeleton } from "@/components/ui/skeleton";
import { ANALYSIS_STEPS } from "@/lib/constants";
import { CheckCircle, Loader2 } from "lucide-react";

export function ResultsPanel({ step }: { step: number }) {
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
            Checking against CKD Stage 4 clinical rules…
          </p>
        </div>
      </div>

      {/* Step list */}
      <div className="space-y-2.5">
        {ANALYSIS_STEPS.map((steps, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${
              index < step
                ? "border-emerald-200 bg-emerald-50"
                : index === step
                  ? "border-emerald-300 bg-emerald-50 shadow-sm"
                  : "border-slate-100 bg-white"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                index < step
                  ? "bg-emerald-500"
                  : index === step
                    ? "bg-emerald-200"
                    : "bg-slate-100"
              }`}
            >
              {index < step ? (
                <CheckCircle
                  size={12}
                  className="text-white"
                  strokeWidth={3}
                />
              ) : index === step ? (
                <Loader2 size={10} className="text-emerald-700 animate-spin" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              )}
            </div>
            <p
              className={`text-xs leading-snug ${
                index <= step ? "text-slate-700 font-medium" : "text-slate-400"
              }`}
            >
              {steps}
            </p>
          </div>
        ))}
      </div>

      {/* Skeleton cards */}
      <div className="space-y-3 mt-1">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white border border-slate-100 rounded-xl p-4 animate-pulse space-y-2.5"
          >
            <Skeleton className="h-3 w-2/5 rounded"/>
            <Skeleton className="h-3 w-2/5 rounded"/>
            <Skeleton className="h-3 w-2/5 rounded"/>
          </div>
        ))}
      </div>
    </div>
  )
}