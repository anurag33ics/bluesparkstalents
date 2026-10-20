import Link from "next/link";
import { Bell, BellRing, Bookmark, Bot, Building2, CalendarClock, Clock, ExternalLink, Eye, Lightbulb, Megaphone, Sparkles, UserRound, UsersRound } from "lucide-react";
import { cn } from "cn";
import { ActionButton } from "@/components/forms/action-button";
import { ApiErrorState } from "@/components/journey/api-error-state";
import { EmptyState, IconTile, Panel, PanelLink, panelClass } from "@/components/journey/layout";
import { LocalTime } from "@/components/journey/local-time";
import { Meter, ProgressRing } from "@/components/journey/meter";
import { NotificationList } from "@/components/journey/notification-list";
import { StatusBadge } from "@/components/journey/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { markNotificationsRead } from "@/lib/actions/candidate";
import { getAiInterviews, getExpertInterviews, getHiring, getListing, getNotifications } from "@/lib/api/candidate";
import { opportunityStageLabels } from "@/lib/journey/labels";
import type { Opportunity } from "@/lib/journey/types";

export function PanelSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(panelClass, className)} aria-busy="true" aria-label="Loading">
      <Skeleton className="h-5 w-40 bg-brand-50" />
      <div className="mt-6 flex gap-4">
        <Skeleton className="size-14 rounded-2xl bg-brand-50" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4 bg-brand-50" />
          <Skeleton className="h-4 w-1/2 bg-brand-50" />
        </div>
      </div>
      <Skeleton className="mt-6 h-16 w-full bg-brand-50" />
    </div>
  );
}

/* Upcoming interviews and reminders ----------------------------------------- */

/** Recruiter interview rounds still ahead, soonest first. */
function upcomingRounds(opportunities: Opportunity[], now = Date.now()) {
  return opportunities
    .flatMap((opportunity) =>
      opportunity.rounds
        .filter((round) => round.status === "scheduled" && round.scheduledAt && Date.parse(round.scheduledAt) > now)
        .map((round) => ({ ...round, scheduledAt: round.scheduledAt!, company: opportunity.company, jobTitle: opportunity.jobTitle }))
    )
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt));
}

export async function UpcomingInterviewsPanel() {
  const [expert, hiring] = await Promise.all([getExpertInterviews(), getHiring()]);

  const current = expert.ok ? expert.data.current : null;
  const upcoming = current && (current.status === "scheduled" || current.status === "rescheduled") ? current : null;
  const recruiterRounds = hiring.ok ? upcomingRounds(hiring.data.opportunities) : [];

  return (
    <Panel title="Upcoming interviews" icon={CalendarClock} accent="fuchsia" action={<PanelLink href="/interview">Manage</PanelLink>}>
      {!expert.ok ? (
        <ApiErrorState error={expert.error} compact />
      ) : upcoming ? (
        <div className="flex flex-col gap-5">
          <div className="flex gap-4 rounded-2xl bg-linear-to-br from-fuchsia-50/70 via-white to-white p-4 ring-1 ring-fuchsia-100">
            {/* Calendar tile */}
            <span className="flex w-16 shrink-0 flex-col overflow-hidden rounded-xl bg-white text-center shadow-sm ring-1 ring-black/6">
              <span className="bg-brand-600 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                <LocalTime value={upcoming.startsAt} format="month" />
              </span>
              <span className="py-1.5 font-heading text-2xl font-medium text-ink-950">
                <LocalTime value={upcoming.startsAt} format="dayOfMonth" />
              </span>
            </span>
            <div className="min-w-0">
              <p className="font-heading text-lg font-medium text-ink-950">One-to-one interview</p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <UserRound className="size-3.5" aria-hidden />
                {upcoming.interviewer.name}, {upcoming.interviewer.title}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                <Clock className="size-3.5" aria-hidden />
                <LocalTime value={upcoming.startsAt} format="long" />
              </p>
              {upcoming.meetingUrl && (
                <a
                  href={upcoming.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "brand", size: "cta-sm" }), "mt-3")}
                >
                  Join meeting
                  <ExternalLink aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
          {upcoming.reminders.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Reminders</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-brand-950">
                {upcoming.reminders.map((reminder) => (
                  <li key={reminder} className="flex items-center gap-2">
                    <BellRing className="size-4 text-brand-500" aria-hidden />
                    Email reminder on <LocalTime value={reminder} format="datetime" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={CalendarClock}
          title="No one-to-one interview scheduled"
          description={expert.data.eligible ? "Pick a time with an expert interviewer that suits you." : expert.data.ineligibleReason ?? undefined}
          action={
            expert.data.eligible ? (
              <Link href="/interview" className={buttonVariants({ variant: "brand", size: "cta-sm" })}>
                Schedule interview
              </Link>
            ) : undefined
          }
        />
      )}

      {recruiterRounds.length > 0 && (
        <div className="mt-5 border-t border-brand-100 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Recruiter interviews</p>
          <ul className="mt-3 flex flex-col gap-3">
            {recruiterRounds.slice(0, 3).map((round) => (
              <li key={`${round.company}-${round.name}`} className="flex items-start gap-3 text-sm">
                <Building2 className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                <span>
                  <span className="font-semibold text-brand-950">
                    {round.name} · {round.company}
                  </span>
                  <span className="block text-muted-foreground">
                    {round.jobTitle} · <LocalTime value={round.scheduledAt} format="datetime" />
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

/* AI interview scores --------------------------------------------------------- */

export async function AiResultsPanel() {
  const result = await getAiInterviews();

  if (!result.ok) {
    return (
      <Panel title="AI interview results" icon={Bot} accent="indigo">
        <ApiErrorState error={result.error} compact />
      </Panel>
    );
  }

  const report = result.data.latestReport;

  return (
    <Panel
      title="AI interview results"
      icon={Bot}
      accent="indigo"
      action={report ? <PanelLink href={`/ai-interview/${report.sessionId}`}>Full report</PanelLink> : undefined}
    >
      {report ? (
        <div>
          <div className="flex items-center gap-4">
            <ProgressRing value={report.overallScore} label="Overall AI interview score" size={72} strokeWidth={7}>
              <span className="text-lg font-bold tabular-nums text-brand-950">{report.overallScore}</span>
            </ProgressRing>
            <div>
              <p className="font-semibold text-brand-950">{report.role}</p>
              <p className="text-sm text-muted-foreground">
                Overall score out of 100 · <LocalTime value={report.generatedAt} format="date" />
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
                <Bot className="size-3" aria-hidden />
                AI assessment
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {report.criteria.map((criterion) => (
              <Meter key={criterion.key} label={criterion.label} value={criterion.score} size="sm" />
            ))}
          </div>

          {report.suggestions[0] && (
            <p className="mt-5 flex gap-2.5 rounded-2xl bg-gold-50 p-3 text-sm leading-6 text-ink-950 ring-1 ring-gold-100">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden />
              <span>
                <span className="font-semibold">Next focus: </span>
                {report.suggestions[0]}
              </span>
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Practice feedback generated by AI. It isn&apos;t a hiring decision or a guarantee of any outcome.
          </p>
        </div>
      ) : (
        <EmptyState
          icon={Bot}
          title="No AI interview results yet"
          description={
            result.data.available
              ? "Practise a role-specific interview and get scores on technical knowledge, problem solving and communication."
              : result.data.unavailableReason ?? undefined
          }
          action={
            result.data.available ? (
              <Link href="/ai-interview" className={buttonVariants({ variant: "brand", size: "cta-sm" })}>
                Start AI interview
              </Link>
            ) : undefined
          }
        />
      )}
    </Panel>
  );
}

/* Recruiter activity ------------------------------------------------------------ */

export async function RecruiterActivityPanel() {
  const [listing, hiring] = await Promise.all([getListing(), getHiring()]);

  if (!listing.ok || !hiring.ok) {
    const error = !listing.ok ? listing.error : !hiring.ok ? hiring.error : null;
    return <Panel title="Recruiter activity" icon={Building2} accent="cyan">{error && <ApiErrorState error={error} compact />}</Panel>;
  }

  const { stats, status } = listing.data;
  const visible = status === "listed" || status === "paused";
  const pendingRequests = hiring.data.contactRequests.filter((request) => request.status === "pending");
  const recent = [...hiring.data.opportunities].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 3);

  if (!visible && recent.length === 0) {
    return (
      <Panel title="Recruiter activity" icon={Building2} accent="cyan">
        <EmptyState
          icon={Megaphone}
          title="You're not on the hiring portal yet"
          description="Profile views, shortlists and recruiter messages show up here once your profile is approved for listing."
          action={
            <Link href="/listing" className={buttonVariants({ variant: "brand-outline", size: "cta-sm" })}>
              View listing status
            </Link>
          }
        />
      </Panel>
    );
  }

  return (
    <Panel title="Recruiter activity" icon={Building2} accent="cyan" action={<PanelLink href="/hiring">Hiring status</PanelLink>}>
      {stats && (
        <dl className="grid grid-cols-3 gap-2.5">
          {(
            [
              { label: "Profile views", value: stats.profileViews, icon: Eye, accent: "sky" },
              { label: "Recruiter interest", value: stats.recruiterInterest, icon: Sparkles, accent: "violet" },
              { label: "Shortlists", value: stats.shortlists, icon: Bookmark, accent: "gold" },
            ] as const
          ).map((tile) => (
            <div key={tile.label} className="rounded-2xl border border-black/6 bg-white p-3">
              <IconTile icon={tile.icon} accent={tile.accent} className="size-8 rounded-lg [&_svg]:size-4" />
              <dd className="mt-3 font-heading text-3xl font-medium tabular-nums text-ink-950">{tile.value}</dd>
              <dt className="mt-0.5 text-[11px] font-bold uppercase leading-4 tracking-wider text-muted-foreground">{tile.label}</dt>
            </div>
          ))}
        </dl>
      )}
      {stats && <p className="mt-2 text-xs text-muted-foreground">Last {stats.windowDays} days</p>}

      {pendingRequests.length > 0 && (
        <Link
          href="/hiring#contact-requests"
          className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 transition-colors hover:bg-amber-100"
        >
          <UsersRound className="size-5 shrink-0 text-amber-700" aria-hidden />
          <span>
            <span className="font-semibold">
              {pendingRequests.length} recruiter{pendingRequests.length > 1 ? "s" : ""} asked for your contact details.
            </span>{" "}
            You decide whether to share them.
          </span>
        </Link>
      )}

      {recent.length > 0 && (
        <ul className="mt-5 flex flex-col divide-y divide-brand-100">
          {recent.map((opportunity) => (
            <li key={opportunity.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-brand-950">{opportunity.company}</span>
                <span className="block truncate text-sm text-muted-foreground">{opportunity.jobTitle}</span>
              </span>
              <StatusBadge status={opportunityStageLabels[opportunity.stage]} />
            </li>
          ))}
        </ul>
      )}
      {recent.length === 0 && pendingRequests.length === 0 && (
        <p className="mt-5 text-sm text-muted-foreground">
          No shortlists yet. Keep your availability current so recruiters know when you can start.
        </p>
      )}
    </Panel>
  );
}

/* Notifications ----------------------------------------------------------------- */

export async function NotificationsPanel() {
  const result = await getNotifications(5);

  if (!result.ok) {
    return (
      <Panel title="Updates" icon={Bell} accent="gold">
        <ApiErrorState error={result.error} compact />
      </Panel>
    );
  }

  const { items, unreadCount } = result.data;

  return (
    <Panel
      title="Updates"
      icon={Bell}
      accent="gold"
      description={unreadCount ? `${unreadCount} unread` : undefined}
      action={
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <ActionButton action={markNotificationsRead} variant="brand-ghost" size="cta-sm" success="Marked as read">
              Mark all read
            </ActionButton>
          )}
          <PanelLink href="/notifications">View all</PanelLink>
        </div>
      }
    >
      {items.length ? (
        <NotificationList items={items} className="-mx-3" />
      ) : (
        <EmptyState icon={Bell} title="You're all caught up" description="Status changes, reminders and recruiter messages will appear here." />
      )}
    </Panel>
  );
}
