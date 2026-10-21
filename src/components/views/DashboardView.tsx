import React from 'react';
import { Equipment, Rental, Customer, ActivityLog } from '../../types';
import { Boxes, CheckCircle2, Handshake, Users, History, Trash2, ArrowUpRight } from 'lucide-react';

interface DashboardViewProps {
  equipment: Equipment[];
  rentals: Rental[];
  customers: Customer[];
  activityLogs: ActivityLog[];
  onClearActivityLogs: () => void;
  onNavigate: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  equipment,
  rentals,
  customers,
  activityLogs,
  onClearActivityLogs,
  onNavigate,
}) => {
  const activeEquip = equipment.filter((e) => !e.deleted);
  const totalEquip = activeEquip.length;
  const availableStock = activeEquip
    .filter((e) => e.status === 'available' || e.status === 'reserved')
    .reduce((sum, e) => sum + (e.available || 0), 0);
  const activeRentals = rentals.filter((r) => !r.deleted && r.status === 'active').length;
  const totalCustomers = customers.filter((c) => !c.deleted).length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Equipment */}
        <div
          onClick={() => onNavigate('equipment')}
          className="bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] rounded-xl p-5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-[#94a3b8] font-semibold flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-[#f5b342]" /> Total Equipment
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f5b342]/15 flex items-center justify-center text-[#f5b342] group-hover:scale-110 transition-transform">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#edf2f7] mb-1">{totalEquip}</div>
          <div className="text-xs text-[#94a3b8] flex items-center justify-between">
            <span>items in inventory</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#f5b342]" />
          </div>
        </div>

        {/* Available Stock */}
        <div
          onClick={() => onNavigate('equipment')}
          className="bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] rounded-xl p-5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-[#94a3b8] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e]" /> Available Stock
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/15 flex items-center justify-center text-[#22c55e] group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#22c55e] mb-1">{availableStock}</div>
          <div className="text-xs text-[#94a3b8] flex items-center justify-between">
            <span>ready to rent / sell</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#22c55e]" />
          </div>
        </div>

        {/* Active Rentals */}
        <div
          onClick={() => onNavigate('rentals')}
          className="bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] rounded-xl p-5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-[#94a3b8] font-semibold flex items-center gap-1.5">
              <Handshake className="w-4 h-4 text-[#3b82f6]" /> Active Rentals
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/15 flex items-center justify-center text-[#3b82f6] group-hover:scale-110 transition-transform">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#edf2f7] mb-1">{activeRentals}</div>
          <div className="text-xs text-[#94a3b8] flex items-center justify-between">
            <span>currently rented out</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#3b82f6]" />
          </div>
        </div>

        {/* Total Customers */}
        <div
          onClick={() => onNavigate('customers')}
          className="bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] rounded-xl p-5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-[#94a3b8] font-semibold flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#8b5cf6]" /> Total Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/15 flex items-center justify-center text-[#8b5cf6] group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#edf2f7] mb-1">{totalCustomers}</div>
          <div className="text-xs text-[#94a3b8] flex items-center justify-between">
            <span>registered clients</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#8b5cf6]" />
          </div>
        </div>
      </div>

      {/* Activity Log section */}
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-[#2a3a4a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#f5b342]" />
            <h2 className="text-base font-bold text-[#edf2f7]">Activity Log</h2>
          </div>
          {activityLogs.length > 0 && (
            <button
              onClick={onClearActivityLogs}
              className="text-xs text-[#94a3b8] hover:text-[#ef4444] px-2.5 py-1 rounded bg-[#131a24] hover:bg-[#212d3d] border border-[#2a3a4a] flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          )}
        </div>

        <div className="p-4 sm:p-5 max-h-80 overflow-y-auto space-y-2">
          {activityLogs.length === 0 ? (
            <div className="text-center py-8 text-[#64748b]">
              <History className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No activity recorded yet</p>
              <p className="text-xs">Inventory actions and syncs will appear here.</p>
            </div>
          ) : (
            activityLogs.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 py-2 border-b border-[#2a3a4a]/50 text-xs sm:text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-[#edf2f7]">{item.action}</span>
                  {item.details && (
                    <span className="text-xs text-[#94a3b8]">{item.details}</span>
                  )}
                </div>
                <span className="text-[11px] text-[#64748b] whitespace-nowrap shrink-0 mt-0.5">
                  {new Date(item.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
