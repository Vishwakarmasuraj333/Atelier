'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  History,
  Plus,
  Minus,
  Edit,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [newStock, setNewStock] = useState('');
  const [reason, setReason] = useState('RESTOCK');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      setProducts(data.products || []);
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAdjustModal = (product: any) => {
    setSelectedProduct(product);
    setNewStock(String(product.stock));
    setReason('RESTOCK');
    setNotes('');
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          newStock: parseInt(newStock, 10),
          reason,
          notes,
        }),
      });

      if (res.ok) {
        setSelectedProduct(null);
        fetchInventory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vault & Warehousing</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Inventory & Stock Audit Logs
          </h1>
        </div>
      </div>

      {/* Live Inventory Status */}
      <div className="bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 overflow-hidden shadow-xl space-y-4 p-6">
        <h3 className="font-serif text-xl font-normal text-white">Live Stock Levels</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-wider text-[#E8CFA8]">
              <tr>
                <th className="p-3.5">Piece</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#E8CFA8]" />
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-bold text-white">{p.name}</td>
                    <td className="p-3.5 font-mono text-white/70">{p.sku}</td>
                    <td className="p-3.5">{p.category?.name}</td>
                    <td className="p-3.5 font-bold text-[#E8CFA8] text-sm">{p.stock} units</td>
                    <td className="p-3.5">
                      {p.stock <= p.lowStockThreshold ? (
                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Low Stock Warning
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
                          Nominal
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openAdjustModal(p)}
                        className="px-3.5 py-1.5 bg-[#641C32] hover:bg-[#B83B5E] text-white rounded-xl font-bold transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Audit Logs Stream */}
      <div className="bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 overflow-hidden shadow-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#E8CFA8]" />
          <h3 className="font-serif text-xl font-normal text-white">Stock Adjustment History</h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-white">{log.product?.name}</span>
                <span className="text-white/40 ml-2 font-mono text-[11px]">({log.product?.sku})</span>
                <p className="text-[11px] text-[#E8CFA8] mt-0.5">
                  Reason: {log.reason} • {log.notes}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span
                  className={`font-bold font-mono text-sm ${
                    log.quantityChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {log.quantityChange >= 0 ? `+${log.quantityChange}` : log.quantityChange} units ({log.previousStock} &rarr; {log.newStock})
                </span>
                <p className="text-[10px] text-white/50">{formatDateTime(log.createdAt)} by {log.createdBy || 'Admin'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#17151A] rounded-3xl border border-[#E8CFA8]/50 shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-serif text-xl font-normal text-white">
                  Adjust Stock Quantity
                </h3>
                <p className="text-xs text-white/50">{selectedProduct.name} ({selectedProduct.sku})</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-1.5 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  New Stock Count (Current: {selectedProduct.stock})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#121015] border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  Adjustment Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#121015] border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                >
                  <option value="RESTOCK">RESTOCK (Arrived from Atelier)</option>
                  <option value="MANUAL_AUDIT">MANUAL AUDIT (Physical count adjustment)</option>
                  <option value="DAMAGE">DAMAGE / DEFECT (Removed from circulation)</option>
                  <option value="VIP_RESERVATION">VIP RESERVATION</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  Audit Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Received shipment batch #8912"
                  className="w-full px-3.5 py-2.5 bg-[#121015] border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 py-2.5 bg-white/5 text-white/70 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#641C32] hover:bg-[#B83B5E] text-white font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  {isSubmitting ? 'Logging...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
