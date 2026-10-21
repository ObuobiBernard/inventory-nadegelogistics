import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { X, Users, Save } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Partial<Customer>) => void;
  editingCustomer: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCustomer,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name || '');
      setEmail(editingCustomer.email || '');
      setPhone(editingCustomer.phone || '');
      setCompany(editingCustomer.company || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
    }
  }, [editingCustomer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, phone, company });
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2a3a4a]">
          <div className="flex items-center gap-2 text-[#edf2f7]">
            <Users className="w-5 h-5 text-[#f5b342]" />
            <h3 className="font-bold text-lg">
              {editingCustomer ? 'Edit Customer' : 'Add Customer'}
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
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 555 0101"
              className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Company / Organization
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
              className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
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
              <span>{editingCustomer ? 'Update Customer' : 'Save Customer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
