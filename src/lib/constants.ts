/**
 * @fileoverview Application-wide constants.
 */

/** Number of expenses per page in the list view */
export const EXPENSES_PER_PAGE = 20;

/** Default category colors for the color picker */
export const CATEGORY_COLORS = [
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#6b7280',
] as const;

/** Recurring interval labels in Portuguese */
export const RECURRING_LABELS: Record<string, string> = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
};

/** Navigation items for the sidebar (all routes) */
export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/incomes', label: 'Ganhos', icon: 'TrendingUp' },
  { href: '/expenses', label: 'Despesas', icon: 'Receipt' },
  { href: '/bills', label: 'Contas', icon: 'CalendarClock' },
  { href: '/categories', label: 'Categorias', icon: 'Tags' },
  { href: '/export', label: 'Exportar', icon: 'Download' },
  { href: '/settings', label: 'Configurações', icon: 'Settings' },
] as const;

/** Navigation items shown in mobile bottom bar (max 5 to fit the screen) */
export const MOBILE_NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/incomes', label: 'Ganhos', icon: 'TrendingUp' },
  { href: '/expenses', label: 'Despesas', icon: 'Receipt' },
  { href: '/bills', label: 'Contas', icon: 'CalendarClock' },
  { href: '/settings', label: 'Config', icon: 'Settings' },
] as const;
