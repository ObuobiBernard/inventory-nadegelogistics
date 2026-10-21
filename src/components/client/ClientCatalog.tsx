import React, { useState } from 'react';
import { Equipment, Category, SelectedServiceItem, CustomerOrder, formatGHS } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingBag,
  Store,
  User,
  LogIn,
  LogOut,
  Lock,
  Plus,
  Check,
  Search,
  FileText,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

interface ClientCatalogProps {
  equipment: Equipment[];
  categories: Category[];
  selectedItems: SelectedServiceItem[];
  onAddItem: (item: Equipment, serviceType: 'rental' | 'purchase') => void;
  onOpenBookingDrawer: () => void;
  onOpenAuthModal: () => void;
  onOpenStaffPortal: () => void;
  clientOrders: CustomerOrder[];
  onViewOrderDoc: (order: CustomerOrder) => void;
}

export const ClientCatalog: React.FC<ClientCatalogProps> = ({
  equipment,
  categories,
  selectedItems,
  onAddItem,
  onOpenBookingDrawer,
  onOpenAuthModal,
  onOpenStaffPortal,
  clientOrders,
  onViewOrderDoc,
}) => {
  const { user, userProfile, signOutUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'catalog' | 'my_orders'>('catalog');

  const activeEquip = equipment.filter((e) => !e.deleted);
  const activeCats = categories.filter((c) => !c.deleted);

  const filtered = activeEquip.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const cat = categories.find((c) => c.id === item.category);
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchCat = cat?.name.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : 'Uncategorized';
  };

  const getCategoryIcon = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    return cat?.icon || 'fa-solid fa-cube';
  };

  const totalCartCount = selectedItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#edf2f7] flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0f151e]/95 backdrop-blur-md border-b border-[#2a3a4a] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/nadege logo.jpg"
              alt="NADEGE Logistics"
              className="h-10 w-auto object-contain rounded drop-shadow"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <span className="font-bold text-base text-[#edf2f7] block leading-tight">
                NADEGE Logistics
              </span>
              <span className="text-[10px] text-[#f5b342] font-semibold uppercase tracking-wider">
                Event Equipment Catalog
              </span>
            </div>
          </div>

          {/* Right Navigation & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* My Orders Tab */}
            {user && (
              <button
                onClick={() => setActiveView(activeView === 'catalog' ? 'my_orders' : 'catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  activeView === 'my_orders'
                    ? 'bg-[#f5b342] text-[#0b0e14] border-[#f5b342]'
                    : 'bg-[#1a232f] text-[#94a3b8] border-[#2a3a4a] hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">My Orders & Invoices</span>
                <span className="sm:hidden">Orders</span>
                {clientOrders.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#131a24] text-[#f5b342] text-[10px] flex items-center justify-center font-bold">
                    {clientOrders.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart / Booking Tray Button */}
            <button
              onClick={onOpenBookingDrawer}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] flex items-center gap-2 transition-all shadow-md shadow-[#f5b342]/15 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">My Selection</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#0b0e14] text-[#f5b342] text-[11px] font-mono font-bold">
                {totalCartCount}
              </span>
            </button>

            {/* User Account / Auth */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#2a3a4a]">
                <div className="hidden md:block text-right">
                  <span className="text-xs font-bold text-[#edf2f7] block leading-tight">
                    {userProfile?.displayName || user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className={`text-[10px] font-semibold block capitalize ${
                    userProfile?.role === 'admin'
                      ? 'text-[#f5b342]'
                      : userProfile?.role === 'staff'
                      ? 'text-[#3b82f6]'
                      : 'text-[#22c55e]'
                  }`}>
                    {userProfile?.role || 'Client'} Account
                  </span>
                </div>
                <button
                  onClick={() => signOutUser()}
                  className="p-2 rounded-lg bg-[#1a232f] hover:bg-[#ef4444]/20 text-[#94a3b8] hover:text-[#ef4444] border border-[#2a3a4a] transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] text-[#edf2f7] flex items-center gap-1.5 transition-all"
              >
                <User className="w-4 h-4 text-[#f5b342]" />
                <span>Client Login</span>
              </button>
            )}

            {/* Staff Gateway */}
            <button
              onClick={onOpenStaffPortal}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                userProfile?.role === 'staff' || userProfile?.role === 'admin'
                  ? 'bg-[#f5b342]/15 text-[#f5b342] border border-[#f5b342]/30 hover:bg-[#f5b342]/25'
                  : 'text-[#64748b] hover:text-[#f5b342] hover:bg-[#131a24] border border-transparent hover:border-[#2a3a4a]'
              }`}
              title="Staff Inventory RMS Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-semibold">Staff RMS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'my_orders' ? (
          /* Client Orders & Invoices View */
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a3a4a]">
              <div>
                <h2 className="text-xl font-bold text-[#edf2f7]">My Orders & Invoices</h2>
                <p className="text-xs text-[#94a3b8]">
                  Track your booked services, proforma invoices, and payment receipts.
                </p>
              </div>
              <button
                onClick={() => setActiveView('catalog')}
                className="px-3.5 py-1.5 bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] text-xs font-semibold rounded-lg text-[#f5b342]"
              >
                ← Back to Catalog
              </button>
            </div>

            {clientOrders.length === 0 ? (
              <div className="text-center py-16 bg-[#1a232f] border border-[#2a3a4a] rounded-2xl p-8">
                <FileText className="w-12 h-12 mx-auto mb-3 text-[#64748b] opacity-40" />
                <h3 className="text-base font-bold text-[#edf2f7]">No orders placed yet</h3>
                <p className="text-xs text-[#94a3b8] mt-1">
                  Browse our equipment catalog, choose your required services, and checkout to
                  receive your proforma invoice or receipt.
                </p>
                <button
                  onClick={() => setActiveView('catalog')}
                  className="mt-4 px-4 py-2 bg-[#f5b342] text-[#0b0e14] font-bold text-xs rounded-lg"
                >
                  Explore Equipment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientOrders.map((order) => {
                  const isPaid = order.paymentStatus === 'paid';
                  const isPart = order.paymentStatus === 'partially_paid';

                  return (
                    <div
                      key={order.id}
                      className="bg-[#1a232f] border border-[#2a3a4a] rounded-xl p-5 flex flex-col justify-between hover:border-[#f5b342]/60 transition-all shadow-lg"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div>
                            <span className="font-mono text-xs font-bold text-[#f5b342]">
                              {order.orderNumber}
                            </span>
                            <span className="block text-xs text-[#94a3b8] mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isPaid
                                ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30'
                                : isPart
                                ? 'bg-[#f5b342]/20 text-[#f5b342] border border-[#f5b342]/30'
                                : 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30'
                            }`}
                          >
                            {isPaid ? 'Receipt (Paid)' : isPart ? 'Receipt (Deposit)' : 'Proforma Invoice'}
                          </span>
                        </div>

                        {/* Order Items Summary */}
                        <div className="space-y-1.5 py-2 border-y border-[#2a3a4a]/60 text-xs">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-[#edf2f7]">
                              <span className="truncate max-w-[240px]">
                                {item.name} <span className="text-[#94a3b8]">x{item.quantity}</span>
                              </span>
                              <span className="font-mono text-[#f5b342]">
                                {formatGHS(item.totalPrice)}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-[10px] text-[#64748b]">
                              + {order.items.length - 3} more items
                            </p>
                          )}
                        </div>

                        {/* Totals */}
                        <div className="pt-3 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#94a3b8]">Total Amount:</span>
                            <span className="font-bold text-base text-[#edf2f7] font-mono">
                              {formatGHS(order.totalAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between text-[#22c55e]">
                            <span>Paid:</span>
                            <span className="font-mono">{formatGHS(order.amountPaid)}</span>
                          </div>
                          {order.balanceDue > 0 && (
                            <div className="flex justify-between text-[#ef4444]">
                              <span>Balance Due:</span>
                              <span className="font-mono font-bold">
                                {formatGHS(order.balanceDue)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#2a3a4a] flex items-center justify-between">
                        <span className="text-[11px] text-[#64748b]">
                          {order.paymentChannel}
                        </span>

                        <button
                          onClick={() => onViewOrderDoc(order)}
                          className="px-3 py-1.5 rounded-lg bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs flex items-center gap-1.5 shadow"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>
                            View {isPaid || isPart ? 'Payment Receipt' : 'Proforma Invoice'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Catalog View */
          <div className="space-y-8 animate-in fade-in">
            {/* Hero Banner */}
            <section className="relative rounded-2xl p-6 sm:p-12 bg-gradient-to-r from-[#131a24] via-[#1a232f] to-[#131a24] border border-[#2a3a4a] hero-glow overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5b342]/15 text-[#f5b342] text-xs font-semibold mb-3 border border-[#f5b342]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ghana's Premier Event Production & Logistics</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-[#edf2f7] tracking-tight leading-tight mb-3">
                  Hire or Purchase Premium <span className="text-[#f5b342]">Event Equipment</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                  High-refresh Outdoor LED Walls, Digital Sound Systems, Subwoofers, Trusses, and
                  Modular Aluminum Stages. All prices in <strong>Ghanaian Cedis (GH₵)</strong>.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[#edf2f7]">
                  <span className="bg-[#131a24] px-2.5 py-1 rounded border border-[#2a3a4a]">
                    Instant Proforma Invoices
                  </span>
                  <span className="bg-[#131a24] px-2.5 py-1 rounded border border-[#2a3a4a]">
                    Part Payment Deposits Accepted
                  </span>
                  <span className="bg-[#131a24] px-2.5 py-1 rounded border border-[#2a3a4a]">
                    MTN MoMo & Card Supported
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center justify-center p-6 bg-[#131a24]/80 rounded-2xl border border-[#2a3a4a] text-center w-56 shrink-0 relative z-10 shadow-xl">
                <span className="text-3xl mb-2">🇬🇭</span>
                <span className="text-xs font-bold text-[#edf2f7]">Ghanaian Cedis</span>
                <span className="text-[11px] text-[#f5b342] font-mono mt-1 font-semibold">
                  Official Rate (GHS)
                </span>
                <span className="text-[10px] text-[#64748b] mt-2">
                  An anchor in a new era.
                </span>
              </div>
            </section>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    selectedCategory === 'all'
                      ? 'bg-[#f5b342] text-[#0b0e14] border-[#f5b342] shadow-md shadow-[#f5b342]/15'
                      : 'bg-[#1a232f] text-[#94a3b8] border-[#2a3a4a] hover:border-[#f5b342]/60 hover:text-white'
                  }`}
                >
                  All Equipment ({activeEquip.length})
                </button>
                {activeCats.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                      selectedCategory === cat.id
                        ? 'bg-[#f5b342] text-[#0b0e14] border-[#f5b342] shadow-md shadow-[#f5b342]/15'
                        : 'bg-[#1a232f] text-[#94a3b8] border-[#2a3a4a] hover:border-[#f5b342]/60 hover:text-white'
                    }`}
                  >
                    <i className={cat.icon || 'fa-solid fa-cube'} />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a232f] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] rounded-xl pl-9 pr-3 py-2.5 outline-none"
                />
              </div>
            </div>

            {/* Catalog Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-[#1a232f] border border-[#2a3a4a] rounded-2xl p-8">
                <Store className="w-12 h-12 mx-auto mb-3 text-[#64748b] opacity-40" />
                <h3 className="text-base font-bold text-[#edf2f7]">No equipment matches found</h3>
                <p className="text-xs text-[#94a3b8] mt-1">
                  Try another search query or category filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((item) => {
                  const iconClass = getCategoryIcon(item.category);
                  const catName = getCategoryName(item.category);
                  const isOutOfStock = (item.available || 0) <= 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-[#1a232f] border border-[#2a3a4a] hover:border-[#f5b342] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f5b342]/10 group"
                    >
                      {/* Visual Header */}
                      <div className="h-44 bg-[#131a24] flex items-center justify-center text-5xl text-[#64748b] relative overflow-hidden group-hover:text-[#f5b342] transition-colors border-b border-[#2a3a4a]/50">
                        <i
                          className={`${iconClass} transition-transform duration-500 group-hover:scale-125 group-hover:rotate-3`}
                        />
                        {/* Stock pill */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isOutOfStock
                                ? 'bg-[#ef4444] text-white'
                                : 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30'
                            }`}
                          >
                            {isOutOfStock ? 'Rented Out' : `${item.available} Available`}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#f5b342] mb-1 flex items-center gap-1.5">
                            <i className={iconClass} />
                            <span>{catName}</span>
                          </div>

                          <h3 className="font-bold text-sm text-[#edf2f7] mb-2 group-hover:text-[#f5b342] transition-colors line-clamp-2">
                            {item.name}
                          </h3>

                          <p className="text-xs text-[#94a3b8] line-clamp-2 mb-4 leading-relaxed">
                            {item.description || 'Professional event and logistics equipment.'}
                          </p>
                        </div>

                        {/* Pricing section */}
                        <div>
                          <div className="p-3 bg-[#131a24] rounded-xl border border-[#2a3a4a] mb-4 space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[#94a3b8]">Rental Rate:</span>
                              <span className="font-bold text-[#edf2f7] font-mono">
                                {formatGHS(item.rentalPrice)}{' '}
                                <span className="text-[10px] text-[#64748b]">/ day</span>
                              </span>
                            </div>

                            {item.salePrice > 0 && (
                              <div className="flex justify-between items-center text-xs pt-1 border-t border-[#2a3a4a]/50">
                                <span className="text-[#94a3b8]">Direct Sale:</span>
                                <span className="font-bold text-[#22c55e] font-mono">
                                  {formatGHS(item.salePrice)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons: Add Rental or Add Purchase */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              disabled={isOutOfStock}
                              onClick={() => onAddItem(item, 'rental')}
                              className="py-2 px-2 bg-[#f5b342] hover:bg-[#e6a63c] disabled:opacity-40 disabled:hover:bg-[#f5b342] text-[#0b0e14] font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Rent Service</span>
                            </button>

                            <button
                              disabled={isOutOfStock || item.salePrice <= 0}
                              onClick={() => onAddItem(item, 'purchase')}
                              className="py-2 px-2 bg-[#131a24] hover:bg-[#212d3d] border border-[#2a3a4a] hover:border-[#22c55e] disabled:opacity-40 text-[#22c55e] font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-all active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Purchase</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {selectedItems.length > 0 && (
        <div className="sticky bottom-4 z-30 max-w-lg mx-auto w-full px-4">
          <div className="bg-[#1a232f] border-2 border-[#f5b342] rounded-2xl p-3.5 flex items-center justify-between shadow-2xl shadow-black/80 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5b342] text-[#0b0e14] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#edf2f7] block">
                  {totalCartCount} item{totalCartCount === 1 ? '' : 's'} selected
                </span>
                <span className="text-xs text-[#f5b342] font-mono font-bold">
                  {formatGHS(selectedItems.reduce((s, i) => s + i.totalPrice, 0))}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenBookingDrawer}
              className="px-4 py-2 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
            >
              Review & Book →
            </button>
          </div>
        </div>
      )}

      {/* Client Catalog Footer */}
      <footer className="border-t border-[#2a3a4a] py-8 text-center text-xs text-[#64748b] mt-12 bg-[#0f151e]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            &copy; 2026 <strong className="text-[#edf2f7]">NADEGE Logistics</strong> &nbsp;·&nbsp;
            An anchor in a new era.
          </span>
          <span className="text-[11px] text-[#f5b342]">
            Accra, Ghana &nbsp;·&nbsp; nadegelogisticservices@gmail.com
          </span>
        </div>
      </footer>
    </div>
  );
};
