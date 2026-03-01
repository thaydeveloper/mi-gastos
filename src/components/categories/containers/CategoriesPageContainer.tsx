/**
 * @fileoverview Container component for the categories management page.
 * Handles CRUD logic and state, delegates rendering to presentation components.
 */

'use client';

import { useState } from 'react';
import type { Category } from '@/types';
import { createCategory, updateCategory, deleteCategory } from '@/app/(dashboard)/categories/actions';
import { CategoryListView } from '../presentation/CategoryListView';
import { CategoryFormView } from '../presentation/CategoryFormView';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

/** Props for CategoriesPageContainer */
interface CategoriesPageContainerProps {
  initialCategories: Category[];
}

/** Container managing categories CRUD state and actions */
export function CategoriesPageContainer({ initialCategories }: CategoriesPageContainerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditingCategory(null);
    setName('');
    setColor('#6366f1');
    setIcon('');
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setColor(cat.color);
    setIcon(cat.icon ?? '');
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set('name', name);
    formData.set('color', color);
    formData.set('icon', icon);

    const result = editingCategory
      ? await updateCategory(editingCategory.id, formData)
      : await createCategory(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    const result = await deleteCategory(id);
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categorias</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie suas categorias de despesas
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Nova Categoria
        </Button>
      </div>

      <CategoryListView
        categories={initialCategories}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <CategoryFormView
        open={modalOpen}
        isEditing={!!editingCategory}
        name={name}
        color={color}
        icon={icon}
        error={error}
        loading={loading}
        onNameChange={setName}
        onColorChange={setColor}
        onIconChange={setIcon}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
