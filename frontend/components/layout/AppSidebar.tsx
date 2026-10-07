"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ChartColumn, LayoutDashboard, Leaf } from "lucide-react";
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

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const NAV_SECTIONS: { label?: string; items: NavItem[] }[] = [
  { items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Diet management",
    items: [
      { href: "/history", label: "Meal history", icon: CalendarDays },
      { href: "/patterns", label: "Patterns", icon: ChartColumn },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const closeOnMobile = () => setOpenMobile(false);

  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-5 pb-3">
        <Link
          href="/"
          onClick={closeOnMobile}
          className="flex items-center gap-2.5 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <Leaf size={20} strokeWidth={2.2} />
          </span>
          <span className="flex flex-col">
            <span className="font-heading text-[19px] font-bold leading-tight tracking-tight">K-WAIS</span>
            <span className="text-xs font-medium text-muted-foreground">Patient workspace</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2">
        {NAV_SECTIONS.map((section, index) => (
          <SidebarGroup key={section.label ?? index} className="py-1">
            {section.label && (
              <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {section.items.map(({ href, label, icon: Icon }) => {
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
                        className="h-10 gap-2.5 rounded-lg px-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground [&_svg]:size-4.5"
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
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="rounded-xl bg-secondary p-3.5 text-[13px] leading-snug text-muted-foreground">
          <p className="mb-0.5 font-bold text-foreground">Decision support only</p>
          <p>K-WAIS does not diagnose or replace your doctor or renal dietitian.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
