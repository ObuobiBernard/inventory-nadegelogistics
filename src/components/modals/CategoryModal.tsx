import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { X, Tags, Save } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
  editingCategory: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('fa-solid fa-cube');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setIcon(editingCategory.icon || 'fa-solid fa-cube');
    } else {
      setName('');
      setIcon('fa-solid fa-cube');
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, icon });
  };

  const sampleIcons = [
    { label: 'Display / LED', val: 'fa-solid fa-display' },
    { label: 'Sound / Volume', val: 'fa-solid fa-volume-high' },
    { label: 'Stage / Layers', val: 'fa-solid fa-layer-group' },
    { label: 'Microphone', val: 'fa-solid fa-microphone' },
    { label: 'Lighting / Bolt', val: 'fa-solid fa-bolt' },
    { label: 'Box / Hardware', val: 'fa-solid fa-cube' },
    { label: 'Truss / Tower', val: 'fa-solid fa-broadcast-tower' },
  ];

  return (
    <div className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2a3a4a]">
          <div className="flex items-center gap-2 text-[#edf2f7]">
            <Tags className="w-5 h-5 text-[#f5b342]" />
            <h3 className="font-bold text-lg">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. LED Screens"
              className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Icon Class (Font Awesome)
            </label>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#131a24] border border-[#2a3a4a] flex items-center justify-center text-[#f5b342] shrink-0 text-lg">
                <i className={icon || 'fa-solid fa-cube'} />
              </div>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="fa-solid fa-display"
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2 text-sm text-[#edf2f7] outline-none"
              />
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {sampleIcons.map((item) => (
                <button
                  type="button"
                  key={item.val}
                  onClick={() => setIcon(item.val)}
                  className={`text-[11px] px-2 py-1 rounded bg-[#131a24] border text-[#94a3b8] hover:text-white hover:border-[#f5b342] flex items-center gap-1.5 transition-all ${
                    icon === item.val ? 'border-[#f5b342] text-[#f5b342]' : 'border-[#2a3a4a]'
                  }`}
                >
                  <i className={item.val} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#2a3a4a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#131a24] hover:bg-[#212d3d] text-[#94a3b8] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-bold bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] flex items-center gap-2 transition-all shadow-md shadow-[#f5b342]/10"
            >
              <Save className="w-4 h-4" />
              <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
