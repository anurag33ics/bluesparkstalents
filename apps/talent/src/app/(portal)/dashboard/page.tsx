import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AiResultsPanel,
  NotificationsPanel,
  PanelSkeleton,
  RecruiterActivityPanel,
  UpcomingInterviewsPanel,
} from "@/components/dashboard/activity-panels";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { ApiErrorState } from "@/components/journey/api-error-state";
import { AutoRefresh } from "@/components/journey/auto-refresh";
import { JourneyOverview } from "@/components/journey/journey-overview";
import { JourneySteps } from "@/components/journey/journey-steps";
import { PageShell, SectionHeader } from "@/components/journey/layout";
import { getCurrentUser, getJourney } from "@/lib/api/candidate";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const [user, journey] = await Promise.all([getCurrentUser(), getJourney()]);

  return (
    <PageShell>
      <WelcomeHeader
        name={user.ok ? user.data.firstName : "there"}
        hiringStatus={journey.ok ? journey.data.hiringStatus : null}
        planName={journey.ok ? journey.data.activePlanName : null}
      />

      <div className="mt-8 flex flex-col gap-12">
        {journey.ok ? (
          <>
            <JourneyOverview journey={journey.data} />
            <JourneySteps journey={journey.data} />
            {/* Picks up changes made by others (reviewers, interviewers, payment confirmation) while the page is open. */}
            <AutoRefresh seconds={30} />

            {/* Each panel loads and fails on its own, so one slow service doesn't block the page. */}
            <section aria-labelledby="activity-heading">
              <SectionHeader
                id="activity-heading"
                eyebrow="Activity"
                title="What's happening"
                description="Interviews, AI feedback, recruiter interest and the latest updates on your journey."
              />
              <div className="grid gap-5 lg:grid-cols-2">
                <Suspense fallback={<PanelSkeleton />}>
                  <UpcomingInterviewsPanel />
                </Suspense>
                <Suspense fallback={<PanelSkeleton />}>
                  <AiResultsPanel />
                </Suspense>
                <Suspense fallback={<PanelSkeleton />}>
                  <RecruiterActivityPanel />
                </Suspense>
                <Suspense fallback={<PanelSkeleton />}>
                  <NotificationsPanel />
                </Suspense>
              </div>
            </section>
          </>
        ) : (
          <ApiErrorState error={journey.error} />
        )}


      </div>
    </PageShell>
  );
}
