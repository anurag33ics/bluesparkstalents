import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  ClipboardList,
  IdCard,
  MessagesSquare,
  Video,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./section-heading";

const solutions: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    icon: ClipboardList,
    title: "Career Shortlisting",
    description:
      "Understand your strengths and shortlist your best-fit careers through our psychometric assessment.",
    href: "/assessment",
  },
  {
    icon: MessagesSquare,
    title: "Personalised Guidance",
    description:
      "Gain career clarity with one-on-one sessions with our expert counsellors.",
    href: "/counselling",
  },
  {
    icon: Video,
    title: "Interview Preparation",
    description:
      "Practise with AI mock interviews and get structured feedback on every answer.",
    href: "/ai-interview",
  },
  {
    icon: IdCard,
    title: "Profile & Resume",
    description:
      "Build a verified profile and resume that gets you noticed by hiring companies.",
    href: "/profile",
  },
  {
    icon: BookOpen,
    title: "My Resources",
    description:
      "Access exclusive guides, articles and webinars to explore your options and plan ahead.",
    href: "/resources",
  },
  {
    icon: BriefcaseBusiness,
    title: "Jobs & Internships",
    description:
      "Get discovered by verified employers and apply to roles that match your skills.",
    href: "/jobs",
  },
];

export function SolutionsGrid() {
  return (
    <section>
      <SectionHeading title="Find solutions for" />

      <div className="grid gap-4 md:grid-cols-2">
        {solutions.map((solution) => {
          const Icon = solution.icon;

          return (
            <Link
              key={solution.href}
              href={solution.href}
              className="group flex gap-4 rounded-3xl border border-brand-100 bg-white p-5 shadow-sm shadow-brand-500/5 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 focus-visible:ring-2 focus-visible:ring-brand-500/40 sm:p-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="size-6" strokeWidth={1.8} />
              </span>

              <div className="flex-1">
                <h3 className="font-heading text-lg font-medium text-brand-950">{solution.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{solution.description}</p>
              </div>

              <ChevronRight className="mt-1 size-5 shrink-0 text-brand-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-600" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
