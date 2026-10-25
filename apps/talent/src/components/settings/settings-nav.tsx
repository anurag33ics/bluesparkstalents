import Link from "next/link";
import { ChevronRight, CreditCard, LifeBuoy, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { accentTile, type Accent } from "@/components/journey/accents";
import { panelClass } from "@/components/journey/layout";

export const settingsSections = {
  profile: { title: "Personal & Recruiter Profile", description: "Your details and recruiter view", icon: UserRound, accent: "blue" },
  security: { title: "Security & Login", description: "Sign-in, devices and your data", icon: ShieldCheck, accent: "teal" },
  billing: { title: "Subscription & Billing", description: "Plan, payments and invoices", icon: CreditCard, accent: "gold" },
  support: { title: "Help & Support", description: "FAQs and contact options", icon: LifeBuoy, accent: "violet" },
} satisfies Record<string, { title: string; description: string; icon: LucideIcon; accent: Accent }>;

export type SettingsSection = keyof typeof settingsSections;

export const settingsSectionKeys = Object.keys(settingsSections) as SettingsSection[];

export function isSettingsSection(value: unknown): value is SettingsSection {
  return typeof value === "string" && value in settingsSections;
}

export function SettingsNav({ active }: { active: SettingsSection }) {
  return (
    <nav aria-label="Settings sections" className={cn(panelClass, "p-2 sm:p-2")}>
      <ul className="flex gap-2 overflow-x-auto p-1 lg:flex-col lg:gap-1 lg:overflow-visible">
        {settingsSectionKeys.map((key) => {
          const section = settingsSections[key];
          const Icon = section.icon;
          const current = key === active;
          return (
            <li key={key} className="shrink-0 lg:shrink">
              <Link
                href={`/settings?section=${key}`}
                scroll={false}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 outline-none transition-all focus-visible:ring-2 focus-visible:ring-brand-500/40",
                  current ? "bg-brand-50 ring-1 ring-brand-200" : "hover:bg-slate-50"
                )}
              >
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl ring-1", accentTile[section.accent])}>
                  <Icon className="size-4.5" strokeWidth={1.9} aria-hidden />
                </span>
                <span className="min-w-0 flex-1 pr-2 lg:pr-0">
                  <span className={cn("block text-sm font-semibold whitespace-nowrap lg:whitespace-normal", current ? "text-brand-800" : "text-ink-950")}>
                    {section.title}
                  </span>
                  <span className="hidden text-xs text-slate-500 lg:block">{section.description}</span>
                </span>
                <ChevronRight className="hidden size-4 shrink-0 text-slate-400 lg:block" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
