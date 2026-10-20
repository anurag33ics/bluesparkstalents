"use client";

import { Check, CircleCheck, Crown, Download, Lock, Receipt, ShieldCheck } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { Plan } from "@/lib/journey/types";
import { RazorpayCheckout } from "./razorpay-checkout";

const cardShadow = "shadow-[0_1px_2px_rgba(11,21,51,0.04),0_12px_32px_-12px_rgba(11,21,51,0.10)]";

/**
 * The single service plan with an order summary, paid through Razorpay
 * Checkout. The API decides what the plan unlocks.
 */
export function PlanCheckout({ plan, active }: { plan: Plan; active: boolean }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_24rem]">
      {/* Plan */}
      <section aria-labelledby="plan-name">
        <p className="mb-5">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gold-600">Step 1 · Review</span>
          <span className="mt-2 block font-heading text-2xl font-medium tracking-tight text-ink-950">What your plan includes</span>
        </p>

        <div
          className={cn(
            "relative flex flex-col gap-5 rounded-3xl border bg-white p-5 sm:flex-row sm:p-6",
            cardShadow,
            active ? "border-emerald-500 ring-2 ring-emerald-500/30" : "border-brand-500 ring-2 ring-brand-500/30"
          )}
        >
          {active && (
            <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
              <CircleCheck className="size-3" aria-hidden />
              Current plan
            </span>
          )}

          {/* Name and price */}
          <div className="sm:w-56 sm:shrink-0">
            <h2 id="plan-name" className="font-heading text-xl font-medium text-ink-950">
              {plan.name}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{plan.tagline}</p>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="font-heading text-3xl font-medium tabular-nums text-ink-950">{formatMoney(plan.price)}</span>
              <span className="text-sm text-muted-foreground">one-time</span>
            </p>
            {plan.validityDays && <p className="text-xs text-muted-foreground">Valid for {plan.validityDays} days</p>}
          </div>

          {/* Features */}
          <ul className="grid flex-1 content-start gap-2.5 border-t border-black/6 pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-950">
                <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Order summary */}
      <aside aria-labelledby="order-summary" className="lg:sticky lg:top-28">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-600 lg:mt-0">Step 2 · Pay</p>
        <div className={cn("overflow-hidden rounded-3xl border border-black/6 bg-white", cardShadow)}>
          <div className="flex items-center gap-3 border-b border-black/6 bg-slate-50/70 px-6 py-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gold-50 text-gold-600 ring-1 ring-gold-100">
              <Receipt className="size-5" aria-hidden />
            </span>
            <h2 id="order-summary" className="font-heading text-xl font-medium text-ink-950">
              Order summary
            </h2>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Crown className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-ink-950">{plan.name}</p>
                <p className="text-sm text-muted-foreground">{plan.tagline}</p>
              </div>
            </div>

            <dl className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Plan price</dt>
                <dd className="font-medium tabular-nums text-ink-950">{formatMoney(plan.price)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Validity</dt>
                <dd className="font-medium text-ink-950">{plan.validityDays ? `${plan.validityDays} days` : "No expiry"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Billing</dt>
                <dd className="font-medium text-ink-950">One-time payment</dd>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-dashed border-slate-200 pt-4">
                <dt className="font-semibold text-ink-950">Total due today</dt>
                <dd className="font-heading text-3xl font-medium tabular-nums text-ink-950">{formatMoney(active ? { ...plan.price, amount: 0 } : plan.price)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              {active ? (
                <Button type="button" variant="brand-outline" size="cta" className="h-11 w-full" disabled>
                  <CircleCheck aria-hidden />
                  Your plan is active
                </Button>
              ) : (
                <RazorpayCheckout planId={plan.id} label={`Pay ${formatMoney(plan.price)} securely`} />
              )}
            </div>

            <ul className="mt-6 flex flex-col gap-2.5 border-t border-black/6 pt-5 text-xs leading-5 text-muted-foreground">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                Secure checkout powered by Razorpay.
              </li>
              <li className="flex items-start gap-2">
                <Lock className="mt-0.5 size-4 shrink-0 text-slate-500" aria-hidden />
                We never see or store your card or UPI details.
              </li>
              <li className="flex items-start gap-2">
                <Download className="mt-0.5 size-4 shrink-0 text-slate-500" aria-hidden />
                Download your invoice from payment history once the payment is confirmed.
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
