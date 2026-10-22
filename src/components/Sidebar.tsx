import React from 'react';
import { PageTab } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Boxes,
  Handshake,
  Tag,
  Users,
  Tags,
  Store,
  Lock,
  X,
  ExternalLink,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onLockSession: () => void;
  onSwitchToClientCatalog: () => void;
  counts: {
    equipment: number;
    rentals: number;
    sales: number;
    customers: number;
    orders: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onLockSession,
  onSwitchToClientCatalog,
  counts,
}) => {
  const { isAdmin } = useAuth();

  const navItems = [
    {
      id: 'dashboard' as PageTab,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      badge: null,
    },
    {
      id: 'orders' as PageTab,
      label: 'Customer Orders',
      icon: <ClipboardList className="w-5 h-5 shrink-0 text-[#22c55e]" />,
      badge: counts.orders,
      isSpecial: true,
    },
    {
      id: 'equipment' as PageTab,
      label: 'Equipment Inventory',
      icon: <Boxes className="w-5 h-5 shrink-0" />,
      badge: counts.equipment,
    },
    {
      id: 'rentals' as PageTab,
      label: 'Rentals RMS',
      icon: <Handshake className="w-5 h-5 shrink-0" />,
      badge: counts.rentals,
    },
    {
      id: 'sales' as PageTab,
      label: 'Sales Records',
      icon: <Tag className="w-5 h-5 shrink-0" />,
      badge: counts.sales,
    },
    {
      id: 'customers' as PageTab,
      label: 'Customer Directory',
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: counts.customers,
    },
    {
      id: 'categories' as PageTab,
      label: 'Categories',
      icon: <Tags className="w-5 h-5 shrink-0" />,
      badge: null,
    },
    ...(isAdmin
      ? [
          {
            id: 'staff-management' as PageTab,
            label: 'Staff Access & RBAC',
            icon: <ShieldCheck className="w-5 h-5 shrink-0 text-[#f5b342]" />,
            badge: 'Admin',
            isSpecial: true,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0f151e] border-r border-[#2a3a4a] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-[#2a3a4a] flex flex-col items-center text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#94a3b8] hover:text-white lg:hidden p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src="/nadege-logo.jpg"
            alt="NADEGE Logistics"
            className="max-h-14 w-auto object-contain mb-2 rounded"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          <h2 className="text-base font-bold tracking-tight text-[#edf2f7]">
            NADEGE Logistics
          </h2>
          <span className="text-[10px] uppercase tracking-wider text-[#f5b342] font-semibold">
            Staff Inventory & RMS
          </span>
          <p className="text-[11px] text-[#94a3b8] italic mt-0.5 font-serif">
            Ghanaian Cedis (GH₵)
          </p>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#f5b342]/15 text-[#f5b342] font-semibold'
                    : 'text-[#94a3b8] hover:bg-[#1a232f] hover:text-[#edf2f7]'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.isSpecial
                        ? 'bg-[#22c55e] text-[#0b0e14]'
                        : isActive
                        ? 'bg-[#f5b342] text-[#0b0e14]'
                        : 'bg-[#1a232f] text-[#94a3b8]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-[#2a3a4a] space-y-1">
            {/* Switch to Client Catalog */}
            <button
              onClick={() => {
                onSwitchToClientCatalog();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#f5b342] hover:bg-[#f5b342]/10 transition-all border border-[#f5b342]/20"
            >
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 shrink-0" />
                <span>Client Catalog</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </button>

            {/* Lock Session */}
            <button
              onClick={() => {
                onLockSession();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
            >
              <Lock className="w-5 h-5 shrink-0" />
              <span>Lock Staff Session</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a3a4a] text-center text-xs text-[#64748b] flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block animate-pulse" />
          <span>v5.0 · Firebase & GHS Live</span>
        </div>
      </aside>
    </>
  );
};
