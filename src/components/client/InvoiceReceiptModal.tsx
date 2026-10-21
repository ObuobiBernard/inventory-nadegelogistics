import React from 'react';
import { CustomerOrder, formatGHS } from '../../types';
import { X, Printer, CheckCircle, Clock, FileText, Download } from 'lucide-react';

interface InvoiceReceiptModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const isReceipt = order.paymentStatus === 'paid' || order.paymentStatus === 'partially_paid';
  const docTitle = isReceipt ? 'OFFICIAL PAYMENT RECEIPT' : 'PROFORMA INVOICE';
  const docRef = isReceipt ? order.receiptNumber || order.invoiceNumber : order.invoiceNumber;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:h-auto">
      <div className="bg-[#1a232f] border border-[#2a3a4a] text-[#edf2f7] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 print:bg-white print:text-black print:border-none print:shadow-none print:w-full print:max-w-none">
        
        {/* Action Toolbar (hidden during print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#2a3a4a] print:hidden">
          <div className="flex items-center gap-2">
            {isReceipt ? (
              <CheckCircle className="w-5 h-5 text-[#22c55e]" />
            ) : (
              <FileText className="w-5 h-5 text-[#f5b342]" />
            )}
            <span className="font-bold text-sm uppercase tracking-wider text-[#94a3b8]">
              {docTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#94a3b8] hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Printable Sheet */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#2a3a4a] print:border-gray-300">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img
                  src="/nadege logo.jpg"
                  alt="NADEGE Logistics"
                  className="h-10 w-auto object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <h2 className="text-xl font-bold tracking-tight text-[#edf2f7] print:text-black">
                  NADEGE Logistics
                </h2>
              </div>
              <p className="text-xs text-[#94a3b8] print:text-gray-600">
                Event Equipment Rentals, Sales & Stage Engineering
              </p>
              <p className="text-xs text-[#94a3b8] print:text-gray-600">
                Accra, Ghana &nbsp;·&nbsp; nadegelogisticservices@gmail.com
              </p>
            </div>

            <div className="text-left sm:text-right">
              <h1 className="text-lg font-black text-[#f5b342] print:text-amber-600 tracking-wider">
                {docTitle}
              </h1>
              <p className="text-xs font-mono text-[#edf2f7] print:text-black font-semibold mt-1">
                Ref: {docRef}
              </p>
              <p className="text-xs text-[#94a3b8] print:text-gray-600">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Billed To & Status Stamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#64748b] print:text-gray-500 uppercase tracking-wider block mb-1">
                BILLED TO / CLIENT:
              </span>
              <p className="text-sm font-bold text-[#edf2f7] print:text-black">
                {order.customerName}
              </p>
              {order.customerCompany && (
                <p className="text-xs text-[#f5b342] print:text-gray-700 font-medium">
                  {order.customerCompany}
                </p>
              )}
              <p className="text-xs text-[#94a3b8] print:text-gray-600">
                {order.customerEmail}
              </p>
              {order.customerPhone && (
                <p className="text-xs text-[#94a3b8] print:text-gray-600">
                  {order.customerPhone}
                </p>
              )}
            </div>

            <div className="sm:text-right flex flex-col sm:items-end justify-center">
              <div
                className={`inline-block px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${
                  order.paymentStatus === 'paid'
                    ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e] print:text-green-700 print:border-green-700'
                    : order.paymentStatus === 'partially_paid'
                    ? 'bg-[#f5b342]/20 border-[#f5b342] text-[#f5b342] print:text-amber-700 print:border-amber-700'
                    : 'bg-[#3b82f6]/20 border-[#3b82f6] text-[#3b82f6] print:text-blue-700 print:border-blue-700'
                }`}
              >
                {order.paymentStatus === 'paid'
                  ? 'Payment Received (Full)'
                  : order.paymentStatus === 'partially_paid'
                  ? 'Part Payment (Deposit Paid)'
                  : 'Proforma Invoice - Payment Pending'}
              </div>

              {order.paymentChannel && (
                <p className="text-[11px] text-[#94a3b8] print:text-gray-600 mt-2">
                  Payment Method: <span className="font-semibold text-[#edf2f7] print:text-black">{order.paymentChannel}</span>
                </p>
              )}

              {order.transactionRef && (
                <p className="text-[10px] font-mono text-[#64748b] print:text-gray-500">
                  Trans Ref: {order.transactionRef}
                </p>
              )}
            </div>
          </div>

          {/* Event Details if available */}
          {order.eventDetails && (
            <div className="bg-[#131a24] print:bg-gray-100 p-3 rounded-lg text-xs border border-[#2a3a4a] print:border-gray-300">
              <span className="font-bold text-[#f5b342] print:text-amber-700 mr-2">
                Event / Service Notes:
              </span>
              <span className="text-[#edf2f7] print:text-black">{order.eventDetails}</span>
            </div>
          )}

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2a3a4a] print:border-gray-300 text-[#94a3b8] print:text-gray-600 font-semibold uppercase">
                  <th className="py-2.5 px-3">Service / Equipment</th>
                  <th className="py-2.5 px-2 text-center">Type</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-center">Days</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Total (GH₵)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3a4a]/40 print:divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index} className="text-[#edf2f7] print:text-black">
                    <td className="py-3 px-3 font-medium">
                      {item.name}
                      {item.categoryName && (
                        <span className="block text-[10px] text-[#94a3b8] print:text-gray-500">
                          {item.categoryName}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center capitalize">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#131a24] print:bg-gray-200">
                        {item.serviceType}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-semibold">{item.quantity}</td>
                    <td className="py-3 px-2 text-center">
                      {item.serviceType === 'rental' ? `${item.days}d` : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {formatGHS(item.unitPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold font-mono">
                      {formatGHS(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-[#2a3a4a] print:border-gray-300 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#94a3b8] print:text-gray-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium text-[#edf2f7] print:text-black">
                  {formatGHS(order.subtotal || order.totalAmount)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#2a3a4a] print:border-gray-300">
                <span className="text-[#edf2f7] print:text-black">Total Amount:</span>
                <span className="text-[#f5b342] print:text-amber-700 font-mono text-base">
                  {formatGHS(order.totalAmount)}
                </span>
              </div>

              <div className="flex justify-between text-[#22c55e] print:text-green-700 font-medium">
                <span>Amount Paid:</span>
                <span className="font-mono font-bold">{formatGHS(order.amountPaid)}</span>
              </div>

              <div className="flex justify-between text-[#ef4444] print:text-red-700 font-semibold pt-1 border-t border-[#2a3a4a]/40 print:border-gray-200">
                <span>Balance Due:</span>
                <span className="font-mono font-bold text-sm">{formatGHS(order.balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms & Footer */}
          <div className="pt-6 border-t border-[#2a3a4a] print:border-gray-300 text-[11px] text-[#94a3b8] print:text-gray-600 space-y-1 text-center">
            <p className="font-semibold text-[#edf2f7] print:text-black">
              Thank you for choosing NADEGE Logistics · An anchor in a new era.
            </p>
            <p>
              Bank & MoMo accounts for direct transfers are available upon inquiry at{' '}
              <strong className="text-[#f5b342] print:text-black">nadegelogisticservices@gmail.com</strong>
            </p>
            <p className="text-[10px] text-[#64748b] print:text-gray-500 pt-2">
              This document was generated and authenticated via NADEGE Logistics RMS Cloud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
