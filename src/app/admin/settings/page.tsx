'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    STORE_NAME: 'Atelier Éclat',
    STORE_TAGLINE: 'High Luxury Fashion & Horology',
    CURRENCY: 'USD',
    TAX_RATE: '8.0',
    FREE_SHIPPING_THRESHOLD: '300',
    CONTACT_EMAIL: 'concierge@atelier-eclat.com',
    SUPPORT_PHONE: '+1 (800) 892-LUXE',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings((prev: any) => ({ ...prev, ...data.settings }));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-[#E8CFA8] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Configuration</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Global Maison Settings
          </h1>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Global store settings updated and synchronized with database.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-[#17151A] p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/30 space-y-4">
          <h3 className="font-serif text-xl font-normal text-white pb-3 border-b border-white/10">
            Brand Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                Store Name
              </label>
              <input
                type="text"
                required
                value={settings.STORE_NAME}
                onChange={(e) => setSettings({ ...settings, STORE_NAME: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={settings.STORE_TAGLINE}
                onChange={(e) => setSettings({ ...settings, STORE_TAGLINE: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                Concierge Contact Email
              </label>
              <input
                type="email"
                required
                value={settings.CONTACT_EMAIL}
                onChange={(e) => setSettings({ ...settings, CONTACT_EMAIL: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                Concierge Phone Line
              </label>
              <input
                type="text"
                value={settings.SUPPORT_PHONE}
                onChange={(e) => setSettings({ ...settings, SUPPORT_PHONE: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
              />
            </div>
          </div>
        </div>

        {/* Commercial & Financial Settings */}
        <div className="bg-[#17151A] p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/30 space-y-4">
          <h3 className="font-serif text-xl font-normal text-white pb-3 border-b border-white/10">
            Financial & Shipping Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                Standard Currency
              </label>
              <select
                value={settings.CURRENCY}
                onChange={(e) => setSettings({ ...settings, CURRENCY: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#121015] border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                Standard Sales Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.TAX_RATE}
                onChange={(e) => setSettings({ ...settings, TAX_RATE: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                Free VIP Courier Threshold ($)
              </label>
              <input
                type="number"
                value={settings.FREE_SHIPPING_THRESHOLD}
                onChange={(e) => setSettings({ ...settings, FREE_SHIPPING_THRESHOLD: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-xl transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
