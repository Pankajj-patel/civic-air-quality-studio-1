'use client';

import React from 'react';
import { DeltaAnalysis, AQICategory } from '@/types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertOctagon,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface DeltaComparisonCardProps {
  delta: DeltaAnalysis;
  overallAQI: number;
  overallCategory: AQICategory;
}

export function DeltaComparisonCard({
  delta,
  overallAQI,
  overallCategory,
}: DeltaComparisonCardProps) {
  const getCategoryColor = (cat: AQICategory) => {
    switch (cat) {
      case 'Good':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Satisfactory':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Moderate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Poor':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Very Poor':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Severe':
      case 'Hazardous':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {/* Metric 1: Current AQI Snapshot */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center font-mono">
            <span className="text-2xl font-black text-white">{overallAQI}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">AQI</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Current Status
            </span>
            <span
              className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCategoryColor(
                overallCategory
              )}`}
            >
              {overallCategory}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Primary Driver: PM2.5 Fine Particles
            </p>
          </div>
        </div>

        {/* Metric 2: Temporal Delta (What Changed) */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Delta Since Last Brief
            </span>
            {delta.trendDirection === 'worsening' ? (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                <TrendingUp className="w-3.5 h-3.5" /> +{delta.aqiDeltaPercentage}% Worsened
              </span>
            ) : delta.trendDirection === 'improving' ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <TrendingDown className="w-3.5 h-3.5" /> {delta.aqiDeltaPercentage}% Improved
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                <Minus className="w-3.5 h-3.5" /> Stable Baseline
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-slate-300">
            {delta.hasPrevious ? (
              <p className="line-clamp-2">{delta.summaryText}</p>
            ) : (
              <p className="text-slate-500 italic">No prior snapshot recorded for this sector.</p>
            )}
          </div>

          {delta.peakHourShift && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-amber-300">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{delta.peakHourShift}</span>
            </div>
          )}
        </div>

        {/* Metric 3: Active Spatial Hotspot */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              Primary Emission Hotspot
            </span>
          </div>

          <div className="mt-2">
            <h4 className="text-sm font-bold text-white">
              {delta.newHotspots[0] || 'Central Transit Junction'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Source: <span className="text-slate-200">{delta.primaryChangeDriver}</span>
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1 text-[11px] text-slate-400">
            <span>Mandatory action required under Stage-III Clean Air directive</span>
            <ArrowRight className="w-3 h-3 ml-auto text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
