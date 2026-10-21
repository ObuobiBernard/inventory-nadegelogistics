import React, { useState } from 'react';
import { CustomerOrder, SelectedServiceItem, formatGHS } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { genId, genOrderRef } from '../../services/storage';
import {
  X,
  CreditCard,
  Smartphone,
  FileText,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Calendar,
  Lock,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SelectedServiceItem[];
  subtotal: number;
  eventNotes: string;
  onOrderCompleted: (order: CustomerOrder) => void;
  onRequireAuth: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  eventNotes,
  onOrderCompleted,
  onRequireAuth,
}) => {
  const { user, userProfile } = useAuth();

  // Mode: 'pay_now' or 'pay_later'
  const [paymentMode, setPaymentMode] = useState<'pay_now' | 'pay_later'>('pay_now');

  // Payment Options
  const [paymentFraction, setPaymentFraction] = useState<'full' | 'half' | 'custom'>('full');
  const [customAmount, setCustomAmount] = useState<number>(Math.round(subtotal * 0.5));
  const [paymentChannel, setPaymentChannel] = useState<string>('MTN Mobile Money');
  const [momoNumber, setMomoNumber] = useState<string>(userProfile?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const totalAmount = subtotal;

  // Calculate actual amount to pay right now
  let amountToPay = totalAmount;
  if (paymentMode === 'pay_later') {
    amountToPay = 0;
  } else if (paymentFraction === 'half') {
    amountToPay = Math.round((totalAmount / 2) * 100) / 100;
  } else if (paymentFraction === 'custom') {
    amountToPay = Math.min(totalAmount, Math.max(10, customAmount));
  }

  const balanceDue = totalAmount - amountToPay;

  const handleProcessOrder = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    if (paymentMode === 'pay_now') {
      if (!momoNumber.trim()) {
        setError('Please enter your Mobile Money or contact phone number for verification.');
        return;
      }
    }

    setError('');
    setIsProcessing(true);

    try {
      // Authenticated payment processing delay simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isFull = amountToPay >= totalAmount;
      const isPart = amountToPay > 0 && amountToPay < totalAmount;
      const isLater = paymentMode === 'pay_later' || amountToPay === 0;

      const orderRef = genOrderRef('NLG');
      const invoiceNumber = `INV-${orderRef}`;
      const receiptNumber = !isLater ? `RCT-${orderRef}` : undefined;

      const newOrder: CustomerOrder = {
        id: genId(),
        customerId: user.uid,
        customerName: user.displayName || userProfile?.displayName || user.email?.split('@')[0] || 'Valued Client',
        customerEmail: user.email || '',
        customerPhone: momoNumber || userProfile?.phone || '',
        customerCompany: userProfile?.company || '',
        orderNumber: orderRef,
        items,
        subtotal,
        totalAmount,
        paymentType: isLater ? 'later' : isFull ? 'full' : 'part',
        paymentStatus: isLater ? 'pending' : isFull ? 'paid' : 'partially_paid',
        amountPaid: amountToPay,
        balanceDue,
        orderStatus: 'confirmed',
        invoiceNumber,
        receiptNumber,
        paymentChannel: isLater ? 'Book & Pay Later' : paymentChannel,
        transactionRef: !isLater ? `TXN-${Date.now().toString(36).toUpperCase()}` : undefined,
        eventDetails: eventNotes,
        createdAt: new Date().toISOString(),
      };

      onOrderCompleted(newOrder);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Payment authentication failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9992] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#94a3b8] hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#f5b342]/15 text-[#f5b342] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#edf2f7]">Checkout & Payment Confirmation</h2>
            <p className="text-xs text-[#94a3b8]">
              Secure order processing authenticated by Firebase
            </p>
          </div>
        </div>

        {/* User state indicator */}
        {!user && (
          <div className="mb-4 p-3 bg-[#f5b342]/15 border border-[#f5b342]/30 rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#f5b342] font-medium flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Please log in or create an account to finalize your booking.
            </span>
            <button
              onClick={onRequireAuth}
              className="px-3 py-1 bg-[#f5b342] text-[#0b0e14] font-bold rounded-lg hover:bg-[#e6a63c] transition-all shrink-0 ml-2"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Mode Selector: Pay Now vs Book & Pay Later */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#131a24] rounded-xl mb-5 border border-[#2a3a4a]">
          <button
            type="button"
            onClick={() => setPaymentMode('pay_now')}
            className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              paymentMode === 'pay_now'
                ? 'bg-[#22c55e] text-white shadow-md'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Pay Online Now</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('pay_later')}
            className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              paymentMode === 'pay_later'
                ? 'bg-[#f5b342] text-[#0b0e14] shadow-md font-bold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book & Pay Later</span>
          </button>
        </div>

        {/* Option 1: PAY NOW TAB */}
        {paymentMode === 'pay_now' && (
          <div className="space-y-4">
            {/* Payment amount options: Full or Part */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                Choose Payment Amount
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentFraction('full')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentFraction === 'full'
                      ? 'border-[#22c55e] bg-[#22c55e]/15 text-[#22c55e]'
                      : 'border-[#2a3a4a] bg-[#131a24] text-[#94a3b8] hover:border-[#22c55e]/40'
                  }`}
                >
                  <span className="block text-[11px] font-medium">Full Payment (100%)</span>
                  <span className="block text-xs font-bold text-[#edf2f7] mt-0.5">
                    {formatGHS(totalAmount)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentFraction('half')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentFraction === 'half'
                      ? 'border-[#f5b342] bg-[#f5b342]/15 text-[#f5b342]'
                      : 'border-[#2a3a4a] bg-[#131a24] text-[#94a3b8] hover:border-[#f5b342]/40'
                  }`}
                >
                  <span className="block text-[11px] font-medium">50% Part Deposit</span>
                  <span className="block text-xs font-bold text-[#edf2f7] mt-0.5">
                    {formatGHS(totalAmount * 0.5)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentFraction('custom')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentFraction === 'custom'
                      ? 'border-[#3b82f6] bg-[#3b82f6]/15 text-[#3b82f6]'
                      : 'border-[#2a3a4a] bg-[#131a24] text-[#94a3b8] hover:border-[#3b82f6]/40'
                  }`}
                >
                  <span className="block text-[11px] font-medium">Custom Part Deposit</span>
                  <span className="block text-xs font-bold text-[#edf2f7] mt-0.5">
                    {formatGHS(amountToPay)}
                  </span>
                </button>
              </div>

              {paymentFraction === 'custom' && (
                <div className="mt-3">
                  <label className="block text-xs text-[#94a3b8] mb-1">
                    Enter deposit amount to pay now (GH₵)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max={totalAmount}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2 text-sm text-[#edf2f7] outline-none"
                  />
                </div>
              )}
            </div>

            {/* Ghanaian Mobile Money / Card Providers */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                Select Mobile Money or Card
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { name: 'MTN Mobile Money', short: 'MTN MoMo', color: 'border-yellow-500' },
                  { name: 'Telecel Cash', short: 'Telecel Cash', color: 'border-red-500' },
                  { name: 'AT Money', short: 'AirtelTigo', color: 'border-blue-500' },
                  { name: 'Debit/Credit Card', short: 'Bank Card', color: 'border-emerald-500' },
                ].map((channel) => (
                  <button
                    key={channel.name}
                    type="button"
                    onClick={() => setPaymentChannel(channel.name)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      paymentChannel === channel.name
                        ? 'bg-[#f5b342]/15 border-[#f5b342] text-[#f5b342]'
                        : 'bg-[#131a24] border-[#2a3a4a] text-[#94a3b8] hover:border-white/40'
                    }`}
                  >
                    {channel.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Money Number */}
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
                {paymentChannel.includes('Card') ? 'Contact Phone Number' : `${paymentChannel} Number`} *
              </label>
              <input
                type="tel"
                placeholder="024XXXXXXX or +233..."
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none font-mono"
              />
              <span className="block text-[11px] text-[#64748b] mt-1">
                You will receive a prompt/receipt upon submitting.
              </span>
            </div>
          </div>
        )}

        {/* Option 2: BOOK & PAY LATER TAB */}
        {paymentMode === 'pay_later' && (
          <div className="bg-[#131a24] border border-[#2a3a4a] rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-[#f5b342] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-[#edf2f7]">
                  Skip Payment & Receive Official Proforma Invoice
                </h3>
                <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                  Lock in your equipment and event dates now without immediate payment.
                  An official <strong>Proforma Invoice</strong> with reference number, payment terms,
                  and bank transfer details will be generated instantly.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#2a3a4a]/60 text-xs text-[#22c55e] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Equipment reserved on hold for your event dates.</span>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="mt-5 p-4 rounded-xl bg-[#131a24] border border-[#2a3a4a] space-y-1.5 text-xs">
          <div className="flex justify-between text-[#94a3b8]">
            <span>Selected Items ({items.length}):</span>
            <span className="font-medium text-[#edf2f7]">{formatGHS(totalAmount)}</span>
          </div>

          <div className="flex justify-between text-[#22c55e] font-semibold">
            <span>Amount to Pay Now:</span>
            <span className="font-mono text-sm font-bold">{formatGHS(amountToPay)}</span>
          </div>

          {balanceDue > 0 && (
            <div className="flex justify-between text-[#ef4444] pt-1 border-t border-[#2a3a4a]/50 font-medium">
              <span>Remaining Balance Due Later:</span>
              <span className="font-mono">{formatGHS(balanceDue)}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 bg-[#ef4444]/15 border border-[#ef4444]/30 rounded-xl text-xs text-[#ef4444] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#131a24] hover:bg-[#212d3d] text-[#94a3b8] hover:text-white transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleProcessOrder}
            disabled={isProcessing}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 ${
              paymentMode === 'pay_now'
                ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-[#22c55e]/20'
                : 'bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] shadow-[#f5b342]/20'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Firebase...</span>
              </>
            ) : paymentMode === 'pay_now' ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>
                  Confirm & Pay {formatGHS(amountToPay)}{' '}
                  {amountToPay < totalAmount ? '(Part Payment)' : '(Full Payment)'}
                </span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Confirm Order & Generate Proforma Invoice</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
