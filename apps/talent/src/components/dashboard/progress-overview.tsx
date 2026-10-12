import Link from "next/link";
import { Award, ChevronRight, Flag, Gauge } from "lucide-react";
import type { StudentProgress } from "@/lib/student";

const cardClass = "flex flex-col rounded-3xl border border-brand-100 bg-white p-6 shadow-sm shadow-brand-500/5";
const headingClass = "text-xs font-bold uppercase tracking-[0.16em] text-brand-950";
const buttonClass = "mt-auto inline-flex items-center justify-center self-start rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500";

function ProgressRing({ value }: { value: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative size-16 shrink-0" role="img" aria-label={`${value}% complete`}>
      <svg viewBox="0 0 64 64" className="size-full -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="6" className="stroke-viz-track" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className="stroke-viz-stage-2"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-brand-950">
        {value}%
      </span>
    </div>
  );
}

function CardLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} aria-label={label} className="flex size-8 items-center justify-center rounded-lg text-brand-400 transition-colors duration-300 hover:bg-brand-50 hover:text-brand-600">
      <ChevronRight className="size-5" />
    </Link>
  );
}

export function ProgressOverview({ progress }: { progress: StudentProgress }) {
  const { milestones, badges, ongoing, upNext } = progress;
  const milestonePercent = milestones.total ? (milestones.completed / milestones.total) * 100 : 0;

  return (
    <section aria-label="Your progress" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

      {/* My progress */}
      <div className={`${cardClass} md:col-span-2 lg:col-span-1`}>
        <div className="flex items-center justify-between">
          <h2 className={headingClass}>My Progress</h2>
          <Link href="/progress" className="group inline-flex items-center gap-0.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
            Know more
            <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Flag className="size-5" />
          </span>
          <div>
            <p className="text-xl font-bold text-brand-950">
              {milestones.completed}/{milestones.total}
            </p>
            <p className="text-sm text-muted-foreground">Milestones completed</p>
          </div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-viz-track" aria-hidden>
          <div className="h-full rounded-full bg-viz-stage-2" style={{ width: `${milestonePercent}%` }} />
        </div>

        <div className="my-5 h-px bg-brand-100" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Gauge className="size-5" />
            </span>
            <div>
              <p className="font-bold text-amber-600">{progress.profileLevel}</p>
              <p className="text-xs text-muted-foreground">Profile level</p>
              <Link href="/profile" className="mt-1 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700">
                Evaluate now
              </Link>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Award className="size-5" />
            </span>
            <div>
              <p className="text-xl font-bold leading-6 text-brand-950">
                {badges.unlocked}/{badges.total}
              </p>
              <p className="text-xs text-muted-foreground">Badges unlocked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing */}
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <h2 className={headingClass}>Ongoing</h2>
          <CardLink href={ongoing.href} label={`Open ${ongoing.title}`} />
        </div>

        <div className="mt-5 flex gap-4">
          <ProgressRing value={ongoing.percent} />
          <div>
            <h3 className="font-semibold text-brand-950">{ongoing.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{ongoing.description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-1 flex-col pl-20">
          <Link href={ongoing.href} className={buttonClass}>
            Continue
          </Link>
        </div>
      </div>

      {/* Coming up next */}
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <h2 className={headingClass}>Coming Up Next</h2>
          <CardLink href={upNext.href} label={`Open ${upNext.title}`} />
        </div>

        <h3 className="mt-5 font-semibold text-brand-950">{upNext.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{upNext.description}</p>

        <div className="mt-6 flex flex-1 flex-col">
          <Link href={upNext.href} className={buttonClass}>
            Start now
          </Link>
        </div>
      </div>

    </section>
  );
}
