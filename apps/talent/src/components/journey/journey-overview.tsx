import Link from "next/link";
import { ArrowRight, Compass, ListChecks, PartyPopper } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { stageStatusLabels } from "@/lib/journey/labels";
import { journeyProgress, primaryAction } from "@/lib/journey/progress";
import { stageCount, stages } from "@/lib/journey/stages";
import type { Journey } from "@/lib/journey/types";
import { accentTile, stageAccent } from "./accents";
import { JourneyStepper } from "./journey-stepper";
import { ProgressRing } from "./meter";
import { stageIcons } from "./stage-icons";
import { StatusBadge } from "./status-badge";

export function JourneyOverview({ journey, name }: { journey: Journey; name: string }) {
  const progress = journeyProgress(journey);
  const { current } = progress;
  const action = primaryAction(current);
  const meta = current ? stages[current.key] : null;
  const Icon = meta ? stageIcons[meta.key] : PartyPopper;

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="scroll-mt-28 overflow-hidden rounded-[2rem] bg-white shadow-[0_1px_2px_rgba(11,21,51,0.04),0_24px_48px_-24px_rgba(11,21,51,0.18)] ring-1 ring-black/6"
    >
      <div className="relative overflow-hidden bg-linear-to-br from-white via-white to-brand-50/70 p-6 sm:p-10">
        {/* Soft light and texture */}
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-24 size-[30rem] rounded-full bg-brand-100/60 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 left-1/4 size-96 rounded-full bg-gold-100/70 blur-3xl" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(11,21,51,0.9)_1px,transparent_1px)] [background-size:22px_22px]"
        />

        <div className="relative border-b border-black/6 pb-8">
          <h1 className="font-heading text-4xl font-medium tracking-tight text-ink-950 sm:text-5xl">
            Welcome back, <span className="text-brand-600">{name}</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Here&apos;s where you are on your way to getting hired.
          </p>
        </div>

        <div className="relative mt-8 grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <div className="flex items-start gap-4">
              <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1", accentTile[meta ? stageAccent[meta.key] : "gold"])}>
                <Icon className="size-6" strokeWidth={1.8} aria-hidden />
              </span>
              <div>
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                  {meta ? `Step ${meta.step} of ${stageCount}` : "All steps complete"}
                </span>
                <h2 id="journey-heading" className="mt-2 font-heading text-3xl leading-tight font-medium tracking-tight text-ink-950 sm:text-4xl">
                  {meta ? meta.title : "You're hired. Congratulations!"}
                </h2>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {current?.note ?? meta?.description ?? "Your hiring record is saved. Keep your availability up to date for future opportunities."}
            </p>

            {current && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <StatusBadge status={stageStatusLabels[current.status]} />
                {current.detail && <span className="text-sm text-muted-foreground">{current.detail}</span>}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={action.href} className={cn(buttonVariants({ variant: "gold", size: "cta" }), "group h-11 px-6")}>
                {action.label}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-5 md:flex-col md:gap-4">
            <ProgressRing
              value={progress.percent}
              label="Overall journey completion"
              size={160}
              strokeWidth={11}
              trackClassName="stroke-slate-100"
              indicatorClassName="stroke-gold-400"
            >
              <span className="font-heading text-5xl font-medium tabular-nums text-ink-950">
                {progress.percent}
                <span className="text-2xl text-slate-400">%</span>
              </span>
              <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">complete</span>
            </ProgressRing>
            <p className="text-sm text-muted-foreground md:text-center">
              <span className="font-heading text-lg font-medium text-ink-950">{progress.completed}</span> of {progress.total} steps done
            </p>
          </div>
        </div>
      </div>

      {/* Desktop at-a-glance stepper; the step-by-step list below covers smaller screens. */}
      <div className="hidden border-t border-black/6 px-8 py-9 lg:block">
        <JourneyStepper journey={journey.stages} currentKey={current?.key ?? null} horizontalOnly />
      </div>
    </section>
  );
}
