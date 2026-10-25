import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, TriangleAlert } from "lucide-react";
import { ApiErrorState } from "@/components/journey/api-error-state";
import { PageShell } from "@/components/journey/layout";
import { LocalTime } from "@/components/journey/local-time";
import { isSettingsSection, SettingsNav, settingsSections, type SettingsSection } from "@/components/settings/settings-nav";
import { BillingSection, ProfileSection, SecuritySection, SupportSection } from "@/components/settings/settings-sections";
import { getBilling, getCurrentUser, getHiring, getListing, getSettings } from "@/lib/api/candidate";

export const metadata: Metadata = {
  title: "Settings",
};

/** Loads only what the open section needs. */
async function SectionContent({ section }: { section: SettingsSection }) {
  switch (section) {
    case "profile": {
      const [settings, user, listing, hiring] = await Promise.all([getSettings(), getCurrentUser(), getListing(), getHiring()]);
      if (!settings.ok) return <ApiErrorState error={settings.error} />;
      if (!user.ok) return <ApiErrorState error={user.error} />;
      return <ProfileSection user={user.data} settings={settings.data} listing={listing} hiring={hiring} />;
    }
    case "security": {
      const settings = await getSettings();
      return settings.ok ? <SecuritySection settings={settings.data} /> : <ApiErrorState error={settings.error} />;
    }
    case "billing": {
      const billing = await getBilling();
      return billing.ok ? <BillingSection billing={billing.data} /> : <ApiErrorState error={billing.error} />;
    }
    case "support":
      return <SupportSection />;
  }
}

export default async function SettingsPage({ searchParams }: PageProps<"/settings">) {
  const [{ section }, settings] = await Promise.all([searchParams, getSettings()]);
  const active = isSettingsSection(section) ? section : "profile";
  const meta = settingsSections[active];
  const deletionDate = settings.ok ? settings.data.deletionScheduledFor : null;

  return (
    <PageShell>
      <header>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/dashboard" className="font-semibold text-brand-600 hover:text-brand-700">
            Dashboard
          </Link>
          <ChevronRight className="size-4" aria-hidden />
          <span aria-current="page">Settings</span>
        </nav>
        <h1 className="mt-4 font-heading text-3xl font-medium tracking-tight text-ink-950 sm:text-4xl">Settings</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Manage your profile, sign-in and subscription, or get help.
        </p>

        {deletionDate && active !== "security" && (
          <p role="status" className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            Your account is scheduled for deletion on <LocalTime value={deletionDate} format="date" />.
            <Link href="/settings?section=security" scroll={false} className="font-semibold underline underline-offset-2">
              Keep my account
            </Link>
          </p>
        )}
      </header>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[20rem_1fr]">
        <aside className="min-w-0 lg:sticky lg:top-28">
          <SettingsNav active={active} />
        </aside>

        <section aria-labelledby="settings-section-heading" className="flex min-w-0 flex-col gap-6">
          <div>
            <h2 id="settings-section-heading" className="font-heading text-2xl font-medium tracking-tight text-ink-950">
              {meta.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
          </div>
          <SectionContent section={active} />
        </section>
      </div>
    </PageShell>
  );
}
