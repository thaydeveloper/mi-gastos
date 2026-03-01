/**
 * @fileoverview Reusable Card presentation component.
 */

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/** Props for the Card component */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** Card container with border and shadow */
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Card header with title and optional action */
export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}

/** Card title */
export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)} {...props}>
      {children}
    </h3>
  );
}
