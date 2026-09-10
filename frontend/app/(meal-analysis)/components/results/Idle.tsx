import { ChefHat, Flame, Leaf, ShieldAlert } from "lucide-react";

export function IdlePanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-64 gap-4 text-center py-8">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
        <Leaf size={22} className="text-emerald-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">
          Ready to Analyze
        </p>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Fill in your meal details on the left, then hit{" "}
          <strong className="text-slate-600">Analyze Meal with AI</strong> to
          receive a personalized renal safety assessment.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs mt-2">
        {[
          {
            icon: <Flame size={12} />,
            label: "Nutrient Flags",
            color: "text-rose-500 bg-rose-50 border-rose-100",
          },
          {
            icon: <ChefHat size={12} />,
            label: "Pinoy Swaps",
            color: "text-emerald-600 bg-emerald-50 border-emerald-100",
          },
          {
            icon: <ShieldAlert size={12} />,
            label: "Risk Score",
            color: "text-amber-600 bg-amber-50 border-amber-100",
          },
        ].map(({ icon, label, color }) => (
          <div
            key={label}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium ${color}`}
          >
            {icon}
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}