import type { Metadata } from "next";
import Link from "next/link";
import { Loader2, ServerCrash } from "lucide-react";
import { AiReport } from "@/components/ai-interview/ai-report";
import { InterviewRunner } from "@/components/ai-interview/interview-runner";
import { ApiErrorState } from "@/components/journey/api-error-state";
import { AutoRefresh } from "@/components/journey/auto-refresh";
import { EmptyState } from "@/components/journey/layout";
import { StageFrame } from "@/components/journey/stage-frame";
import { buttonVariants } from "@/components/ui/button";
import { getAiInterview, getJourney } from "@/lib/api/candidate";
import type { AiInterviewSession } from "@/lib/journey/types";

export const metadata: Metadata = {
  title: "AI mock interview",
};

function SessionView({ session }: { session: AiInterviewSession }) {
  switch (session.status) {
    case "in_progress":
      return <InterviewRunner session={session} />;
    case "evaluating":
      return (
        <div className="flex flex-col items-center rounded-3xl border border-brand-100 bg-white px-6 py-14 text-center shadow-sm" role="status">
          <Loader2 className="size-10 animate-spin text-brand-600" aria-hidden />
          <p className="mt-5 font-heading text-xl font-medium text-brand-950">Assessing your answers…</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            This page updates automatically. You can also leave and we&apos;ll notify you when your report is ready.
          </p>
          <AutoRefresh seconds={5} />
        </div>
      );
    case "completed":
      return session.report ? <AiReport session={session} report={session.report} /> : null;
    case "failed":
      return (
        <EmptyState
          icon={ServerCrash}
          title="We couldn't assess this interview"
          description={session.failureReason ?? "Something went wrong while generating your report. Please start a new interview, or contact support if it happens again."}
          action={
            <Link href="/ai-interview" className={buttonVariants({ variant: "brand", size: "cta" })}>
              Start a new interview
            </Link>
          }
          className="bg-white py-14"
        />
      );
  }
}

export default async function AiInterviewSessionPage({ params }: PageProps<"/ai-interview/[sessionId]">) {
  const { sessionId } = await params;
  const [journey, session] = await Promise.all([getJourney(), getAiInterview(sessionId)]);

  return (
    <StageFrame stageKey="ai_interview" journey={journey}>
      <Link href="/ai-interview" className="mb-5 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
        ← All AI interviews
      </Link>
      {session.ok ? <SessionView session={session.data} /> : <ApiErrorState error={session.error} />}
    </StageFrame>
  );
}
