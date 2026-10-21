import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { checkStaffInvitation } from '../../services/firestoreService';
import { StaffInvitation } from '../../types';
import { BOOTSTRAP_ADMIN_EMAIL } from '../../services/storage';
import {
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Store,
  Sparkles,
} from 'lucide-react';

interface StaffAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onReturnToCatalog: () => void;
  showTimeoutWarning?: boolean;
  remainingCountdown?: number;
  onExtendSession?: () => void;
}

export const StaffAuthModal: React.FC<StaffAuthModalProps> = ({
  isOpen,
  onSuccess,
  onReturnToCatalog,
  showTimeoutWarning,
  remainingCountdown,
  onExtendSession,
}) => {
  const { signInWithEmail, registerStaffFirstTime, signInWithGoogle, isStaff, user } = useAuth();

  // Steps: 'email_check' -> 'first_time_setup' | 'password_login' | 'unauthorized'
  const [step, setStep] = useState<'email_check' | 'first_time_setup' | 'password_login' | 'unauthorized'>('email_check');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeInvitation, setActiveInvitation] = useState<StaffInvitation | null>(null);

  if (!isOpen) {
    if (showTimeoutWarning && onExtendSession) {
      return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a232f] border border-[#f5b342] rounded-xl px-6 py-4 z-[9998] flex items-center gap-4 shadow-2xl animate-bounce">
          <div className="w-6 h-6 rounded-full bg-[#f5b342]/20 flex items-center justify-center text-[#f5b342] animate-spin">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-sm text-[#edf2f7]">
            Staff session will lock in <strong className="text-[#f5b342] text-base">{remainingCountdown}</strong>s due to inactivity.
          </span>
          <button
            onClick={onExtendSession}
            className="px-4 py-1.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-semibold text-xs rounded-lg transition-all"
          >
            Stay Logged In
          </button>
        </div>
      );
    }
    return null;
  }

  // Handle email verification
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid staff email address.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check if owner/bootstrap admin
      if (cleanEmail === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
        setActiveInvitation({
          email: cleanEmail,
          role: 'admin',
          name: 'NADEGE Administrator',
          claimed: true,
          createdAt: new Date().toISOString(),
        });
        setStep('password_login');
        setIsLoading(false);
        return;
      }

      // 2. Query Firestore staffInvitations
      const invitation = await checkStaffInvitation(cleanEmail);

      if (!invitation) {
        setStep('unauthorized');
        setIsLoading(false);
        return;
      }

      setActiveInvitation(invitation);
      if (invitation.name) setFullName(invitation.name);

      if (!invitation.claimed) {
        // Staff has not set up a password yet!
        setStep('first_time_setup');
      } else {
        // Staff already claimed and set password previously
        setStep('password_login');
      }
    } catch (err: any) {
      console.error('Error checking staff authorization:', err);
      setError('Unable to verify authorization. Please check internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // First-time staff password creation
  const handleFirstTimeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      await registerStaffFirstTime(email.trim().toLowerCase(), password, fullName.trim());
      onSuccess();
    } catch (err: any) {
      console.error('First time setup error:', err);
      // If user already existed in Auth, offer password login
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Switching to password login...');
        setTimeout(() => setStep('password_login'), 1500);
      } else {
        setError(err.message || 'Failed to create staff credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Existing password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmail(email.trim().toLowerCase(), password);
      onSuccess();
    } catch (err: any) {
      console.error('Staff login error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect password. Please verify and try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found. It looks like you need to create your first-time password.');
        setStep('first_time_setup');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0b0e14]/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glowing border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f5b342] via-[#3b82f6] to-[#22c55e]" />

        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/nadege logo.jpg"
            alt="NADEGE Logistics"
            className="max-h-16 object-contain mb-3 drop-shadow-[0_0_15px_rgba(245,179,66,0.25)] rounded"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5b342]/10 border border-[#f5b342]/20 text-[#f5b342] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Fortified Staff Portal
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#edf2f7]">
            {step === 'first_time_setup' ? 'Create Your Staff Password' : 'Staff Access & RMS'}
          </h2>
          <p className="text-[#94a3b8] text-xs mt-1">
            {step === 'first_time_setup'
              ? 'First-time setup: Choose your personal, secure password'
              : 'Secure access controlled by Firebase Authentication & RBAC'}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-start gap-3 text-[#ef4444] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* STEP 1: Email Check */}
        {step === 'email_check' && (
          <form onSubmit={handleCheckEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="email"
                  required
                  placeholder="e.g. staff@nadegelogistics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] focus:ring-2 focus:ring-[#f5b342]/20 rounded-xl pl-10 pr-4 py-3 text-sm text-[#edf2f7] placeholder-[#64748b] outline-none transition-all"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-[#64748b] mt-1.5">
                Enter your authorized email. If this is your first time, you will create your password.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#f5b342]/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="inline-block animate-pulse">Verifying Authorization...</span>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Google Sign In for Admin */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2a3a4a]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1a232f] px-3 text-[#64748b]">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              disabled={isLoading}
              className="w-full py-2.5 bg-[#131a24] hover:bg-[#212d3d] border border-[#2a3a4a] text-[#edf2f7] font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-4 h-4"
              />
              <span>Sign in with Google (Admin)</span>
            </button>
          </form>
        )}

        {/* STEP 2A: First Time Password Setup */}
        {step === 'first_time_setup' && (
          <form onSubmit={handleFirstTimeSetup} className="space-y-4">
            <div className="p-3 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl text-xs text-[#22c55e] flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                Authorized email detected: <strong>{email}</strong> ({activeInvitation?.role?.toUpperCase()} role)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Mensah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#edf2f7] placeholder-[#64748b] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                Create First-Time Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#edf2f7] placeholder-[#64748b] outline-none transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#edf2f7]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#edf2f7] placeholder-[#64748b] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#22c55e] hover:bg-[#16a34a] text-[#0b0e14] font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#22c55e]/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="inline-block animate-pulse">Setting up staff credentials...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Activate & Unlock Portal</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email_check');
                setPassword('');
                setConfirmPassword('');
              }}
              className="w-full text-center text-xs text-[#94a3b8] hover:text-[#edf2f7] py-1"
            >
              ← Use different email
            </button>
          </form>
        )}

        {/* STEP 2B: Returning Staff Password Login */}
        {step === 'password_login' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="p-3 bg-[#131a24] border border-[#2a3a4a] rounded-xl flex items-center justify-between text-xs">
              <span className="text-[#94a3b8]">Staff Account:</span>
              <strong className="text-[#edf2f7] font-mono">{email}</strong>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-[#94a3b8]">
                  Your Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your personal password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] focus:ring-2 focus:ring-[#f5b342]/20 rounded-xl pl-10 pr-10 py-3 text-sm text-[#edf2f7] placeholder-[#64748b] outline-none transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#edf2f7]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#f5b342]/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="inline-block animate-pulse">Authenticating with Firebase...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Staff Portal</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email_check');
                setPassword('');
              }}
              className="w-full text-center text-xs text-[#94a3b8] hover:text-[#edf2f7] py-1"
            >
              ← Use different email
            </button>
          </form>
        )}

        {/* STEP 3: Unauthorized Email Notification */}
        {step === 'unauthorized' && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#ef4444]/15 text-[#ef4444] mx-auto flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#edf2f7]">Access Restricted</h3>
              <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                The email <strong className="text-white font-mono">{email}</strong> is not authorized to access the NADEGE Logistics Staff Management Portal.
              </p>
              <div className="mt-4 p-3 bg-[#131a24] border border-[#2a3a4a] rounded-xl text-left text-[11px] text-[#94a3b8] space-y-1">
                <p className="font-semibold text-[#f5b342]">How to gain access:</p>
                <p>1. Contact the super-administrator at: <strong className="text-white">nadegelogisticservices@gmail.com</strong></p>
                <p>2. Once authorized, return here to create your own secure password.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setStep('email_check')}
                className="w-full py-2.5 bg-[#212d3d] hover:bg-[#2a3a4a] text-[#edf2f7] font-medium text-xs rounded-xl transition-all"
              >
                Try Another Email
              </button>
              <button
                type="button"
                onClick={onReturnToCatalog}
                className="w-full py-2.5 text-[#94a3b8] hover:text-[#f5b342] text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Return to Public Client Catalog</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Return button */}
        {step !== 'unauthorized' && (
          <div className="mt-6 pt-4 border-t border-[#2a3a4a] flex items-center justify-between">
            <button
              type="button"
              onClick={onReturnToCatalog}
              className="text-xs text-[#94a3b8] hover:text-[#f5b342] transition-colors flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Client Catalog</span>
            </button>
            <span className="text-[10px] text-[#64748b]">
              Zero-Trust Protected
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
