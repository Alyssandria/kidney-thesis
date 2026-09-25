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
import { dmSans } from "@/lib/fonts";

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
    <Sidebar className={dmSans.className}>
      <SidebarHeader className="px-4 pt-6 pb-2">
        <Link
          href="/"
          onClick={closeOnMobile}
          className="flex items-center gap-3 rounded-xl px-1 text-kc-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-primary"
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-kc-coral-bg"
            aria-hidden="true"
          >
            <Leaf size={22} strokeWidth={2.2} />
          </span>
          <span className="flex flex-col">
            <span className="text-[19px] font-extrabold leading-tight tracking-tight">KidneyCare</span>
            <span className="text-xs font-medium text-kc-subtle">Meal companion</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-[0.1em] text-kc-subtle">
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
                      className="h-11 gap-3 rounded-xl px-3.5 text-[15px] text-kc-ink-soft data-active:font-bold data-active:text-kc-ink [&_svg]:size-5"
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
        <p className="px-1.5 text-[12.5px] leading-relaxed text-kc-subtle">
          KidneyCare explains meals. It doesn&apos;t diagnose or replace your doctor or renal
          dietitian.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
