import React, { useState } from 'react';
import { StoreConfig } from '../types/scraper';
import { CONFIGURED_STORES } from '../data/categoryUrls';
import { X, Check, MapPin, Store, Shield, Plus } from 'lucide-react';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStore: StoreConfig;
  onSelectStore: (store: StoreConfig) => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  currentStore,
  onSelectStore,
}) => {
  const [customStoreId, setCustomStoreId] = useState('');
  const [customZip, setCustomZip] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [customFulfillment, setCustomFulfillment] = useState<'PICKUP' | 'IN_STORE'>('PICKUP');

  if (!isOpen) return null;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStoreId || !customZip) return;

    const newStore: StoreConfig = {
      storeId: customStoreId,
      storeName: `Walmart Supercenter #${customStoreId}`,
      zipcode: customZip,
      cityState: customCity || 'Custom Location',
      storeLocation: `${customAddress || 'Walmart Store'}, ${customZip}`,
      fulfillmentContext: customFulfillment,
      address: customAddress || 'Walmart Supercenter',
      phone: '(800) 925-6278',
    };

    onSelectStore(newStore);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-400" />
              Select or Configure Walmart Location
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports multiple store locations through configuration without code rewriting.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close store selection modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Preset Stores */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Pre-Configured Certified Stores
            </span>
            <div className="space-y-2">
              {CONFIGURED_STORES.map((s) => {
                const isSelected = currentStore.storeId === s.storeId;
                return (
                  <button
                    key={s.storeId}
                    onClick={() => {
                      onSelectStore(s);
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{s.storeId}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{s.storeName}</span>
                          <span className="text-[10px] font-mono text-blue-400">
                            ZIP: {s.zipcode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{s.storeLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-emerald-400 border border-slate-700">
                        {s.fulfillmentContext}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Store Form */}
          <form
            onSubmit={handleAddCustom}
            className="pt-4 border-t border-slate-800 space-y-3 text-xs"
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Add Custom Walmart Store ID & ZIP
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Store Number</label>
                <input
                  type="text"
                  placeholder="e.g. 4521"
                  value={customStoreId}
                  onChange={(e) => setCustomStoreId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">ZIP Code</label>
                <input
                  type="text"
                  placeholder="e.g. 75001"
                  value={customZip}
                  onChange={(e) => setCustomZip(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">City, State</label>
                <input
                  type="text"
                  placeholder="e.g. Dallas, TX"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Fulfillment Mode</label>
                <select
                  value={customFulfillment}
                  onChange={(e) =>
                    setCustomFulfillment(e.target.value as 'PICKUP' | 'IN_STORE')
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                >
                  <option value="PICKUP">STORE PICKUP (Recommended)</option>
                  <option value="IN_STORE">IN-STORE</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!customStoreId || !customZip}
              className="w-full mt-2 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg border border-slate-700 font-semibold disabled:opacity-40 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply Custom Store Config</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
