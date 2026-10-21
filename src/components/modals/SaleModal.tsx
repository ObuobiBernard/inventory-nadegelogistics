import React, { useState, useEffect } from 'react';
import { Equipment, Customer, Sale } from '../../types';
import { formatCurrency, today } from '../../services/storage';
import { X, Tag } from 'lucide-react';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Omit<Sale, 'id'>) => void;
  equipmentList: Equipment[];
  customerList: Customer[];
  preSelectedEquipmentId?: string;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  equipmentList,
  customerList,
  preSelectedEquipmentId,
}) => {
  const availableEquip = equipmentList.filter((e) => !e.deleted && e.available > 0);
  const activeCustomers = customerList.filter((c) => !c.deleted);

  const [equipmentId, setEquipmentId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (preSelectedEquipmentId) {
        setEquipmentId(preSelectedEquipmentId);
      } else if (availableEquip.length > 0) {
        setEquipmentId(availableEquip[0].id);
      }
      if (activeCustomers.length > 0) {
        setCustomerId(activeCustomers[0].id);
      }
      setQuantity(1);
      setError('');
    }
  }, [isOpen, preSelectedEquipmentId]);

  if (!isOpen) return null;

  const selectedEquip = equipmentList.find((e) => e.id === equipmentId);
  const totalAmount = selectedEquip ? quantity * (selectedEquip.salePrice || 0) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentId || !customerId) {
      setError('Please select equipment and customer.');
      return;
    }
    if (selectedEquip && quantity > selectedEquip.available) {
      setError(`Only ${selectedEquip.available} items are available in stock.`);
      return;
    }

    onSave({
      equipmentId,
      customerId,
      date: today(),
      quantity,
      totalPrice: totalAmount,
      deleted: false,
    });
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2a3a4a]">
          <div className="flex items-center gap-2 text-[#edf2f7]">
            <Tag className="w-5 h-5 text-[#f5b342]" />
            <h3 className="font-bold text-lg">Record Equipment Sale</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {availableEquip.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-[#ef4444] text-sm font-medium mb-3">
              No equipment is currently available for sale.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#131a24] text-sm text-[#94a3b8] hover:text-white rounded-lg"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-[#ef4444]/15 border border-[#ef4444]/30 rounded-lg text-xs text-[#ef4444]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Equipment *
              </label>
              <select
                required
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              >
                {availableEquip.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.available} available — {formatCurrency(e.salePrice)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Customer *
              </label>
              <select
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              >
                {activeCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                max={selectedEquip?.available || 1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              />
            </div>

            {/* Sale summary */}
            <div className="bg-[#131a24] border border-[#2a3a4a] rounded-xl p-3 flex justify-between items-center text-sm">
              <div>
                <span className="text-xs text-[#94a3b8]">Unit Sale Price:</span>
                <span className="ml-1 font-semibold text-[#edf2f7]">
                  {formatCurrency(selectedEquip?.salePrice)}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#94a3b8]">Total Amount:</span>
                <span className="ml-1 text-base font-bold text-[#22c55e]">
                  {formatCurrency(totalAmount)}
                </span>
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
                className="px-5 py-2 rounded-lg text-sm font-bold bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] transition-all shadow-md shadow-[#f5b342]/10"
              >
                Record Sale
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
