import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight,
  Briefcase
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginWithGoogle, 
    switchDemoRole, 
    currentUser 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Fast login
    switchDemoRole('buyer');
    setIsAuthModalOpen(false);
  };

  const handleRoleSelect = (role: UserRole) => {
    switchDemoRole(role);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-3xl max-w-md w-full my-6 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0D5F38] to-[#16834A] text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-1 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Secure Indian Enterprise Access
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Sign In to BUSINESS CONNECT
            </h2>
            <p className="text-xs text-white/90 mt-0.5">
              Access your digital catalogue, RFQs, leads & orders.
            </p>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* 1. Google OAuth Sign In */}
          <button
            onClick={async () => {
              await loginWithGoogle();
              setIsAuthModalOpen(false);
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-[#16834A] bg-white dark:bg-[#101713] text-gray-800 dark:text-gray-200 font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google Account</span>
          </button>

          <div className="flex items-center gap-3 text-gray-400 text-[11px]">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
            <span>or instant test drive as role</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
          </div>

          {/* Quick Demo Role Logins */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleRoleSelect('seller')}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#16834A] bg-gray-50 dark:bg-[#101713] text-left transition cursor-pointer"
            >
              <div className="font-bold text-gray-800 dark:text-gray-200">Seller / MSME</div>
              <div className="text-[10px] text-gray-500">Products, CRM Leads</div>
            </button>

            <button
              onClick={() => handleRoleSelect('supplier')}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#16834A] bg-gray-50 dark:bg-[#101713] text-left transition cursor-pointer"
            >
              <div className="font-bold text-gray-800 dark:text-gray-200">Wholesale Supplier</div>
              <div className="text-[10px] text-gray-500">RFQ Bids, MOQs</div>
            </button>

            <button
              onClick={() => handleRoleSelect('buyer')}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#16834A] bg-gray-50 dark:bg-[#101713] text-left transition cursor-pointer"
            >
              <div className="font-bold text-gray-800 dark:text-gray-200">Corporate Buyer</div>
              <div className="text-[10px] text-gray-500">Post RFQs, Quotes</div>
            </button>

            <button
              onClick={() => handleRoleSelect('super_admin')}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#16834A] bg-emerald-50 dark:bg-emerald-950/40 text-left transition cursor-pointer"
            >
              <div className="font-bold text-[#16834A]">Super Admin</div>
              <div className="text-[10px] text-gray-500">Full System Control</div>
            </button>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                Business Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Sign In with Credentials
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
