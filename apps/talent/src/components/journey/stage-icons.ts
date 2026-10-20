import { Bot, BriefcaseBusiness, CreditCard, Megaphone, ShieldCheck, UserRound, Video, type LucideIcon } from "lucide-react";
import type { StageKey } from "@/lib/journey/types";

export const stageIcons: Record<StageKey, LucideIcon> = {
  profile: UserRound,
  plan: CreditCard,
  verification: ShieldCheck,
  ai_interview: Bot,
  expert_interview: Video,
  listing: Megaphone,
  hiring: BriefcaseBusiness,
};
