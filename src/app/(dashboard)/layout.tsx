/**
 * @fileoverview Dashboard layout - sidebar + header shell for authenticated pages.
 */

import { createClient } from '@/lib/supabase/server';
import { SidebarContainer } from '@/components/layout/containers/SidebarContainer';
import { MobileNavContainer } from '@/components/layout/containers/MobileNavContainer';
import { DashboardShell } from '@/components/layout/containers/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.name ?? user?.email ?? null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarContainer userName={userName} />
      <DashboardShell userName={userName}>{children}</DashboardShell>
      <MobileNavContainer />
    </div>
  );
}
