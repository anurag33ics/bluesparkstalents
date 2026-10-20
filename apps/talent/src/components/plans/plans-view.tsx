import Link from "next/link";
import { ArrowRight, CircleAlert, CircleCheck, Download, Loader, Receipt, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { AutoRefresh } from "@/components/journey/auto-refresh";
import { EmptyState, Panel } from "@/components/journey/layout";
import { LocalTime } from "@/components/journey/local-time";
import { StatusBadge } from "@/components/journey/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { paymentStatusLabels } from "@/lib/journey/labels";
import type { Billing, Payment } from "@/lib/journey/types";
import { PlanCheckout } from "./plan-checkout";

const calloutStyles = {
  success: { box: "border-emerald-200 bg-emerald-50 text-emerald-950", icon: "text-emerald-600" },
  info: { box: "border-brand-200 bg-brand-50 text-brand-950", icon: "text-brand-600" },
  danger: { box: "border-red-200 bg-red-50 text-red-950", icon: "text-red-600" },
};

function Callout({
  tone,
  icon: Icon,
  title,
  action,
  children,
}: {
  tone: keyof typeof calloutStyles;
  icon: LucideIcon;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div role="status" className={cn("flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between", calloutStyles[tone].box)}>
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 size-5 shrink-0", calloutStyles[tone].icon)} aria-hidden />
        <div className="text-sm leading-6">
          <p className="font-semibold">{title}</p>
          <div>{children}</div>
        </div>
      </div>
      {action}
    </div>
  );
}

function PaymentHistory({ payments }: { payments: Payment[] }) {
  if (!payments.length) {
    return <EmptyState icon={Receipt} title="No payments yet" description="Receipts and invoices for your plan will appear here." />;
  }

  return (
    <>
      {/* Table on larger screens */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Payment history</caption>
          <thead>
            <tr className="border-b border-black/6 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <th scope="col" className="py-3 pr-4 font-bold">Date</th>
              <th scope="col" className="py-3 pr-4 font-bold">Plan</th>
              <th scope="col" className="py-3 pr-4 font-bold">Amount</th>
              <th scope="col" className="py-3 pr-4 font-bold">Status</th>
              <th scope="col" className="py-3 pr-4 font-bold">Reference</th>
              <th scope="col" className="py-3 font-bold"><span className="sr-only">Invoice</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/6">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="py-4 pr-4 whitespace-nowrap text-slate-700"><LocalTime value={payment.createdAt} format="datetime" /></td>
                <td className="py-4 pr-4 font-semibold text-ink-950">{payment.planName}</td>
                <td className="py-4 pr-4 tabular-nums text-ink-950">{formatMoney(payment.amount)}</td>
                <td className="py-4 pr-4">
                  <StatusBadge status={paymentStatusLabels[payment.status]} />
                  {payment.failureReason && <p className="mt-1 text-xs text-red-700">{payment.failureReason}</p>}
                </td>
                <td className="py-4 pr-4 font-mono text-xs text-muted-foreground">
                  {payment.gatewayPaymentId ?? payment.gatewayOrderId}
                  {payment.method && <span className="block font-sans">{payment.method}</span>}
                </td>
                <td className="py-4 text-right">
                  {payment.invoice && (
                    <a
                      href={payment.invoice.url}
                      download
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold text-brand-700 ring-1 ring-brand-200 transition-colors hover:bg-brand-50"
                    >
                      <Download className="size-4" aria-hidden />
                      Invoice<span className="sr-only"> {payment.invoice.number}</span>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards on small screens */}
      <ul className="flex flex-col gap-3 md:hidden">
        {payments.map((payment) => (
          <li key={payment.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink-950">{payment.planName}</p>
                <p className="text-sm text-muted-foreground">
                  <LocalTime value={payment.createdAt} format="datetime" />
                </p>
              </div>
              <p className="font-semibold tabular-nums text-ink-950">{formatMoney(payment.amount)}</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <StatusBadge status={paymentStatusLabels[payment.status]} />
              {payment.invoice && (
                <a href={payment.invoice.url} download className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  <Download className="size-4" aria-hidden />
                  Invoice
                </a>
              )}
            </div>
            {payment.failureReason && <p className="mt-2 text-xs text-red-700">{payment.failureReason}</p>}
            <p className="mt-2 font-mono text-xs text-muted-foreground">{payment.gatewayPaymentId ?? payment.gatewayOrderId}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function PlansView({ billing }: { billing: Billing }) {
  const payments = [...billing.payments].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const latest = payments[0];
  const processing = latest && (latest.status === "pending" || latest.status === "created") && latest.gatewayPaymentId;
  const lastFailed = latest?.status === "failed";
  const activePlan = billing.activePlan;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        {processing && (
          <Callout tone="info" icon={Loader} title="Payment processing">
            We&apos;re waiting for your bank to confirm {formatMoney(latest.amount)} for {latest.planName}. This page updates
            automatically; paid services unlock as soon as it&apos;s confirmed.
            <AutoRefresh seconds={8} />
          </Callout>
        )}
        {lastFailed && (
          <Callout tone="danger" icon={CircleAlert} title="Your last payment didn't go through">
            {latest.failureReason ?? "The payment was declined."} No money was taken. You can try again below.
          </Callout>
        )}
        {activePlan && !processing && (
          <Callout
            tone="success"
            icon={CircleCheck}
            title={`Payment complete. ${activePlan.name} is active.`}
            action={
              <Link href="/verification" className={cn(buttonVariants({ variant: "brand", size: "cta" }), "shrink-0 self-start sm:self-center")}>
                Next: verify your profile
                <ArrowRight aria-hidden />
              </Link>
            }
          >
            Activated <LocalTime value={activePlan.activatedAt} format="date" />
            {activePlan.expiresAt && (
              <>
                {" "}· valid until <LocalTime value={activePlan.expiresAt} format="date" />
              </>
            )}
            .
          </Callout>
        )}
      </div>

      <PlanCheckout plan={billing.plan} active={activePlan?.planId === billing.plan.id} />

      <Panel title="Payment history" description="Transaction details and downloadable invoices." icon={Receipt} accent="sky">
        <PaymentHistory payments={payments} />
      </Panel>
    </div>
  );
}
