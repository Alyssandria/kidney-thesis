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
      className="gap-4 rounded-[26px] bg-white py-6 text-kc-ink shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-0"
    >
      <CardHeader className="px-5 sm:px-7">
        <CardTitle>
          <h2 id={headingId} className="text-[19px] font-bold">
            {title}
          </h2>
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-kc-subtle">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-4 px-5 sm:px-7", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
