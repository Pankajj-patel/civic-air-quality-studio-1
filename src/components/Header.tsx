'use client';

import React from 'react';
import { PERSONAS } from '@/lib/constants';
import { PersonaId } from '@/types';
import { Landmark, Building2, School, Activity, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentPersona: PersonaId;
  onPersonaChange: (p: PersonaId) => void;
  onOpenExport: () => void;
  hasBriefing: boolean;
}

export function Header({
  currentPersona,
  onPersonaChange,
  onOpenExport,
  hasBriefing,
}: HeaderProps) {
  const getIcon = (id: PersonaId) => {
    switch (id) {
      case 'ward_officer':
        return <Landmark className="w-4 h-4" />;
      case 'housing_society':
        return <Building2 className="w-4 h-4" />;
      case 'school_admin':
        return <School className="w-4 h-4" />;
      case 'health_clinic':
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo & Civic Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
            AQ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Civic Air Quality Briefing Studio
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" /> AI-Civic Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grounded tabular synthesis • Traceable interventions • Multilingual citizen advisories
            </p>
          </div>
        </div>

        {/* Persona Switcher Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1 hidden lg:inline">
            Active Persona:
          </span>
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex flex-wrap gap-1">
            {(Object.keys(PERSONAS) as PersonaId[]).map((pId) => {
              const p = PERSONAS[pId];
              const isActive = currentPersona === pId;
              return (
                <button
                  key={pId}
                  onClick={() => onPersonaChange(pId)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={p.subtitle}
                >
                  {getIcon(pId)}
                  <span>{p.title.split('/')[0].trim()}</span>
                </button>
              );
            })}
          </div>

          {/* Export / Share button */}
          {hasBriefing && (
            <button
              onClick={onOpenExport}
              className="ml-auto md:ml-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Export & Share
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
