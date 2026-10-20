import Link from "next/link";
import { ArrowRight, Ban, CalendarCheck, Check, CircleAlert, Clock, Lock, MapPin } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { stageStatusLabels, type StatusLabel } from "@/lib/journey/labels";
import { journeyProgress } from "@/lib/journey/progress";
import { stages } from "@/lib/journey/stages";
import type { Journey, StageSummary } from "@/lib/journey/types";
import { accentTile, stageAccent } from "./accents";
import { SectionHeader } from "./layout";
import { LocalTime } from "./local-time";
import { stageIcons } from "./stage-icons";
import { StatusBadge } from "./status-badge";

type StepState = "completed" | "current" | "attention" | "blocked" | "locked" | "open";

function stepState(stage: StageSummary, isCurrent: boolean): StepState {
  if (stage.status === "completed") return "completed";
  if (stage.status === "action_required") return "attention";
  if (stage.status === "blocked") return "blocked";
  if (isCurrent) return "current";
  return stage.locked ? "locked" : "open";
}

function badgeFor(stage: StageSummary, state: StepState): StatusLabel {
  if (state === "locked") return { label: "Locked", tone: "neutral" };
  if (state === "current" && stage.status === "pending") return { label: "Up next", tone: "info" };
  return stageStatusLabels[stage.status];
}

const nodeStyles: Record<StepState, string> = {
  completed: "border-emerald-500 bg-emerald-500 text-white",
  current: "border-brand-600 bg-white text-brand-700 ring-4 ring-brand-100",
  attention: "border-amber-500 bg-amber-50 text-amber-700 ring-4 ring-amber-100",
  blocked: "border-red-500 bg-red-50 text-red-700 ring-4 ring-red-100",
  locked: "border-slate-200 bg-white text-slate-400",
  open: "border-slate-300 bg-white text-slate-600",
};

const cardStyles: Record<StepState, string> = {
  completed: "border-black/6 bg-white",
  current: "border-brand-200 bg-white ring-2 ring-brand-500/25 shadow-[0_24px_48px_-24px_rgba(37,99,235,0.35)]",
  attention: "border-amber-200 bg-white ring-2 ring-amber-400/30 shadow-[0_24px_48px_-24px_rgba(217,119,6,0.30)]",
  blocked: "border-red-200 bg-white ring-2 ring-red-400/25",
  locked: "border-dashed border-slate-200 bg-white/50",
  open: "border-black/6 bg-white",
};

/**
 * All seven hiring steps with their live status. Statuses come from the API on
 * every request, so completing a step (or a reviewer, interviewer or payment
 * update) shows up here on the next refresh.
 */
export function JourneySteps({ journey }: { journey: Journey }) {
  const { current, completed, total } = journeyProgress(journey);

  return (
    <section aria-labelledby="journey-steps-heading" id="journey-steps" className="scroll-mt-28">
      <SectionHeader
        id="journey-steps-heading"
        eyebrow="Step by step"
        title="Your 7-step hiring journey"
        description={`${completed} of ${total} steps complete. Each step unlocks when the one before it is done.`}
      />

      <ol className="flex flex-col">
        {journey.stages.map((stage, index) => {
          const meta = stages[stage.key];
          const isCurrent = stage.key === current?.key;
          const state = stepState(stage, isCurrent);
          const Icon = stageIcons[stage.key];
          const last = index === journey.stages.length - 1;
          const required = meta.requires ? stages[meta.requires] : null;
          const highlighted = state === "current" || state === "attention" || state === "blocked";

          return (
            <li key={stage.key} aria-current={isCurrent ? "step" : undefined} className="relative flex gap-4 pb-5 last:pb-0 sm:gap-6">
              {/* Node and connector */}
              <div className="relative hidden flex-col items-center sm:flex">
                <span
                  aria-hidden
                  className={cn("relative z-10 mt-6 flex size-11 shrink-0 items-center justify-center rounded-full border-2 font-heading text-base font-medium", nodeStyles[state])}
                >
                  {state === "completed" && <Check className="size-5" strokeWidth={3} />}
                  {state === "attention" && <CircleAlert className="size-5" />}
                  {state === "blocked" && <Ban className="size-5" />}
                  {state === "locked" && <Lock className="size-4" />}
                  {(state === "current" || state === "open") && meta.step}
                </span>
                {!last && <span aria-hidden className={cn("-mb-5 w-0.5 flex-1", stage.status === "completed" ? "bg-emerald-400" : "bg-slate-200")} />}
              </div>

              {/* Step card */}
              <article className={cn("relative min-w-0 flex-1 rounded-3xl border p-5 transition-shadow sm:p-6", cardStyles[state])}>
                {isCurrent && (
                  <span className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-md shadow-brand-600/25">
                    <MapPin className="size-3" aria-hidden />
                    You are here
                  </span>
                )}

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1",
                        state === "locked" ? "bg-slate-50 text-slate-400 ring-slate-100" : accentTile[stageAccent[stage.key]]
                      )}
                    >
                      <Icon className="size-5.5" strokeWidth={1.8} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Step {String(meta.step).padStart(2, "0")}
                      </p>
                      <h3 className={cn("mt-1 font-heading text-xl font-medium leading-snug tracking-tight", state === "locked" ? "text-slate-400" : "text-ink-950")}>
                        {meta.title}
                      </h3>
                      <p className={cn("mt-1.5 text-sm leading-6", state === "locked" ? "text-slate-400" : "text-muted-foreground")}>{meta.description}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-row flex-wrap items-center gap-2 md:flex-col md:items-end md:gap-1.5">
                    <StatusBadge status={badgeFor(stage, state)} />
                    {state === "completed" && stage.completedAt && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarCheck className="size-3.5" aria-hidden />
                        <LocalTime value={stage.completedAt} format="date" />
                      </span>
                    )}
                    {state !== "completed" && state !== "locked" && stage.updatedAt && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3.5" aria-hidden />
                        Updated <LocalTime value={stage.updatedAt} format="date" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Status detail, notes and actions */}
                <div className="mt-5 flex flex-col gap-3 border-t border-black/6 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 text-sm leading-6">
                    {state === "locked" ? (
                      <p className="inline-flex items-center gap-1.5 text-slate-400">
                        <Lock className="size-3.5" aria-hidden />
                        {stage.note ?? (required ? `Unlocks after step ${required.step}: ${required.title}` : "Unlocks after the previous step")}
                      </p>
                    ) : (
                      <>
                        {stage.detail && <p className="font-semibold text-ink-950">{stage.detail}</p>}
                        {stage.note && (
                          <p className={cn(state === "attention" ? "text-amber-900" : state === "blocked" ? "text-red-800" : "text-muted-foreground")}>
                            {stage.note}
                          </p>
                        )}
                        {!stage.detail && !stage.note && (
                          <p className="text-muted-foreground">{highlighted ? "This is your next step." : "All done here."}</p>
                        )}
                      </>
                    )}
                  </div>

                  {state !== "locked" && (
                    <Link
                      href={meta.href}
                      className={cn(
                        highlighted
                          ? buttonVariants({ variant: "brand", size: "cta" })
                          : "group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600",
                        "shrink-0 self-start sm:self-center"
                      )}
                    >
                      {meta.actionLabels[stage.status]}
                      <ArrowRight className={cn("size-4", !highlighted && "transition-transform group-hover:translate-x-0.5")} aria-hidden />
                    </Link>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
