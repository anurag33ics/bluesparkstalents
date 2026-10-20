"use client";

import { useRef, useState, useTransition } from "react";
import Script from "next/script";
import { Loader2, Lock } from "lucide-react";
import { settle } from "@/components/forms/feedback";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { confirmPayment, createCheckout, reportPaymentFailure } from "@/lib/actions/candidate";

/* Minimal typings for Razorpay Checkout (https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/). */
type RazorpaySuccess = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayFailure = { error: { code?: string; description?: string; reason?: string } };
type RazorpayOptions = {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpaySuccess) => void;
  modal: { ondismiss: () => void };
};
type RazorpayInstance = { open: () => void; on: (event: "payment.failed", callback: (response: RazorpayFailure) => void) => void };

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

/**
 * Pays for a plan with Razorpay Checkout. The API creates the order and later
 * verifies the signature with its secret; the browser never decides whether a
 * payment succeeded.
 */
export function RazorpayCheckout({ planId, label }: { planId: string; label: string }) {
  const [ready, setReady] = useState(false);
  const [pending, startTransition] = useTransition();
  const failed = useRef(false);

  function pay() {
    startTransition(async () => {
      const order = await createCheckout(planId);
      if (!settle(order)) return;

      if (!window.Razorpay) {
        toast.error("Payment window unavailable", "Check your connection or turn off content blockers, then try again.");
        return;
      }

      const { data } = order;
      failed.current = false;

      const checkout = new window.Razorpay({
        key: data.keyId,
        order_id: data.orderId,
        amount: data.amount.amount,
        currency: data.amount.currency,
        name: "Bluespark Talents",
        description: data.description,
        prefill: data.prefill,
        theme: { color: "#2563eb" },
        handler: (response) =>
          startTransition(async () => {
            const result = await confirmPayment(data.paymentId, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            if (!settle(result)) return;
            if (result.data.status === "captured") toast.success("Payment successful", `${data.planName} is now active.`);
            else toast.info("Payment received", "We're confirming it with your bank. This page updates automatically.");
          }),
        modal: {
          ondismiss: () => {
            if (!failed.current) toast.info("Payment not completed", "You weren't charged. You can try again whenever you're ready.");
          },
        },
      });

      checkout.on("payment.failed", (response) => {
        failed.current = true;
        void reportPaymentFailure(data.paymentId, response.error);
        toast.error("Payment failed", response.error.description ?? "Your payment didn't go through. No money was taken; please try again.");
      });

      checkout.open();
    });
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onReady={() => setReady(true)} />
      <Button type="button" variant="brand" size="cta" className="h-11 w-full" disabled={!ready || pending} onClick={pay}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Lock aria-hidden />}
        {ready ? label : "Loading secure checkout…"}
      </Button>
    </>
  );
}
