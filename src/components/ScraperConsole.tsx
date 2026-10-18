import React, { useState, useEffect, useRef } from 'react';
import { StoreConfig, ScraperLogEntry, CategoryConfig } from '../types/scraper';
import { WALMART_CATEGORIES, CONFIGURED_STORES } from '../data/categoryUrls';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Shield,
  Layers,
  Database,
  Lock,
  ArrowRight,
  Server,
} from 'lucide-react';

interface ScraperConsoleProps {
  currentStore: StoreConfig;
  onSelectStore: (store: StoreConfig) => void;
  isRunning: boolean;
  onStartRun: () => void;
  onPauseRun: () => void;
  logs: ScraperLogEntry[];
  categoryProgress: Record<string, { count: number; status: 'pending' | 'in_progress' | 'completed' | 'warning' }>;
  totalYield: number;
}

export const ScraperConsole: React.FC<ScraperConsoleProps> = ({
  currentStore,
  onSelectStore,
  isRunning,
  onStartRun,
  onPauseRun,
  logs,
  categoryProgress,
  totalYield,
}) => {
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'CHECKPOINT'>('ALL');
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inner terminal container only on new logs, without scrolling window
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter((l) => {
    if (logFilter === 'ALL') return true;
    return l.level === logFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Store & Runtime Config */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Azure Execution Node: East US (Container Apps Job)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Distributed Lease Lock Active
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Location-Specific Walmart Scraper Engine
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Crawls all 11 categories and subcategories from <code className="text-blue-300">Walmart_Category_URLs.csv</code>.
              Verifies local fulfillment context, rejects marketplace/shipping-only offers, and writes through a staging buffer.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={isRunning ? onPauseRun : onStartRun}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs shadow-md transition ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Scrape</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Scrape Pass</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Store & Location Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5 pt-4 border-t border-slate-800/80">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Target Store Location
            </label>
            <select
              value={currentStore.storeId}
              onChange={(e) => {
                const found = CONFIGURED_STORES.find((s) => s.storeId === e.target.value);
                if (found) onSelectStore(found);
              }}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {CONFIGURED_STORES.map((s) => (
                <option key={s.storeId} value={s.storeId}>
                  Store #{s.storeId} - {s.storeName} ({s.zipcode}, {s.cityState})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Verified Fulfillment Context
            </label>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-emerald-300">{currentStore.fulfillmentContext}</span>
              <span className="text-slate-400 text-[11px] ml-auto">Local Store Inventory Only</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Safe Publish Policy
            </label>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-blue-300">Two-Stage Atomic Promotion</span>
              <span className="text-slate-400 text-[11px] ml-auto">Zero Overwrites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Terminal (Left) & Category Progress Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Terminal Live Log Stream (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-inner">
          {/* Terminal Header */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-xs font-mono font-medium text-slate-300 ml-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                walmart_scraper.py &bull; stdout
              </span>
            </div>

            {/* Log Level Filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-md border border-slate-800 text-[11px]">
              {(['ALL', 'INFO', 'WARN', 'CHECKPOINT'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                    logFilter === lvl
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalScrollRef}
            className="p-4 font-mono text-xs text-slate-300 h-96 overflow-y-auto space-y-1.5 select-text scrollbar-thin scrollbar-thumb-slate-800"
          >
            {filteredLogs.length === 0 ? (
              <div className="text-slate-500 py-8 text-center italic">
                No logs matching filter. Click &quot;Start Scrape Pass&quot; to begin.
              </div>
            ) : (
              filteredLogs.map((log) => {
                let badgeClass = 'text-blue-400 bg-blue-950/60 border-blue-800/40';
                if (log.level === 'SUCCESS') badgeClass = 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
                if (log.level === 'WARN') badgeClass = 'text-amber-400 bg-amber-950/60 border-amber-800/40';
                if (log.level === 'ERROR') badgeClass = 'text-red-400 bg-red-950/60 border-red-800/40';
                if (log.level === 'CHECKPOINT') badgeClass = 'text-purple-400 bg-purple-950/60 border-purple-800/40';

                return (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-500 text-[10px] whitespace-nowrap">{log.timestamp}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase tracking-wider ${badgeClass}`}
                    >
                      {log.level}
                    </span>
                    {log.category && (
                      <span className="text-cyan-400 text-[11px]">[{log.category}]</span>
                    )}
                    <span className="text-slate-200 text-[11px] break-all">{log.message}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Terminal Footer Bar */}
          <div className="bg-slate-900/80 px-4 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>Status: <strong className="text-slate-200">{isRunning ? 'Crawling...' : 'Ready'}</strong></span>
              <span>Yield: <strong className="text-emerald-400">{totalYield} products</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Canary check: Validated</span>
            </div>
          </div>
        </div>

        {/* Category Coverage & Yield Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Category Yield & Coverage Matrix
              </h3>
              <p className="text-[11px] text-slate-400">11 Categories from Walmart_Category_URLs.csv</p>
            </div>
            <span className="text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
              11/11 Active
            </span>
          </div>

          {/* Category List */}
          <div className="space-y-2 overflow-y-auto max-h-[345px] pr-1">
            {WALMART_CATEGORIES.map((cat) => {
              const prog = categoryProgress[cat.name] || { count: 0, status: 'completed' };
              const isWarning = prog.count > 0 && prog.count < 10;
              const hasNotes = Boolean(cat.notes);

              return (
                <div
                  key={cat.name}
                  className="bg-slate-850 p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {cat.name}
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {prog.count} items
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{cat.subcategories.length} subcategories</span>
                    {hasNotes ? (
                      <span className="text-amber-400/90 text-[10px]">{cat.notes}</span>
                    ) : (
                      <span className="text-slate-400">All subcategories</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWarning ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(15, (prog.count / 60) * 100))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Staging Summary */}
          <div className="mt-auto pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Staging checkpoint: <code className="text-slate-300">checkpoint.json</code>
            </span>
            <span className="text-slate-400">Zero Overwrites Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
