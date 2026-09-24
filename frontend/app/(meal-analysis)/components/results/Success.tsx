import { AnalysisResult } from "@/components/meals/AnalysisResult";
import { MealAnalysisResponse } from "@/schemas/mealAnalysisResponse";
import { MutationStatus } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, Loader2, Sparkles } from "lucide-react";

type SuccessPanelProps = {
  result: MealAnalysisResponse;
  onReset: () => void;
  onSave: () => void;
  saveStatus: MutationStatus;
};

export function SuccessPanel({ result, onReset, onSave, saveStatus }: SuccessPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <AnalysisResult result={result} />

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex gap-2.5">
          {saveStatus === "success" ? (
            <p className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              <CheckCircle2 size={14} aria-hidden="true" />
              Saved to Log
            </p>
          ) : (
            <button
              type="button"
              onClick={onSave}
              disabled={saveStatus === "pending"}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900 transition-all disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saveStatus === "pending" ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                <CalendarDays size={14} aria-hidden="true" />
              )}
              {saveStatus === "pending" ? "Saving…" : "Save to Log"}
            </button>
          )}
          <button type="button" onClick={onReset} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            <Sparkles size={14} />
            Analyze Another
          </button>
        </div>
        <p role="status" className="min-h-4 text-xs">
          {saveStatus === "success" && (
            <span className="text-emerald-700">This meal is now in your log.</span>
          )}
          {saveStatus === "error" && (
            <span className="text-rose-700">We couldn&apos;t save this meal. Please try again.</span>
          )}
        </p>
      </div>
    </div>
  );
}