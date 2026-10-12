"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ name, signOutHref }: { name: string; signOutHref: string }) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="group flex items-center gap-2 rounded-xl p-1 outline-none transition-colors duration-300 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500/40 md:pr-2"
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-brand-100 text-sm font-bold text-brand-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-semibold text-brand-950 md:inline">{name}</span>
        <ChevronDown className="hidden size-4 text-brand-950/55 transition-transform duration-300 group-data-popup-open:rotate-180 md:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-xl p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            Signed in as <span className="font-semibold text-brand-950">{name}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem render={<Link href="/profile" />} className="px-2 py-1.5">
          <UserRound />
          My profile
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link href="/settings" />} className="px-2 py-1.5">
          <Settings />
          Settings
        </DropdownMenuLinkItem>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem href={signOutHref} className="px-2 py-1.5">
          <LogOut />
          Sign out
        </DropdownMenuLinkItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
