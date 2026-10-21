import React, { useState } from 'react';
import { Equipment, Category } from '../../types';
import { formatCurrency } from '../../services/storage';
import { Store, ArrowLeft } from 'lucide-react';

interface CatalogViewProps {
  equipment: Equipment[];
  categories: Category[];
  onBackToDashboard: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  equipment,
  categories,
  onBackToDashboard,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const activeEquip = equipment.filter((e) => !e.deleted);
  const activeCats = categories.filter((c) => !c.deleted);

  const filtered =
    selectedFilter === 'all'
      ? activeEquip
      : activeEquip.filter((e) => e.category === selectedFilter);

  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : 'Uncategorized';
  };

  const getCategoryIcon = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    return cat?.icon || 'fa-solid fa-cube';
  };

  const getStatusBadge = (status: string, available: number) => {
    if (available === 0) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ef4444] text-white">
          Out of stock
        </span>
      );
    }
    if (status === 'rented') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f5b342] text-[#0b0e14]">
          Rented
        </span>
      );
    }
    if (status === 'sold') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#3b82f6] text-white">
          Sold
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#22c55e] text-[#0b0e14]">
        Available
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#edf2f7] -m-4 sm:-m-8">
      {/* Return to Staff portal toolbar */}
      <div className="bg-[#131a24] border-b border-[#2a3a4a] px-6 py-2.5 flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-semibold text-[#f5b342] hover:text-[#e6a63c] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Staff Portal</span>
        </button>
        <span className="text-[11px] text-[#64748b]">
          Viewing Public Customer Catalog Preview
        </span>
      </div>

      {/* Hero section */}
      <section className="relative min-h-[48vh] flex items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-[#131a24] via-[#0b0e14] to-[#0b0e14] hero-glow overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <img
            src="/nadege logo.jpg"
            alt="NADEGE Logistics"
            className="max-h-24 w-auto object-contain mb-5 drop-shadow-[0_0_25px_rgba(245,179,66,0.35)] rounded-lg"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#edf2f7] mb-3">
            Premium Event <span className="text-[#f5b342]">Equipment</span>
          </h1>
          <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
            Explore our wide range of LED Screens, Stages, Trusses, PA Systems, and more –
            available for rental and purchase.
          </p>
          <div className="text-xs text-[#f5b342] italic mt-3 font-serif tracking-wider">
            An anchor in a new era.
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="px-4 py-6 max-w-6xl mx-auto flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            selectedFilter === 'all'
              ? 'bg-[#f5b342] text-[#0b0e14] border-[#f5b342] shadow-md shadow-[#f5b342]/20'
              : 'bg-[#1a232f] text-[#94a3b8] border-[#2a3a4a] hover:border-[#f5b342] hover:text-[#edf2f7]'
          }`}
        >
          All Equipment
        </button>
        {activeCats.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedFilter(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              selectedFilter === cat.id
                ? 'bg-[#f5b342] text-[#0b0e14] border-[#f5b342] shadow-md shadow-[#f5b342]/20'
                : 'bg-[#1a232f] text-[#94a3b8] border-[#2a3a4a] hover:border-[#f5b342] hover:text-[#edf2f7]'
            }`}
          >
            <i className={cat.icon || 'fa-solid fa-cube'} />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#1a232f]/40 border border-[#2a3a4a] rounded-2xl max-w-md mx-auto">
            <Store className="w-12 h-12 text-[#64748b] mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-[#edf2f7] mb-1">No equipment found</h3>
            <p className="text-xs text-[#94a3b8]">
              Check back later – our inventory is updated regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => {
              const iconClass = getCategoryIcon(item.category);
              const catName = getCategoryName(item.category);

              return (
                <div
                  key={item.id}
                  className="bg-[#1a232f] border border-[#2a3a4a] hover:border-[#f5b342] rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#f5b342]/10 group"
                >
                  {/* Card Visual Icon Header */}
                  <div className="h-40 bg-[#131a24] flex items-center justify-center text-5xl text-[#64748b] relative overflow-hidden group-hover:text-[#f5b342] transition-colors">
                    <i className={`${iconClass} transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6`} />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-2.5">
                      {getStatusBadge(item.status, item.available)}
                    </div>

                    <h3 className="font-bold text-base text-[#edf2f7] mb-1 group-hover:text-[#f5b342] transition-colors line-clamp-2">
                      {item.name}
                    </h3>

                    <div className="text-xs font-semibold text-[#f5b342] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <i className={iconClass} />
                      <span>{catName}</span>
                    </div>

                    <p className="text-xs text-[#94a3b8] line-clamp-3 mb-4 leading-relaxed flex-1">
                      {item.description || item.notes || 'Professional event and logistics equipment.'}
                    </p>

                    <div className="border-t border-[#2a3a4a] pt-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="block text-[10px] text-[#64748b] uppercase font-semibold">
                          Rental
                        </span>
                        <span className="font-bold text-[#edf2f7]">
                          {formatCurrency(item.rentalPrice)}{' '}
                          <span className="text-[10px] text-[#64748b]">/ day</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-[#64748b] uppercase font-semibold">
                          Purchase
                        </span>
                        <span className="font-bold text-[#22c55e]">
                          {formatCurrency(item.salePrice)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#2a3a4a]/40 text-[11px] text-[#94a3b8] flex justify-between">
                      <span>Total: {item.quantity}</span>
                      <span className="font-semibold text-[#edf2f7]">
                        Available: {item.available}
                      </span>
                      {item.location && <span>Loc: {item.location}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2a3a4a] py-8 text-center text-xs text-[#64748b]">
        &copy; 2026 <strong className="text-[#edf2f7]">NADEGE Logistics</strong> &nbsp;·&nbsp; An
        anchor in a new era.
      </footer>
    </div>
  );
};
