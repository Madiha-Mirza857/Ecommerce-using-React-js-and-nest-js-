import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  requiredRole?: 'admin' | 'customer' | null;
  promptMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  requiredRole = null,
  promptMessage = null,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister ? { email, password, name } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (requiredRole === 'admin' && data.user.role !== 'admin') {
        throw new Error('Access Denied: This account does not have Admin privileges. Please use an admin account (admin@atelier.com).');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoRole: 'admin' | 'customer') => {
    setError(null);
    setLoading(true);

    const demoEmail = demoRole === 'admin' ? 'admin@atelier.com' : 'customer@atelier.com';
    const demoPassword = demoRole === 'admin' ? 'admin123' : 'user123';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Quick login failed');

      if (requiredRole === 'admin' && data.user.role !== 'admin') {
        throw new Error('Access Denied: Customer account cannot access Admin Panel.');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative bg-[#fdfbf7] rounded-xl max-w-md w-full shadow-2xl border border-[#1a1a1a]/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#1a1a1a] text-[#fdfbf7] flex items-center justify-between border-b border-[#1a1a1a]/20">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#8b4513]" />
            <h2 className="serif-display text-xl font-bold">
              {requiredRole === 'admin'
                ? 'Admin Portal Sign In'
                : isRegister
                ? 'Create Customer Account'
                : 'Customer Sign In'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#fdfbf7]/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {promptMessage && (
            <div className="bg-[#8b4513]/10 border border-[#8b4513]/30 text-[#8b4513] p-3 rounded text-xs ui-mono font-bold">
              {promptMessage}
            </div>
          )}

          {requiredRole === 'admin' && (
            <div className="bg-[#1a1a1a] text-white p-3 rounded text-xs ui-mono space-y-1">
              <p className="font-bold text-[#8b4513]">🛡️ Admin Credentials required to view Admin Dashboard:</p>
              <p className="text-white/80">• Email: <span className="font-bold text-white">admin@atelier.com</span></p>
              <p className="text-white/80">• Password: <span className="font-bold text-white">admin123</span></p>
            </div>
          )}

          {/* Quick Demo Login Preset Buttons */}
          <div className="bg-[#f7f4ee] p-3.5 rounded-lg border border-[#1a1a1a]/15 space-y-2">
            <p className="ui-mono text-[11px] font-bold text-[#8b4513] uppercase tracking-wider">
              ⚡ Fill / Login Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="bg-[#1a1a1a] hover:bg-[#8b4513] text-white py-2 px-3 rounded ui-mono text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Login as Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="bg-[#8b4513] hover:bg-[#1a1a1a] text-white py-2 px-3 rounded ui-mono text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Login as Customer</span>
              </button>
            </div>
          </div>

          <div className="relative text-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1a1a1a]/15"></div>
            </div>
            <span className="relative bg-[#fdfbf7] px-3 ui-mono text-[10px] text-[#5a5853] uppercase font-bold">
              or enter email & password
            </span>
          </div>

          {error && (
            <div className="bg-[#ba1a1a]/10 border border-[#ba1a1a]/30 text-[#ba1a1a] p-3 rounded text-xs ui-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs ui-mono">
            {isRegister && (
              <div>
                <label className="block text-[#5a5853] font-bold mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5853]" />
                  <input
                    type="text"
                    required
                    placeholder="Clara Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a] focus:border-[#8b4513] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#5a5853] font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5853]" />
                <input
                  type="email"
                  required
                  placeholder="admin@atelier.com or customer@atelier.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a] focus:border-[#8b4513] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#5a5853] font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5853]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a] focus:border-[#8b4513] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] hover:bg-[#8b4513] text-white py-3 rounded ui-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs ui-mono text-[#5a5853]">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegister(false)}
                  className="text-[#8b4513] font-bold underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account yet?{' '}
                <button
                  onClick={() => setIsRegister(true)}
                  className="text-[#8b4513] font-bold underline"
                >
                  Register Customer Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
