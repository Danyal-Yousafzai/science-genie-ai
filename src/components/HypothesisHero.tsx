import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Beaker, Sparkles, ArrowRight } from "lucide-react";

interface HypothesisHeroProps {
  onSubmit: (hypothesis: string) => void;
  isLoading: boolean;
}

const SAMPLE_HYPOTHESIS =
  "Adding 0.1 M trehalose to a standard 10% DMSO freezing medium will improve post-thaw viability of HeLa cells by ≥15% compared to DMSO alone.";

export const HypothesisHero = ({ onSubmit, isLoading }: HypothesisHeroProps) => {
  const [hypothesis, setHypothesis] = useState("");

  const handleSubmit = () => {
    if (hypothesis.trim().length > 0) {
      onSubmit(hypothesis);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-glow" />

      <div className="container relative mx-auto px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm shadow-sm animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono uppercase tracking-wider">AI Research Co-Pilot</span>
          </div>

          {/* Title */}
          <h1 className="mb-5 text-4xl font-semibold tracking-tight text-foreground md:text-6xl animate-fade-in-up">
            The AI{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">Scientist</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground md:text-lg animate-fade-in-up [animation-delay:100ms] opacity-0">
            Translate your scientific hypothesis into a rigorously planned, ready-to-execute
            experiment — complete with literature review, protocol, materials, and budget.
          </p>

          {/* Input card */}
          <div className="mx-auto rounded-2xl border border-border bg-gradient-card p-2 shadow-elevated animate-fade-in-up [animation-delay:200ms] opacity-0">
            <div className="rounded-xl bg-background/60 p-1">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  <Beaker className="h-3.5 w-3.5 text-primary" />
                  Scientific Hypothesis
                </div>
                <button
                  type="button"
                  onClick={() => setHypothesis(SAMPLE_HYPOTHESIS)}
                  className="text-xs font-mono text-primary transition-smooth hover:text-primary-glow"
                  disabled={isLoading}
                >
                  Try sample →
                </button>
              </div>

              <Textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                placeholder="e.g., Adding 0.1 M trehalose to a standard DMSO freezing medium will improve post-thaw viability of HeLa cells…"
                className="min-h-[140px] resize-none border-0 bg-transparent text-base leading-relaxed shadow-none focus-visible:ring-0"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col items-stretch gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="px-2 text-left text-xs text-muted-foreground">
                Be specific — include variables, conditions, and expected outcomes.
              </p>
              <Button
                size="lg"
                variant="hero"
                onClick={handleSubmit}
                disabled={isLoading || hypothesis.trim().length === 0}
                className="group min-w-[240px]"
              >
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Generate Experiment Plan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono uppercase tracking-wider text-muted-foreground animate-fade-in-up [animation-delay:300ms] opacity-0">
            <span>Peer-reviewed sources</span>
            <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
            <span>Reproducible protocols</span>
            <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
            <span>Lab-ready output</span>
          </div>
        </div>
      </div>
    </section>
  );
};
