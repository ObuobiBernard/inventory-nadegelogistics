import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, LogIn, UserPlus, Lock, Mail, User, Phone, Building } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  onSuccess,
}) => {
  const { signInWithGoogle, signInWithEmail, registerWithEmail } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (tab === 'login') {
        await signInWithEmail(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setIsSubmitting(false);
          return;
        }
        await registerWithEmail(email, password, name, phone, company);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      let msg = err?.message || 'Authentication error';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Try signing in.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9995] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#94a3b8] hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <img
            src="/nadege logo.jpg"
            alt="NADEGE Logistics"
            className="h-12 w-auto mx-auto object-contain mb-2 rounded"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <h3 className="text-xl font-bold text-[#edf2f7]">
            {tab === 'login' ? 'Client Sign In' : 'Create Client Account'}
          </h3>
          <p className="text-xs text-[#94a3b8] mt-1">
            Access event equipment booking, proforma invoices, and payment receipts.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#131a24] p-1 rounded-xl mb-5 border border-[#2a3a4a]">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === 'login'
                ? 'bg-[#f5b342] text-[#0b0e14] shadow'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === 'register'
                ? 'bg-[#f5b342] text-[#0b0e14] shadow'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Google One-Click Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-[#131a24] hover:bg-[#212d3d] border border-[#2a3a4a] text-[#edf2f7] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mb-4 transition-all shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#2a3a4a]" />
          <span className="px-3 text-[11px] text-[#64748b] uppercase">Or with email</span>
          <div className="flex-1 border-t border-[#2a3a4a]" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#ef4444]/15 border border-[#ef4444]/30 rounded-xl text-xs text-[#ef4444]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Kofi Mensah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] rounded-lg pl-9 pr-3 py-2.5 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] rounded-lg pl-9 pr-3 py-2.5 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] rounded-lg pl-9 pr-3 py-2.5 outline-none"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
                  Phone (Ghana)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#64748b] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+233 55..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] rounded-lg pl-8 pr-2 py-2.5 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
                  Company / Church
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#64748b] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Event org"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] rounded-lg pl-8 pr-2 py-2.5 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs rounded-lg transition-all shadow-md shadow-[#f5b342]/10 mt-4 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Processing...'
              : tab === 'login'
              ? 'Sign In to Account'
              : 'Create Account & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};
