import { ExperimentPlan } from "@/data/dummyResults";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsDashboardProps {
  plan: ExperimentPlan;
  hypothesis: string;
  onReset: () => void;
}

const noveltyConfig = {
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

export const ResultsDashboard = ({ plan, hypothesis, onReset }: ResultsDashboardProps) => {
  const novelty =
    noveltyConfig[plan.literatureQC.noveltyStatus] ?? noveltyConfig["similar work exists"];
  const NoveltyIcon = novelty.icon;

  const timelineEntries = Object.entries(plan.timeline ?? {});

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
            <div className="mb-6 rounded-xl border border-primary/20 bg-gradient-hero/5 bg-gradient-to-br from-primary/5 to-accent/5 p-5">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Total Estimate
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  ${plan.budget.totalEstimate.toLocaleString()}
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  {plan.budget.currency}
                </span>
              </div>
            </div>

            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Breakdown
            </div>
            <ul className="space-y-3">
              {plan.budget.breakdown.map((item) => {
                const pct = (item.amount / plan.budget.totalEstimate) * 100;
                return (
                  <li key={item.category}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-foreground/80">{item.category}</span>
                      <span className="font-mono font-medium text-foreground">
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-hero transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
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

            {plan.protocol.map((step) => (
              <li key={step.step} className="relative flex gap-4 pl-0">
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background font-mono text-sm font-semibold text-primary shadow-sm">
                  {step.step}
                </div>
                <div className="flex-1 pb-1 pt-0.5">
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-semibold text-foreground">{step.title}</h4>
                    <span className="font-mono text-xs text-muted-foreground">
                      ⏱ {step.duration}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
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
          subtitle={`${plan.timeline.totalDuration} · ${totalDays} working days`}
        />
        <div className="p-6">
          <div className="space-y-3">
            {plan.timeline.phases.map((phase, idx) => {
              const widthPct = Math.max(8, (phase.days / totalDays) * 100);
              return (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center gap-4 rounded-lg border border-border bg-muted/20 p-3 transition-smooth hover:border-primary/30"
                >
                  <div className="col-span-12 md:col-span-3">
                    <div className="font-mono text-xs uppercase tracking-wider text-primary">
                      {phase.week}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div className="text-sm text-foreground">{phase.activity}</div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-border">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-hero"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {phase.days}d
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
