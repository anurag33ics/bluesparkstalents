import Link from "next/link";
import { ArrowRight, Bot, CircleCheck, Lightbulb, RotateCcw, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Panel } from "@/components/journey/layout";
import { LocalTime } from "@/components/journey/local-time";
import { Meter, ProgressRing } from "@/components/journey/meter";
import { buttonVariants } from "@/components/ui/button";
import { experienceLevelLabels } from "@/lib/journey/labels";
import type { AiInterviewReport, AiInterviewSession } from "@/lib/journey/types";
import { AiDisclaimer } from "./ai-disclaimer";

function scoreBand(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 50) return "Developing";
  return "Needs practice";
}

function ListCard({ title, items, icon: Icon, iconClass }: { title: string; items: string[]; icon: typeof CircleCheck; iconClass: string }) {
  return (
    <Panel title={title} headingLevel={3}>
      {items.length ? (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-6 text-brand-950">
              <Icon className={cn("mt-1 size-4 shrink-0", iconClass)} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing noted.</p>
      )}
    </Panel>
  );
}

export function AiReport({ session, report }: { session: AiInterviewSession; report: AiInterviewReport }) {
  const questions = [...session.questions].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="report-heading" className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm shadow-brand-500/5">
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-center">
          <ProgressRing value={report.overallScore} label="Overall AI interview score" size={148} strokeWidth={12}>
            <span className="font-heading text-4xl font-medium tabular-nums text-brand-950">{report.overallScore}</span>
            <span className="text-xs font-semibold text-muted-foreground">out of 100</span>
          </ProgressRing>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
              <Bot className="size-3.5" aria-hidden />
              AI assessment
            </span>
            <h2 id="report-heading" className="mt-3 font-heading text-2xl font-medium text-brand-950">
              {scoreBand(report.overallScore)} performance
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {session.role} · {experienceLevelLabels[session.experienceLevel]} · {session.skillCategory} · <LocalTime value={report.generatedAt} format="date" />
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {report.criteria.map((criterion) => (
                <div key={criterion.key}>
                  <Meter label={criterion.label} value={criterion.score} />
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{criterion.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-brand-100 bg-brand-50/40 p-4 sm:px-8">
          <AiDisclaimer className="border-0 bg-transparent p-0" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <ListCard title="Strengths" items={report.strengths} icon={CircleCheck} iconClass="text-emerald-600" />
        <ListCard title="Areas to improve" items={report.weaknesses} icon={TriangleAlert} iconClass="text-amber-600" />
        <ListCard title="How to improve" items={report.suggestions} icon={Lightbulb} iconClass="text-brand-600" />
      </div>

      <Panel title="Your answers" description="Review what you said for each question.">
        <ul className="flex flex-col gap-2">
          {questions.map((question) => (
            <li key={question.id}>
              <details className="group rounded-2xl border border-brand-100 bg-white open:bg-brand-50/30">
                <summary className="flex cursor-pointer list-none items-start gap-3 rounded-2xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 [&::-webkit-details-marker]:hidden">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">{question.order}</span>
                  <span className="flex-1 text-sm font-semibold leading-6 text-brand-950">{question.prompt}</span>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-brand-400 transition-transform group-open:rotate-90" aria-hidden />
                </summary>
                <p className="px-4 pb-4 pl-14 text-sm leading-6 whitespace-pre-line text-muted-foreground">{question.answer ?? "No answer given."}</p>
              </details>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="flex flex-wrap gap-3">
        <Link href="/ai-interview" className={buttonVariants({ variant: "brand-outline", size: "cta" })}>
          <RotateCcw aria-hidden />
          Practise again
        </Link>
        <Link href="/interview" className={buttonVariants({ variant: "brand", size: "cta" })}>
          Next: one-to-one interview
          <ArrowRight aria-hidden />
        </Link>
      </div>
    </div>
  );
}
