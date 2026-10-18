import React, { useState } from 'react';
import { WalmartProductRecord, ValidationCheckResult } from '../types/scraper';
import { runFullDatasetValidation } from '../utils/schemaValidator';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Upload,
  FileCheck,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ValidationSuiteProps {
  records: WalmartProductRecord[];
  onUploadCustomDataset?: (newRecords: WalmartProductRecord[]) => void;
}

export const ValidationSuite: React.FC<ValidationSuiteProps> = ({
  records,
  onUploadCustomDataset,
}) => {
  const [results, setResults] = useState<ValidationCheckResult[]>(() =>
    runFullDatasetValidation(records)
  );
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const passedCount = results.filter((r) => r.passed).length;
  const isAllPassed = passedCount === results.length;

  const handleRerun = () => {
    setResults(runFullDatasetValidation(records));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          setUploadError('Uploaded file must be a JSON array of product records.');
          return;
        }
        if (onUploadCustomDataset) {
          onUploadCustomDataset(parsed as WalmartProductRecord[]);
          setResults(runFullDatasetValidation(parsed as WalmartProductRecord[]));
        }
      } catch (err) {
        setUploadError(`JSON parse error: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded uppercase tracking-wider">
                Automated Quality Assurance
              </span>
              <span className="text-xs text-slate-400">Specification Acceptance Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              11-Point Scraper Acceptance & Schema Verification
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Validates dataset against every strict rule: 22-field exact sequence, zero nulls, approximate-weight exclusions,
              PPM formatting, deal classifications, zero duplicates, and store consistency.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Validate External JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleRerun}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-emerald-600/30 transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Re-run Suite</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Status Scorecard */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-base ${
                isAllPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {passedCount}/{results.length}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                {isAllPassed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All 11 Quality Assurance Gates Passed (100%)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{results.length - passedCount} Quality Gate(s) Failed</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Dataset verified against {records.length} records from Store #{records[0]?.store_name || '3170'}
              </p>
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold border ${
              isAllPassed
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-red-950 text-red-300 border-red-700'
            }`}
          >
            {isAllPassed ? 'CONTEST READY' : 'ACTION REQUIRED'}
          </span>
        </div>
      </div>

      {/* Check Cards */}
      <div className="space-y-3">
        {results.map((check, idx) => {
          const isExpanded = expandedCheckId === check.id;
          return (
            <div
              key={check.id}
              className={`bg-slate-900 border rounded-xl overflow-hidden transition ${
                check.passed
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-red-600/50 bg-red-950/10'
              }`}
            >
              <div
                onClick={() => setExpandedCheckId(isExpanded ? null : check.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="mt-0.5">
                    {check.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                      <h4 className="text-sm font-bold text-white tracking-tight">{check.name}</h4>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase font-semibold ${
                          check.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : check.severity === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {check.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{check.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {check.stats}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Validation Rule ID: <code className="text-blue-300">{check.id}</code></span>
                    <span>Status: <strong className={check.passed ? 'text-emerald-400' : 'text-red-400'}>{check.passed ? 'COMPLIANT' : 'VIOLATION'}</strong></span>
                  </div>

                  {check.failingSample && (
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-red-300 overflow-x-auto">
                      <span className="text-slate-400 text-[10px] block mb-1">Diagnostic Sample:</span>
                      {JSON.stringify(check.failingSample, null, 2)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
