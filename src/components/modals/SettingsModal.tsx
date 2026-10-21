import React, { useState, useEffect } from 'react';
import { SyncSettings } from '../../types';
import { X, CloudUpload, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SyncSettings;
  onSave: (settings: SyncSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    setUrl(settings.url || '');
    setSecret(settings.secret || '');
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ url, secret });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2a3a4a]">
          <div className="flex items-center gap-2 text-[#edf2f7]">
            <CloudUpload className="w-5 h-5 text-[#3b82f6]" />
            <h3 className="font-bold text-lg">Google Sheets Sync Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Google Apps Script Web App URL *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
            />
            <span className="block text-[11px] text-[#64748b] mt-1">
              Paste the web app URL from your Apps Script deployment.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Secret Key *
            </label>
            <input
              type="text"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your webhook secret"
              className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
            />
            <span className="block text-[11px] text-[#64748b] mt-1">
              Must match the secret token defined in your Apps Script code.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#2a3a4a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#131a24] hover:bg-[#212d3d] text-[#94a3b8] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-bold bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] flex items-center gap-2 transition-all shadow-md shadow-[#f5b342]/10"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
