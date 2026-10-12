import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Bluespark Talents",
  description: "The terms and conditions for using Bluespark Talents.",
};

export default function TermsConditionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <h1 className="font-heading text-4xl font-medium tracking-tight text-foreground">
        Terms &amp; Conditions
      </h1>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        Full terms and conditions are coming soon. For questions, contact us
        at{" "}
        <a
          href="mailto:support@bluesparkstalents.com"
          className="font-medium text-primary hover:underline"
        >
          support@bluesparkstalents.com
        </a>
        .
      </p>
    </div>
  );
}
