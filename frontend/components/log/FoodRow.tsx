import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { HIGH_SHARE, highNutrients, isLowSodium } from "@/lib/foodFlags";
import { NUTRIENT_LABELS, NUTRIENT_SHORT_LABELS, formatAmount } from "@/lib/nutrients";
import type { Food } from "@/schemas/foods";
import type { FoodCategory, NutrientAmounts } from "@/schemas/nutrition";

const CATEGORY_TONES: Record<FoodCategory, string> = {
  GRAINS: "bg-warn-soft text-warn",
  PROTEIN: "bg-crit-soft text-destructive",
  VEGETABLES: "bg-ok-soft text-ok",
  FRUIT: "bg-accent text-accent-foreground",
  SOUPS: "bg-info-soft text-info",
  PROCESSED: "bg-muted text-muted-foreground",
  BEVERAGES: "bg-brand-soft text-primary",
  MIXED_DISHES: "bg-secondary text-foreground",
};

const CHIP = "h-6 rounded-md px-2 text-xs font-semibold";

export function FoodRow({
  food,
  references,
  action,
}: {
  food: Food;
  references: NutrientAmounts;
  action?: ReactNode;
}) {
  const high = highNutrients(food, references);
  const { nutrients: n } = food;

  return (
    <div className="flex items-start gap-3 py-3.5">
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg font-heading text-base font-bold ${CATEGORY_TONES[food.category]}`}
        aria-hidden="true"
      >
        {food.name.charAt(0)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div>
          <p className="font-semibold leading-snug">{food.name}</p>
          <p className="text-[13px] text-muted-foreground">
            {formatAmount("ENERGY", food.serving.size)} {food.serving.unit} ·{" "}
            {formatAmount("ENERGY", n.energyKcal)} kcal
          </p>
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label="Per serving">
          <li><Badge variant="secondary" className={CHIP}>{NUTRIENT_SHORT_LABELS.SODIUM} {formatAmount("SODIUM", n.sodiumMg)} mg</Badge></li>
          <li><Badge variant="secondary" className={CHIP}>{NUTRIENT_SHORT_LABELS.POTASSIUM} {formatAmount("POTASSIUM", n.potassiumMg)} mg</Badge></li>
          <li><Badge variant="secondary" className={CHIP}>{NUTRIENT_SHORT_LABELS.PHOSPHORUS} {formatAmount("PHOSPHORUS", n.phosphorusMg)} mg</Badge></li>
          <li><Badge variant="secondary" className={CHIP}>Protein {formatAmount("PROTEIN", n.proteinG)} g</Badge></li>
          {isLowSodium(food) && (
            <li><Badge className={`${CHIP} bg-ok-soft text-ok`}>Low sodium</Badge></li>
          )}
          {high.map((nutrient) => (
            <li key={nutrient}>
              <Badge
                className={`${CHIP} bg-warn-soft text-warn`}
                title={`One serving is ${HIGH_SHARE * 100}% or more of your daily ${NUTRIENT_LABELS[nutrient].toLowerCase()} reference`}
              >
                High {NUTRIENT_LABELS[nutrient].toLowerCase()}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
      {action}
    </div>
  );
}
