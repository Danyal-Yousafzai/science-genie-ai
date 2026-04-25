import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { label: "Parsing hypothesis", detail: "Extracting variables & entities" },
  { label: "Searching literature", detail: "Querying PubMed, bioRxiv, Crossref" },
  { label: "Assessing novelty", detail: "Cross-referencing prior art" },
  { label: "Designing protocol", detail: "Sequencing experimental steps" },
  { label: "Sourcing materials", detail: "Matching catalog numbers" },
  { label: "Estimating budget & timeline", detail: "Calculating resource needs" },
];

export const LoadingState = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // ~15s total — advance through 6 stages
    const stageInterval = setInterval(() => {
      setCurrentStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 2400);

    const timeInterval = setInterval(() => {
      setElapsed((t) => t + 0.1);
    }, 100);

    return () => {
      clearInterval(stageInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <section className="container mx-auto px-6 py-16 md:py-24 animate-fade-in">
      <div className="mx-auto max-w-2xl">
        {/* Animated visual */}
        <div className="relative mx-auto mb-12 flex h-48 w-48 items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-border/60" />
          {/* Orbiting rings */}
          <div className="absolute inset-2 animate-orbit rounded-full border border-dashed border-primary/40" />
          <div
            className="absolute inset-6 rounded-full border border-dashed border-accent/40"
            style={{ animation: "orbit 5s linear infinite reverse" }}
          />

          {/* Glow core */}
          <div className="absolute inset-12 animate-pulse-glow rounded-full bg-gradient-hero opacity-80 blur-xl" />

          {/* Center icon */}
          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-hero shadow-glow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-10 w-10 text-primary-foreground"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3v6l-5 9a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-9V3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9 3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
              <circle cx="10" cy="14" r="0.7" fill="currentColor" />
              <circle cx="14" cy="15.5" r="0.5" fill="currentColor" />
            </svg>
          </div>

          {/* Orbiting dot */}
          <div
            className="absolute inset-0 animate-orbit"
            style={{ animationDuration: "2.5s" }}
          >
            <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent shadow-glow" />
          </div>
        </div>

        {/* Status header */}
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <Loader2 className="h-3 w-3 animate-spin" />
            Generating experiment plan
          </div>
          <h2 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">
            {STAGES[currentStage]?.label}
          </h2>
          <p className="text-sm text-muted-foreground">{STAGES[currentStage]?.detail}</p>
        </div>

        {/* Stage list */}
        <div className="rounded-xl border border-border bg-card p-2 shadow-card">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStage;
            const isActive = idx === currentStage;
            return (
              <div
                key={stage.label}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-smooth",
                  isActive && "bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-smooth",
                    isDone && "border-success bg-success text-success-foreground",
                    isActive && "border-primary bg-primary/10 text-primary",
                    !isDone && !isActive && "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : isActive ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span className="font-mono text-[10px]">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={cn(
                      "text-sm font-medium transition-smooth",
                      isDone && "text-muted-foreground line-through decoration-1",
                      isActive && "text-foreground",
                      !isDone && !isActive && "text-muted-foreground"
                    )}
                  >
                    {stage.label}
                  </div>
                </div>
                {isActive && (
                  <div className="relative h-1 w-20 overflow-hidden rounded-full bg-border">
                    <div className="absolute inset-y-0 left-0 w-full bg-gradient-hero opacity-60" />
                    <div
                      className="absolute inset-y-0 w-1/3 animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-primary-foreground/60 to-transparent"
                      style={{ backgroundSize: "200% 100%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer meta */}
        <div className="mt-6 flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>elapsed: {elapsed.toFixed(1)}s</span>
          <span>est. ~15s total</span>
        </div>
      </div>
    </section>
  );
};
