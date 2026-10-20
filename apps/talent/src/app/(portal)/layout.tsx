import { redirect } from "next/navigation";
import { Header } from "@/components/common/header/header";
import { Toaster } from "@/components/ui/toast";
import { getCurrentUser, getNotifications } from "@/lib/api/candidate";
import { signInUrl } from "@/lib/config";

export default async function PortalLayout({ children }: LayoutProps<"/">) {
  const [user, feed] = await Promise.all([getCurrentUser(), getNotifications(5)]);

  if (!user.ok && user.error.kind === "unauthorized") redirect(signInUrl);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        studentName={user.ok ? user.data.firstName : "Guest"}
        signOutHref={signInUrl}
        unreadCount={feed.ok ? feed.data.unreadCount : 0}
      />
      <main id="main" className="flex-1 px-3 pt-4 pb-12 sm:px-4 lg:px-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
