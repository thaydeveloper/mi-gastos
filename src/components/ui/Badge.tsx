/**
 * @fileoverview Reusable Badge presentation component.
 */

import { cn } from '@/lib/utils/cn';

/** Props for the Badge component */
interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

/** Small colored badge for labels and tags */
export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        !color && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        className,
      )}
      style={color ? { backgroundColor: `${color}20`, color } : undefined}
    >
      {children}
    </span>
  );
}
