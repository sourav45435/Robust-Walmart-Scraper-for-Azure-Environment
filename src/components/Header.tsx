import React from 'react';
import { StoreConfig } from '../types/scraper';
import { Cloud, CheckCircle2, Calendar, ShieldCheck, Download, Terminal } from 'lucide-react';

interface HeaderProps {
  currentStore: StoreConfig;
  onOpenStoreModal: () => void;
  recordCount: number;
  onDownloadJson: () => void;
  onDownloadCsv: () => void;
  onTriggerRun: () => void;
  isRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStore,
  onOpenStoreModal,
  recordCount,
  onDownloadJson,
  onDownloadCsv,
  onTriggerRun,
  isRunning,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white relative z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title & Status */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Walmart Scraper for Microsoft Azure
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Production Ready
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Location-Verified • 22-Field Ordered Schema • Two-Stage Atomic Promotion • Azure Serverless
              </p>
            </div>
          </div>

          {/* Location & Fulfillment Badge + Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Store & Fulfillment Context Pill */}
            <button
              onClick={onOpenStoreModal}
              title="Click to switch or configure Walmart location"
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-750 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="font-semibold text-blue-300">Store #{currentStore.storeId}</span>
              <span className="text-slate-400">({currentStore.cityState})</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-900/50 text-blue-300 font-mono text-[10px] uppercase border border-blue-700/50">
                {currentStore.fulfillmentContext}
              </span>
            </button>

            {/* Schedule Pill */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/60 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700/60">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cron: <code className="font-mono text-cyan-300">0 2 * * 2,5</code></span>
            </div>

            {/* Run Button */}
            <button
              onClick={onTriggerRun}
              disabled={isRunning}
              className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg transition shadow-sm ${
                isRunning
                  ? 'bg-amber-600 text-white cursor-not-allowed animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              {isRunning ? 'Scraping Active...' : 'Run Scraper Job'}
            </button>

            {/* Export JSON */}
            <button
              onClick={onDownloadJson}
              title="Download full 22-field JSON dataset"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>JSON ({recordCount})</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={onDownloadCsv}
              title="Download CSV export"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
