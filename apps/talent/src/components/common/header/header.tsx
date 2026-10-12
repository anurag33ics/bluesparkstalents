"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Sparkles } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AllServicesMenu } from "../all-services-menu";
import { UserMenu } from "./user-menu";

type NavItem = { label: string; href: string; isNew?: boolean };

const navLinks: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
];

const moreLinks: NavItem[] = [
  { label: "Change Password", href: "/change-password" },
  { label: "Help & Support", href: "/support" },
];

const supportEmail = "support@bluesparkstalents.com";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Logo() {
  return (
    <Link href="/dashboard" className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50">
      <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-400 to-brand-600 font-heading text-base font-medium text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-brand-500/20">
        B
      </span>
      <span className="font-heading text-lg font-medium tracking-tight text-brand-950">
        Bluespark<span className="text-brand-600">Talents</span>
      </span>
    </Link>
  );
}

function NewBadge({ className }: { className?: string }) {
  return (
    <span className={cn("rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white", className)}>
      New
    </span>
  );
}

function NavLink({
  item,
  active,
  className,
}: {
  item: NavItem;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-500/40",
        active ? "text-brand-950" : "text-brand-950/55 hover:text-brand-950",
        className
      )}
    >
      {item.label}
      {item.isNew && <NewBadge className="absolute -top-1 right-0" />}
      <span className={cn("absolute bottom-0 left-3 right-3 h-0.5 origin-left rounded-full bg-brand-500 transition-transform duration-300", active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
    </Link>
  );
}

export function Header({
  studentName,
  signOutHref,
}: {
  studentName: string;
  signOutHref: string;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-900/10 bg-white/90 shadow-[0_10px_30px_rgba(22,52,104,0.06)] backdrop-blur-xl supports-backdrop-filter:bg-white/80">
      <div className="h-0.5 w-full bg-linear-to-r from-brand-300 via-brand-600 to-brand-300" />

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo + desktop navigation */}
        <div className="flex items-center gap-8">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="group inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-950/55 outline-none transition-colors duration-300 hover:text-brand-950 focus-visible:ring-2 focus-visible:ring-brand-500/40 data-popup-open:text-brand-950">
                More
                <ChevronDown className="size-4 transition-transform duration-300 group-data-popup-open:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={8} className="w-48 rounded-xl p-1.5">
                {moreLinks.map((item) => (
                  <DropdownMenuLinkItem key={item.href} render={<Link href={item.href} />} className="px-2 py-1.5">
                    {item.label}
                  </DropdownMenuLinkItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Support, services and account */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a href={`mailto:${supportEmail}`} className="hidden items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-brand-700 transition-colors duration-300 hover:text-brand-600 xl:inline-flex">
            <Mail className="size-4" />
            {supportEmail}
          </a>

          <AllServicesMenu />

          <UserMenu name={studentName} signOutHref={signOutHref} />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="size-10 rounded-xl border border-brand-900/10 bg-white/70 text-brand-950 hover:bg-brand-50 lg:hidden" aria-label="Open menu" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-full border-l border-brand-900/10 bg-white p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-brand-950/10 px-5 py-5">
                <Logo />
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <SheetDescription className="sr-only">Dashboard navigation</SheetDescription>
              </SheetHeader>

              <nav aria-label="Mobile" className="flex flex-1 flex-col px-5 py-7">
                <div className="mb-5 flex items-center gap-2 px-3">
                  <Sparkles className="size-4 text-brand-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                    Navigation
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {[...navLinks, ...moreLinks].map((item) => (
                    <SheetClose key={item.href} nativeButton={false} render={<span />}>
                      <NavLink item={item} active={isActive(pathname, item.href)} className="inline-block py-2.5 text-base" />
                    </SheetClose>
                  ))}
                </div>

                <div className="mt-auto border-t border-brand-950/10 pt-7">
                  <a href={`mailto:${supportEmail}`} className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-950/80">
                    <Mail className="size-4 text-brand-600" />
                    {supportEmail}
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
