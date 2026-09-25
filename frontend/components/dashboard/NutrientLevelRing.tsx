"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { describeRing, type NutrientRing } from "@/lib/nutrientPatterns";

const chartConfig = {
  high: { label: "High or very high", color: "var(--color-kc-level-high)" },
  moderate: { label: "Moderate", color: "var(--color-kc-level-moderate)" },
  rest: { label: "Low", color: "var(--color-kc-mist)" },
} satisfies ChartConfig;

export function NutrientLevelRing({ ring }: { ring: NutrientRing }) {
  const data = [
    { level: "high", meals: ring.highOrAbove, fill: "var(--color-high)" },
    { level: "moderate", meals: ring.moderate, fill: "var(--color-moderate)" },
    { level: "rest", meals: ring.rest, fill: "var(--color-rest)" },
  ].filter((segment) => segment.meals > 0);

  return (
    <figure className="flex flex-col items-center gap-2">
      <ChartContainer
        config={chartConfig}
        role="img"
        aria-label={describeRing(ring)}
        className="aspect-square w-[110px]"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="level" />} />
          <Pie
            data={data}
            dataKey="meals"
            nameKey="level"
            innerRadius={38}
            outerRadius={50}
            startAngle={90}
            endAngle={-270}
            paddingAngle={data.length > 1 ? 2 : 0}
            stroke="none"
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) - 2}
                      className="fill-kc-ink text-[22px] font-extrabold"
                    >
                      {ring.highOrAbove + ring.moderate}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 15}
                      className="fill-kc-subtle text-[11px] font-semibold"
                    >
                      of {ring.total}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <figcaption className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-[15px] font-bold">{ring.label}</span>
        <span className="text-[12.5px] text-kc-muted">
          {ring.highOrAbove} high+ · {ring.moderate} moderate
        </span>
      </figcaption>
    </figure>
  );
}
