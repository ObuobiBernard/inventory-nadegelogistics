import React, { useState, useEffect } from 'react';
import { Equipment, Category, EquipmentStatus } from '../../types';
import { X, Save, Boxes } from 'lucide-react';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Partial<Equipment>) => void;
  editingItem: Equipment | null;
  categories: Category[];
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  categories,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<EquipmentStatus>('available');
  const [quantity, setQuantity] = useState(1);
  const [available, setAvailable] = useState(1);
  const [rentalPrice, setRentalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || '');
      setCategory(editingItem.category || (categories[0]?.id || ''));
      setStatus(editingItem.status || 'available');
      setQuantity(editingItem.quantity || 1);
      setAvailable(editingItem.available !== undefined ? editingItem.available : 1);
      setRentalPrice(editingItem.rentalPrice || 0);
      setSalePrice(editingItem.salePrice || 0);
      setDescription(editingItem.description || '');
      setSupplier(editingItem.supplier || '');
      setLocation(editingItem.location || '');
    } else {
      setName('');
      setCategory(categories[0]?.id || '');
      setStatus('available');
      setQuantity(1);
      setAvailable(1);
      setRentalPrice(0);
      setSalePrice(0);
      setDescription('');
      setSupplier('');
      setLocation('Warehouse');
    }
  }, [editingItem, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      category,
      status,
      quantity: Number(quantity),
      available: Number(available),
      rentalPrice: Number(rentalPrice),
      salePrice: Number(salePrice),
      description,
      supplier,
      location,
    });
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2a3a4a]">
          <div className="flex items-center gap-2 text-[#edf2f7]">
            <Boxes className="w-5 h-5 text-[#f5b342]" />
            <h3 className="font-bold text-lg">
              {editingItem ? 'Edit Equipment' : 'Add Equipment'}
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
              Equipment Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 6m Truss Section"
              className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Category *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EquipmentStatus)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Total Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={(e) => {
                  const q = parseInt(e.target.value) || 0;
                  setQuantity(q);
                  if (!editingItem) setAvailable(q);
                }}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Available Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                value={available}
                onChange={(e) => setAvailable(parseInt(e.target.value) || 0)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Rental Price (GH₵ / day) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={rentalPrice}
                onChange={(e) => setRentalPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Sale Price (GH₵) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Supplier (optional)
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Supplier name"
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2 text-sm text-[#edf2f7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Location (optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Warehouse"
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2 text-sm text-[#edf2f7] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specifications, details, accessories..."
              className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none resize-none"
            />
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
              <span>{editingItem ? 'Update Equipment' : 'Save Equipment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
