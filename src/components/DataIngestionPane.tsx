'use client';

import React, { useState, useRef } from 'react';
import { PRELOADED_DATASETS } from '@/lib/constants';
import { PersonaId } from '@/types';
import {
  UploadCloud,
  FileSpreadsheet,
  History,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface DataIngestionPaneProps {
  rawText: string;
  setRawText: (text: string) => void;
  currentPersona: PersonaId;
  previousAQI: number | undefined;
  setPreviousAQI: (val: number | undefined) => void;
  previousDate: string;
  setPreviousDate: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onSelectDataset: (id: string) => void;
}

export function DataIngestionPane({
  rawText,
  setRawText,
  previousAQI,
  setPreviousAQI,
  previousDate,
  setPreviousDate,
  onAnalyze,
  isLoading,
  onSelectDataset,
}: DataIngestionPaneProps) {
  const [showPrevSettings, setShowPrevSettings] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setRawText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Raw Air Quality Ingestion Hub
          </h2>
          <p className="text-xs text-slate-400">
            Paste messy sensor tables, ragged CSVs, or select a pre-loaded municipal scenario.
          </p>
        </div>

        {/* Pre-loaded Scenarios */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider">
            Quick Load:
          </span>
          {PRELOADED_DATASETS.map((ds) => (
            <button
              key={ds.id}
              onClick={() => onSelectDataset(ds.id)}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-700/60 text-slate-300 border border-slate-700/80 transition font-medium"
              title={ds.description}
            >
              {ds.name.split('-')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea for Data Ingestion */}
      <div className="relative">
        <textarea
          rows={6}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`Paste messy CSV or table here...\nExample:\nLocation,Time,PM 2.5,Sensor\nGate 4,08:00,195,S-01\nRing Road,,280,S-02\nSchool Gate,08:30,-999,S-03`}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition placeholder:text-slate-600 resize-y"
        />

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.txt,.tsv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded border border-slate-700 flex items-center gap-1 transition"
            title="Upload CSV or TXT file"
          >
            <UploadCloud className="w-3 h-3" /> Upload File
          </button>
          {rawText && (
            <button
              onClick={() => setRawText('')}
              className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-red-400 text-[11px] rounded border border-slate-700 transition"
              title="Clear text"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Delta Baseline Controls */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrevSettings(!showPrevSettings)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            {showPrevSettings ? 'Hide Delta Baseline' : 'Set Previous Snapshot for Delta Comparison'}
          </button>

          {showPrevSettings && (
            <div className="flex items-center gap-2 ml-2">
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-500">Prior AQI:</span>
                <input
                  type="number"
                  value={previousAQI || ''}
                  onChange={(e) => setPreviousAQI(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 210"
                  className="w-16 bg-transparent text-xs text-amber-300 font-mono focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-500">Prior Date/Time:</span>
                <input
                  type="text"
                  value={previousDate}
                  onChange={(e) => setPreviousDate(e.target.value)}
                  placeholder="Yesterday 18:00"
                  className="w-28 bg-transparent text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Briefing Button */}
        <button
          onClick={onAnalyze}
          disabled={isLoading || !rawText.trim()}
          className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg ${
            isLoading || !rawText.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Synthesizing Civic Briefing...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Generate Civic Intelligence Brief
            </>
          )}
        </button>
      </div>
    </div>
  );
}
