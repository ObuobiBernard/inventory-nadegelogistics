import React, { useState } from 'react';
import { Sale, Equipment, Customer } from '../../types';
import { formatCurrency, formatDate } from '../../services/storage';
import { Tag, Plus, Eye, EyeOff, Trash2, Undo2 } from 'lucide-react';

interface SalesViewProps {
  sales: Sale[];
  equipment: Equipment[];
  customers: Customer[];
  searchQuery: string;
  onOpenNewSale: () => void;
  onDeleteSale: (id: string) => void;
  onRestoreSale: (id: string) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  sales,
  equipment,
  customers,
  searchQuery,
  onOpenNewSale,
  onDeleteSale,
  onRestoreSale,
}) => {
  const [showDeleted, setShowDeleted] = useState(false);

  const filtered = sales.filter((s) => {
    if (!showDeleted && s.deleted) return false;
    if (showDeleted && !s.deleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const equip = equipment.find((e) => e.id === s.equipmentId);
      const cust = customers.find((c) => c.id === s.customerId);
      const matchEquip = equip?.name.toLowerCase().includes(q);
      const matchCust = cust?.name.toLowerCase().includes(q);
      if (!matchEquip && !matchCust) return false;
    }

    return true;
  });

  return (
    <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-xl overflow-hidden shadow-xl animate-in fade-in">
      <div className="p-4 sm:p-5 border-b border-[#2a3a4a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#f5b342]" />
          <h2 className="text-base font-bold text-[#edf2f7]">
            Sales Transactions ({filtered.length})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewSale}
            className="px-3 py-1.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Sale</span>
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
              <th className="py-3 px-4 font-semibold">Equipment Item</th>
              <th className="py-3 px-3 font-semibold">Customer</th>
              <th className="py-3 px-3 font-semibold">Date</th>
              <th className="py-3 px-3 font-semibold text-center">Qty</th>
              <th className="py-3 px-3 font-semibold">Total Price</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3a4a]/40">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#64748b]">
                  <Tag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-base font-semibold">No sales recorded</p>
                  <p className="text-xs">Record equipment purchases using the button above.</p>
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const equip = equipment.find((e) => e.id === s.equipmentId);
                const cust = customers.find((c) => c.id === s.customerId);

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-[#212d3d]/50 transition-colors ${
                      s.deleted ? 'opacity-40 bg-[#131a24]/50' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-[#edf2f7]">
                      {equip?.name || 'Equipment ' + s.equipmentId}
                      {s.deleted && (
                        <span className="text-[10px] text-[#ef4444] ml-2">(deleted)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#edf2f7]">
                        {cust?.name || 'Customer ' + s.customerId}
                      </div>
                      {cust?.company && (
                        <div className="text-xs text-[#94a3b8]">{cust.company}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-xs text-[#94a3b8]">
                      {formatDate(s.date)}
                    </td>

                    <td className="py-3.5 px-3 text-center font-medium text-[#edf2f7]">
                      {s.quantity}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-[#22c55e]">
                      {formatCurrency(s.totalPrice)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!s.deleted ? (
                          <button
                            onClick={() => onDeleteSale(s.id)}
                            className="p-1.5 rounded bg-[#131a24] hover:bg-[#ef4444]/20 text-[#94a3b8] hover:text-[#ef4444] transition-all"
                            title="Delete sale"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onRestoreSale(s.id)}
                            className="p-1.5 rounded bg-[#3b82f6]/20 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white transition-all flex items-center gap-1 text-xs"
                            title="Restore sale"
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
