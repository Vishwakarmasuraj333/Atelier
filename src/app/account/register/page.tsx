'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/layout/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await register(formData);
    setIsLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setError(res.error || 'Failed to create account');
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
            Create Account
          </h2>
          <p className="text-xs text-[#17151A]/60">
            Join the private salon to enjoy personalized concierge and order management.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Lord / Lady Sterling"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patron@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
              Telephone (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
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
                <span>Create Patron Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-[#17151A]/60">
            Already registered?{' '}
            <Link href="/account/login" className="font-bold text-[#641C32] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
