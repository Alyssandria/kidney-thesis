import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./global.css"
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/hooks/providers/QueryProvider";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "KidneyCare",
    template: "%s · KidneyCare",
  },
  description: "Analyze your meals and understand how they may affect sodium, potassium and phosphorus.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Matches the cookie the shadcn sidebar writes when it is opened or closed.
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full bg-slate-50">
        <QueryProvider>
          <SidebarProvider defaultOpen={sidebarOpen}>
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex h-14 items-center gap-2 border-b border-sidebar-border bg-white px-3 md:hidden">
                <SidebarTrigger className="size-11" />
                <span className="text-base font-bold text-kc-ink">KidneyCare</span>
              </header>
              {children}
            </div>
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
