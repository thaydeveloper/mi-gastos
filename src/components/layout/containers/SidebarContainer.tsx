/**
 * @fileoverview Sidebar container component.
 * Manages active route detection and logout logic.
 */

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { NAV_ITEMS } from '@/lib/constants';
import { SidebarView } from '../presentation/SidebarView';

/** Props for SidebarContainer */
interface SidebarContainerProps {
  userName: string | null;
}

/** Container that manages sidebar state and delegates rendering */
export function SidebarContainer({ userName }: SidebarContainerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <SidebarView
      pathname={pathname}
      userName={userName}
      items={NAV_ITEMS}
      onLogout={handleLogout}
    />
  );
}
