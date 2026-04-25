import { useState } from "react";
import { HypothesisHero } from "@/components/HypothesisHero";
import { LoadingState } from "@/components/LoadingState";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { dummyExperimentPlan, type ExperimentPlan } from "@/data/dummyResults";
import { FlaskConical } from "lucide-react";

type AppState = "idle" | "loading" | "results";

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [hypothesis, setHypothesis] = useState("");
  const [plan, setPlan] = useState<ExperimentPlan | null>(null);

  const handleSubmit = (h: string) => {
    setHypothesis(h);
    setState("loading");
    // Simulate ~15s backend call. Later: replace with FastAPI fetch.
    setTimeout(() => {
      setPlan(dummyExperimentPlan);
      setState("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 15000);
  };

  const handleReset = () => {
    setState("idle");
    setPlan(null);
    setHypothesis("");
  };

  return (
    <main className="min-h-screen bg-gradient-subtle">
      {/* Top nav */}
      <header className="border-b border-border bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero shadow-sm">
              <FlaskConical className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="font-semibold tracking-tight text-foreground">
              The AI Scientist
            </div>
          </div>
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            v0.1 · research preview
          </div>
        </div>
      </header>

      {state === "idle" && <HypothesisHero onSubmit={handleSubmit} isLoading={false} />}
      {state === "loading" && <LoadingState />}
      {state === "results" && plan && (
        <ResultsDashboard plan={plan} hypothesis={hypothesis} onReset={handleReset} />
      )}
    </main>
  );
};

export default Index;
