export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex-1">
      <main className="max-w-5xl mx-auto px-5 py-7 flex flex-col gap-6">{children}</main>
    </div>
  );
}
