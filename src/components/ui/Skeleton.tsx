/**
 * @fileoverview Skeleton loading placeholder component.
 */

import { cn } from '@/lib/utils/cn';

/** Props for the Skeleton component */
interface SkeletonProps {
  className?: string;
}

/** Animated loading placeholder */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700', className)}
    />
  );
}
