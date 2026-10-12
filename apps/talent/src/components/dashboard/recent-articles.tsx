import Link from "next/link";
import { Compass, FileText, Mic, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";

const articles: {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  icon: LucideIcon;
  gradient: string;
}[] = [
  {
    slug: "screening-interview-guide",
    category: "Interviews",
    title: "How to Ace Your First Screening Interview: A Complete Guide",
    excerpt:
      "A screening interview is your first conversation with a hiring team. Here's how to prepare your story, answer common questions and follow up well.",
    publishedAt: "2026-09-28",
    icon: Mic,
    gradient: "from-brand-500 to-brand-800",
  },
  {
    slug: "career-options-after-graduation",
    category: "Career Planning",
    title: "Best Career Options After Graduation: Finding the Right Fit",
    excerpt:
      "Year after year, graduates face the same question: what next? We break down how to weigh your interests, your skills and the job market.",
    publishedAt: "2026-09-02",
    icon: Compass,
    gradient: "from-brand-700 to-brand-900",
  },
  {
    slug: "resume-that-gets-shortlisted",
    category: "Profile",
    title: "Building a Resume That Gets You Shortlisted",
    excerpt:
      "Recruiters spend seconds on each resume. Learn what to highlight, what to cut and how a verified profile helps you stand out.",
    publishedAt: "2026-08-25",
    icon: FileText,
    gradient: "from-brand-400 to-brand-600",
  },
];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function RecentArticles() {
  return (
    <section>
      <SectionHeading title="Recent articles" action={{ label: "View all", href: "/articles" }} />

      <div className="grid gap-5 md:grid-cols-3">
        {articles.map((article) => {
          const Icon = article.icon;

          return (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm shadow-brand-500/5 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/10 focus-visible:ring-2 focus-visible:ring-brand-500/40"
            >
              {/* Thumbnail */}
              <div className={`relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br ${article.gradient}`}>
                <div className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-12 -left-6 size-32 rounded-full bg-white/10" />
                <span className="flex size-16 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                  <Icon className="size-8" strokeWidth={1.6} />
                </span>
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">
                  {article.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-heading text-lg font-medium leading-snug text-brand-950 transition-colors duration-300 group-hover:text-brand-700">
                  {article.title}
                </h3>
                <time dateTime={article.publishedAt} className="mt-2 text-xs font-semibold text-brand-600">
                  {dateFormat.format(new Date(`${article.publishedAt}T00:00:00Z`))}
                </time>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
