import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { accentTile, type Accent } from "./accents";

/** Warm ivory canvas every portal page sits on. */
export function PageShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl rounded-4xl bg-canvas px-4 py-8 ring-1 ring-black/3 sm:rounded-[2.5rem] sm:px-8 sm:py-10 lg:px-14 lg:py-12",
        className
      )}
    >
      {children}
    </div>
  );
}

export const panelClass =
  "rounded-3xl border border-black/6 bg-white p-5 shadow-[0_1px_2px_rgba(11,21,51,0.04),0_12px_32px_-12px_rgba(11,21,51,0.10)] sm:p-6";

export function IconTile({ icon: Icon, accent = "blue", className }: { icon: LucideIcon; accent?: Accent; className?: string }) {
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl ring-1", accentTile[accent], className)}>
      <Icon className="size-5" strokeWidth={1.9} aria-hidden />
    </span>
  );
}

export function Panel({
  title,
  description,
  action,
  icon,
  accent,
  children,
  className,
  as: Tag = "section",
  headingLevel = 2,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: LucideIcon;
  accent?: Accent;
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Tag className={cn(panelClass, className)}>
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {icon && <IconTile icon={icon} accent={accent} />}
            <div className="min-w-0">
              {title && <Heading className="font-heading text-xl font-medium tracking-tight text-ink-950">{title}</Heading>}
              {description && <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{description}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}

/** Eyebrow and serif heading that introduce a dashboard section. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  id,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  id?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">{eyebrow}</p>
        <h2 id={id} className="mt-2 font-heading text-2xl font-medium tracking-tight text-ink-950 sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-6 py-8 text-center", className)}>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm shadow-brand-500/10">
        <Icon className="size-6" strokeWidth={1.8} aria-hidden />
      </span>
      <p className="mt-4 font-semibold text-brand-950">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Label/value pairs for detail cards. */
export function DetailList({
  items,
  className,
}: {
  items: { label: string; value: React.ReactNode; wide?: boolean }[];
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-4 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.label} className={cn("min-w-0", item.wide && "sm:col-span-full")}>
          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-sm font-medium break-words text-brand-950">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-brand-950">
      {children}
    </h2>
  );
}
