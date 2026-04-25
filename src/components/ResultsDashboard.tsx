import { useState } from "react";
import { ExperimentPlan } from "@/data/dummyResults";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  ListChecks,
  FlaskConical,
  Wallet,
  Calendar,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Download,
  Pencil,
  Check,
  X,
  Send,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const REVIEW_URL = "http://127.0.0.1:8000/api/review";

interface ResultsDashboardProps {
  plan: ExperimentPlan;
  hypothesis: string;
  onReset: () => void;
}

type NoveltyConfig = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className: string;
};

const noveltyConfig: Record<string, NoveltyConfig> = {
  novel: {
    icon: Sparkles,
    label: "Novel",
    className: "bg-success/10 text-success border-success/30",
  },
  "similar work exists": {
    icon: AlertTriangle,
    label: "Similar work exists",
    className: "bg-warning/10 text-warning-foreground border-warning/40",
  },
  "well-established": {
    icon: CheckCircle2,
    label: "Well-established",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const FALLBACK_NOVELTY: NoveltyConfig = {
  icon: AlertTriangle,
  label: "Unknown",
  className: "bg-muted text-muted-foreground border-border",
};

export const ResultsDashboard = ({ plan, hypothesis, onReset }: ResultsDashboardProps) => {
  const { toast } = useToast();
  const rawNovelty = (plan.literatureQC?.noveltyStatus ?? "").toString().toLowerCase().trim();
  const novelty: NoveltyConfig = noveltyConfig[rawNovelty] ?? {
    ...FALLBACK_NOVELTY,
    label: plan.literatureQC?.noveltyStatus ? String(plan.literatureQC.noveltyStatus) : FALLBACK_NOVELTY.label,
  };
  const NoveltyIcon = novelty.icon;

  const timelineEntries = Object.entries(plan.timeline ?? {});

  // Per-step scientist feedback state.
  const [openEditor, setOpenEditor] = useState<Record<number, boolean>>({});
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [corrections, setCorrections] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const correctionCount = Object.values(corrections).filter((v) => v.trim().length > 0).length;

  const toggleEditor = (idx: number) => {
    setOpenEditor((prev) => ({ ...prev, [idx]: !prev[idx] }));
    setDrafts((prev) => ({ ...prev, [idx]: prev[idx] ?? corrections[idx] ?? "" }));
  };

  const saveCorrection = (idx: number) => {
    const text = (drafts[idx] ?? "").trim();
    setCorrections((prev) => {
      const next = { ...prev };
      if (text) next[idx] = text;
      else delete next[idx];
      return next;
    });
    setOpenEditor((prev) => ({ ...prev, [idx]: false }));
  };

  const cancelEditor = (idx: number) => {
    setDrafts((prev) => ({ ...prev, [idx]: corrections[idx] ?? "" }));
    setOpenEditor((prev) => ({ ...prev, [idx]: false }));
  };

  const submitReview = async () => {
    setSubmitting(true);
    try {
      const payload = {
        hypothesis,
        corrections: Object.entries(corrections)
          .filter(([, text]) => text.trim().length > 0)
          .map(([idx, correction]) => ({
            step_index: Number(idx),
            original_step: plan.protocol[Number(idx)] ?? "",
            scientist_correction: correction,
          })),
      };

      const response = await fetch(REVIEW_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status} ${response.statusText}`);
      }

      setSubmitted(true);
      toast({
        title: "Review submitted!",
        description: "Thanks for helping the AI learn.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error submitting review.";
      console.error("Failed to submit review:", error);
      toast({
        variant: "destructive",
        title: "Failed to submit review",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto animate-fade-in px-6 py-12 md:py-16">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Experiment Plan Generated
          </div>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Results Dashboard
          </h2>
          <blockquote className="max-w-3xl border-l-2 border-primary/40 pl-4 text-sm italic leading-relaxed text-muted-foreground md:text-base">
            "{hypothesis}"
          </blockquote>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            New hypothesis
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Steps" value={plan.protocol.length.toString()} icon={ListChecks} />
        <StatCard label="Materials" value={plan.materials.length.toString()} icon={FlaskConical} />
        <StatCard label="Budget" value={plan.budget.totalEstimate} icon={Wallet} />
        <StatCard
          label="Duration"
          value={`${timelineEntries.length} ${timelineEntries.length === 1 ? "phase" : "phases"}`}
          icon={Calendar}
        />
      </div>

      {/* Top row: Literature QC + Budget */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Literature QC */}
        <Card className="overflow-hidden lg:col-span-2 animate-scale-in">
          <SectionHeader icon={BookOpen} title="Literature QC" subtitle="Prior art assessment" />
          <div className="p-6">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Novelty Status
              </span>
              <Badge
                variant="outline"
                className={cn("gap-1.5 border px-3 py-1 text-xs font-medium", novelty.className)}
              >
                <NoveltyIcon className="h-3 w-3" />
                {novelty.label}
              </Badge>
            </div>

            {plan.literatureQC.summary && (
              <p className="mb-6 text-sm leading-relaxed text-foreground/80">
                {plan.literatureQC.summary}
              </p>
            )}

            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              References ({plan.literatureQC.references.length})
            </div>
            <ul className="space-y-3">
              {plan.literatureQC.references.map((ref, idx) => (
                <li
                  key={idx}
                  className="group flex gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-smooth hover:border-primary/40 hover:bg-muted/60"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-xs text-primary">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium leading-snug text-foreground">
                      {ref}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Budget */}
        <Card className="overflow-hidden animate-scale-in [animation-delay:80ms] opacity-0">
          <SectionHeader icon={Wallet} title="Budget" subtitle="Estimated costs" />
          <div className="p-6">
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-5">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Total Estimate
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  {plan.budget.totalEstimate}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Aggregate estimate provided by the AI Scientist. Detailed breakdown not included in
                this response.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Protocol */}
      <Card className="mb-6 overflow-hidden animate-scale-in [animation-delay:160ms] opacity-0">
        <SectionHeader
          icon={ListChecks}
          title="Experiment Protocol"
          subtitle={`${plan.protocol.length} sequential steps`}
        />
        <div className="p-6">
          <ol className="relative space-y-5">
            {/* Vertical connector */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" aria-hidden />

            {plan.protocol.map((step, idx) => {
              const isOpen = !!openEditor[idx];
              const savedCorrection = corrections[idx];
              return (
                <li key={idx} className="relative flex gap-4 pl-0">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background font-mono text-sm font-semibold text-primary shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pb-1 pt-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-relaxed text-foreground/90">{step}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary"
                        onClick={() => toggleEditor(idx)}
                        aria-label={isOpen ? "Close correction editor" : "Edit step"}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {savedCorrection && !isOpen && (
                      <div className="mt-2 rounded-md border border-primary/30 bg-primary/5 p-3">
                        <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                          Scientist Correction
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {savedCorrection}
                        </p>
                      </div>
                    )}

                    {isOpen && (
                      <div className="mt-3 rounded-md border border-border bg-muted/30 p-3 animate-fade-in">
                        <label className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Scientist Correction
                        </label>
                        <Textarea
                          value={drafts[idx] ?? ""}
                          onChange={(e) =>
                            setDrafts((prev) => ({ ...prev, [idx]: e.target.value }))
                          }
                          placeholder="Suggest a refinement to this step…"
                          className="min-h-[80px] bg-background"
                          autoFocus
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelEditor(idx)}
                          >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => saveCorrection(idx)}>
                            <Check className="h-3.5 w-3.5" />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Card>

      {/* Materials */}
      <Card className="mb-6 overflow-hidden animate-scale-in [animation-delay:240ms] opacity-0">
        <SectionHeader
          icon={FlaskConical}
          title="Materials Needed"
          subtitle={`${plan.materials.length} items`}
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-border bg-muted/40">
                <th className="px-6 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Catalog Number
                </th>
                <th className="px-6 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody>
              {plan.materials.map((m, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border/60 transition-smooth last:border-0 hover:bg-muted/30"
                >
                  <td className="px-6 py-3.5 text-sm font-medium text-foreground">{m.itemName}</td>
                  <td className="px-6 py-3.5 font-mono text-sm text-primary">
                    {m.catalogNumber}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">{m.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="overflow-hidden animate-scale-in [animation-delay:320ms] opacity-0">
        <SectionHeader
          icon={Calendar}
          title="Timeline"
          subtitle={`${timelineEntries.length} ${
            timelineEntries.length === 1 ? "phase" : "phases"
          }`}
        />
        <div className="p-6">
          <div className="space-y-3">
            {timelineEntries.map(([week, activity], idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-start gap-4 rounded-lg border border-border bg-muted/20 p-4 transition-smooth hover:border-primary/30"
              >
                <div className="col-span-12 md:col-span-3">
                  <div className="font-mono text-xs uppercase tracking-wider text-primary">
                    {week}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-9">
                  <div className="text-sm leading-relaxed text-foreground/90">{activity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Expert Review submission */}
      <Card className="mt-10 overflow-hidden border-primary/20">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-1 font-mono text-xs uppercase tracking-wider text-primary">
              Expert Review
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Send your corrections back to the AI Scientist
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {correctionCount === 0
                ? "Click the pencil icon next to any protocol step to add a correction."
                : `${correctionCount} correction${
                    correctionCount === 1 ? "" : "s"
                  } ready to submit.`}
            </p>
          </div>
          <Button
            size="lg"
            onClick={submitReview}
            disabled={submitting}
            className="shrink-0"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : submitted ? (
              <Check className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {submitting
              ? "Submitting…"
              : submitted
              ? "Review Submitted"
              : "Submit Expert Review"}
          </Button>
        </div>
      </Card>

      {/* Footer meta */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-6 font-mono text-xs text-muted-foreground">
        <span>Generated by The AI Scientist · v0.1</span>
        <span>For research use only · Validate before execution</span>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-card transition-smooth hover:border-primary/30 hover:shadow-elevated">
    <div className="mb-2 flex items-center justify-between">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Icon className="h-3.5 w-3.5 text-primary" />
    </div>
    <div className="text-xl font-semibold tracking-tight text-foreground">{value}</div>
  </div>
);

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);
