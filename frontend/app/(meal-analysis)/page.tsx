import { MealInputForm } from "./components/MealForm";
import { IdlePanel } from "./components/results/Idle";

export default function Home() {
  return (
    <div
          className="min-h-full bg-slate-50"
    >
      <main className="max-w-5xl mx-auto px-5 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-5 items-start">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50">
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                Log a Meal
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Real-time renal safety analysis for every bite.
              </p>
            </div>
            <div className="px-6 py-5">
              <MealInputForm />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                  AI Analysis
                  {/* {appState === "idle" && "AI Analysis"}
                  {appState === "analyzing" && "Processing…"}
                  {appState === "success" && "Analysis Results"}
                  {appState === "error" && "Analysis Failed"} */}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your renal safety report will appear here.
                  {/* {appState === "idle" &&
                    "Your renal safety report will appear here."}
                  {appState === "analyzing" &&
                    "Running CKD Stage 4 clinical checks…"}
                  {appState === "success" &&
                    "Personalized for Stage 4 CKD · Non-dialysis"}
                  {appState === "error" &&
                    "Something went wrong during processing."} */}
                </p>
              </div>
              {/* {appState === "success" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={10} strokeWidth={3} />
                  Complete
                </span>
              )} */}
            </div>
            <div className="px-6 py-5">
              <IdlePanel />
              {/* {appState === "idle" && <IdlePanel />}
              {appState === "analyzing" && (
                <AnalyzingPanel step={analysisStep} />
              )}
              {appState === "success" && (
                <SuccessPanel result={MOCK_RESULT} onReset={reset} />
              )}
              {appState === "error" && (
                <ErrorPanel onRetry={startAnalysis} onReset={reset} />
              )} */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
