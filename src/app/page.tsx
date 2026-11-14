'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DataIngestionPane } from '@/components/DataIngestionPane';
import { DataQualityBanner } from '@/components/DataQualityBanner';
import { DeltaComparisonCard } from '@/components/DeltaComparisonCard';
import { TraceableDataTable } from '@/components/TraceableDataTable';
import { BriefingStudio } from '@/components/BriefingStudio';
import { ExportModal } from '@/components/ExportModal';
import { PRELOADED_DATASETS, PERSONAS } from '@/lib/constants';
import { PersonaId, AirQualityBriefing } from '@/types';
import { parseRawAirQualityData } from '@/lib/parser';
import { generateAirQualityBriefing } from '@/lib/generator';
import { AlertCircle, Sparkles } from 'lucide-react';

export default function Home() {
  const [currentPersona, setCurrentPersona] = useState<PersonaId>('ward_officer');
  const [rawText, setRawText] = useState<string>(PRELOADED_DATASETS[0].rawText);
  const [previousAQI, setPreviousAQI] = useState<number | undefined>(PRELOADED_DATASETS[0].previousSnapshotAQI);
  const [previousDate, setPreviousDate] = useState<string>(PRELOADED_DATASETS[0].previousSnapshotDate || '');
  const [readingLevel, setReadingLevel] = useState<'elementary' | 'standard'>('standard');
  const [language, setLanguage] = useState<string>('en');

  const [briefing, setBriefing] = useState<AirQualityBriefing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [highlightRecordIds, setHighlightRecordIds] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Initial synthesis on mount
  useEffect(() => {
    handleRunAnalysis(PRELOADED_DATASETS[0].rawText, 'ward_officer', PRELOADED_DATASETS[0].previousSnapshotAQI, PRELOADED_DATASETS[0].previousSnapshotDate, 'standard', 'en');
  }, []);

  const handleRunAnalysis = (
    inputText = rawText,
    persona = currentPersona,
    prevAQI = previousAQI,
    prevDate = previousDate,
    readLvl = readingLevel,
    lang = language
  ) => {
    if (!inputText.trim()) {
      setErrorMessage('Please provide or paste air quality data to analyze.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Deterministic Hygiene Parsing
      const { records, qualityReport } = parseRawAirQualityData(inputText);

      if (records.length === 0) {
        setErrorMessage('Could not parse any valid records from the provided table. Please verify data format.');
        setIsLoading(false);
        return;
      }

      // 2. Generate Civic Briefing
      const generated = generateAirQualityBriefing(
        records,
        qualityReport,
        persona,
        prevAQI,
        prevDate,
        readLvl,
        lang
      );

      setBriefing(generated);
      setHighlightRecordIds([]);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('An unexpected error occurred during data analysis. Please check tabular formatting.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaChange = (pId: PersonaId) => {
    setCurrentPersona(pId);
    if (rawText.trim()) {
      handleRunAnalysis(rawText, pId, previousAQI, previousDate, readingLevel, language);
    }
  };

  const handleSelectDataset = (id: string) => {
    const ds = PRELOADED_DATASETS.find((d) => d.id === id);
    if (!ds) return;

    setRawText(ds.rawText);
    setCurrentPersona(ds.personaRecommended);
    setPreviousAQI(ds.previousSnapshotAQI);
    setPreviousDate(ds.previousSnapshotDate || '');

    handleRunAnalysis(
      ds.rawText,
      ds.personaRecommended,
      ds.previousSnapshotAQI,
      ds.previousSnapshotDate || '',
      readingLevel,
      language
    );
  };

  const handleReadingLevelChange = (lvl: 'elementary' | 'standard') => {
    setReadingLevel(lvl);
    if (briefing) {
      handleRunAnalysis(rawText, currentPersona, previousAQI, previousDate, lvl, language);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (briefing) {
      handleRunAnalysis(rawText, currentPersona, previousAQI, previousDate, readingLevel, lang);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navigation Header */}
      <Header
        currentPersona={currentPersona}
        onPersonaChange={handlePersonaChange}
        onOpenExport={() => setIsExportOpen(true)}
        hasBriefing={!!briefing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification */}
        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-4 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Ingestion Hub */}
        <DataIngestionPane
          rawText={rawText}
          setRawText={setRawText}
          currentPersona={currentPersona}
          previousAQI={previousAQI}
          setPreviousAQI={setPreviousAQI}
          previousDate={previousDate}
          setPreviousDate={setPreviousDate}
          onAnalyze={() => handleRunAnalysis()}
          isLoading={isLoading}
          onSelectDataset={handleSelectDataset}
        />

        {/* Section 2: Data Quality & Delta Cards */}
        {briefing && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataQualityBanner report={briefing.dataQuality} />
            <DeltaComparisonCard
              delta={briefing.delta}
              overallAQI={briefing.overallAQI}
              overallCategory={briefing.overallCategory}
            />
          </div>
        )}

        {/* Section 3: Traceable Data Ledger */}
        {briefing && (
          <TraceableDataTable
            records={briefing.records}
            highlightRecordIds={highlightRecordIds}
            onSelectRecord={(rec) => setHighlightRecordIds([rec.id])}
          />
        )}

        {/* Section 4: Dual Briefing Studio (Internal Note vs Citizen Advisory) */}
        {briefing && (
          <BriefingStudio
            briefing={briefing}
            currentPersona={currentPersona}
            highlightRecordIds={highlightRecordIds}
            setHighlightRecordIds={setHighlightRecordIds}
            readingLevel={readingLevel}
            setReadingLevel={handleReadingLevelChange}
            language={language}
            setLanguage={handleLanguageChange}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Civic Air Quality Briefing Studio • Grounded AI for Municipal & Community Resilience</span>
          <span className="font-mono text-[11px] text-slate-600">Built with Next.js 16, TypeScript & Tailwind CSS</span>
        </div>
      </footer>

      {/* Export & Broadcast Modal */}
      {briefing && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          briefing={briefing}
          personaConfig={PERSONAS[currentPersona]}
        />
      )}
    </div>
  );
}
