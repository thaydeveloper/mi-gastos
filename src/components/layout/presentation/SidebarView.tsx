/**
 * @fileoverview Sidebar presentation component.
 * Renders navigation links and logout button - no logic.
 */

'use client';

import Link from 'next/link';
import { LayoutDashboard, Receipt, Tags, Download, Settings, LogOut, TrendingUp, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const icons = {
  LayoutDashboard,
  Receipt,
  Tags,
  Download,
  Settings,
  TrendingUp,
  CalendarClock,
} as const;

/** Props for the SidebarView */
interface SidebarViewProps {
  pathname: string;
  userName: string | null;
  items: ReadonlyArray<{
    href: string;
    label: string;
    icon: keyof typeof icons;
  }>;
  onLogout: () => void;
}

/** Renders the sidebar navigation UI */
export function SidebarView({ pathname, userName, items, onLogout }: SidebarViewProps) {
  return (
    <aside className="hidden h-screen w-64 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <h1 className="text-xl font-bold text-indigo-600">Meus Gastos</h1>
          {userName && (
            <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
              {userName}
            </p>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => {
            const Icon = icons[item.icon];
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-3 dark:border-gray-800">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
