import React, { useState } from 'react';
import { CustomerOrder, formatGHS } from '../../types';
import {
  FileText,
  Search,
  CheckCircle,
  Clock,
  Printer,
  ChevronDown,
  User,
  Phone,
  Building,
  Mail,
  Calendar,
  Eye,
} from 'lucide-react';

interface OrdersViewProps {
  orders: CustomerOrder[];
  searchQuery: string;
  onUpdateStatus: (orderId: string, status: CustomerOrder['orderStatus']) => void;
  onViewDoc: (order: CustomerOrder) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  searchQuery,
  onUpdateStatus,
  onViewDoc,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = orders.filter((order) => {
    if (statusFilter !== 'all' && order.orderStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchEmail = order.customerEmail.toLowerCase().includes(q);
      const matchCompany = (order.customerCompany || '').toLowerCase().includes(q);
      const matchItems = order.items.some((i) => i.name.toLowerCase().includes(q));
      if (!matchNum && !matchName && !matchEmail && !matchCompany && !matchItems) return false;
    }
    return true;
  });

  return (
    <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-xl overflow-hidden shadow-xl animate-in fade-in">
      {/* Header and filter bar */}
      <div className="p-4 sm:p-5 border-b border-[#2a3a4a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#f5b342]" />
          <div>
            <h2 className="text-base font-bold text-[#edf2f7]">
              Customer Bookings & Orders ({filtered.length})
            </h2>
            <span className="text-xs text-[#94a3b8]">
              Client service selections, proforma invoices, and payment receipts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] rounded-lg px-3 py-1.5 outline-none font-medium"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#131a24]/80 text-[#94a3b8] border-b border-[#2a3a4a] text-xs uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Ref & Date</th>
              <th className="py-3 px-3 font-semibold">Customer Details</th>
              <th className="py-3 px-4 font-semibold">Selected Services / Equipment</th>
              <th className="py-3 px-3 font-semibold">Payment Status</th>
              <th className="py-3 px-3 font-semibold">Total / Paid</th>
              <th className="py-3 px-3 font-semibold">Order Status</th>
              <th className="py-3 px-4 font-semibold text-right">Document</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3a4a]/40">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-[#64748b]">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-base font-semibold">No customer orders recorded</p>
                  <p className="text-xs">
                    Client requests and checkouts from the catalog will appear here in real time.
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const isPaid = order.paymentStatus === 'paid';
                const isPart = order.paymentStatus === 'partially_paid';

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-[#212d3d]/50 transition-colors align-top"
                  >
                    {/* Order Ref & Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-xs text-[#f5b342] block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-[#94a3b8]">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span className="block text-[10px] text-[#64748b] mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-3">
                      <div className="font-bold text-xs text-[#edf2f7]">
                        {order.customerName}
                      </div>
                      {order.customerCompany && (
                        <div className="text-[11px] text-[#f5b342] font-medium flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-[#64748b]" />
                          <span>{order.customerCompany}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-[#94a3b8] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-[#64748b]" />
                        <span>{order.customerEmail}</span>
                      </div>
                      {order.customerPhone && (
                        <div className="text-[11px] text-[#94a3b8] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#64748b]" />
                          <span>{order.customerPhone}</span>
                        </div>
                      )}
                    </td>

                    {/* Items Selected */}
                    <td className="py-4 px-4 min-w-[200px] max-w-xs">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-[#edf2f7] flex justify-between">
                            <span className="truncate mr-2">
                              {item.name}{' '}
                              <span className="text-[#94a3b8] font-mono">
                                ({item.serviceType === 'rental' ? `${item.days}d` : 'sale'} x{item.quantity})
                              </span>
                            </span>
                            <span className="font-mono text-[#f5b342] shrink-0 font-medium">
                              {formatGHS(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.eventDetails && (
                        <div className="mt-2 p-1.5 rounded bg-[#131a24] text-[10px] text-[#94a3b8] border border-[#2a3a4a]">
                          <span className="text-[#f5b342] font-semibold">Event:</span>{' '}
                          {order.eventDetails}
                        </div>
                      )}
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isPaid
                            ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30'
                            : isPart
                            ? 'bg-[#f5b342]/20 text-[#f5b342] border border-[#f5b342]/30'
                            : 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30'
                        }`}
                      >
                        {isPaid
                          ? 'Full Payment'
                          : isPart
                          ? 'Deposit (Part)'
                          : 'Pay Later'}
                      </span>
                      <span className="block text-[11px] text-[#64748b] mt-1 font-medium">
                        Via {order.paymentChannel || 'Pay Later'}
                      </span>
                    </td>

                    {/* Financials (GHS) */}
                    <td className="py-4 px-3 font-mono text-xs whitespace-nowrap">
                      <span className="font-bold text-[#edf2f7] block">
                        {formatGHS(order.totalAmount)}
                      </span>
                      <span className="text-[#22c55e] block text-[11px]">
                        Paid: {formatGHS(order.amountPaid)}
                      </span>
                      {order.balanceDue > 0 && (
                        <span className="text-[#ef4444] block text-[11px] font-bold">
                          Due: {formatGHS(order.balanceDue)}
                        </span>
                      )}
                    </td>

                    {/* Order Status Select */}
                    <td className="py-4 px-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          onUpdateStatus(order.id, e.target.value as CustomerOrder['orderStatus'])
                        }
                        className="bg-[#131a24] border border-[#2a3a4a] text-xs text-[#edf2f7] rounded-lg px-2 py-1 outline-none font-semibold capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Action: View Proforma / Receipt */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onViewDoc(order)}
                        className="px-3 py-1.5 rounded-lg bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs flex items-center gap-1.5 ml-auto transition-all shadow-sm"
                        title={isPaid || isPart ? 'View Payment Receipt' : 'View Proforma Invoice'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isPaid || isPart ? 'Receipt' : 'Proforma'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
