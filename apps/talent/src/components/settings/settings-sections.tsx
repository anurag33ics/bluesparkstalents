import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleCheck,
  CircleHelp,
  Clock3,
  Crown,
  Download,
  Eye,
  Globe,
  KeyRound,
  LifeBuoy,
  LogIn,
  Mail,
  Monitor,
  PauseCircle,
  Receipt,
  Smartphone,
  Tablet,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { cn } from "cn";
import { ActionButton } from "@/components/forms/action-button";
import { ApiErrorState } from "@/components/journey/api-error-state";
import { DetailList, Panel, PanelLink } from "@/components/journey/layout";
import { LocalTime } from "@/components/journey/local-time";
import { StatusBadge } from "@/components/journey/status-badge";
import { PaymentHistory } from "@/components/plans/plans-view";
import { buttonVariants } from "@/components/ui/button";
import {
  cancelAccountDeletion,
  cancelEmailChange,
  disconnectGoogle,
  requestDataExport,
  setListingPaused,
  signOutOtherSessions,
  signOutSession,
} from "@/lib/actions/candidate";
import type { ApiResult } from "@/lib/api/result";
import { supportEmail } from "@/lib/config";
import { canonicalTimeZone, formatRelative, initials } from "@/lib/format";
import { listingStatusLabels } from "@/lib/journey/labels";
import type { AccountSettings, ActiveSession, Billing, CurrentUser, Hiring, Listing } from "@/lib/journey/types";
import {
  AvailabilityForm,
  DeleteAccountDialog,
  EmailChangeForm,
  NotificationsForm,
  PasswordForm,
  TimeZoneForm,
  VisibilityForm,
} from "./settings-forms";
import { settingsSections, type SettingsSection } from "./settings-nav";

/** Every IANA zone, labelled with its current UTC offset and sorted by name so typing a city jumps to it. */
function timeZoneOptions(current: string): Record<string, string> {
  const now = new Date();
  // One entry per zone, keyed by canonical id, so aliases don't show up twice.
  const zones = new Map<string, string>();
  for (const zone of [...Intl.supportedValuesOf("timeZone"), "UTC"]) {
    const id = canonicalTimeZone(zone);
    if (id && !zones.has(id)) zones.set(id, zone);
  }
  // Keep the saved spelling (e.g. Asia/Kolkata) rather than the runtime's older alias.
  const currentId = canonicalTimeZone(current);
  if (currentId) zones.set(currentId, current);

  const options: Record<string, string> = {};
  for (const zone of [...zones.values()].sort()) {
    const offset =
      new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value ?? "GMT";
    options[zone] = `${zone.replaceAll("_", " ")} (${offset === "GMT" ? "GMT+00:00" : offset})`;
  }
  return options;
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-6 text-muted-foreground">{children}</p>;
}

/* Personal & Recruiter Profile ------------------------------------------------------- */

function ListingControl({ listing }: { listing: Listing }) {
  if (listing.status === "listed" || listing.status === "paused") {
    const paused = listing.status === "paused";
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Hint>
          {paused
            ? "Your listing is paused, so recruiters can't find you. Resume it whenever you're ready."
            : "Taking a break? Pause your listing and recruiters won't find you until you resume it."}
        </Hint>
        <ActionButton
          action={setListingPaused.bind(null, !paused)}
          success={paused ? "Listing resumed" : "Listing paused"}
          variant={paused ? "brand" : "brand-outline"}
          confirm={
            paused
              ? undefined
              : {
                  title: "Pause your listing?",
                  description: "Recruiters won't be able to find your profile until you resume it.",
                  confirmLabel: "Pause listing",
                }
          }
        >
          {paused ? "Resume listing" : "Pause listing"}
        </ActionButton>
      </div>
    );
  }

  return (
    <Hint>
      You&apos;re not on the hiring portal yet. Once you&apos;re listed you can pause and resume your listing here. The visibility choices
      above apply from your first day on the portal.
    </Hint>
  );
}

export function ProfileSection({
  user,
  settings,
  listing,
  hiring,
}: {
  user: CurrentUser;
  settings: AccountSettings;
  listing: ApiResult<Listing>;
  hiring: ApiResult<Hiring>;
}) {
  const name = `${user.firstName} ${user.lastName}`.trim();

  return (
    <>
      <Panel
        title="Your account"
        description="The basics recruiters and our team know you by."
        icon={UserRound}
        accent="blue"
        headingLevel={3}
        action={<PanelLink href="/profile?section=personal">Edit profile</PanelLink>}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gold-100 font-heading text-2xl font-medium text-gold-700 ring-1 ring-gold-200">
            {initials(name)}
          </span>
          <DetailList
            className="flex-1"
            items={[
              { label: "Full name", value: name },
              { label: "Sign-in email", value: settings.email },
              { label: "Mobile number", value: settings.phone ?? <span className="text-muted-foreground">Not added</span> },
              { label: "Member since", value: <LocalTime value={settings.createdAt} format="date" /> },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Time zone" description="So interview times and reminders match your clock." icon={Globe} accent="teal" headingLevel={3}>
        <TimeZoneForm timeZone={settings.timeZone} options={timeZoneOptions(settings.timeZone)} />
      </Panel>

      <Panel title="Notifications" description="Choose how you hear about each kind of update." icon={Bell} accent="gold" headingLevel={3}>
        <NotificationsForm preferences={settings.notifications} required={settings.requiredNotifications} phone={settings.phone} />
      </Panel>

      <Panel
        title="Job search status"
        description="Tell recruiters whether you're open to offers right now."
        icon={BriefcaseBusiness}
        accent="teal"
        headingLevel={3}
      >
        {hiring.ok ? <AvailabilityForm availability={hiring.data.availability} /> : <ApiErrorState error={hiring.error} compact />}
      </Panel>

      <Panel
        title="What recruiters see"
        description="Choose what's on your hiring portal profile."
        icon={Eye}
        accent="violet"
        headingLevel={3}
        action={listing.ok && <StatusBadge status={listingStatusLabels[listing.data.status]} size="md" />}
      >
        {listing.ok ? <VisibilityForm visibility={listing.data.visibility} /> : <ApiErrorState error={listing.error} compact />}
      </Panel>

      {listing.ok && (
        <Panel title="Listing" icon={PauseCircle} accent="sky" headingLevel={3}>
          <ListingControl listing={listing.data} />
        </Panel>
      )}
    </>
  );
}

/* Security & Login ------------------------------------------------------------------- */

const deviceIcons: Record<ActiveSession["deviceType"], typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

function SessionRow({ session }: { session: ActiveSession }) {
  const Icon = deviceIcons[session.deviceType];

  return (
    <li className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
        <Icon className="size-5" strokeWidth={1.8} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-brand-950">
          {session.device}
          {session.current && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              This device
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {[session.location, session.current ? "Active now" : `Active ${formatRelative(session.lastActiveAt)}`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      {!session.current && (
        <ActionButton action={signOutSession.bind(null, session.id)} success="Signed out of that device" variant="brand-outline" size="cta-sm">
          Sign out
        </ActionButton>
      )}
    </li>
  );
}

function DataExportState({ settings }: { settings: AccountSettings }) {
  const exportState = settings.dataExport;

  if (exportState?.status === "pending") {
    return (
      <p className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200" role="status">
        <Clock3 className="size-4 shrink-0 text-slate-500" aria-hidden />
        <span>
          Preparing your file, requested <LocalTime value={exportState.requestedAt} format="datetime" />. We&apos;ll email you when
          it&apos;s ready.
        </span>
      </p>
    );
  }

  if (exportState?.status === "ready" && exportState.url) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-emerald-800">
          Your file is ready.
          {exportState.expiresAt && (
            <>
              {" "}
              The link works until <LocalTime value={exportState.expiresAt} format="date" />.
            </>
          )}
        </p>
        <a href={exportState.url} download className={cn(buttonVariants({ variant: "brand", size: "cta-sm" }))}>
          <Download aria-hidden />
          Download
        </a>
      </div>
    );
  }

  return (
    <div>
      <ActionButton action={requestDataExport} success="We're preparing your file" variant="brand-outline">
        <Download aria-hidden />
        {exportState?.status === "expired" ? "Request a new copy" : "Request my data"}
      </ActionButton>
    </div>
  );
}

function DeleteAccountPanel({ settings }: { settings: AccountSettings }) {
  return (
    <section aria-labelledby="delete-account-heading" className="rounded-3xl border border-red-200 bg-red-50/40 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
          <TriangleAlert className="size-5" strokeWidth={1.9} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id="delete-account-heading" className="font-heading text-xl font-medium tracking-tight text-ink-950">
            Delete account
          </h3>
          {settings.deletionScheduledFor ? (
            <div className="mt-3 flex flex-col gap-4">
              <p className="text-sm leading-6 text-red-800">
                Your account will be permanently deleted on <LocalTime value={settings.deletionScheduledFor} format="date" />. Changed your
                mind? Keep it and everything stays as it was.
              </p>
              <div>
                <ActionButton action={cancelAccountDeletion} success="Your account is safe" variant="brand">
                  Keep my account
                </ActionButton>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-4">
              <ul className="flex flex-col gap-1.5 text-sm leading-6 text-slate-700">
                <li className="flex gap-2">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-red-400" aria-hidden />
                  Your profile is removed from the hiring portal straight away.
                </li>
                <li className="flex gap-2">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-red-400" aria-hidden />
                  Your account and data are deleted for good after {settings.deletionGraceDays} days. You can cancel until then.
                </li>
                <li className="flex gap-2">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-red-400" aria-hidden />
                  Payment records are kept only as long as the law requires.
                </li>
              </ul>
              <p className="text-sm leading-6 text-slate-700">Want a copy first? Download your data above before you go.</p>
              <div>
                <DeleteAccountDialog hasPassword={settings.signIn.hasPassword} graceDays={settings.deletionGraceDays} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function SecuritySection({ settings }: { settings: AccountSettings }) {
  const { signIn } = settings;
  const others = settings.sessions.filter((session) => !session.current);
  const sessions = [...settings.sessions].sort(
    (a, b) => Number(b.current) - Number(a.current) || Date.parse(b.lastActiveAt) - Date.parse(a.lastActiveAt)
  );

  return (
    <>
      <Panel title="Sign-in email" description="Where we send sign-in links, receipts and important updates." icon={Mail} accent="sky" headingLevel={3}>
        {settings.pendingEmail && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-brand-800">
              Waiting for you to confirm <span className="font-semibold">{settings.pendingEmail}</span>. Check that inbox for the link.
            </p>
            <ActionButton action={cancelEmailChange} success="Email change cancelled" variant="brand-outline" size="cta-sm">
              Cancel change
            </ActionButton>
          </div>
        )}
        <EmailChangeForm hasPassword={signIn.hasPassword} />
      </Panel>

      <Panel
        title={signIn.hasPassword ? "Password" : "Set a password"}
        description={
          signIn.hasPassword && signIn.passwordChangedAt
            ? `Last changed ${formatRelative(signIn.passwordChangedAt)}.`
            : "Use a strong password you don't use anywhere else."
        }
        icon={KeyRound}
        accent="teal"
        headingLevel={3}
      >
        <PasswordForm hasPassword={signIn.hasPassword} />
      </Panel>

      <Panel title="Sign-in methods" description="Ways you can get into your account." icon={LogIn} accent="indigo" headingLevel={3}>
        <ul className="divide-y divide-black/6">
          <li className="flex items-center justify-between gap-4 pb-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-950">Email and password</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{settings.email}</p>
            </div>
            {signIn.hasPassword ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CircleCheck className="size-4" aria-hidden />
                On
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500">Not set up</span>
            )}
          </li>
          <li className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-950">Google</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                {signIn.google ? (
                  <>
                    Connected as {signIn.google.email} since <LocalTime value={signIn.google.connectedAt} format="date" />
                  </>
                ) : (
                  "Not connected. Choose “Continue with Google” when you sign in to link it."
                )}
              </p>
            </div>
            {signIn.google &&
              (signIn.hasPassword ? (
                <ActionButton
                  action={disconnectGoogle}
                  success="Google disconnected"
                  variant="brand-outline"
                  size="cta-sm"
                  confirm={{
                    title: "Disconnect Google?",
                    description: "You'll sign in with your email and password from now on. You can link Google again later.",
                    confirmLabel: "Disconnect",
                  }}
                >
                  Disconnect
                </ActionButton>
              ) : (
                <p className="text-xs text-muted-foreground sm:max-w-48 sm:text-right">Set a password before disconnecting Google.</p>
              ))}
          </li>
        </ul>
      </Panel>

      <Panel
        title="Where you're signed in"
        description="Sign out of any device you don't recognise, then change your password."
        icon={Monitor}
        accent="blue"
        headingLevel={3}
        action={
          others.length > 0 && (
            <ActionButton
              action={signOutOtherSessions}
              success="Signed out of other devices"
              variant="brand-outline"
              size="cta-sm"
              confirm={{
                title: "Sign out everywhere else?",
                description: `You'll stay signed in here. The other ${others.length === 1 ? "device" : `${others.length} devices`} will need to sign in again.`,
                confirmLabel: "Sign out others",
              }}
            >
              Sign out of all other devices
            </ActionButton>
          )
        }
      >
        <ul className="divide-y divide-black/6">
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </ul>
      </Panel>

      <Panel
        title="Download your data"
        description="A copy of your profile, documents, interview reports, payments and activity."
        icon={Download}
        accent="sky"
        headingLevel={3}
      >
        <div className="flex flex-col gap-4">
          <Hint>We&apos;ll prepare a downloadable file and email you when it&apos;s ready.</Hint>
          <DataExportState settings={settings} />
        </div>
      </Panel>

      <DeleteAccountPanel settings={settings} />
    </>
  );
}

/* Subscription & Billing ---------------------------------------------------------------- */

export function BillingSection({ billing }: { billing: Billing }) {
  const plan = billing.activePlan;
  const features = plan?.planId === billing.plan.id ? billing.plan.features : [];
  const payments = [...billing.payments].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return (
    <>
      <Panel
        title="Your subscription"
        description={plan ? "Your current plan and what it includes." : "Unlock verification, interviews and your listing."}
        icon={Crown}
        accent="gold"
        headingLevel={3}
        action={plan && <PanelLink href="/plans">Plan details</PanelLink>}
      >
        {plan ? (
          <div className="flex flex-col gap-6">
            <DetailList
              items={[
                { label: "Current plan", value: plan.name },
                { label: "Active since", value: <LocalTime value={plan.activatedAt} format="date" /> },
                {
                  label: "Valid until",
                  value: plan.expiresAt ? <LocalTime value={plan.expiresAt} format="date" /> : "No expiry",
                },
              ]}
              className="sm:grid-cols-3"
            />
            {features.length > 0 && (
              <div className="border-t border-black/6 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Included in your plan</p>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-950">
                      <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Hint>You don&apos;t have an active plan yet. Choose one to unlock verification, interviews and your listing.</Hint>
            <Link href="/plans" className={cn(buttonVariants({ variant: "brand", size: "cta" }), "shrink-0 self-start sm:self-center")}>
              See plans
            </Link>
          </div>
        )}
      </Panel>

      <Panel title="Payment history" description="Transaction details and downloadable invoices." icon={Receipt} accent="sky" headingLevel={3}>
        <PaymentHistory payments={payments} />
      </Panel>
    </>
  );
}

/* Help & Support ------------------------------------------------------------------------ */

function SectionLink({ section }: { section: SettingsSection }) {
  return (
    <Link href={`/settings?section=${section}`} scroll={false} className="font-semibold text-brand-600 hover:text-brand-700">
      {settingsSections[section].title}
    </Link>
  );
}

const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: "How do I change the email I sign in with?",
    answer: (
      <>
        Open <SectionLink section="security" /> and enter the new address under Sign-in email. We&apos;ll send a link to it, and you keep
        signing in with your current email until you confirm.
      </>
    ),
  },
  {
    question: "I forgot my password. What should I do?",
    answer: <>Sign out, then choose &ldquo;Forgot password&rdquo; on the sign-in page.</>,
  },
  {
    question: "Can recruiters see my email or phone number?",
    answer: (
      <>
        No. Recruiters have to ask for your contact details, and you decide. Choose what else they see in <SectionLink section="profile" />.
      </>
    ),
  },
  {
    question: "How do I stop recruiters finding me for a while?",
    answer: (
      <>
        Pause your listing in <SectionLink section="profile" />. Recruiters won&apos;t find you until you resume it.
      </>
    ),
  },
  {
    question: "Where are my invoices?",
    answer: (
      <>
        Under Payment history in <SectionLink section="billing" />. Download any invoice from there.
      </>
    ),
  },
  {
    question: "A payment failed. What now?",
    answer: (
      <>
        You can try again from{" "}
        <Link href="/plans" className="font-semibold text-brand-600 hover:text-brand-700">
          Plans
        </Link>
        . If money left your account for a failed payment, write to us with the reference shown in Payment history.
      </>
    ),
  },
  {
    question: "How do I delete my account?",
    answer: (
      <>
        Open <SectionLink section="security" /> and choose Delete account. Your profile leaves the hiring portal straight away, and you can
        cancel any time before the deletion date.
      </>
    ),
  },
];

export function SupportSection() {
  return (
    <>
      <Panel title="Common questions" description="Quick answers about your account, privacy and payments." icon={CircleHelp} accent="sky" headingLevel={3}>
        <ul className="-my-3 divide-y divide-black/6">
          {faqs.map((faq) => (
            <li key={faq.question}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl py-3 text-sm font-semibold text-brand-950 outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="pb-4 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Still need help?"
        description="Questions about your account, payments or privacy? Write to us and we'll help."
        icon={LifeBuoy}
        accent="violet"
        headingLevel={3}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Email us</p>
            <a href={`mailto:${supportEmail}`} className="mt-1 inline-flex text-sm font-semibold break-all text-brand-600 hover:text-brand-700">
              {supportEmail}
            </a>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Write from the email you sign in with so we can find your account.</p>
          </div>
          <a
            href={`mailto:${supportEmail}?subject=${encodeURIComponent("Problem report")}`}
            className={cn(buttonVariants({ variant: "brand-outline", size: "cta" }), "shrink-0 self-start sm:self-center")}
          >
            <Mail aria-hidden />
            Report a problem
          </a>
        </div>
      </Panel>
    </>
  );
}
