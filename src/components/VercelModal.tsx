import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Terminal, Globe, Zap, Shield } from 'lucide-react';

interface VercelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelModal: React.FC<VercelModalProps> = ({ isOpen, onClose }) => {
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen) return null;

  const cliCommands = `npm i -g vercel\nvercel`;
  const vercelJsonContent = `{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommands);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(vercelJsonContent);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white shadow-inner">
              <svg viewBox="0 0 1155 1000" className="w-5 h-5 fill-current">
                <path d="M577.347 0L1154.69 1000H0L577.347 0Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Deploy to Vercel
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">Zero-config Vite React deployment pre-configured</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Method 1: Git Push (Easiest) */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Zap className="w-4 h-4" />
              <span>Method 1: Connect Git Repository (Recommended)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Push this repository to GitHub, GitLab, or Bitbucket. Import it in your{' '}
              <a 
                href="https://vercel.com/new" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
              >
                Vercel Dashboard <ExternalLink className="w-3 h-3 inline ml-0.5" />
              </a>
              . Vercel will auto-detect Vite and deploy instantly.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 text-slate-300">
                <span className="text-slate-500 block text-[9px]">FRAMEWORK</span> Vite
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 text-slate-300">
                <span className="text-slate-500 block text-[9px]">BUILD CMD</span> npm run build
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 text-slate-300">
                <span className="text-slate-500 block text-[9px]">OUTPUT DIR</span> dist
              </div>
            </div>
          </div>

          {/* Method 2: Vercel CLI */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Terminal className="w-4 h-4" />
                <span>Method 2: One-Command CLI Deploy</span>
              </div>
              <button
                onClick={handleCopyCli}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition"
              >
                {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCli ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800 overflow-x-auto">
              <code>{cliCommands}</code>
            </pre>
            <p className="text-[11px] text-slate-400">
              Run in your terminal. Accept the defaults, and Vercel will provision an instant live production URL.
            </p>
          </div>

          {/* Pre-configured vercel.json info */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Configured vercel.json file</span>
              </div>
              <button
                onClick={handleCopyJson}
                className="text-[10px] text-slate-400 hover:text-slate-200 transition"
              >
                {copiedJson ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              A pre-configured <code className="text-purple-300 font-mono">vercel.json</code> file has already been added to the root directory with SPA client-side routing rewrites and asset cache headers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Globe className="w-3 h-3 text-blue-400" />
            Runs on Vercel Edge Network
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              Close
            </button>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition shadow-sm"
            >
              <span>Open Vercel</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
