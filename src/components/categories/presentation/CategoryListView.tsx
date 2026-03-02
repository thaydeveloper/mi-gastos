/**
 * @fileoverview Presentation component for the category list.
 */

import type { Category } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

/** Props for CategoryListView */
interface CategoryListViewProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

/** Renders a list of categories with edit/delete actions */
export function CategoryListView({ categories, onEdit, onDelete }: CategoryListViewProps) {
  if (categories.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma categoria encontrada. Crie sua primeira categoria!
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <Card key={cat.id} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
            {cat.icon && <Badge className="text-xs">{cat.icon}</Badge>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(cat)}
              className="rounded px-2 py-1 text-xs text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(cat.id)}
              className="rounded px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
            >
              Excluir
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
