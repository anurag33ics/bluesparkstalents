import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import type { ApiResult } from "@/lib/api/result";
import { stageStatusLabels } from "@/lib/journey/labels";
import { findStage } from "@/lib/journey/progress";
import { stageCount, stages } from "@/lib/journey/stages";
import type { Journey, StageKey, StageSummary } from "@/lib/journey/types";
import { accentTile, stageAccent } from "./accents";
import { ApiErrorState } from "./api-error-state";
import { JourneyStrip } from "./journey-stepper";
import { PageShell } from "./layout";
import { stageIcons } from "./stage-icons";
import { StatusBadge, toneStyles } from "./status-badge";

function StageHeader({ journey, stage }: { journey: Journey; stage: StageSummary }) {
  const meta = stages[stage.key];
  const Icon = stageIcons[stage.key];
  const status = stageStatusLabels[stage.status];
  const showNote = stage.note && (stage.status === "action_required" || stage.status === "blocked");

  return (
    <header>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/dashboard" className="font-semibold text-brand-600 hover:text-brand-700">
          Dashboard
        </Link>
        <ChevronRight className="size-4" aria-hidden />
        <span aria-current="page">
          Step {meta.step} of {stageCount}
        </span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1", accentTile[stageAccent[stage.key]])}>
            <Icon className="size-6" strokeWidth={1.8} aria-hidden />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-medium tracking-tight text-ink-950 sm:text-4xl">{meta.title}</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{meta.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <StatusBadge status={stage.locked ? { label: "Locked", tone: "neutral" } : status} size="md" />
          {stage.detail && !stage.locked && <span className="text-sm text-muted-foreground">{stage.detail}</span>}
        </div>
      </div>

      <div className="mt-6">
        <JourneyStrip journey={journey.stages} activeKey={stage.key} />
      </div>

      {showNote && (
        <p role="status" className={cn("mt-6 rounded-2xl border px-4 py-3 text-sm leading-6", toneStyles[status.tone].surface, toneStyles[status.tone].text)}>
          {stage.note}
        </p>
      )}
    </header>
  );
}

function LockedStage({ stage }: { stage: StageSummary }) {
  const required = stages[stage.key].requires;
  const requiredMeta = required ? stages[required] : null;

  return (
    <div className="flex flex-col items-center rounded-3xl border border-brand-100 bg-white px-6 py-12 text-center shadow-sm shadow-brand-500/5 sm:py-16">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Lock className="size-7" strokeWidth={1.8} aria-hidden />
      </span>
      <p className="mt-5 font-heading text-xl font-medium text-brand-950">This step isn&apos;t unlocked yet</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {stage.note ?? (requiredMeta ? `Finish "${requiredMeta.title}" first. We'll unlock this step as soon as it's complete.` : "Complete the earlier steps to unlock this one.")}
      </p>
      {requiredMeta && (
        <Link href={requiredMeta.href} className={cn(buttonVariants({ variant: "brand", size: "cta" }), "mt-6")}>
          Go to {requiredMeta.shortTitle.toLowerCase()}
        </Link>
      )}
    </div>
  );
}

/**
 * Wraps every stage page: header, status, journey strip, and the locked state
 * when an earlier stage is incomplete. The API enforces the same lock.
 */
export function StageFrame({
  stageKey,
  journey,
  children,
}: {
  stageKey: StageKey;
  journey: ApiResult<Journey>;
  children: React.ReactNode;
}) {
  if (!journey.ok) {
    return (
      <PageShell>
        <ApiErrorState error={journey.error} />
      </PageShell>
    );
  }

  const stage = findStage(journey.data, stageKey);
  if (!stage) {
    return (
      <PageShell>
        <ApiErrorState error={{ kind: "server", message: "We couldn't load this step. Please try again.", fieldErrors: null }} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <StageHeader journey={journey.data} stage={stage} />
      <div className="mt-8">{stage.locked ? <LockedStage stage={stage} /> : children}</div>
    </PageShell>
  );
}
