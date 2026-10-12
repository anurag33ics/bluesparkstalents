import Link from "next/link";
import { ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Why Choose Us", href: "/#why-choose-us" },
  { label: "How We Work", href: "/#how-we-work" },
  { label: "Contact Us", href: "/contact-us" },
];

const candidateLinks = [
  { label: "Find a Job", href: "/signup" },
  { label: "Submit Resume", href: "/signup" },
  { label: "Candidate Login", href: "/signin" },
];

const employerLinks = [
  { label: "Find Talent", href: "/contact-us" },
  { label: "Submit Requirement", href: "/contact-us" },
  { label: "Employer Login", href: "/signin" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-brand-950">
        {title}
      </h3>

      <ul className="mt-5 flex flex-col gap-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-[#536888] transition-all duration-300 hover:translate-x-1 hover:text-brand-600">
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-brand-100 bg-sky-wash">

      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-white/60 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-brand-200/40 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-white/50 blur-[120px]" />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        {/* ===================================================
            TOP BRAND STATEMENT
        ==================================================== */}

        <div className="grid gap-10 border-b border-brand-200 pb-14 lg:grid-cols-12 lg:gap-16 lg:pb-16">

          {/* Brand */}
          <div className="lg:col-span-7">

            <Link href="/" className="group inline-flex items-center gap-3">

              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 font-heading text-lg font-medium text-white shadow-lg shadow-brand-500/25 transition-transform duration-300 group-hover:scale-105">
                B
              </span>

              <span className="font-heading text-xl font-medium tracking-tight text-brand-950">
                Bluespark<span className="text-brand-600">Talents</span>
              </span>

            </Link>

            <h2 className="mt-8 max-w-3xl font-heading text-3xl font-medium leading-[1.05] tracking-tight text-brand-950 sm:text-4xl lg:text-5xl">
              Connecting great people with
              <span className="text-brand-600"> great opportunities.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#536888]">
              A quality-first talent platform helping companies discover
              verified professionals and helping candidates move closer to
              their next opportunity.
            </p>

            {/* Email */}
            <a href="mailto:support@bluesparkstalents.com" className="group mt-7 inline-flex items-center gap-3 rounded-xl border border-brand-200 bg-white/75 px-4 py-3 transition-all duration-300 hover:border-brand-300 hover:bg-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Mail className="h-4 w-4" />
              </span>

              <span className="text-sm font-medium text-brand-950/80 transition-colors duration-300 group-hover:text-brand-700">
                support@bluesparkstalents.com
              </span>

              <ArrowUpRight className="h-4 w-4 text-brand-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </a>

          </div>

          {/* Right statement */}
          <div className="flex items-end lg:col-span-5 lg:justify-end">

            <div className="max-w-sm rounded-[2rem] border border-white bg-white/80 p-6 shadow-2xl shadow-brand-500/10 backdrop-blur-md sm:p-7">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <p className="mt-5 font-heading text-xl font-medium leading-snug text-brand-950">
                Screened.
                <br />
                Verified.
                <br />
                Ready to connect.
              </p>

              <div className="mt-5 h-px bg-gradient-to-r from-brand-500 via-brand-300 to-transparent" />

              <p className="mt-4 text-xs leading-5 text-[#536888]">
                Built to make recruitment simpler, faster, and more
                transparent.
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 lg:grid-cols-4 lg:py-16">

          <FooterColumn title="Explore" links={quickLinks} />

          <FooterColumn title="Candidates" links={candidateLinks} />

          <FooterColumn title="Employers" links={employerLinks} />

          {/* CTA */}
          <div className="col-span-2 sm:col-span-1">

            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-brand-950">
              Get Started
            </h3>

            <p className="mt-5 max-w-xs text-sm leading-6 text-[#536888]">
              Take the next step toward your next opportunity or your next
              great hire.
            </p>

            <div className="mt-5 flex flex-col gap-2.5">

              <Link href="/signup" className="group inline-flex items-center justify-between rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/25">
                Find a Job
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

              <Link href="/contact-us" className="group inline-flex items-center justify-between rounded-xl border border-brand-200 bg-white/75 px-4 py-3 text-sm font-semibold text-brand-700 transition-all duration-300 hover:border-brand-300 hover:bg-white">
                Find Talent
                <ArrowUpRight className="h-4 w-4 text-brand-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </Link>

            </div>

          </div>

        </div>

        {/* ===================================================
            BOTTOM
        ==================================================== */}

        <Separator className="bg-brand-200" />

        <div className="flex flex-col items-start justify-between gap-5 pt-7 text-sm sm:flex-row sm:items-center">

          <div className="flex flex-col gap-1">
            <p className="text-[#536888]">
              © 2026 Bluespark Talents. All rights reserved.
            </p>

            <p className="text-xs text-[#536888]/70">
              Built for better hiring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-7">

            <Link href="/privacy-policy" className="text-xs text-[#536888] transition-colors duration-300 hover:text-brand-600">
              Privacy Policy
            </Link>

            <Link href="/terms-conditions" className="text-xs text-[#536888] transition-colors duration-300 hover:text-brand-600">
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM GRADIENT LINE
      ====================================================== */}

      <div className="h-1 w-full bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300" />

    </footer>
  );
}