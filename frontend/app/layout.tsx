import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./global.css"
import { cn } from "@/lib/utils";
import { bricolage, manrope, plexMono } from "@/lib/fonts";
import { QueryProvider } from "@/hooks/providers/QueryProvider";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: {
    default: "K-WAIS",
    template: "%s · K-WAIS",
  },
  description: "Analyze your meals and understand how they may affect sodium, potassium and phosphorus.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Matches the cookie the shadcn sidebar writes when it is opened or closed.
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <html
      lang="en"
      className={cn("h-full antialiased", manrope.variable, bricolage.variable, plexMono.variable)}
    >
      <body className="min-h-full">
        <QueryProvider>
          <SidebarProvider defaultOpen={sidebarOpen}>
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <TopBar />
              {children}
            </div>
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
