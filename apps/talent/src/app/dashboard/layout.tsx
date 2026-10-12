import { Header } from "@/components/common/header/header";
import { getCurrentStudent } from "@/lib/student";

const websiteUrl = process.env.WEBSITE_URL ?? "http://localhost:3000";
const signInUrl = process.env.SIGN_IN_URL ?? `${websiteUrl}/signin`;

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const student = await getCurrentStudent();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header studentName={student.firstName} signOutHref={signInUrl} />
      <main className="flex-1 px-3 pb-12 pt-4 sm:px-4 lg:px-6">{children}</main>
    </div>
  );
}
