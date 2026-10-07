"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ChartColumn, House, Leaf, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: House },
  { href: "/history", label: "History", icon: CalendarDays },
  { href: "/patterns", label: "Patterns", icon: ChartColumn },
  { href: "/meals/new", label: "Analyze a meal", icon: Plus },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const closeOnMobile = () => setOpenMobile(false);

  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-6 pb-2">
        <Link
          href="/"
          onClick={closeOnMobile}
          className="flex items-center gap-3 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <Leaf size={22} strokeWidth={2.2} />
          </span>
          <span className="flex flex-col">
            <span className="font-heading text-[19px] font-bold leading-tight tracking-tight">K-WAIS</span>
            <span className="text-xs font-medium text-muted-foreground">Meal companion</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={
                        <Link
                          href={href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={closeOnMobile}
                        />
                      }
                      className="h-11 gap-3 rounded-lg px-3.5 text-[15px] font-semibold text-muted-foreground hover:text-foreground data-active:font-bold [&_svg]:size-5"
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <p className="px-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          K-WAIS explains meals. It doesn&apos;t diagnose or replace your doctor or renal
          dietitian.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
