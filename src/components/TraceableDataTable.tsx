'use client';

import React, { useState } from 'react';
import { NormalizedRecord } from '@/types';
import {
  Table,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  Info,
} from 'lucide-react';

interface TraceableDataTableProps {
  records: NormalizedRecord[];
  highlightRecordIds: string[];
  onSelectRecord?: (rec: NormalizedRecord) => void;
}

export function TraceableDataTable({
  records,
  highlightRecordIds,
  onSelectRecord,
}: TraceableDataTableProps) {
  const [filterType, setFilterType] = useState<'all' | 'flagged' | 'highlighted'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter((r) => {
    if (filterType === 'flagged' && !r.isFlagged) return false;
    if (filterType === 'highlighted' && !highlightRecordIds.includes(r.id)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        r.location.toLowerCase().includes(term) ||
        r.sensorId.toLowerCase().includes(term) ||
        r.id.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">
            Traceable Normalized Ingestion Ledger
          </h3>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
            {records.length} records
          </span>
          {highlightRecordIds.length > 0 && (
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium animate-pulse">
              {highlightRecordIds.length} cited in active claim
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search location or sensor..."
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('flagged')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                filterType === 'flagged'
                  ? 'bg-rose-900/60 text-rose-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flagged Only
            </button>
            {highlightRecordIds.length > 0 && (
              <button
                onClick={() => setFilterType('highlighted')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                  filterType === 'highlighted'
                    ? 'bg-emerald-900/60 text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cited Only
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-72 rounded-xl border border-slate-800/80 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 sticky top-0 border-b border-slate-800 z-10">
            <tr>
              <th className="py-2.5 px-3">Record ID</th>
              <th className="py-2.5 px-3">Location / Zone</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">PM2.5 (µg/m³)</th>
              <th className="py-2.5 px-3">Est. AQI</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Sensor ID</th>
              <th className="py-2.5 px-3">Quality Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-500 italic">
                  No records match the current filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => {
                const isHighlighted = highlightRecordIds.includes(r.id);
                return (
                  <tr
                    key={r.id}
                    onClick={() => onSelectRecord && onSelectRecord(r)}
                    className={`transition-colors cursor-pointer ${
                      isHighlighted
                        ? 'bg-emerald-950/70 border-l-4 border-l-emerald-400 text-white'
                        : r.isFlagged
                        ? 'hover:bg-rose-950/30 bg-rose-950/10'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-emerald-400 flex items-center gap-1.5">
                      {isHighlighted && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      )}
                      {r.id}
                    </td>
                    <td className="py-2 px-3 font-sans font-medium text-slate-200">
                      {r.location}
                    </td>
                    <td className="py-2 px-3 text-slate-400">
                      {r.timestamp || 'N/A'}
                      {r.isImputed && (
                        <span className="ml-1 text-[9px] bg-slate-800 text-amber-300 px-1 py-0.2 rounded font-sans">
                          imputed
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-100">
                      {r.pm25 < 0 ? (
                        <span className="text-rose-400">ERROR ({r.pm25})</span>
                      ) : (
                        r.pm25
                      )}
                    </td>
                    <td className="py-2 px-3 font-bold text-white">{r.aqi}</td>
                    <td className="py-2 px-3 font-sans">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          r.aqiCategory === 'Severe' || r.aqiCategory === 'Hazardous'
                            ? 'bg-purple-500/20 text-purple-300'
                            : r.aqiCategory === 'Very Poor'
                            ? 'bg-rose-500/20 text-rose-300'
                            : r.aqiCategory === 'Poor'
                            ? 'bg-orange-500/20 text-orange-300'
                            : r.aqiCategory === 'Moderate'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {r.aqiCategory}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{r.sensorId}</td>
                    <td className="py-2 px-3 font-sans">
                      {r.isFlagged ? (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20"
                          title={r.flagReason}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {r.flagReason?.slice(0, 20)}...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          Clicking any observation or action badge in the briefing note highlights its source records above.
        </span>
        <span>Standardized scale: Indian National AQI / CPCB Breakpoints</span>
      </div>
    </div>
  );
}
