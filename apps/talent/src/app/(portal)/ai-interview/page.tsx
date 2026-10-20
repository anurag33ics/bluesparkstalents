import type { Metadata } from "next";
import Link from "next/link";
import { Bot, History } from "lucide-react";
import { AiDisclaimer } from "@/components/ai-interview/ai-disclaimer";
import { AiSetupForm } from "@/components/ai-interview/ai-setup-form";
import { ApiErrorState } from "@/components/journey/api-error-state";
import { EmptyState, Panel, PanelLink } from "@/components/journey/layout";
import { LocalTime } from "@/components/journey/local-time";
import { Meter, ProgressRing } from "@/components/journey/meter";
import { StageFrame } from "@/components/journey/stage-frame";
import { StatusBadge } from "@/components/journey/status-badge";
import { getAiInterviews, getJourney, getProfile } from "@/lib/api/candidate";
import { aiInterviewStatusLabels, experienceLevelLabels } from "@/lib/journey/labels";
import type { AiInterviewOverview, CandidateProfile } from "@/lib/journey/types";

export const metadata: Metadata = {
  title: "AI mock interview",
};

function AiInterviewHome({ overview, profile }: { overview: AiInterviewOverview; profile: CandidateProfile | null }) {
  const report = overview.latestReport;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-6">
        <AiDisclaimer />

        {overview.available ? (
          <Panel
            title="Start a mock interview"
            description="Pick the role you're targeting. Questions are tailored to the role, level and skill area."
            action={
              overview.attemptsRemaining !== null ? (
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-200">
                  {overview.attemptsRemaining} attempt{overview.attemptsRemaining === 1 ? "" : "s"} left
                </span>
              ) : undefined
            }
          >
            <AiSetupForm options={overview.options} defaults={{ role: profile?.preferences.desiredRoles[0] }} />
          </Panel>
        ) : (
          <Panel title="Start a mock interview">
            <EmptyState icon={Bot} title="AI interviews aren't available yet" description={overview.unavailableReason ?? undefined} />
          </Panel>
        )}

        <Panel title="Your interviews">
          {overview.sessions.length ? (
            <ul className="flex flex-col divide-y divide-brand-100">
              {overview.sessions.map((session) => (
                <li key={session.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-950">{session.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {experienceLevelLabels[session.experienceLevel]} · {session.skillCategory} · <LocalTime value={session.startedAt} format="date" />
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.overallScore !== null ? (
                      <span className="text-sm font-bold tabular-nums text-brand-950">{session.overallScore}/100</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {session.answeredCount}/{session.questionCount} answered
                      </span>
                    )}
                    <StatusBadge status={aiInterviewStatusLabels[session.status]} />
                    <PanelLink href={`/ai-interview/${session.id}`}>{session.status === "in_progress" ? "Resume" : "View"}</PanelLink>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={History} title="No interviews yet" description="Your interview history and reports will be saved here." />
          )}
        </Panel>
      </div>

      <aside className="lg:sticky lg:top-28">
        {report ? (
          <Panel title="Latest result" action={<PanelLink href={`/ai-interview/${report.sessionId}`}>Report</PanelLink>}>
            <div className="flex items-center gap-4">
              <ProgressRing value={report.overallScore} label="Latest overall AI interview score" size={76} strokeWidth={7}>
                <span className="text-lg font-bold tabular-nums text-brand-950">{report.overallScore}</span>
              </ProgressRing>
              <div>
                <p className="font-semibold text-brand-950">{report.role}</p>
                <p className="text-sm text-muted-foreground">Out of 100</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {report.criteria.map((criterion) => (
                <Meter key={criterion.key} label={criterion.label} value={criterion.score} size="sm" />
              ))}
            </div>
          </Panel>
        ) : (
          <Panel title="How it works">
            <ol className="flex flex-col gap-4 text-sm leading-6 text-brand-950">
              {[
                "Choose a role, level and skill category.",
                "Answer each question in your own words. Answers save as you go.",
                "Finish to get scores on technical knowledge, problem solving and communication, plus tips to improve.",
              ].map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs text-muted-foreground">
              Want feedback from a person too? <Link href="/interview" className="font-semibold text-brand-600 hover:underline">Book a one-to-one interview</Link> after this step.
            </p>
          </Panel>
        )}
      </aside>
    </div>
  );
}

export default async function AiInterviewPage() {
  const [journey, overview, profile] = await Promise.all([getJourney(), getAiInterviews(), getProfile()]);

  return (
    <StageFrame stageKey="ai_interview" journey={journey}>
      {overview.ok ? (
        <AiInterviewHome overview={overview.data} profile={profile.ok ? profile.data : null} />
      ) : (
        <ApiErrorState error={overview.error} />
      )}
    </StageFrame>
  );
}
