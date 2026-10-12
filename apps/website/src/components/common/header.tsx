"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
];

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 font-heading text-base font-medium text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-brand-500/20">
        B
      </span>
      <span className="font-heading text-lg font-medium tracking-tight text-brand-950">
        Bluespark<span className="text-brand-600">Talents</span>
      </span>
    </Link>
  );
}

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-500/40",
        active ? "text-brand-950" : "text-brand-950/55 hover:text-brand-950"
      )}
    >
      {label}
      <span className={cn("absolute bottom-0 left-3 right-3 h-0.5 origin-left rounded-full bg-brand-500 transition-transform duration-300", active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-900/10 bg-white/90 shadow-[0_10px_30px_rgba(22,52,104,0.06)] backdrop-blur-xl supports-backdrop-filter:bg-white/80">
      <div className="h-0.5 w-full bg-gradient-to-r from-brand-300 via-brand-600 to-brand-300" />

      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
          ))}
        </nav>

        {/* Desktop Sign In */}
        <div className="hidden lg:block">
          <Link href="/signin" className="group inline-flex items-center gap-2 rounded-xl border border-brand-600/20 bg-white/75 px-5 py-2.5 text-sm font-bold text-brand-950 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-600/45 hover:bg-white hover:shadow-md hover:shadow-brand-600/10">
            Sign In
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-brand-900/10 bg-white/70 text-brand-950 hover:bg-brand-50 lg:hidden" aria-label="Open menu" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>

          <SheetContent side="right" className="w-full border-l border-brand-900/10 bg-white p-0 sm:max-w-sm">

            <SheetHeader className="border-b border-brand-950/10 px-5 py-5">
              <Logo />

              <SheetTitle className="sr-only">
                Navigation menu
              </SheetTitle>

              <SheetDescription className="sr-only">
                Site navigation and sign in
              </SheetDescription>
            </SheetHeader>

            <nav aria-label="Mobile" className="flex flex-1 flex-col px-5 py-7">

              <div className="mb-5 flex items-center gap-2 px-3">
                <Sparkles className="h-4 w-4 text-brand-600" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                  Navigation
                </span>
              </div>

              <div className="space-y-2">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} nativeButton={false} render={<span />}>
                    <NavLink href={link.href} label={link.label} active={pathname === link.href} />
                  </SheetClose>
                ))}
              </div>

              {/* Mobile Sign In */}
              <div className="mt-auto border-t border-brand-950/10 pt-7">
                <SheetClose nativeButton={false} render={<span />}>
                  <Link href="/signin" className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-500">
                    Sign In
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </SheetClose>
              </div>

            </nav>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}