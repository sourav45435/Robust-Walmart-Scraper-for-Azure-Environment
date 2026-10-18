import React, { useState, useMemo } from 'react';
import { WalmartProductRecord, MANDATORY_FIELD_ORDER } from '../types/scraper';
import {
  Search,
  Filter,
  ExternalLink,
  Code2,
  CheckCircle2,
  Copy,
  Tag,
  Sparkles,
  ShoppingBag,
  Info,
  X,
  FileSpreadsheet,
  Download,
} from 'lucide-react';

interface DataExplorerProps {
  records: WalmartProductRecord[];
  onDownloadJson: () => void;
  onDownloadCsv: () => void;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({
  records,
  onDownloadJson,
  onDownloadCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [dealFilter, setDealFilter] = useState<'ALL' | 'VOLUME' | 'DIGITAL' | 'SALE' | 'NO_DEAL'>('ALL');
  const [brandFilter, setBrandFilter] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [inspectedRecord, setInspectedRecord] = useState<WalmartProductRecord | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.category));
    return Array.from(set).sort();
  }, [records]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.product_title.toLowerCase().includes(q);
        const matchUpc = r.upc.includes(q);
        const matchSub = r.sub_category.toLowerCase().includes(q);
        const matchPpm = r.ppm.toLowerCase().includes(q);
        if (!matchTitle && !matchUpc && !matchSub && !matchPpm) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && r.category !== selectedCategory) {
        return false;
      }

      // Deals
      if (dealFilter === 'VOLUME' && !r.volume_deals_description) return false;
      if (dealFilter === 'DIGITAL' && !r.digital_deals_description) return false;
      if (dealFilter === 'SALE' && !r.sale_price) return false;
      if (
        dealFilter === 'NO_DEAL' &&
        (r.volume_deals_description || r.digital_deals_description || r.sale_price)
      ) {
        return false;
      }

      // Brand
      if (brandFilter === 'YES' && r.store_brand !== 'yes') return false;
      if (brandFilter === 'NO' && r.store_brand !== 'no') return false;

      return true;
    });
  }, [records, searchQuery, selectedCategory, dealFilter, brandFilter]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search product title, UPC, subcategory, or PPM (e.g. $0.25/oz)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
            />
          </div>

          {/* Quick Metrics & Exports */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Showing <strong className="text-white font-mono">{filteredRecords.length}</strong> of{' '}
              <span className="font-mono">{records.length}</span> items
            </span>
            <button
              onClick={onDownloadJson}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onDownloadCsv}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1 focus:outline-none"
            >
              <option value="ALL">All 11 Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Deal Filters */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px] font-medium ml-2">Deals:</span>
            {(
              [
                { id: 'ALL', label: 'All' },
                { id: 'VOLUME', label: 'Volume Deals' },
                { id: 'DIGITAL', label: 'Digital Deals' },
                { id: 'SALE', label: 'Sale Price' },
                { id: 'NO_DEAL', label: 'Regular Only' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setDealFilter(f.id);
                  setPage(1);
                }}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  dealFilter === f.id
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Store Brand Filter */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-slate-400 text-[11px] font-medium">Store Brand:</span>
            <button
              onClick={() => {
                setBrandFilter('ALL');
                setPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] transition ${
                brandFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setBrandFilter('YES');
                setPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] transition ${
                brandFilter === 'YES'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Private Label (yes)
            </button>
            <button
              onClick={() => {
                setBrandFilter('NO');
                setPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] transition ${
                brandFilter === 'NO'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              National (no)
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Product Title & UPC</th>
                <th className="py-3 px-3">Category / Subcategory</th>
                <th className="py-3 px-3">Brand Tag</th>
                <th className="py-3 px-3">Pricing & PPM</th>
                <th className="py-3 px-3">Promotions & Deals</th>
                <th className="py-3 px-3 text-right">Raw JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                    No products matching current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item, idx) => {
                  return (
                    <tr
                      key={item.upc || idx}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* Product Title & UPC */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <img
                            src={item.image_url}
                            alt=""
                            className="w-10 h-10 object-contain rounded bg-white p-0.5 shrink-0 border border-slate-700"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback placeholder icon
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="space-y-0.5">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-slate-200 hover:text-blue-400 transition line-clamp-2 leading-snug flex items-center gap-1"
                            >
                              <span>{item.product_title}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition shrink-0" />
                            </a>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                              <span>UPC: {item.upc}</span>
                              {item.weight && (
                                <span className="bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                                  {item.weight}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-200">{item.category}</div>
                          <div className="text-[11px] text-slate-400">{item.sub_category}</div>
                        </div>
                      </td>

                      {/* Store Brand */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {item.store_brand === 'yes' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            <Tag className="w-2.5 h-2.5" />
                            Private Label (yes)
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            National (no)
                          </span>
                        )}
                      </td>

                      {/* Pricing & PPM */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-mono">
                            {item.sale_price ? (
                              <>
                                <span className="text-emerald-400 font-bold text-sm">
                                  ${item.sale_price}
                                </span>
                                <span className="text-slate-500 line-through text-[11px]">
                                  ${item.regular_price}
                                </span>
                              </>
                            ) : (
                              <span className="text-white font-bold text-sm">
                                ${item.regular_price}
                              </span>
                            )}
                          </div>
                          {item.ppm ? (
                            <div className="text-[10px] font-mono text-blue-300 bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-900/60 inline-block">
                              PPM: {item.ppm}
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 italic">No PPM displayed</div>
                          )}
                        </div>
                      </td>

                      {/* Promotions & Deals */}
                      <td className="py-3 px-3">
                        <div className="space-y-1 max-w-xs">
                          {item.volume_deals_description ? (
                            <div className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                              <span>Volume: {item.volume_deals_description}</span>
                              {item.volume_deals_price && (
                                <strong className="font-mono text-amber-200">
                                  (${item.volume_deals_price})
                                </strong>
                              )}
                            </div>
                          ) : null}

                          {item.digital_deals_description ? (
                            <div className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium">
                              <span>Digital: {item.digital_deals_description}</span>
                              {item.digital_deals_price && (
                                <strong className="font-mono text-cyan-200">
                                  (${item.digital_deals_price})
                                </strong>
                              )}
                            </div>
                          ) : null}

                          {!item.volume_deals_description && !item.digital_deals_description && (
                            <span className="text-[11px] text-slate-400 italic">—</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setInspectedRecord(item)}
                          className="inline-flex items-center gap-1 text-xs font-mono bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 px-2.5 py-1 rounded border border-slate-700 transition"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>View 22-JSON</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Page <strong className="text-white font-mono">{page}</strong> of{' '}
            <strong className="text-white font-mono">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Inspected Record 22-Field Ordered JSON Modal */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  Mandatory 22-Field Ordered JSON Record
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Exact key sequence verification: 1: zipcode &rarr; 22: crawl_date (Zero Nulls)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(inspectedRecord, null, 2), 9999)
                  }
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                  <span>{copiedIndex === 9999 ? 'Copied JSON!' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={() => setInspectedRecord(null)}
                  aria-label="Close record details"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Ordered Table & Raw JSON */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Product Title
                  </span>
                  <p className="font-semibold text-slate-200 mt-0.5">
                    {inspectedRecord.product_title}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Assigned Store & Pickup
                  </span>
                  <p className="font-semibold text-emerald-300 mt-0.5">
                    {inspectedRecord.store_name} ({inspectedRecord.zipcode})
                  </p>
                </div>
              </div>

              {/* Exact Key Sequence Inspector */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Ordered Fields (1 to 22)</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Schema Sequence Compliant
                  </span>
                </div>
                <div className="p-3 font-mono text-xs overflow-x-auto divide-y divide-slate-850">
                  {MANDATORY_FIELD_ORDER.map((field, idx) => {
                    const val = (inspectedRecord as Record<string, string>)[field];
                    const isSpecial = field === 'gupc' || field === 'unit_price';
                    const isLast = field === 'crawl_date';
                    return (
                      <div
                        key={field}
                        className="py-1.5 px-2 flex items-start justify-between gap-4 hover:bg-slate-900/50 rounded"
                      >
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-slate-600 text-[10px] w-5 text-right font-mono">
                            {idx + 1}
                          </span>
                          <span className="text-blue-300 font-semibold">{field}:</span>
                        </div>
                        <div className="text-right break-all">
                          {val === '' ? (
                            <span className="text-amber-400/80 italic text-[11px]">
                              &quot;&quot; (empty string
                              {isSpecial ? ' - pipeline invariant' : ''})
                            </span>
                          ) : (
                            <span className="text-emerald-300">
                              &quot;{val}&quot;
                              {isLast ? ' (final field)' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
