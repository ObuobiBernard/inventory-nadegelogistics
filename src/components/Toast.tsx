import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-[10000] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map(toast => {
        let borderColor = 'border-[#3b82f6]';
        let icon = <Info className="w-5 h-5 text-[#3b82f6] shrink-0" />;

        if (toast.type === 'success') {
          borderColor = 'border-[#22c55e]';
          icon = <CheckCircle className="w-5 h-5 text-[#22c55e] shrink-0" />;
        } else if (toast.type === 'error') {
          borderColor = 'border-[#ef4444]';
          icon = <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 bg-[#1a232f] border-l-4 ${borderColor} border-t border-r border-b border-[#2a3a4a] text-[#edf2f7] p-3.5 rounded-lg shadow-2xl transition-all animate-in slide-in-from-right`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <span className="text-sm font-medium leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#94a3b8] hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
