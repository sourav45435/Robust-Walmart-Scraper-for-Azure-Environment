import React, { useState } from 'react';
import { PYTHON_CODEBASE, SourceFile } from '../data/pythonCodebase';
import {
  Code2,
  Copy,
  Download,
  FileCode,
  Check,
  FileSpreadsheet,
  Terminal,
  Layers,
  FolderArchive,
} from 'lucide-react';

export const SourceCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<SourceFile>(PYTHON_CODEBASE[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllBundle = () => {
    // Concatenate bundle with clean separators
    let bundle = `# ==============================================================================\n`;
    bundle += `# PRODUCTION WALMART SCRAPER FOR MICROSOFT AZURE - COMPLETE SOURCE BUNDLE\n`;
    bundle += `# Contains all Python engines, runners, configurations, Dockerfile and IaC\n`;
    bundle += `# ==============================================================================\n\n`;

    PYTHON_CODEBASE.forEach((file) => {
      bundle += `\n# ==============================================================================\n`;
      bundle += `# FILE: ${file.filename} (${file.language})\n`;
      bundle += `# DESCRIPTION: ${file.description}\n`;
      bundle += `# ==============================================================================\n\n`;
      bundle += file.content;
      bundle += `\n\n`;
    });

    const blob = new Blob([bundle], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `walmart_scraper_azure_full_source_bundle.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded uppercase tracking-wider">
                Production Source Code Repository
              </span>
              <span className="text-xs text-slate-400">Zero Encrypted or Obfuscated Logic</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Enterprise Python 3.11 & Microsoft Azure Deployment Files
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Complete, unencrypted source code conforming to all contest delivery requirements. Includes the Playwright async crawler,
              Azure Blob distributed locking runner, 11-point schema validator, Dockerfile, Azure CLI script, and Terraform IaC.
            </p>
          </div>

          <button
            onClick={handleDownloadAllBundle}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-amber-600/30 transition shrink-0"
          >
            <FolderArchive className="w-4 h-4" />
            <span>Download All 8 Source Files</span>
          </button>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Navigator Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 shadow-sm">
          <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Repository Files</span>
            <span className="text-[10px] text-slate-400 font-mono">8 Files</span>
          </div>

          <div className="space-y-1.5">
            {PYTHON_CODEBASE.map((file) => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg border transition flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-slate-800 text-white border-blue-500/60 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected ? 'text-blue-400' : 'text-slate-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-mono font-bold truncate">{file.filename}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {file.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content View (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-inner">
          {/* File Header Bar */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-xs font-mono font-bold text-white">
                  {selectedFile.filename}
                </span>
                <span className="text-[10px] text-slate-400 ml-2 font-mono uppercase bg-slate-800 px-1.5 py-0.2 rounded">
                  {selectedFile.language}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSingle}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          {/* Description banner */}
          <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-850 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-blue-400 font-medium">Summary:</span>
            <span>{selectedFile.description}</span>
          </div>

          {/* Code Text Area with Line Numbers */}
          <div className="p-4 font-mono text-xs overflow-x-auto text-slate-300 max-h-[580px] overflow-y-auto select-text scrollbar-thin scrollbar-thumb-slate-800 leading-relaxed">
            <pre>
              <code>
                {selectedFile.content.split('\n').map((line, idx) => (
                  <div key={idx} className="flex leading-5 hover:bg-slate-900/40 px-1 rounded">
                    <span className="w-9 text-slate-600 select-none text-right pr-4 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="flex-1 whitespace-pre">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
