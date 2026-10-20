import { BriefcaseBusiness, Code, FileText, GraduationCap, Phone, Target, UserRound, type LucideIcon } from "lucide-react";
import type { Accent } from "@/components/journey/accents";
import type { ProfileSectionKey } from "@/lib/journey/types";

export const sectionVisuals: Record<ProfileSectionKey, { icon: LucideIcon; accent: Accent; tips: string[] }> = {
  personal: {
    icon: UserRound,
    accent: "violet",
    tips: [
      "Name your role and top skills in the headline.",
      "Keep the summary to three or four sentences about impact and goals.",
    ],
  },
  contact: {
    icon: Phone,
    accent: "sky",
    tips: [
      "Use a number you can answer during working hours.",
      "Recruiters only see your contact details if you agree to share them.",
    ],
  },
  education: {
    icon: GraduationCap,
    accent: "teal",
    tips: ["List your highest qualification first.", "Add certifications that match the roles you want."],
  },
  experience: {
    icon: BriefcaseBusiness,
    accent: "indigo",
    tips: [
      "Start each description with a strong action verb.",
      "Add numbers where you can: users served, time saved, revenue.",
    ],
  },
  skills: {
    icon: Code,
    accent: "fuchsia",
    tips: [
      "Add the skills that appear in job descriptions you're targeting.",
      "Be honest about levels; interviews will test them.",
    ],
  },
  preferences: {
    icon: Target,
    accent: "cyan",
    tips: ["Keep your notice period accurate; it affects matching.", "Pick up to five roles so matches stay relevant."],
  },
  resume: {
    icon: FileText,
    accent: "gold",
    tips: [
      "Upload a PDF so the formatting stays intact.",
      "Make sure dates match your profile to speed up verification.",
    ],
  },
};
