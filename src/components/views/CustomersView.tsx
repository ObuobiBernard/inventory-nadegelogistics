import React, { useState } from 'react';
import { Customer } from '../../types';
import { Users, Plus, Eye, EyeOff, Edit2, Trash2, Undo2, Mail, Phone, Building } from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  searchQuery: string;
  onOpenAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onRestoreCustomer: (id: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  searchQuery,
  onOpenAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onRestoreCustomer,
}) => {
  const [showDeleted, setShowDeleted] = useState(false);

  const filtered = customers.filter((c) => {
    if (!showDeleted && c.deleted) return false;
    if (showDeleted && !c.deleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchPhone = (c.phone || '').toLowerCase().includes(q);
      const matchCompany = (c.company || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchCompany) return false;
    }

    return true;
  });

  return (
    <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-xl overflow-hidden shadow-xl animate-in fade-in">
      <div className="p-4 sm:p-5 border-b border-[#2a3a4a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#f5b342]" />
          <h2 className="text-base font-bold text-[#edf2f7]">
            Customer Directory ({filtered.length})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddCustomer}
            className="px-3 py-1.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Customer</span>
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
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-3 font-semibold">Email</th>
              <th className="py-3 px-3 font-semibold">Phone</th>
              <th className="py-3 px-3 font-semibold">Company</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3a4a]/40">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#64748b]">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-base font-semibold">No customers found</p>
                  <p className="text-xs">Add your first customer using the button above.</p>
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
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

                  <td className="py-3.5 px-3">
                    <a
                      href={`mailto:${c.email}`}
                      className="text-xs text-[#3b82f6] hover:underline flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{c.email}</span>
                    </a>
                  </td>

                  <td className="py-3.5 px-3 text-xs text-[#94a3b8]">
                    {c.phone ? (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#64748b]" />
                        <span>{c.phone}</span>
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-xs text-[#edf2f7]">
                    {c.company ? (
                      <span className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#f5b342]" />
                        <span>{c.company}</span>
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!c.deleted ? (
                        <>
                          <button
                            onClick={() => onEditCustomer(c)}
                            className="p-1.5 rounded bg-[#131a24] hover:bg-[#212d3d] text-[#94a3b8] hover:text-white transition-all"
                            title="Edit customer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteCustomer(c.id)}
                            className="p-1.5 rounded bg-[#131a24] hover:bg-[#ef4444]/20 text-[#94a3b8] hover:text-[#ef4444] transition-all"
                            title="Delete customer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onRestoreCustomer(c.id)}
                          className="p-1.5 rounded bg-[#3b82f6]/20 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white transition-all flex items-center gap-1 text-xs"
                          title="Restore customer"
                        >
                          <Undo2 className="w-4 h-4" />
                          <span>Restore</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
