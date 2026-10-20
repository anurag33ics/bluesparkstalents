import Link from "next/link";
import { BellRing, Building2, CircleAlert, CircleCheck, CreditCard, Info, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { formatRelative } from "@/lib/format";
import type { AppNotification, NotificationKind } from "@/lib/journey/types";

const kindIcons: Record<NotificationKind, { icon: LucideIcon; className: string; label: string }> = {
  status_change: { icon: CircleCheck, className: "bg-emerald-50 text-emerald-700", label: "Status update" },
  action_required: { icon: CircleAlert, className: "bg-amber-50 text-amber-700", label: "Action required" },
  reminder: { icon: BellRing, className: "bg-brand-50 text-brand-700", label: "Reminder" },
  recruiter: { icon: Building2, className: "bg-brand-50 text-brand-700", label: "Recruiter" },
  payment: { icon: CreditCard, className: "bg-slate-100 text-slate-700", label: "Payment" },
  system: { icon: Info, className: "bg-slate-100 text-slate-700", label: "Announcement" },
};

/** Server-rendered so relative times don't depend on the browser clock. */
export function NotificationList({ items, className }: { items: AppNotification[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => {
        const kind = kindIcons[item.kind];
        const Icon = kind.icon;
        const unread = !item.readAt;

        const body = (
          <>
            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", kind.className)}>
              <Icon className="size-4.5" aria-label={kind.label} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-3">
                <span className={cn("text-sm leading-5 text-brand-950", unread ? "font-bold" : "font-semibold")}>{item.title}</span>
                <time dateTime={item.createdAt} className="shrink-0 text-xs text-muted-foreground">
                  {formatRelative(item.createdAt)}
                </time>
              </span>
              <span className="mt-0.5 block text-sm leading-5 text-muted-foreground">{item.body}</span>
            </span>
            {unread && (
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600">
                <span className="sr-only">Unread</span>
              </span>
            )}
          </>
        );

        return (
          <li key={item.id}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "flex gap-3 rounded-2xl p-3 outline-none transition-colors hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500/40",
                  unread && "bg-brand-50/50"
                )}
              >
                {body}
              </Link>
            ) : (
              <div className={cn("flex gap-3 rounded-2xl p-3", unread && "bg-brand-50/50")}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
