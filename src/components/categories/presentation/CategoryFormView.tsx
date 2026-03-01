/**
 * @fileoverview Presentation component for category form (create/edit).
 */

'use client';

import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CATEGORY_COLORS } from '@/lib/constants';

/** Props for CategoryFormView */
interface CategoryFormViewProps {
  open: boolean;
  isEditing: boolean;
  name: string;
  color: string;
  icon: string;
  error: string | null;
  loading: boolean;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onIconChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

/** Renders the category form modal UI */
export function CategoryFormView({
  open,
  isEditing,
  name,
  color,
  icon,
  error,
  loading,
  onNameChange,
  onColorChange,
  onIconChange,
  onSubmit,
  onClose,
}: CategoryFormViewProps) {
  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Editar Categoria' : 'Nova Categoria'}>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="cat-name"
          label="Nome"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex: Alimentação"
          required
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cor
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onColorChange(c)}
                className={`h-8 w-8 rounded-full border-2 transition-transform ${
                  color === c ? 'scale-110 border-gray-900 dark:border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <Input
          id="cat-icon"
          label="Ícone (opcional)"
          value={icon}
          onChange={(e) => onIconChange(e.target.value)}
          placeholder="Ex: utensils"
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
