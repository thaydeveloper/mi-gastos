/**
 * @fileoverview DatePicker presentation component using native date input.
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/** Props for the DatePicker component */
interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/** Native date input with consistent styling */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type="date"
          style={{ colorScheme: 'dark' }}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-indigo-500/20',
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-indigo-500 dark:border-gray-700',
            'dark:bg-gray-800 dark:text-white',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
