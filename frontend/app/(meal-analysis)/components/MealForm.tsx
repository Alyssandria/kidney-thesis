"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Sparkles, Soup } from "lucide-react";

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

export function MealInputForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MealFormValues>({
    resolver: zodResolver(MealSchema),
    defaultValues: {
      description: "",
      mealType: undefined,
      isSoup: false,
      consumedSoup: false,
      ingredients: [],
      ckdStage: 1,
      isDialysis: false,
    },
  });

  console.log(process.env.NEXT_PUBLIC_API_URL);

  const { mutateAsync : analyzeMeal } = useAnalyzeMeal();

  function onSubmit(values: MealFormValues) {
    console.log("Meal submitted:", values);
    analyzeMeal(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <Controller
        name="mealType"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
          >
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
                  const active = field.value === type as  MealType | undefined;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={active}
                      onClick={() => field.onChange(type)}
                      className={`flex flex-col items-center gap-1 rounded-lg py-2.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${ active ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700" }`}
                    >
                      <span className="text-base">
                        {icon}
                      </span>

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
                placeholder="e.g., 1 bowl of Sinigang na Baboy with 1 cup white rice and kangkong"
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
      <Controller
        name="ingredients"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sawsawan &amp; Condiments
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
                  const active = field.value.includes(
                    condiment.id,
                  );

                  const toggleCondiment = () => {
                    if (active) {
                      field.onChange(
                        field.value.filter(
                          (id) => id !== condiment.id,
                        ),
                      );
                    } else {
                      field.onChange([
                        ...field.value,
                        condiment.id,
                      ]);
                    }
                  };

                  return (
                    <button
                      key={condiment.id}
                      type="button"
                      aria-pressed={active}
                      onClick={toggleCondiment}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${ active ? "border-slate-800 bg-slate-800 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800" }`}
                    >
                      {active && (
                        <CheckCircle
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
            </FieldContent>

            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
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
                Identifies meals where broth may affect the renal analysis.
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

                  Did you consume the soup/broth?
                </span>
              </FieldLabel>

              <FieldDescription className="text-xs text-slate-400">
                Broth consumption can be relevant to the nutritional analysis.
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
      <Controller
        name="ckdStage"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              CKD Stage
            </FieldLabel>

            <FieldDescription className="text-xs text-slate-400">
              Select your current CKD stage.
            </FieldDescription>

            <FieldContent>
              <div
                className="grid grid-cols-5 gap-2"
                role="group"
                aria-label="CKD stage"
                aria-invalid={fieldState.invalid}
              >
                {[1, 2, 3, 4, 5].map((stage) => {
                  const active = field.value === stage;

                  return (
                    <button
                      key={stage}
                      type="button"
                      aria-pressed={active}
                      onClick={() => field.onChange(stage)}
                      className={`rounded-lg border py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${ active ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300" }`}
                    >
                      {stage}
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
      <Controller
        name="isDialysis"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            orientation="horizontal"
            data-invalid={fieldState.invalid}
          >
            <FieldContent>
              <FieldLabel className="cursor-pointer text-sm font-medium text-slate-700">
                Currently on dialysis?
              </FieldLabel>

              <FieldDescription className="text-xs text-slate-400">
                This helps personalize the nutritional analysis.
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
      <div className="pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Sparkles
            size={15}
            aria-hidden="true"
          />

          {isSubmitting
            ? "Analyzing..."
            : "Analyze Meal with AI"}
        </button>
      </div>
    </form>
  );
}
