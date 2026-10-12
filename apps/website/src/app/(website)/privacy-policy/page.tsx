import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bluespark Talents",
  description: "How Bluespark Talents collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <h1 className="font-heading text-4xl font-medium tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        Full privacy policy details are coming soon. For questions about how
        your data is handled, contact us at{" "}
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
