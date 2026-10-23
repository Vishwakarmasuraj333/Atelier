'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/layout/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      if (res.user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/account');
      }
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const fillQuickCredentials = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@atelier.com');
      setPassword('admin123');
    } else {
      setEmail('customer@atelier.com');
      setPassword('customer123');
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FFF9F3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-[#E8CFA8]/40 shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-1">
            <Logo variant="auth" size="md" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#17151A]">
            Client Sign In
          </h2>
          <p className="text-xs text-[#17151A]/60">
            Access your order timeline, bespoke recommendations, and saved pieces.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Fast Test Account Selectors */}
        <div className="p-3 bg-[#FFF9F3] rounded-2xl border border-[#E8CFA8]/50 space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#641C32] tracking-wider block text-center">
            Quick Fill Test Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin')}
              className="py-1.5 px-2 bg-[#641C32] text-white text-[11px] font-bold rounded-lg hover:bg-[#B83B5E] transition-colors flex items-center justify-center gap-1"
            >
              <Shield className="w-3 h-3" /> Admin (Full CRUD)
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('customer')}
              className="py-1.5 px-2 bg-[#17151A] text-white text-[11px] font-bold rounded-lg hover:bg-[#2A2630] transition-colors"
            >
              Customer Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@atelier.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#641C32] hover:bg-[#491424] text-[#FFF9F3] text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-[#17151A]/60">
            Do not have a Maison profile yet?{' '}
            <Link href="/account/register" className="font-bold text-[#641C32] hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
