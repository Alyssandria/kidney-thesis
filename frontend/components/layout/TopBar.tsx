import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-15 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-md md:px-8">
      <SidebarTrigger className="size-11 md:hidden" />
      <span className="font-heading text-base font-bold md:hidden">K-WAIS</span>
      <div className="flex-1" />
      <Link
        href="/meals/new"
        className={buttonVariants({ className: "h-10 rounded-lg px-3.5 font-semibold" })}
      >
        <Plus aria-hidden="true" />
        Log food
      </Link>
    </header>
  );
}
