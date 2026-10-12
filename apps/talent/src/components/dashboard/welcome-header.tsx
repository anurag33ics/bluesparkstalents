import Link from "next/link";

export function WelcomeHeader({ name, program }: { name: string; program: string }) {
  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight text-brand-950 sm:text-3xl">
          Hi there, <span className="text-brand-600">{name}!</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          Let&apos;s start your career journey.
        </p>
      </div>

      {/* Current program */}
      <div className="inline-flex items-center self-start rounded-full border border-brand-200 bg-white p-1 pl-4 shadow-sm shadow-brand-500/5">
        <span className="text-sm text-muted-foreground">
          Current program: <span className="font-bold text-brand-950">{program}</span>
        </span>
        <Link href="/upgrade" className="ml-3 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-brand-500">
          Upgrade
        </Link>
      </div>
    </section>
  );
}
