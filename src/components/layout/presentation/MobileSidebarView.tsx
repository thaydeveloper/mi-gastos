/**
 * @fileoverview Mobile sidebar overlay presentation component.
 */

'use client';

import Link from 'next/link';
import { LayoutDashboard, Receipt, Tags, Download, Settings, LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const icons = {
  LayoutDashboard,
  Receipt,
  Tags,
  Download,
  Settings,
} as const;

/** Props for MobileSidebarView */
interface MobileSidebarViewProps {
  open: boolean;
  pathname: string;
  userName: string | null;
  items: ReadonlyArray<{
    href: string;
    label: string;
    icon: keyof typeof icons;
  }>;
  onClose: () => void;
  onLogout: () => void;
}

/** Full-screen mobile sidebar overlay */
export function MobileSidebarView({
  open,
  pathname,
  userName,
  items,
  onClose,
  onLogout,
}: MobileSidebarViewProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <h1 className="text-xl font-bold text-indigo-600">Meus Gastos</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {userName && (
          <div className="border-b border-gray-200 px-6 py-3 dark:border-gray-800">
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{userName}</p>
          </div>
        )}

        <nav className="space-y-1 px-3 py-4">
          {items.map((item) => {
            const Icon = icons[item.icon];
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-3 dark:border-gray-800">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
