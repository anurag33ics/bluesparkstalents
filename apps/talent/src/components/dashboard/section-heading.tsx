import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-950">{title}</h2>
      {action && (
        <Link href={action.href} className="group inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-600 transition-colors duration-300 hover:text-brand-700">
          {action.label}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
