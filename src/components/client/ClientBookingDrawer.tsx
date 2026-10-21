import React from 'react';
import { SelectedServiceItem, formatGHS } from '../../types';
import { X, ShoppingBag, Plus, Minus, Trash2, Calendar, ArrowRight } from 'lucide-react';

interface ClientBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: SelectedServiceItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onUpdateDays: (id: string, days: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  eventNotes: string;
  onEventNotesChange: (notes: string) => void;
  onProceedToPayment: () => void;
}

export const ClientBookingDrawer: React.FC<ClientBookingDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onUpdateDays,
  onRemoveItem,
  onClearCart,
  eventNotes,
  onEventNotesChange,
  onProceedToPayment,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="fixed inset-0 z-[9990] bg-black/70 backdrop-blur-sm flex justify-end">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#1a232f] border-l border-[#2a3a4a] h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#2a3a4a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#f5b342]" />
            <h2 className="font-bold text-base text-[#edf2f7]">
              Selected Services & Equipment ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#131a24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-[#64748b]">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold text-[#edf2f7]">Your selection tray is empty</p>
              <p className="text-xs mt-1">Browse the catalog to add event equipment and services.</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#f5b342] text-[#0b0e14] font-bold text-xs rounded-lg hover:bg-[#e6a63c] transition-all"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center text-xs text-[#94a3b8] pb-1">
                <span>Items in your booking:</span>
                <button
                  onClick={onClearCart}
                  className="text-[#ef4444] hover:underline"
                >
                  Clear all
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#131a24] border border-[#2a3a4a] rounded-xl flex flex-col gap-2.5"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#edf2f7] line-clamp-2">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-[#f5b342] font-semibold uppercase">
                        {item.serviceType === 'rental' ? 'Rental Service' : 'Direct Purchase'}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#94a3b8] hover:text-[#ef4444] p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Pricing and control details */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2a3a4a]/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#94a3b8]">Qty:</span>
                      <div className="flex items-center bg-[#1a232f] border border-[#2a3a4a] rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-[#94a3b8] hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono font-bold text-[#edf2f7]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-[#94a3b8] hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {item.serviceType === 'rental' && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-[#94a3b8]">Days:</span>
                        <select
                          value={item.days}
                          onChange={(e) => onUpdateDays(item.id, parseInt(e.target.value) || 1)}
                          className="bg-[#1a232f] border border-[#2a3a4a] text-xs text-[#edf2f7] rounded px-1.5 py-0.5 outline-none font-medium"
                        >
                          {[1, 2, 3, 4, 5, 7, 10, 14, 30].map((d) => (
                            <option key={d} value={d}>
                              {d} {d === 1 ? 'day' : 'days'}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="text-right">
                      <span className="font-bold text-[#f5b342] font-mono text-xs">
                        {formatGHS(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Event Notes */}
              <div className="mt-4 pt-3 border-t border-[#2a3a4a]">
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#f5b342]" />
                  <span>Event Date, Location & Instructions</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wedding reception at Labadi Beach Hotel, Dec 15-16..."
                  value={eventNotes}
                  onChange={(e) => onEventNotesChange(e.target.value)}
                  className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-xl p-2.5 text-xs text-[#edf2f7] outline-none resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#2a3a4a] bg-[#131a24]/90 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-[#94a3b8] font-semibold">Total Estimated Amount:</span>
              <span className="text-xl font-black text-[#f5b342] font-mono">
                {formatGHS(totalAmount)}
              </span>
            </div>

            <button
              onClick={onProceedToPayment}
              className="w-full py-3 px-4 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#f5b342]/20 transition-all active:scale-[0.98]"
            >
              <span>Send Selection & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-[#64748b]">
              Pay online now (Full/Part) or choose Book & Pay Later for Proforma Invoice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
