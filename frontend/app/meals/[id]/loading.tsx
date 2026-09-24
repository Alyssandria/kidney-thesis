import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-3xl mx-auto px-5 py-7 flex flex-col gap-5" aria-busy="true">
        <p className="sr-only" role="status">Loading saved meal…</p>
        <Skeleton className="h-4 w-24" />
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </main>
    </div>
  );
}
