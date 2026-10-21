import React from 'react';
import { PageTab } from '../types';
import {
  Menu,
  Search,
  Store,
  CloudUpload,
  Plus,
  FileSpreadsheet,
  Settings,
  Loader2,
} from 'lucide-react';

interface TopbarProps {
  currentTab: PageTab;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileSidebar: () => void;
  onOpenAddEquipment: () => void;
  onOpenCsvImport: () => void;
  onOpenSettings: () => void;
  onToggleCatalog: () => void;
  onSyncGoogleSheets: () => void;
  isSyncing: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
  onOpenAddEquipment,
  onOpenCsvImport,
  onOpenSettings,
  onToggleCatalog,
  onSyncGoogleSheets,
  isSyncing,
}) => {
  const titles: Record<PageTab, { title: string; sub: string }> = {
    dashboard: { title: 'Dashboard', sub: 'Overview' },
    orders: { title: 'Customer Orders', sub: 'Client Selections & Proforma Invoices' },
    equipment: { title: 'Equipment', sub: 'Inventory (GH₵)' },
    rentals: { title: 'Rentals', sub: 'Active & History' },
    sales: { title: 'Sales', sub: 'Transactions' },
    customers: { title: 'Customers', sub: 'Directory' },
    categories: { title: 'Categories', sub: 'Classification' },
    'staff-management': { title: 'Staff Access & RBAC', sub: 'Invitations & Role Control' },
  };

  const { title, sub } = titles[currentTab] || { title: 'Dashboard', sub: 'Overview' };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#2a3a4a]">
      {/* Title & mobile menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg bg-[#1a232f] text-[#94a3b8] hover:text-white border border-[#2a3a4a]"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#edf2f7] flex items-baseline gap-2">
            {title}
            <span className="text-sm font-normal text-[#94a3b8]">{sub}</span>
          </h1>
        </div>
      </div>

      {/* Action buttons and Search */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Search Bar */}
        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-56 bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] placeholder-[#64748b] rounded-lg pl-9 pr-3 py-2 outline-none transition-all"
          />
        </div>

        {/* View Client Catalog */}
        <button
          onClick={onToggleCatalog}
          className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border bg-[#1a232f] text-[#f5b342] border-[#2a3a4a] hover:bg-[#212d3d] transition-all"
          title="Switch to Client Catalog"
        >
          <Store className="w-4 h-4" />
          <span className="hidden sm:inline">Client Catalog</span>
        </button>

        {/* Sync Button */}
        <button
          onClick={onSyncGoogleSheets}
          disabled={isSyncing}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] text-[#edf2f7] transition-all disabled:opacity-50"
          title="Sync all data to Google Sheets"
        >
          {isSyncing ? (
            <Loader2 className="w-4 h-4 text-[#f5b342] animate-spin" />
          ) : (
            <CloudUpload className="w-4 h-4 text-[#3b82f6]" />
          )}
          <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>

        {/* Add Equipment */}
        <button
          onClick={onOpenAddEquipment}
          className="px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] border border-[#f5b342] transition-all shadow-md shadow-[#f5b342]/10"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Add Equipment</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Import CSV */}
        <button
          onClick={onOpenCsvImport}
          className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] text-[#22c55e] transition-all"
          title="Import CSV"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span className="hidden md:inline">Import</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-[#94a3b8] hover:text-[#edf2f7] bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] transition-all"
          title="Sync Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
