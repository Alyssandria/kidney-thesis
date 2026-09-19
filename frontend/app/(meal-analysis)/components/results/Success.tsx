import { riskColors, severityStyle } from "@/lib/utils";
import { MealAnalysisResponse } from "@/schemas/mealAnalysisResponse";
import { AlertTriangle, ArrowRight, CalendarDays, ChefHat, ShieldAlert, Sparkles, XCircle } from "lucide-react";

export function SuccessPanel({ result, onReset }: { result: MealAnalysisResponse; onReset: () => void }) {
  const colors = riskColors(result.safetyRating);
  const riskLabel = result.safetyRating.replace("_", " ");

  return (
    <div className="flex flex-col gap-4">
      {/* Score Header */}
      <div className={`rounded-2xl border ${colors.bg} ${colors.border} p-5 flex items-center gap-4`}>
        <div className={`w-16 h-16 rounded-2xl ${colors.badge} flex flex-col items-center justify-center shrink-0`}>
          <span className="text-2xl font-bold leading-none">{result.score}</span>
          <span className="text-xs font-medium opacity-80 mt-0.5">/10</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert size={13} className={result.safetyRating === "HIGH_RISK" || result.safetyRating === "CRITICAL_HAZARD" ? "text-rose-600" : "text-amber-600"} />
            <span className={`text-xs font-bold tracking-widest uppercase ${result.safetyRating === "HIGH_RISK" || result.safetyRating === "CRITICAL_HAZARD"  ? "text-rose-700" : "text-amber-700"}`}>
              {riskLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">Renal Safety Score based on your provided clinical context.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Clinical Summary</p>
        <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
      </div>

      {/* Flagged Ingredients */}
      {result.flaggedIngredients.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-xl px-4 py-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Flagged Ingredients</p>
          <div className="flex flex-wrap gap-2">
            {result.flaggedIngredients.map((fi, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${severityStyle(fi.severity)}`}>
                {fi.severity.toUpperCase() === "SEVERE" ? <XCircle size={10} strokeWidth={2.5} /> : <AlertTriangle size={10} strokeWidth={2.5} />}
                {fi.name}
                <span className="opacity-60">· {fi.category}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Advice */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Actionable Advice</p>
        <ul className="space-y-2.5">
          {result.actionableAdvice.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
              <span className="mt-1 w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Substitutes */}
      {result.pinoySubstitutes && result.pinoySubstitutes.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-xl px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat size={13} className="text-slate-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pinoy-Friendly Substitutes</p>
          </div>
          <div className="space-y-3">
            {result.pinoySubstitutes.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="text-xs text-rose-600 font-medium truncate">{s.originalIngredient}</span>
                  <ArrowRight size={11} className="text-slate-300 shrink-0" />
                  <span className="text-xs text-emerald-700 font-medium truncate">{s.suggestedAlternative}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed shrink-0 max-w-[40%] hidden lg:block">{s.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2.5 pt-1">
        <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900 transition-all">
          <CalendarDays size={14} />
          Save to Log
        </button>
        <button type="button" onClick={onReset} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
          <Sparkles size={14} />
          Analyze Another
        </button>
      </div>
    </div>
  );
}