import Link from "next/link";
import { Ban, Check, CircleAlert, Lock } from "lucide-react";
import { cn } from "cn";
import { stageStatusLabels } from "@/lib/journey/labels";
import { stages } from "@/lib/journey/stages";
import type { StageSummary } from "@/lib/journey/types";

type NodeState = "completed" | "current" | "attention" | "blocked" | "locked" | "upcoming";

function nodeState(stage: StageSummary, isCurrent: boolean): NodeState {
  if (stage.status === "completed") return "completed";
  if (stage.status === "blocked") return "blocked";
  if (stage.status === "action_required") return "attention";
  if (isCurrent) return "current";
  return stage.locked ? "locked" : "upcoming";
}

const nodeStyles: Record<NodeState, string> = {
  completed: "border-emerald-500 bg-emerald-500 text-white",
  current: "border-brand-600 bg-white text-brand-700 ring-4 ring-brand-100",
  attention: "border-amber-500 bg-amber-50 text-amber-700 ring-4 ring-amber-100",
  blocked: "border-red-500 bg-red-50 text-red-700 ring-4 ring-red-100",
  locked: "border-slate-200 bg-slate-50 text-slate-400",
  upcoming: "border-slate-200 bg-white text-slate-500",
};

function Node({ stage, state, className }: { stage: StageSummary; state: NodeState; className?: string }) {
  const { step } = stages[stage.key];

  return (
    <span
      className={cn(
        "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
        nodeStyles[state],
        className
      )}
      aria-hidden
    >
      {state === "completed" && <Check className="size-5" strokeWidth={3} />}
      {state === "attention" && <CircleAlert className="size-5" />}
      {state === "blocked" && <Ban className="size-5" />}
      {state === "locked" && <Lock className="size-4" />}
      {(state === "current" || state === "upcoming") && step}
      {state === "current" && <span className="absolute inset-0 animate-ping rounded-full border-2 border-brand-400 opacity-30 motion-reduce:hidden" />}
    </span>
  );
}

function StepLabel({ stage, children, className }: { stage: StageSummary; children: React.ReactNode; className?: string }) {
  if (stage.locked) return <span className={className}>{children}</span>;

  return (
    <Link
      href={stages[stage.key].href}
      className={cn("rounded-lg outline-none hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500/40", className)}
    >
      {children}
    </Link>
  );
}

function statusText(stage: StageSummary, state: NodeState) {
  if (state === "locked") return "Locked";
  if (state === "current" && stage.status === "pending") return "Up next";
  return stage.detail ?? stageStatusLabels[stage.status].label;
}

/**
 * Seven-stage journey stepper. Horizontal on large screens, a vertical
 * timeline below that. Locked stages aren't links.
 */
export function JourneyStepper({
  journey,
  currentKey,
  horizontalOnly = false,
}: {
  journey: StageSummary[];
  currentKey: string | null;
  /** Skip the vertical mobile timeline when the page shows step details elsewhere. */
  horizontalOnly?: boolean;
}) {
  return (
    <>
      {/* Desktop */}
      <ol aria-label="Hiring journey" className="hidden grid-cols-7 lg:grid">
        {journey.map((stage, index) => {
          const isCurrent = stage.key === currentKey;
          const state = nodeState(stage, isCurrent);
          const meta = stages[stage.key];
          const next = journey[index + 1];

          return (
            <li key={stage.key} aria-current={isCurrent ? "step" : undefined} className="relative flex flex-col items-center px-1 text-center">
              {next && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-5 left-1/2 h-0.5 w-full -translate-y-1/2",
                    stage.status === "completed" ? "bg-emerald-400" : "bg-slate-200"
                  )}
                />
              )}
              <Node stage={stage} state={state} />
              <StepLabel stage={stage} className={cn("mt-3 text-sm font-semibold leading-tight", state === "locked" ? "text-slate-400" : "text-ink-950")}>
                {meta.shortTitle}
              </StepLabel>
              <span
                className={cn(
                  "mt-1 line-clamp-2 text-xs leading-4",
                  state === "attention" ? "font-semibold text-amber-800" : state === "blocked" ? "font-semibold text-red-700" : "text-muted-foreground"
                )}
              >
                <span className="sr-only">Step {meta.step}: </span>
                {statusText(stage, state)}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Mobile and tablet */}
      {!horizontalOnly && (
        <ol aria-label="Hiring journey" className="flex flex-col lg:hidden">
          {journey.map((stage, index) => {
            const isCurrent = stage.key === currentKey;
            const state = nodeState(stage, isCurrent);
            const meta = stages[stage.key];
            const last = index === journey.length - 1;
  
            return (
              <li key={stage.key} aria-current={isCurrent ? "step" : undefined} className="relative flex gap-4 pb-6 last:pb-0">
                {!last && (
                  <span
                    aria-hidden
                    className={cn("absolute top-10 bottom-0 left-5 w-0.5 -translate-x-1/2", stage.status === "completed" ? "bg-emerald-400" : "bg-slate-200")}
                  />
                )}
                <Node stage={stage} state={state} />
                <div className={cn("min-w-0 flex-1 pt-1.5", isCurrent && "rounded-2xl bg-brand-50/70 p-3 -mt-1.5 ring-1 ring-brand-100")}>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Step {meta.step}</p>
                  <StepLabel stage={stage} className={cn("mt-0.5 block font-semibold", state === "locked" ? "text-slate-400" : "text-ink-950")}>
                    {meta.title}
                  </StepLabel>
                  <p
                    className={cn(
                      "mt-0.5 text-sm",
                      state === "attention" ? "font-semibold text-amber-800" : state === "blocked" ? "font-semibold text-red-700" : "text-muted-foreground"
                    )}
                  >
                    {statusText(stage, state)}
                  </p>
                  {isCurrent && stage.note && <p className="mt-1.5 text-sm leading-6 text-brand-950/80">{stage.note}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}

/** Compact seven-segment strip for stage page headers. */
export function JourneyStrip({ journey, activeKey }: { journey: StageSummary[]; activeKey: string }) {
  const completed = journey.filter((stage) => stage.status === "completed").length;

  return (
    <div>
      <ol className="flex gap-1.5" aria-label={`${completed} of ${journey.length} stages complete`}>
        {journey.map((stage) => (
          <li
            key={stage.key}
            title={stages[stage.key].title}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              stage.status === "completed" ? "bg-emerald-400" : stage.key === activeKey ? "bg-brand-500" : "bg-slate-200"
            )}
          >
            <span className="sr-only">
              {stages[stage.key].title}: {stageStatusLabels[stage.status].label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
