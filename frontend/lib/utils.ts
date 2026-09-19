import { MealType } from "@/schemas/mealFormSchema";

export { cn } from "cn"

export function riskColors(risk: string) {
  if (risk === "HIGH_RISK" || risk === "SEVERE_RISK")
    return {
      bg: "bg-rose-50",
      border: "border-rose-200",
      badge: "bg-rose-100 text-rose-800",
      dot: "bg-rose-500",
    };
  if (risk === "MODERATE_RISK")
    return {
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-800",
      dot: "bg-amber-500",
    };
  return {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
  };
}

export function severityStyle(s: string) {
  const upper = s.toUpperCase();
  if (upper === "SEVERE") return "bg-rose-100 text-rose-800 border-rose-200";
  if (upper === "MODERATE") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export function getDefaultMealType(): MealType {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 11) {
    return "BREAKFAST"; // 4:00 AM - 10:59 AM
  } 
  
  if (hour >= 11 && hour < 16) {
    return "LUNCH"; // 11:00 AM - 3:59 PM
  } 
  
  if (hour >= 16 && hour < 22) {
    return "DINNER"; // 4:00 PM - 9:59 PM
  }

  return "SNACK"; // 10:00 PM - 3:59 AM
}