export const dynamic = "force-dynamic";

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth/guard";
import { sidebar } from "@/lib/constant/dashboard";

type Role = keyof typeof sidebar;

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const role = user?.role as Role | undefined;

  console.log(user);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        {role && <DashboardSidebar menu={sidebar[role]} user={user} />}

        {/* Main area */}
        <div className="flex flex-col flex-1">
          {/* Header/Navbar */}

          {/* Main content */}
          <main className="flex-1">
            <div className="@container/main min-h-screen w-full px-4 py-4 lg:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
