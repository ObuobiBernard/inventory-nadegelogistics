import React, { useState } from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Cookie, Building2, Mail, Phone, MapPin } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'refund' | 'cookies';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(defaultTab);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#2a3a4a] flex items-center justify-between bg-[#131a24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5b342]/15 border border-[#f5b342]/30 flex items-center justify-center text-[#f5b342]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg sm:text-xl font-bold text-[#edf2f7]">
                Legal, Privacy & Compliance
              </h2>
              <p className="text-xs text-[#94a3b8]">
                NADEGE Logistics Services · Accra, Ghana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close legal dialog"
            className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#212d3d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#2a3a4a] bg-[#0f151e] px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'terms'
                ? 'border-[#f5b342] text-[#f5b342]'
                : 'border-transparent text-[#94a3b8] hover:text-[#edf2f7]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'privacy'
                ? 'border-[#f5b342] text-[#f5b342]'
                : 'border-transparent text-[#94a3b8] hover:text-[#edf2f7]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy (Act 843)</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'refund'
                ? 'border-[#f5b342] text-[#f5b342]'
                : 'border-transparent text-[#94a3b8] hover:text-[#edf2f7]'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refund & Cancellation</span>
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'cookies'
                ? 'border-[#f5b342] text-[#f5b342]'
                : 'border-transparent text-[#94a3b8] hover:text-[#edf2f7]'
            }`}
          >
            <Cookie className="w-4 h-4" />
            <span>Cookie Policy</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto text-xs sm:text-sm text-[#cbd5e1] leading-relaxed space-y-4">
          {/* TAB: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#131a24] rounded-xl border border-[#2a3a4a] text-xs text-[#94a3b8]">
                Last updated: October 2026 · Governing Law: Laws of the Republic of Ghana.
              </div>

              <h3 className="text-base font-bold text-white">1. Introduction & Acceptance</h3>
              <p>
                These Terms and Conditions govern the reservation, rental, purchase, and logistics handling of audio-visual, staging, LED screens, and concert equipment provided by <strong>NADEGE Logistics Services</strong> ("the Company", "we", "us"). By placing a booking, confirming a proforma invoice, or registering an account, the Client ("you") agrees to be legally bound by these terms.
              </p>

              <h3 className="text-base font-bold text-white">2. Equipment Rental & Custody</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Inspection & Delivery:</strong> Equipment will be inspected prior to hand-off or installation at your designated venue. Any existing defects must be noted on the hand-over manifest.</li>
                <li><strong>Safe Operation:</strong> The Client agrees to provide clean power (voltage stabilizers or regulated generators where specified) and operate equipment under shelter away from rain or excessive moisture.</li>
                <li><strong>Return Deadline:</strong> Rental equipment must be returned or made available for retrieval by the agreed return time. Late returns without prior written authorization incur an automatic daily rental surcharge.</li>
              </ul>

              <h3 className="text-base font-bold text-white">3. Loss, Damage, and Liability</h3>
              <p>
                The Client assumes full custodial responsibility for rented equipment during the rental period. In the event of physical damage, water damage, electrical surge burnout, or loss/theft, the Client agrees to reimburse NADEGE Logistics Services for the full certified repair cost or replacement value in Ghanaian Cedis (GH₵).
              </p>

              <h3 className="text-base font-bold text-white">4. Pricing, Payments & Invoices</h3>
              <p>
                All prices and quotes are denominated in <strong>Ghanaian Cedis (GH₵)</strong>. Proforma invoices issued via the platform are valid for event reservation for 48 hours unless a deposit or payment confirmation is received. Full balance must be cleared prior to or at time of equipment dispatch.
              </p>

              <h3 className="text-base font-bold text-white">5. Force Majeure</h3>
              <p>
                Neither party shall be held liable for failure to perform duties where failure is caused by acts of God, civil riots, severe weather events, or state-ordered public curfews beyond reasonable control.
              </p>
            </div>
          )}

          {/* TAB: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl text-xs text-[#22c55e]">
                Compliant with the Ghana Data Protection Act, 2012 (Act 843) and international security standards.
              </div>

              <h3 className="text-base font-bold text-white">1. Data Minimization & Collection</h3>
              <p>
                We only collect the minimum personal information necessary to deliver equipment rental contracts and issue legal tax/proforma invoices:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Identity Data:</strong> Full Name, Company or Church organization name.</li>
                <li><strong>Contact Data:</strong> Email address, Ghanaian mobile/WhatsApp phone number.</li>
                <li><strong>Transaction Data:</strong> Event delivery address, selected equipment, rental duration, and Mobile Money / payment channel transaction reference.</li>
                <li><strong>Authentication Data:</strong> Secure Firebase user identifier (UID) and encrypted credentials. We NEVER store plain-text passwords.</li>
              </ul>

              <h3 className="text-base font-bold text-white">2. Purpose of Processing</h3>
              <p>
                Your data is exclusively processed to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Generate official proforma invoices and payment receipts.</li>
                <li>Coordinate logistics delivery and setup at your event venue.</li>
                <li>Authenticate your account and maintain your rental order history.</li>
                <li>We do NOT sell, lease, or distribute your personal data to any third-party marketing companies.</li>
              </ul>

              <h3 className="text-base font-bold text-white">3. Data Security & Storage</h3>
              <p>
                All records are securely encrypted in transit (TLS/HTTPS) and stored on enterprise Google Cloud Firestore infrastructure with server-side Security Rules enforcing strict Role-Based Access Control.
              </p>

              <h3 className="text-base font-bold text-white">4. Your Rights Under Act 843</h3>
              <p>
                You retain the right to request access to your stored records, correct inaccuracies, or request account erasure by contacting our Data Protection Officer at: <strong className="text-white">nadegelogisticservices@gmail.com</strong>.
              </p>
            </div>
          )}

          {/* TAB: REFUND & CANCELLATION */}
          {activeTab === 'refund' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#131a24] rounded-xl border border-[#2a3a4a] text-xs text-[#94a3b8]">
                Clear, transparent terms on cancellations, security deposits, and return condition.
              </div>

              <h3 className="text-base font-bold text-white">1. Client Cancellation Notice</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>7+ Days Prior to Event:</strong> 100% refund of deposit or prepayment, less any direct bank/mobile money transfer transaction fees.</li>
                <li><strong>3 to 6 Days Prior to Event:</strong> 75% refund of rental fee.</li>
                <li><strong>Under 48 Hours Prior to Event:</strong> 50% refund, as equipment has already been reserved, tested, and prepped in the warehouse.</li>
                <li><strong>After Equipment Dispatch / Setup:</strong> Non-refundable once equipment leaves the warehouse.</li>
              </ul>

              <h3 className="text-base font-bold text-white">2. Equipment Non-Performance or Breakdown</h3>
              <p>
                In the rare event of equipment malfunction not caused by client mishandling or electrical power spikes, NADEGE Logistics Services will provide an immediate identical replacement or credit a pro-rata refund for the affected equipment.
              </p>

              <h3 className="text-base font-bold text-white">3. Refund Processing Times</h3>
              <p>
                Approved refunds are disbursed within 3-5 business days directly to the original Mobile Money account (MTN MoMo, Telecel Cash, AirtelTigo) or Ghanaian bank account used during the initial transaction.
              </p>
            </div>
          )}

          {/* TAB: COOKIE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">1. How We Use Cookies</h3>
              <p>
                NADEGE Logistics uses only <strong>essential and strictly necessary cookies and local storage tokens</strong> to operate this platform:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Authentication Tokens:</strong> Secure session tokens provided by Firebase Auth to keep you securely signed in to your client account or staff portal.</li>
                <li><strong>Cart & Selection Storage:</strong> Local storage to preserve your selected equipment and event notes while you browse.</li>
                <li><strong>Security Tokens:</strong> Anti-tamper and session timeout trackers.</li>
              </ul>

              <h3 className="text-base font-bold text-white">2. No Third-Party Tracking</h3>
              <p>
                We do not use invasive third-party ad-tracking cookies, pixel trackers, or cross-site data aggregators.
              </p>
            </div>
          )}

          {/* Business Details Footer */}
          <div className="mt-8 pt-5 border-t border-[#2a3a4a] bg-[#131a24] p-4 rounded-xl text-xs text-[#94a3b8] space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#f5b342]" />
              <span>NADEGE Logistics Services</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>Accra, Greater Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>nadegelogisticservices@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#f5b342]" />
                <span>+233 555 0101 / +233 244 0000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2a3a4a] bg-[#131a24] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs rounded-xl transition-all shadow-md"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
