export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex-1">
      <main className="flex w-full max-w-[1240px] flex-col gap-6 px-4 pt-5 pb-24 md:px-8 md:pt-6.5 md:pb-18">{children}</main>
    </div>
  );
}
