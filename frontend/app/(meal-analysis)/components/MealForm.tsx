"use client"

import { Switch } from "@/components/ui/switch";
import { CONDIMENTS, MEAL_TYPES } from "@/lib/constants";
import { CheckCircle, Soup, Sparkles } from "lucide-react";
import { useState } from "react";

export function MealInputForm() {
  //   const disabled = appState === "analyzing";
  //   const hasHighSodium = [...condiments].some((id) =>
  //     ["patis", "bagoong", "soy-sauce", "salt"].includes(id),
  //   );
  //   const showWarning = hasHighSodium || drankBroth;

  const [condiments, setCondiments] = useState<Set<string>>(new Set());

  function toggleCondiment(id: string) {
    setCondiments((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div
    //   className={`flex flex-col gap-5 transition-opacity duration-300 ${
    //     disabled ? "opacity-50 pointer-events-none select-none" : ""
    //   }`}
      className={`flex flex-col gap-5 transition-opacity duration-300`}
    >
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Meal Type
        </p>
        <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
          {MEAL_TYPES.map(({ type, icon }) => (
            <button
              key={type}
              type="button"
            //   onClick={() => setMealType(type)}
            //   className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            //     mealType === type
            //       ? "bg-white text-slate-800 shadow-sm"
            //       : "text-slate-500 hover:text-slate-700"
            //   }`}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            >
              <span className="text-base">{icon}</span>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="meal-desc"
          className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
        >
          What did you eat?
        </label>
        <textarea
          id="meal-desc"
          rows={4}
          //   value={description}
          //   onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., 1 bowl of Sinigang na Baboy with 1 cup white rice and kangkong"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent leading-relaxed"
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Be specific with Pinoy dish names and portion sizes.
        </p>
      </div>

      {/* Condiments */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Sawsawan &amp; Condiments
        </p>
        <p className="text-xs text-slate-400 mb-2.5">
          Select all dipping sauces used.
        </p>
        <div className="flex flex-wrap gap-2">
          {CONDIMENTS.map((c) => {
            const active = condiments.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCondiment(c.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  active
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                {active && <CheckCircle size={10} strokeWidth={3} />}
                {c.label}
              </button>
            );
          })}
        </div>
        {/* {showWarning && (
          <div className="mt-3 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5">
            <AlertTriangle
              size={13}
              className="text-amber-600 mt-0.5 shrink-0"
            />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong className="font-semibold">High sodium alert.</strong>{" "}
              These selections may significantly exceed your daily sodium limit.
              The AI will flag these for dietitian review.
            </p>
          </div>
        )} */}
      </div>

      <div className="flex items-center justify-between gap-4 py-0.5">
        <div className="flex items-center gap-1.5">
          <Soup size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700">
            Did you consume the soup/broth?
          </span>
          {/* <Tooltip text="Broth concentrates sodium and potassium." /> */}
        </div>
        {/* <Toggle checked={drankBroth} onChange={setDrankBroth} /> */}
        <Switch />
      </div>
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          //   onClick={onAnalyze}
          //   disabled={!description.trim()}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Sparkles size={15} />
          Analyze Meal with AI
        </button>
      </div>
    </div>
  );
}
