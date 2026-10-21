import React, { useState } from 'react';
import { Equipment, Category } from '../../types';
import { formatCurrency } from '../../services/storage';
import {
  Boxes,
  Plus,
  FileSpreadsheet,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Undo2,
  Handshake,
  Tag,
  Search,
} from 'lucide-react';

interface EquipmentViewProps {
  equipment: Equipment[];
  categories: Category[];
  searchQuery: string;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onEditItem: (item: Equipment) => void;
  onDeleteItem: (id: string) => void;
  onRestoreItem: (id: string) => void;
  onQuickRent: (equipId: string) => void;
  onQuickSell: (equipId: string) => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  equipment,
  categories,
  searchQuery,
  onOpenAddModal,
  onOpenImportModal,
  onEditItem,
  onDeleteItem,
  onRestoreItem,
  onQuickRent,
  onQuickSell,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDeleted, setShowDeleted] = useState(false);

  // Filter items
  const filtered = equipment.filter((item) => {
    if (!showDeleted && item.deleted) return false;
    if (showDeleted && !item.deleted) return false;

    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const cat = categories.find((c) => c.id === item.category);
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchCat = cat?.name.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat && !matchId) return false;
    }

    return true;
  });

  const getStatusBadge = (status: string, available: number) => {
    if (available === 0) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
          Out of stock
        </span>
      );
    }
    switch (status) {
      case 'available':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30">
            Available
          </span>
        );
      case 'rented':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#f5b342]/20 text-[#f5b342] border border-[#f5b342]/30">
            Rented
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30">
            Reserved
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30">
            Maintenance
          </span>
        );
      case 'sold':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#64748b]/20 text-[#94a3b8] border border-[#64748b]/30">
            Sold
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#1a232f] text-[#94a3b8]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-xl overflow-hidden shadow-xl animate-in fade-in">
      {/* Header & filters */}
      <div className="p-4 sm:p-5 border-b border-[#2a3a4a] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-[#f5b342]" />
          <h2 className="text-base font-bold text-[#edf2f7]">
            All Equipment ({filtered.length})
          </h2>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="all">All Categories</option>
            {categories
              .filter((c) => !c.deleted)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>

          {/* Add */}
          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add</span>
          </button>

          {/* Import */}
          <button
            onClick={onOpenImportModal}
            className="px-3 py-1.5 bg-[#131a24] hover:bg-[#212d3d] border border-[#2a3a4a] text-[#22c55e] font-semibold text-xs rounded-lg flex items-center gap-1 transition-all"
            title="Import CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          {/* Show Deleted Toggle */}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#131a24]/80 text-[#94a3b8] border-b border-[#2a3a4a] text-xs uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Equipment Item</th>
              <th className="py-3 px-3 font-semibold">Category</th>
              <th className="py-3 px-3 font-semibold text-center">Total</th>
              <th className="py-3 px-3 font-semibold text-center">Available</th>
              <th className="py-3 px-3 font-semibold">Rental Price</th>
              <th className="py-3 px-3 font-semibold">Sale Price</th>
              <th className="py-3 px-3 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3a4a]/40">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#64748b]">
                  <Boxes className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-base font-semibold">No equipment found</p>
                  <p className="text-xs">
                    {searchQuery
                      ? 'No matches for your search term.'
                      : 'Add your first piece of equipment or import from CSV.'}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const cat = categories.find((c) => c.id === item.category);
                const isOutOfStock = (item.available || 0) <= 0;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#212d3d]/50 transition-colors ${
                      item.deleted ? 'opacity-40 bg-[#131a24]/50' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#edf2f7] flex items-center gap-1.5 flex-wrap">
                        <span>{item.name}</span>
                        {item._imported && !item.deleted && (
                          <span
                            className="text-[10px] bg-[#f5b342]/15 text-[#f5b342] px-1.5 py-0.2 rounded border border-[#f5b342]/30"
                            title="Imported from Excel / CSV"
                          >
                            Imported
                          </span>
                        )}
                        {item.deleted && (
                          <span className="text-[10px] text-[#ef4444]">(deleted)</span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-[#94a3b8] line-clamp-1 max-w-sm mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-[#131a24] text-[#f5b342] border border-[#2a3a4a]">
                        <i className={cat?.icon || 'fa-solid fa-cube'} />
                        <span>{cat ? cat.name : 'Uncategorized'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-medium text-[#edf2f7]">
                      {item.quantity}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`font-bold ${
                          isOutOfStock ? 'text-[#ef4444]' : 'text-[#22c55e]'
                        }`}
                      >
                        {item.available}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-xs text-[#edf2f7] font-medium">
                      {formatCurrency(item.rentalPrice)} <span className="text-[#64748b]">/day</span>
                    </td>

                    <td className="py-3.5 px-3 text-xs text-[#edf2f7] font-medium">
                      {formatCurrency(item.salePrice)}
                    </td>

                    <td className="py-3.5 px-3">{getStatusBadge(item.status, item.available)}</td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!item.deleted ? (
                          <>
                            {!isOutOfStock ? (
                              <>
                                <button
                                  onClick={() => onQuickRent(item.id)}
                                  className="p-1.5 rounded bg-[#f5b342]/15 hover:bg-[#f5b342] text-[#f5b342] hover:text-[#0b0e14] transition-all"
                                  title="Rent item"
                                >
                                  <Handshake className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onQuickSell(item.id)}
                                  className="p-1.5 rounded bg-[#22c55e]/15 hover:bg-[#22c55e] text-[#22c55e] hover:text-white transition-all"
                                  title="Sell item"
                                >
                                  <Tag className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] text-[#ef4444] px-1.5">Out of stock</span>
                            )}

                            <button
                              onClick={() => onEditItem(item)}
                              className="p-1.5 rounded bg-[#131a24] hover:bg-[#212d3d] text-[#94a3b8] hover:text-white transition-all"
                              title="Edit item"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className="p-1.5 rounded bg-[#131a24] hover:bg-[#ef4444]/20 text-[#94a3b8] hover:text-[#ef4444] transition-all"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onRestoreItem(item.id)}
                            className="p-1.5 rounded bg-[#3b82f6]/20 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white transition-all flex items-center gap-1 text-xs"
                            title="Restore item"
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
