import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnalysisResult } from "@/components/meals/AnalysisResult";
import { CONDIMENTS } from "@/lib/constants";
import { MealType } from "@/schemas/mealFormSchema";
import { MealLogDetail } from "@/schemas/mealLogDetail";
import { getMeal } from "@/services/mealService";

export const metadata: Metadata = {
  title: "Saved meal · KidneyCare",
};

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

const savedAtFormat = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Manila",
});

function describeSoup({ isSoup, consumedSoup }: MealLogDetail["meal"]) {
  if (!isSoup) return "Not a soup";
  return consumedSoup ? "Soup, broth consumed" : "Soup, broth not consumed";
}

function condimentLabel(id: string) {
  return CONDIMENTS.find((condiment) => condiment.id === id)?.label ?? id;
}

export default async function SavedMealPage({ params }: PageProps<"/meals/[id]">) {
  const { id } = await params;
  const saved = await getMeal(id);

  if (!saved) {
    notFound();
  }

  const { meal, patientDetails, analysis } = saved;

  const details = [
    { label: "Meal type", value: meal.mealType ? MEAL_TYPE_LABELS[meal.mealType] : "Not specified" },
    { label: "Soup", value: describeSoup(meal) },
    {
      label: "Condiments",
      value: meal.condiments.length > 0 ? meal.condiments.map(condimentLabel).join(", ") : "None",
    },
    {
      label: "Analyzed for",
      value: `CKD stage ${patientDetails.ckdStage} · ${patientDetails.isDialysis ? "On dialysis" : "Not on dialysis"}`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-3xl mx-auto px-5 py-7 flex flex-col gap-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 self-start rounded text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Log a meal
        </Link>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 flex flex-col gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Saved meal</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              <time dateTime={saved.createdAt}>{savedAtFormat.format(new Date(saved.createdAt))}</time>
            </p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{meal.description}</p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {details.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
                <dd className="text-sm text-slate-800 mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-label="Analysis">
          <AnalysisResult result={analysis} />
        </section>
      </main>
    </div>
  );
}
