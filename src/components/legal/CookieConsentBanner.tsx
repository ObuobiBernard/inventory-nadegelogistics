import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenLegal: (tab: 'cookies' | 'privacy') => void;
}

const COOKIE_CONSENT_KEY = 'nadege_cookie_consent_v1';

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenLegal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay slightly for smooth appearance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'all');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9990] bg-[#1a232f]/98 backdrop-blur-md border border-[#2a3a4a] rounded-2xl p-4 sm:p-5 shadow-2xl animate-slideUp text-xs text-[#edf2f7]"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#f5b342]/15 border border-[#f5b342]/30 flex items-center justify-center text-[#f5b342] shrink-0 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs sm:text-sm">
              Cookie & Data Privacy
            </h4>
            <button
              onClick={handleAcceptEssential}
              aria-label="Dismiss cookie notice"
              className="text-[#94a3b8] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1 leading-relaxed">
            We use essential session cookies for authentication, order security, and remembering your rental selection. We do not use third-party trackers.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-[#2a3a4a]">
            <button
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold rounded-lg text-xs transition-all shadow-sm"
            >
              Accept All
            </button>
            <button
              onClick={handleAcceptEssential}
              className="px-3 py-1.5 bg-[#131a24] hover:bg-[#212d3d] border border-[#2a3a4a] text-[#edf2f7] rounded-lg text-xs transition-all"
            >
              Essential Only
            </button>
            <button
              onClick={() => onOpenLegal('cookies')}
              className="text-[11px] text-[#f5b342] hover:underline ml-auto"
            >
              Policy Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
