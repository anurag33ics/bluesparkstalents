import Image from "next/image";
import Link from "next/link";

const programs = [
  {
    title: "Skill Assessment & Verification",
    description:
      "Take timed, role-based assessments and earn a verified skills badge employers can trust.",
    href: "/programs/skill-verification",
    image: "/assets/images/assessment.png",
  },
  {
    title: "One-on-One Career Counselling",
    description:
      "Get personalised guidance from expert counsellors to choose the right path and build a plan to get there.",
    href: "/programs/career-counselling",
    image: "/assets/images/career-counselling.png",
  },
  {
    title: "Placement Assistance",
    description:
      "Get matched with hiring companies and supported at every stage, from shortlist to offer.",
    href: "/programs/placement-assistance",
    image: "/assets/images/progress.png",
  },
];

export function ProgramCards() {
  return (
    <section aria-labelledby="programs-heading">
      <h2 id="programs-heading" className="sr-only">Programs</h2>

      <div className="grid gap-5 md:grid-cols-3">
        {programs.map((program) => (
          <div key={program.href} className="flex flex-col rounded-3xl border border-brand-100 bg-white p-6 shadow-sm shadow-brand-500/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/10">
            <h3 className="font-heading text-lg font-medium text-brand-950">{program.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{program.description}</p>

            <div className="mt-auto flex items-end justify-between gap-4 pt-6">
              <Link href={program.href} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500">
                Apply now
              </Link>
              <Image
                src={program.image}
                alt=""
                width={112}
                height={112}
                sizes="112px"
                className="-mb-2 -mr-2 size-28 object-contain mix-blend-multiply"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
