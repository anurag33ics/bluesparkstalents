"use client";

import Link from "next/link";
import { Bell, Mail } from "lucide-react";
import { UserMenu } from "./user-menu";

const supportEmail = "support@bluesparkstalents.com";

function Logo() {
  return (
    <Link href="/dashboard" className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50">
      <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 font-heading text-lg font-medium text-white shadow-md shadow-brand-600/25 transition-all duration-300 group-hover:scale-105">
        B
      </span>
      <span className="font-heading text-xl font-medium tracking-tight text-ink-950">
        Bluespark<span className="text-brand-600">Talents</span>
      </span>
    </Link>
  );
}

function NotificationsLink({ unreadCount }: { unreadCount: number }) {
  return (
    <Link
      href="/notifications"
      aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
      className="relative flex size-10 items-center justify-center rounded-xl text-brand-950 outline-none transition-colors duration-300 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500/40"
    >
      <Bell className="size-5" aria-hidden />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

export function Header({
  studentName,
  signOutHref,
  unreadCount = 0,
}: {
  studentName: string;
  signOutHref: string;
  unreadCount?: number;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-900/10 bg-white backdrop-blur-xl supports-backdrop-filter:bg-white/80">
      <div className="h-0.5 w-full bg-linear-to-r from-gold-300 via-brand-600 to-gold-300" />

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Support, notifications and account */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a href={`mailto:${supportEmail}`} className="hidden items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-brand-700 transition-colors duration-300 hover:text-brand-600 md:inline-flex">
            <Mail className="size-4" aria-hidden />
            {supportEmail}
          </a>

          <NotificationsLink unreadCount={unreadCount} />

          <UserMenu name={studentName} signOutHref={signOutHref} />
        </div>
      </div>
    </header>
  );
}
