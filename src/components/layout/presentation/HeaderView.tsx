/**
 * @fileoverview Header presentation component.
 * Displays page title and mobile menu toggle.
 */

'use client';

import { Menu } from 'lucide-react';

/** Props for the HeaderView */
interface HeaderViewProps {
  onMenuToggle: () => void;
}

/** Renders the top header bar */
export function HeaderView({ onMenuToggle }: HeaderViewProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 lg:px-6">
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>
      <div className="lg:hidden">
        <h1 className="text-lg font-bold text-indigo-600">Meus Gastos</h1>
      </div>
    </header>
  );
}
