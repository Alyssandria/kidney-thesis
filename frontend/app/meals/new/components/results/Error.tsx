import { RefreshCcw, XCircle } from "lucide-react";

export function ErrorPanel({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
          <XCircle size={16} className="text-rose-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-rose-800 mb-1">
            Analysis Failed
          </p>
          <p className="text-xs text-rose-700 leading-relaxed">
            Unable to process meal analysis. Please check your connection or try
            again.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3.5 text-sm font-semibold text-white hover:bg-slate-900 transition-all"
      >
        <RefreshCcw size={14} />
        Acknowledge & Edit
      </button>
    </div>
  );
}