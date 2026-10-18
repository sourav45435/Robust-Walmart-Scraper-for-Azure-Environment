import React, { useState } from 'react';
import {
  Cloud,
  Server,
  Database,
  Lock,
  Shield,
  Clock,
  ArrowRight,
  DollarSign,
  Activity,
  Layers,
  Key,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const AzureArchView: React.FC = () => {
  // Interactive cost calculator state
  const [storesCount, setStoresCount] = useState<number>(1);
  const [runsPerWeek, setRunsPerWeek] = useState<number>(2); // Required: twice per week
  const [proxyPricePerGb, setProxyPricePerGb] = useState<number>(10);

  // Computations
  // 1 run ~ 24 mins = 0.4 hours. 1 vCPU = $0.000024/s, 2GB = $0.000003/s.
  // 1 run = 1440s * 0.000030 = $0.043 per run in Container Apps (ignoring free tier).
  const monthlyRuns = storesCount * runsPerWeek * 4.33;
  const computeCost = monthlyRuns * 0.043;
  // Blob storage ~ 5MB per run with versioning
  const storageCost = 0.05 * storesCount;
  // Key vault ~ 50 ops per month
  const keyVaultCost = 0.03;
  // Bandwidth: ~0.35 GB per run (without images)
  const monthlyGb = monthlyRuns * 0.35;
  const proxyCost = monthlyGb * proxyPricePerGb;
  const totalCost = computeCost + storageCost + keyVaultCost + proxyCost;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded uppercase tracking-wider">
                Cloud Native Architecture
              </span>
              <span className="text-xs text-slate-400">Microsoft Azure Infrastructure</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Azure Serverless Container Apps & Two-Stage Storage Pipeline
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Designed for unattended twice-weekly execution, distributed lease locking, zero idle compute costs,
              and two-stage atomic dataset promotion ensuring bad runs never overwrite production data.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Scheduled Cron</span>
              <div className="font-mono text-xs font-bold text-white">0 2 * * 2,5</div>
              <span className="text-[10px] text-cyan-300">Tue & Fri at 02:00 UTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Infrastructure Flow Map */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          End-to-End Azure Orchestration Flow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1: Trigger & Compute */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative group hover:border-slate-700 transition">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                Azure Container App Job
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Serverless Linux runtime with 1.0 vCPU and 2.0 GiB RAM. Scales to 0 replicas when idle.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-400 space-y-1">
              <div>&bull; Playwright Chromium</div>
              <div>&bull; Memory: 2.0 GiB</div>
              <div>&bull; Cost: $0.00 idle</div>
            </div>
          </div>

          {/* Step 2: Concurrency & Lock */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative group hover:border-slate-700 transition">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                Blob Lease Locking
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Acquires 60s auto-renewing lease on <code className="text-purple-300">walmart_scrape.lock</code> to prevent overlapping runs.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-400 space-y-1">
              <div>&bull; Distributed Mutex</div>
              <div>&bull; Auto-Release on Exit</div>
              <div>&bull; Azure Storage SDK v12</div>
            </div>
          </div>

          {/* Step 3: Staging & Validation Gate */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative group hover:border-slate-700 transition">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Staging & Validation
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Scraped records write to <code className="text-amber-300">walmart-staging/</code>. Comprehensive 11-point validation executes.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-400 space-y-1">
              <div>&bull; Schema & Order Test</div>
              <div>&bull; Canary & Yield Baseline</div>
              <div>&bull; Quarantined if Failed</div>
            </div>
          </div>

          {/* Step 4: Atomic Production Promotion */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative group hover:border-slate-700 transition">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Atomic Production Swap
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Promotes to <code className="text-emerald-300">walmart-production/</code> and updates <code className="text-emerald-300">latest.json</code>.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-400 space-y-1">
              <div>&bull; Blob Versioning Enabled</div>
              <div>&bull; Immutable History</div>
              <div>&bull; Zero Data Loss Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Monthly Cost Calculator & Security Features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cost Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Monthly Azure & Proxy Operating Cost Model
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
              Total: ${totalCost.toFixed(2)} / month
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Adjust operating parameters to simulate monthly Azure cloud expenditure and residential proxy usage:
          </p>

          <div className="space-y-3 pt-2">
            {/* Stores Count Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Configured Walmart Locations:</span>
                <span className="font-mono font-bold text-white">{storesCount} store(s)</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={storesCount}
                onChange={(e) => setStoresCount(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Runs per week Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Scrape Frequency:</span>
                <span className="font-mono font-bold text-white">
                  {runsPerWeek} runs / week ({runsPerWeek === 2 ? 'Required twice weekly' : 'Custom'})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={runsPerWeek}
                onChange={(e) => setRunsPerWeek(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Proxy cost per GB */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Residential Proxy Price:</span>
                <span className="font-mono font-bold text-white">${proxyPricePerGb} / GB</span>
              </div>
              <input
                type="range"
                min="5"
                max="15"
                value={proxyPricePerGb}
                onChange={(e) => setProxyPricePerGb(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5 pt-3">
            <div className="flex justify-between text-slate-400">
              <span>Azure Container Apps (Compute 3.2 hrs):</span>
              <span className="text-slate-200">${computeCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Azure Blob Storage & Key Vault:</span>
              <span className="text-slate-200">${(storageCost + keyVaultCost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Residential Proxy Bandwidth ({monthlyGb.toFixed(1)} GB):</span>
              <span className="text-slate-200">${proxyCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 text-emerald-400 font-bold">
              <span>Estimated Cost Per Product Record:</span>
              <span>${(totalCost / (storesCount * 535 * runsPerWeek * 4.33)).toFixed(5)} / record</span>
            </div>
          </div>
        </div>

        {/* Security & Isolation Features (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            Security & Compliance Isolation
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Azure Key Vault Secret Injection
              </span>
              <p className="text-[11px] text-slate-400">
                Credentials, proxy strings, and storage tokens are injected as secure environment variables at job startup. Zero embedded secrets in source code.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Managed Identity (RBAC)
              </span>
              <p className="text-[11px] text-slate-400">
                Uses Azure DefaultAzureCredential with Storage Blob Data Contributor role. No long-lived access keys stored on disk.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Application Insights Telemetry
              </span>
              <p className="text-[11px] text-slate-400">
                Tracks category scrape latency, HTTP status distributions, canary ping health, and raises automated PagerDuty/email alerts on yield drops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
