import React, { useState } from 'react';
import { Rental, Equipment, Customer } from '../../types';
import { formatCurrency, formatDate } from '../../services/storage';
import { Handshake, Plus, Eye, EyeOff, Trash2, Undo2, CheckCircle } from 'lucide-react';

interface RentalsViewProps {
  rentals: Rental[];
  equipment: Equipment[];
  customers: Customer[];
  searchQuery: string;
  onOpenNewRental: () => void;
  onReturnRental: (rentalId: string) => void;
  onDeleteRental: (id: string) => void;
  onRestoreRental: (id: string) => void;
}

export const RentalsView: React.FC<RentalsViewProps> = ({
  rentals,
  equipment,
  customers,
  searchQuery,
  onOpenNewRental,
  onReturnRental,
  onDeleteRental,
  onRestoreRental,
}) => {
  const [showDeleted, setShowDeleted] = useState(false);

  const filtered = rentals.filter((r) => {
    if (!showDeleted && r.deleted) return false;
    if (showDeleted && !r.deleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const equip = equipment.find((e) => e.id === r.equipmentId);
      const cust = customers.find((c) => c.id === r.customerId);
      const matchEquip = equip?.name.toLowerCase().includes(q);
      const matchCust = cust?.name.toLowerCase().includes(q);
      const matchNotes = (r.notes || '').toLowerCase().includes(q);
      const matchEvent = (r.event || '').toLowerCase().includes(q);
      if (!matchEquip && !matchCust && !matchNotes && !matchEvent) return false;
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30">
            Active
          </span>
        );
      case 'returned':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30">
            Returned
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#f5b342]/20 text-[#f5b342] border border-[#f5b342]/30">
            Reserved
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#64748b]/20 text-[#94a3b8] border border-[#64748b]/30">
            Draft
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
      <div className="p-4 sm:p-5 border-b border-[#2a3a4a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Handshake className="w-5 h-5 text-[#f5b342]" />
          <h2 className="text-base font-bold text-[#edf2f7]">
            Rentals Management ({filtered.length})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewRental}
            className="px-3 py-1.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Rental</span>
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
              <th className="py-3 px-3 font-semibold">Start Date</th>
              <th className="py-3 px-3 font-semibold">End Date</th>
              <th className="py-3 px-3 font-semibold">Status</th>
              <th className="py-3 px-3 font-semibold">Total Price</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3a4a]/40">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#64748b]">
                  <Handshake className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-base font-semibold">No rentals recorded</p>
                  <p className="text-xs">Create your first rental using the button above.</p>
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const equip = equipment.find((e) => e.id === r.equipmentId);
                const cust = customers.find((c) => c.id === r.customerId);
                const isActive = r.status.toLowerCase() === 'active';

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-[#212d3d]/50 transition-colors ${
                      r.deleted ? 'opacity-40 bg-[#131a24]/50' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#edf2f7] flex items-center gap-1.5">
                        <span>{equip?.name || 'Equipment ' + r.equipmentId}</span>
                        <span className="text-xs text-[#94a3b8]">x{r.quantity}</span>
                      </div>
                      {r.event && (
                        <p className="text-xs text-[#f5b342] line-clamp-1 mt-0.5">
                          Event: {r.event}
                        </p>
                      )}
                      {r.notes && (
                        <p className="text-[11px] text-[#64748b] line-clamp-1 mt-0.5">
                          {r.notes}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#edf2f7]">
                        {cust?.name || 'Customer ' + r.customerId}
                      </div>
                      {cust?.company && (
                        <div className="text-xs text-[#94a3b8]">{cust.company}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-xs text-[#94a3b8]">
                      {formatDate(r.startDate)}
                    </td>

                    <td className="py-3.5 px-3 text-xs text-[#94a3b8]">
                      {formatDate(r.endDate)}
                    </td>

                    <td className="py-3.5 px-3">{getStatusBadge(r.status)}</td>

                    <td className="py-3.5 px-3 font-semibold text-[#edf2f7]">
                      {formatCurrency(r.totalPrice)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!r.deleted ? (
                          <>
                            {isActive && (
                              <button
                                onClick={() => onReturnRental(r.id)}
                                className="px-2.5 py-1 rounded bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-xs flex items-center gap-1 transition-all"
                                title="Mark as returned and restore inventory"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Return</span>
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteRental(r.id)}
                              className="p-1.5 rounded bg-[#131a24] hover:bg-[#ef4444]/20 text-[#94a3b8] hover:text-[#ef4444] transition-all"
                              title="Delete rental"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onRestoreRental(r.id)}
                            className="p-1.5 rounded bg-[#3b82f6]/20 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white transition-all flex items-center gap-1 text-xs"
                            title="Restore rental"
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
