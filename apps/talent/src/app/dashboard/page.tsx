import type { Metadata } from "next";
import { BannerCarousel } from "@/components/dashboard/banner-carousel";
import { FeatureCards } from "@/components/dashboard/feature-cards";
import { ProgramCards } from "@/components/dashboard/program-cards";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { RecentArticles } from "@/components/dashboard/recent-articles";
import { SolutionsGrid } from "@/components/dashboard/solutions-grid";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { getCurrentStudent, getStudentProgress } from "@/lib/student";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const [student, progress] = await Promise.all([
    getCurrentStudent(),
    getStudentProgress(),
  ]);

  return (
    <div className="mx-auto max-w-7xl rounded-4xl bg-muted px-4 py-8 sm:rounded-[2.5rem] sm:px-8 sm:py-10 lg:px-14 lg:py-12">
      <WelcomeHeader name={student.firstName} program={student.program} />

      <div className="mt-8 flex flex-col gap-12">
        <FeatureCards />
        <ProgressOverview progress={progress} />
        <BannerCarousel />
        <SolutionsGrid />
        <ProgramCards />
        <RecentArticles />
      </div>
    </div>
  );
}
