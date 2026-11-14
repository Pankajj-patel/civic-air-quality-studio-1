'use client';

import React, { useState } from 'react';
import { DataQualityReport } from '@/types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Clock,
  Layers,
} from 'lucide-react';

interface DataQualityBannerProps {
  report: DataQualityReport;
}

export function DataQualityBanner({ report }: DataQualityBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: DQI Score & Status */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-mono font-bold ${getScoreColor(
              report.score
            )}`}
          >
            <span className="text-lg leading-none">{report.score}</span>
            <span className="text-[10px] tracking-widest opacity-80 uppercase">DQI</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                {report.score >= 85 ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                )}
                Data Quality Index & Sensor Health
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getScoreColor(
                  report.score
                )}`}
              >
                {report.score >= 85
                  ? 'High Reliability'
                  : report.score >= 65
                  ? 'Moderate Quality • Flawed Units'
                  : 'Degraded Sensor Grid'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Audited {report.totalRowsParsed} tabular rows • {report.validRows} verified valid •{' '}
              {report.flaggedRows} flagged for sensor glitches or unit anomalies.
            </p>
          </div>
        </div>

        {/* Right: Summary Badges & Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {report.unreliableSensors.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              <Cpu className="w-3.5 h-3.5" />
              <span>Glitched Sensors: {report.unreliableSensors.join(', ')}</span>
            </div>
          )}

          {report.missingValuesCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{report.missingValuesCount} Missing Values (Handled)</span>
            </div>
          )}

          {report.issues.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1 transition ml-auto"
            >
              <span>{isExpanded ? 'Hide Audit Log' : `Inspect ${report.issues.length} Audit Flags`}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Issues Inspector */}
      {isExpanded && report.issues.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Automated Data Cleaning & Outlier Audit Log
            </span>
            <span className="text-[11px] text-slate-500">
              Deterministic corrections applied before AI briefing synthesis
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Row</th>
                  <th className="py-2 px-3">Record ID</th>
                  <th className="py-2 px-3">Issue Type</th>
                  <th className="py-2 px-3">Severity</th>
                  <th className="py-2 px-3">Diagnostic Description</th>
                  <th className="py-2 px-3">Sanitization Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {report.issues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-slate-900/50">
                    <td className="py-2 px-3 text-slate-400">#{iss.rowNumber}</td>
                    <td className="py-2 px-3 text-emerald-400 font-semibold">{iss.recordId}</td>
                    <td className="py-2 px-3 text-slate-300 capitalize">{iss.type.replace('_', ' ')}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          iss.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : iss.severity === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {iss.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-300">{iss.description}</td>
                    <td className="py-2 px-3 font-sans text-emerald-300">{iss.actionTaken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
