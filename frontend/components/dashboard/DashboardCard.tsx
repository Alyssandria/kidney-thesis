import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardCardProps = {
  /** Used to build the heading id that labels the card. */
  id: string;
  title: string;
  description?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function DashboardCard({ id, title, description, contentClassName, children }: DashboardCardProps) {
  const headingId = `${id}-heading`;
  return (
    <Card
      role="region"
      aria-labelledby={headingId}
      className="gap-4 rounded-xl py-5 shadow-card ring-border"
    >
      <CardHeader className="px-5">
        <CardTitle>
          <h2 id={headingId} className="font-sans text-base font-bold">
            {title}
          </h2>
        </CardTitle>
        {description && (
          <CardDescription className="text-[13px]">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-4 px-5", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
