/**
 * @fileoverview Mobile bottom navigation presentation component.
 */

'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Download,
  Settings,
  TrendingUp,
  CalendarClock,
} from 'lucide-react';
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

/** Props for MobileNavView */
interface MobileNavViewProps {
  pathname: string;
  items: ReadonlyArray<{
    href: string;
    label: string;
    icon: keyof typeof icons;
  }>;
}

/** Bottom tab bar for mobile navigation */
export function MobileNavView({ pathname, items }: MobileNavViewProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:hidden">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = icons[item.icon];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400',
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
