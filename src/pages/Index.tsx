import { useState } from "react";
import { HypothesisHero } from "@/components/HypothesisHero";
import { LoadingState } from "@/components/LoadingState";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { type ExperimentPlan } from "@/data/dummyResults";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FlaskConical, AlertTriangle, RotateCcw } from "lucide-react";

type AppState = "idle" | "loading" | "results" | "error";

const API_URL = "http://127.0.0.1:8000/api/generate";

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [hypothesis, setHypothesis] = useState("");
  const [plan, setPlan] = useState<ExperimentPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = async (h: string) => {
    setHypothesis(h);
    setState("loading");
    setErrorMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hypothesis: h }),
      });

      if (!response.ok) {
        throw new Error(
          `Backend responded with ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Map backend payload (qc_check + experiment_plan) into the
      // ExperimentPlan shape the dashboard expects.
      const mapped: ExperimentPlan = {
        literatureQC: {
          noveltyStatus: data.qc_check?.novelty_signal ?? "similar work exists",
          references: data.qc_check?.references ?? [],
        },
        protocol: data.experiment_plan?.protocol_steps ?? [],
        materials: (data.experiment_plan?.materials ?? []).map((m: any) => ({
          itemName: m.item_name ?? m.itemName ?? "",
          catalogNumber: m.catalog_number ?? m.catalogNumber ?? "",
          supplier: m.supplier ?? "",
        })),
        budget: {
          totalEstimate: data.experiment_plan?.budget_estimate ?? "—",
        },
        timeline: data.experiment_plan?.timeline ?? {},
      };

      setPlan(mapped);
      setState("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while contacting the backend.";
      console.error("Failed to generate experiment plan:", error);
      setErrorMessage(message);
      setState("error");
      toast({
        variant: "destructive",
        title: "Failed to generate experiment plan",
        description: message,
      });
    }
  };

  const handleReset = () => {
    setState("idle");
    setPlan(null);
    setHypothesis("");
    setErrorMessage("");
  };

  const handleRetry = () => {
    if (hypothesis) handleSubmit(hypothesis);
  };

  return (
    <main className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Top nav */}
      <header className="border-b border-border bg-background/70 backdrop-blur-md print:hidden">
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

      <div className="flex-1">

      {state === "idle" && <HypothesisHero onSubmit={handleSubmit} isLoading={false} />}
      {state === "loading" && <LoadingState />}
      {state === "results" && plan && (
        <ResultsDashboard plan={plan} hypothesis={hypothesis} onReset={handleReset} />
      )}
      {state === "error" && (
        <section className="container mx-auto flex min-h-[60vh] items-center justify-center px-6 py-20">
          <div className="w-full max-w-lg rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-card animate-fade-in">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
              Something went wrong
            </h2>
            <p className="mb-1 text-sm text-muted-foreground">
              We couldn't reach the AI Scientist backend.
            </p>
            <p className="mb-6 font-mono text-xs text-muted-foreground/80 break-all">
              {errorMessage}
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                New hypothesis
              </Button>
              <Button variant="default" size="sm" onClick={handleRetry}>
                <RotateCcw className="h-4 w-4" />
                Try again
              </Button>
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Check that your backend is running at 127.0.0.1:8000
            </p>
          </div>
        </section>
      )}
    </main>
  );
};

export default Index;
