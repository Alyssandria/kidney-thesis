"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Soup, CheckCircle2, AlertTriangle } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { CONDIMENTS, MEAL_TYPES } from "@/lib/constants";
import { MealFormValues, MealSchema, MealType } from "@/schemas/mealFormSchema";
import { useAnalyzeMeal } from "@/hooks/mutations/useAnalyzeMeal";
import { useSaveMeal } from "@/hooks/mutations/useSaveMeal";
import { IdlePanel } from "./results/Idle";
import { AnalyzingPanel } from "./results/Analyzing";
import { ErrorPanel } from "./results/Error";
import { SuccessPanel } from "./results/Success";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDefaultMealType } from "@/lib/utils";

export function MealInputForm() {
  const router = useRouter();

  const {
    mutateAsync: analyzeMeal,
    data: analysisData,
    variables: analyzedValues,
    isPending,
    isSuccess,
    isError,
    reset: resetMutation,
  } = useAnalyzeMeal();

  const {
    mutate: saveMeal,
    status: saveStatus,
    reset: resetSave,
  } = useSaveMeal();

  const { control, handleSubmit, watch } = useForm<MealFormValues>({
    resolver: zodResolver(MealSchema),
    defaultValues: {
      description: "",
      mealType: getDefaultMealType(),
      isSoup: false,
      consumedSoup: false,
      ingredients: [],
      ckdStage: 4, // Consider passing this from an Auth/Patient Context
      isDialysis: false,
    },
  });

  const selectedIngredients = watch("ingredients");
  const consumedSoup = watch("consumedSoup");

  const hasHighSodium = selectedIngredients.some((id) =>
    ["patis", "bagoong", "soy-sauce", "salt"].includes(id),
  );
  const showWarning = hasHighSodium || consumedSoup;

  const onSubmit = async (values: MealFormValues) => {
    resetSave();
    await analyzeMeal(values);
  };

  // Save the values that were analyzed, not the current form state,
  // which the user may have edited since.
  const onSave = () => {
    if (!analysisData || !analyzedValues) return;
    saveMeal(
      { values: analyzedValues, analysis: analysisData },
      { onSuccess: ({ id }) => router.push(`/meals/${id}?saved=1`) },
    );
  };

  const onReset = () => {
    resetSave();
    resetMutation();
  };

  return (
    <div className="flex-1">
      <main className="max-w-5xl mx-auto px-5 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-5 items-start">
          {/* LEFT PANEL: Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50">
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                Log a Meal
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Real-time renal safety analysis for every bite.
              </p>
            </div>
            <div className="px-6 py-5">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={`flex flex-col gap-5 transition-opacity duration-300 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
              >
                {/* Meal Type */}
                <Controller
                  name="mealType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Meal Type
                      </FieldLabel>
                      <FieldContent>
                        <div
                          className="grid grid-cols-4 gap-1.5 rounded-xl bg-slate-100 p-1"
                          role="group"
                          aria-label="Meal type"
                          aria-invalid={fieldState.invalid}
                        >
                          {MEAL_TYPES.map(({ type, icon }) => {
                            const active =
                              field.value === (type as MealType | undefined);
                            return (
                              <button
                                key={type}
                                type="button"
                                aria-pressed={active}
                                onClick={() => field.onChange(type)}
                                className={`flex flex-col items-center gap-1 rounded-lg py-2.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${active ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                              >
                                <span className="text-base">{icon}</span>
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Description */}
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="meal-description"
                        className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                      >
                        What did you eat?
                      </FieldLabel>
                      <FieldContent>
                        <Textarea
                          {...field}
                          id="meal-description"
                          rows={4}
                          placeholder="e.g., 1 bowl of Sinigang na Baboy with 1 cup white rice"
                          aria-invalid={fieldState.invalid}
                          className="resize-none rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500"
                        />
                        <FieldDescription className="text-xs text-slate-400">
                          Be specific with Pinoy dish names and portion sizes.
                        </FieldDescription>
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Condiments */}
                <Controller
                  name="ingredients"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Sawsawan & Condiments
                      </FieldLabel>
                      <FieldDescription className="text-xs text-slate-400">
                        Select all dipping sauces used.
                      </FieldDescription>
                      <FieldContent>
                        <div
                          className="flex flex-wrap gap-2"
                          role="group"
                          aria-label="Sawsawan and condiments"
                          aria-invalid={fieldState.invalid}
                        >
                          {CONDIMENTS.map((condiment) => {
                            const active = field.value.includes(condiment.id);
                            const toggleCondiment = () => {
                              if (active) {
                                field.onChange(
                                  field.value.filter(
                                    (id) => id !== condiment.id,
                                  ),
                                );
                              } else {
                                field.onChange([...field.value, condiment.id]);
                              }
                            };
                            return (
                              <button
                                key={condiment.id}
                                type="button"
                                aria-pressed={active}
                                onClick={toggleCondiment}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${active ? "border-slate-800 bg-slate-800 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800"}`}
                              >
                                {active && (
                                  <CheckCircle2
                                    size={10}
                                    strokeWidth={3}
                                    aria-hidden="true"
                                  />
                                )}
                                {condiment.label}
                              </button>
                            );
                          })}
                        </div>
                        {showWarning && (
                          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5">
                            <AlertTriangle
                              size={13}
                              className="mt-0.5 shrink-0 text-amber-600"
                            />
                            <p className="text-xs leading-relaxed text-amber-700">
                              <strong className="font-semibold">
                                High sodium alert.
                              </strong>{" "}
                              These selections significantly increase sodium
                              load.
                            </p>
                          </div>
                        )}
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Soup Check */}
                <Controller
                  name="isSoup"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldLabel className="cursor-pointer text-sm font-medium text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <Soup
                              size={14}
                              className="shrink-0 text-slate-400"
                              aria-hidden="true"
                            />
                            Is this a soup or broth-based meal?
                          </span>
                        </FieldLabel>
                        <FieldDescription className="text-xs text-slate-400">
                          Identifies meals where broth may affect the renal
                          analysis.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Consumed Soup Check */}
                {watch("isSoup") && (
                  <Controller
                    name="consumedSoup"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel className="cursor-pointer text-sm font-medium text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Soup
                                size={14}
                                className="shrink-0 text-slate-400"
                                aria-hidden="true"
                              />
                              Did you consume the broth?
                            </span>
                          </FieldLabel>
                          <FieldDescription className="text-xs text-slate-400">
                            Broth concentrates leached sodium and potassium.
                          </FieldDescription>
                        </FieldContent>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    <Sparkles size={15} aria-hidden="true" />
                    {isPending ? "Analyzing..." : "Analyze Meal with AI"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT PANEL: Results */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-20">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {!isPending && !isSuccess && !isError && "AI Analysis"}
                  {isPending && "Processing…"}
                  {isSuccess && "Analysis Results"}
                  {isError && "Analysis Failed"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isSuccess
                    ? "Personalized for your CKD Stage"
                    : "Your renal safety report will appear here."}
                </p>
              </div>
            </div>

            {/* Wrap the content states in the ScrollArea */}
            <ScrollArea className="h-[calc(100vh-15rem)]">
              <div className="px-6 py-5">
                {!isPending && !isSuccess && !isError && <IdlePanel />}
                {isPending && <AnalyzingPanel />}
                {isError && <ErrorPanel onReset={onReset} />}
                {isSuccess && analysisData && (
                  <SuccessPanel
                    result={analysisData}
                    onReset={onReset}
                    onSave={onSave}
                    saveStatus={saveStatus}
                  />
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
}
