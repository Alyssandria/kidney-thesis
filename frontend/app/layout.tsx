import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css"
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/hooks/providers/QueryProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "KidneyCare",
    template: "%s · KidneyCare",
  },
  description: "Analyze your meals and understand how they may affect sodium, potassium and phosphorus.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        <QueryProvider>
          <SiteHeader />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
