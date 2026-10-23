"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicPath } from "@/lib/base-path";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const services = [
  { label: "My Progress", href: "/dashboard#journey", image: "/assets/images/progress.png" },
  { label: "Assessment", href: "/assessment", image: "/assets/images/assessment.png" },
  { label: "AI Interview", href: "/ai-interview", image: "/assets/images/ai-interview.png", isNew: true },
  { label: "Profile Builder", href: "/profile", image: "/assets/images/report.png" },
  { label: "Expert Interview", href: "/interview", image: "/assets/images/career-counselling.png" },
  { label: "Webinar Series", href: "/webinars", image: "/assets/images/banner.png" },
];

export function AllServicesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button aria-label="All services" className="h-10 gap-2 rounded-xl bg-brand-600 px-3 text-sm font-bold text-white shadow-md shadow-brand-600/20 hover:bg-brand-500 sm:px-4" />
        }
      >
        <LayoutGrid className="size-4" />
        <span className="hidden sm:inline">All Services</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl p-3 shadow-2xl shadow-brand-500/15">
        <div className="grid grid-cols-3 gap-1">
          {services.map((service) => (
            <DropdownMenuLinkItem
              key={service.href}
              render={<Link href={service.href} />}
              className="flex-col gap-2 rounded-xl px-2 py-3 text-center focus:bg-brand-50"
            >
              <Image
                src={publicPath(service.image)}
                alt=""
                width={64}
                height={64}
                sizes="64px"
                className="size-16 rounded-2xl object-cover mix-blend-multiply"
              />
              <span className="text-xs font-semibold leading-tight text-brand-950">
                {service.label}
              </span>
              {service.isNew && (
                <span className="absolute right-1.5 top-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white">
                  New
                </span>
              )}
            </DropdownMenuLinkItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
