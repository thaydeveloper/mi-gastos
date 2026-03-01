/**
 * @fileoverview Dashboard shell container that orchestrates sidebar, header, and mobile nav.
 */

'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { NAV_ITEMS } from '@/lib/constants';
import { HeaderView } from '../presentation/HeaderView';
import { MobileSidebarView } from '../presentation/MobileSidebarView';

/** Props for DashboardShell */
interface DashboardShellProps {
  userName: string | null;
  children: React.ReactNode;
}

/** Container that manages mobile menu state and provides the dashboard shell */
export function DashboardShell({ userName, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <MobileSidebarView
        open={sidebarOpen}
        pathname={pathname}
        userName={userName}
        items={NAV_ITEMS}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 flex-col">
        <HeaderView onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 pb-20 lg:p-6 lg:pb-6">{children}</main>
      </div>
    </>
  );
}
