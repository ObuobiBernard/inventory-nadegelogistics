import React, { useState } from 'react';
import { Category, Equipment } from '../../types';
import { Tags, Plus, Eye, EyeOff, Edit2, Trash2, Undo2 } from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  equipment: Equipment[];
  onOpenAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onRestoreCategory: (id: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  equipment,
  onOpenAddCategory,
  onEditCategory,
  onDeleteCategory,
  onRestoreCategory,
}) => {
  const [showDeleted, setShowDeleted] = useState(false);

  const filtered = categories.filter((c) => {
    if (!showDeleted && c.deleted) return false;
    if (showDeleted && !c.deleted) return false;
    return true;
  });

  return (
    <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-xl overflow-hidden shadow-xl animate-in fade-in">
      <div className="p-4 sm:p-5 border-b border-[#2a3a4a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tags className="w-5 h-5 text-[#f5b342]" />
          <h2 className="text-base font-bold text-[#edf2f7]">
            Categories ({filtered.length})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddCategory}
            className="px-3 py-1.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Category</span>
          </button>

          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className={`px-3 py-1.5 border rounded-lg font-semibold text-xs flex items-center gap-1 transition-all ${
              showDeleted
                ? 'bg-[#ef4444]/15 border-[#ef4444] text-[#ef4444]'
                : 'bg-[#131a24] border-[#2a3a4a] text-[#94a3b8] hover:text-white'
            }`}
          >
            {showDeleted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showDeleted ? 'Hide Deleted' : 'Show Deleted'}</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#131a24]/80 text-[#94a3b8] border-b border-[#2a3a4a] text-xs uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Category Name</th>
              <th className="py-3 px-3 font-semibold text-center">Icon</th>
              <th className="py-3 px-3 font-semibold text-center">Equipment Count</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3a4a]/40">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-[#64748b]">
                  <Tags className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-base font-semibold">No categories found</p>
                  <p className="text-xs">Add your first category using the button above.</p>
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const count = equipment.filter(
                  (e) => !e.deleted && e.category === c.id
                ).length;

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-[#212d3d]/50 transition-colors ${
                      c.deleted ? 'opacity-40 bg-[#131a24]/50' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#edf2f7]">{c.name}</span>
                      {c.deleted && (
                        <span className="text-[10px] text-[#ef4444] ml-2">(deleted)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#131a24] text-[#f5b342] text-sm">
                        <i className={c.icon || 'fa-solid fa-cube'} />
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#131a24] text-[#edf2f7] border border-[#2a3a4a]">
                        {count} item{count === 1 ? '' : 's'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!c.deleted ? (
                          <>
                            <button
                              onClick={() => onEditCategory(c)}
                              className="p-1.5 rounded bg-[#131a24] hover:bg-[#212d3d] text-[#94a3b8] hover:text-white transition-all"
                              title="Edit category"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => onDeleteCategory(c.id)}
                              className="p-1.5 rounded bg-[#131a24] hover:bg-[#ef4444]/20 text-[#94a3b8] hover:text-[#ef4444] transition-all"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onRestoreCategory(c.id)}
                            className="p-1.5 rounded bg-[#3b82f6]/20 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white transition-all flex items-center gap-1 text-xs"
                            title="Restore category"
                          >
                            <Undo2 className="w-4 h-4" />
                            <span>Restore</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
