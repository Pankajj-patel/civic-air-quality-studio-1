'use client';

import React, { useState } from 'react';
import {
  AirQualityBriefing,
  PersonaId,
  ActionItem,
} from '@/types';
import { PERSONAS } from '@/lib/constants';
import {
  FileText,
  Users,
  AlertTriangle,
  Clock,
  Building,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Languages,
  Share2,
  Copy,
  Check,
  Shield,
  HeartPulse,
  Baby,
  PersonStanding,
  HardHat,
  Sparkles,
} from 'lucide-react';

interface BriefingStudioProps {
  briefing: AirQualityBriefing;
  currentPersona: PersonaId;
  highlightRecordIds: string[];
  setHighlightRecordIds: (ids: string[]) => void;
  readingLevel: 'elementary' | 'standard';
  setReadingLevel: (lvl: 'elementary' | 'standard') => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export function BriefingStudio({
  briefing,
  currentPersona,
  highlightRecordIds,
  setHighlightRecordIds,
  readingLevel,
  setReadingLevel,
  language,
  setLanguage,
}: BriefingStudioProps) {
  const [activeTab, setActiveTab] = useState<'internal' | 'citizen'>('internal');
  const [copied, setCopied] = useState(false);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const personaConfig = PERSONAS[currentPersona];
  const { internalNote, citizenAdvisory } = briefing;

  const toggleAction = (id: string) => {
    setCompletedActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyWhatsAppAdvisory = () => {
    const text = `🚨 *CIVIC AIR QUALITY ADVISORY* 🚨
📍 *Status:* ${citizenAdvisory.overallStatus}
📢 *Alert:* ${citizenAdvisory.headline}

${citizenAdvisory.plainLanguageSummary}

✅ *RECOMMENDED ACTIONS:*
${citizenAdvisory.doAndDonts.dos.map((d) => `• ${d}`).join('\n')}

❌ *AVOID:*
${citizenAdvisory.doAndDonts.donts.map((d) => `• ${d}`).join('\n')}

⚠️ *CHILDREN & SCHOOLS:*
${citizenAdvisory.vulnerableGroups.childrenAndSchools.map((d) => `• ${d}`).join('\n')}

⚠️ *SENIORS & ASTHMA PATIENTS:*
${citizenAdvisory.vulnerableGroups.seniorsAndElderly.map((d) => `• ${d}`).join('\n')}

🏢 _Issued by ${personaConfig.title} via Civic Intelligence Studio_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Studio Header Tabs */}
      <div className="bg-slate-950 px-5 pt-4 pb-0 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('internal')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'internal'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Internal Briefing Note (Operational)
          </button>

          <button
            onClick={() => setActiveTab('citizen')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'citizen'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Citizen Public Advisory (Multi-Lingual)
          </button>
        </div>

        {/* Dynamic Controls based on tab */}
        {activeTab === 'citizen' ? (
          <div className="flex items-center gap-2 pb-3">
            {/* Reading Level Toggle */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
              <button
                onClick={() => setReadingLevel('elementary')}
                className={`px-2 py-1 rounded font-medium transition ${
                  readingLevel === 'elementary'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Simplified vocabulary suitable for children and fast comprehension"
              >
                Elementary / Plain
              </button>
              <button
                onClick={() => setReadingLevel('standard')}
                className={`px-2 py-1 rounded font-medium transition ${
                  readingLevel === 'standard'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Standard civic public notification format"
              >
                Standard Notice
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-900 text-slate-200">English</option>
                <option value="hi" className="bg-slate-900 text-slate-200">हिंदी (Hindi)</option>
                <option value="es" className="bg-slate-900 text-slate-200">Español (Spanish)</option>
              </select>
            </div>

            {/* Broadcast Copy */}
            <button
              onClick={copyWhatsAppAdvisory}
              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="Copy broadcast message formatted for WhatsApp / SMS"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Broadcast!' : 'WhatsApp Blast'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pb-3 text-xs text-slate-400">
            <span className="font-mono text-emerald-400 font-semibold">{internalNote.documentRef}</span>
            <span>• Issued: {internalNote.generatedAt}</span>
          </div>
        )}
      </div>

      {/* Tab Content 1: Internal Briefing Note */}
      {activeTab === 'internal' && (
        <div className="p-6 space-y-6">
          {/* Executive Header Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {personaConfig.badge}
                </span>
                <span className="text-xs text-slate-400">Target Role:</span>
                <span className="text-xs font-semibold text-white">{personaConfig.title}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1.5">
                Executive Action Directive & Grounded Synthesis
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {internalNote.executiveSummary}
              </p>
            </div>

            <div className="bg-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-800 text-right min-w-[190px]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Primary Focus Area
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {personaConfig.primaryActionTypes.join(' • ')}
              </span>
            </div>
          </div>

          {/* Root Cause & Data Quality Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
                Meteorological & Root Cause Hypothesis
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {internalNote.rootCauseHypothesis}
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                Data Grounding & Audit Summary
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {internalNote.dataQualitySummary}
              </p>
            </div>
          </div>

          {/* Hotspot Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Identified Spatial Hotspots & Evidence Citations
              </h4>
              <span className="text-[11px] text-slate-500">
                Click evidence badge to highlight underlying sensor rows
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-[11px] uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Hotspot Zone</th>
                    <th className="py-2.5 px-3">Peak AQI</th>
                    <th className="py-2.5 px-3">Peak Window</th>
                    <th className="py-2.5 px-3">Severity Bracket</th>
                    <th className="py-2.5 px-3">Grounded Evidence Citing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                  {internalNote.hotspots.map((h, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-semibold text-white">{h.location}</td>
                      <td className="py-2 px-3 font-mono font-bold text-amber-300">{h.peakAQI}</td>
                      <td className="py-2 px-3 text-slate-400">{h.peakTime}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                          {h.severity}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {h.evidenceRecordIds.map((recId) => (
                            <button
                              key={recId}
                              onClick={() => setHighlightRecordIds([recId])}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition ${
                                highlightRecordIds.includes(recId)
                                  ? 'bg-emerald-500 text-slate-950 font-bold'
                                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
                              }`}
                              title={`Inspect ${recId}`}
                            >
                              {recId}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prioritized Role-Specific Action Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Prioritized Action Checklist (Tailored for {personaConfig.title})
                </h4>
                <p className="text-xs text-slate-400">
                  Track operational deployment in real-time. Check off completed items.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {internalNote.actions.map((act) => {
                const isDone = !!completedActions[act.id];
                return (
                  <div
                    key={act.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleAction(act.id)}
                          className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-900 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                act.priority.includes('Immediate')
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {act.priority}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-500" />
                              {act.ownerDepartment}
                            </span>
                          </div>

                          <h5
                            className={`text-sm font-semibold mt-1 ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-100'
                            }`}
                          >
                            {act.action}
                          </h5>

                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            <span className="text-slate-300 font-medium">Rationale:</span>{' '}
                            {act.rationale}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="text-emerald-400 font-medium">
                              Expected Impact: {act.expectedImpact}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Evidence Pill */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-slate-500 uppercase">Evidence</span>
                        <div className="flex gap-1">
                          {act.evidenceRecordIds.map((recId) => (
                            <button
                              key={recId}
                              onClick={() => setHighlightRecordIds([recId])}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-mono font-medium"
                              title="Highlight data row"
                            >
                              {recId}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regulatory Compliance Footer */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              {internalNote.regulatoryComplianceNotice}
            </span>
            <span className="font-mono text-[11px] text-slate-500">GRAP Stage-III Active</span>
          </div>
        </div>
      )}

      {/* Tab Content 2: Citizen Public Advisory */}
      {activeTab === 'citizen' && (
        <div className="p-6 space-y-6">
          {/* Headline Banner */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {citizenAdvisory.overallStatus}
              </span>
              <span className="text-xs text-slate-400">
                Reading Level: <strong className="text-slate-200 capitalize">{readingLevel}</strong>
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white tracking-tight">
              {citizenAdvisory.headline}
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-3xl">
              {citizenAdvisory.plainLanguageSummary}
            </p>
          </div>

          {/* Dos and Don'ts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dos */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                What You Should Do (Dos)
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {citizenAdvisory.doAndDonts.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                What You Must Avoid (Don’ts)
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {citizenAdvisory.doAndDonts.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vulnerable Groups Special Care Section */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              Targeted Guidance for High-Risk & Vulnerable Populations
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Children & Schools */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Baby className="w-4 h-4 text-amber-400" />
                  <h5 className="text-xs font-bold text-white">Children & Schools</h5>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {citizenAdvisory.vulnerableGroups.childrenAndSchools.map((item, i) => (
                    <li key={i} className="leading-snug">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Seniors & Older Adults */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <PersonStanding className="w-4 h-4 text-emerald-400" />
                  <h5 className="text-xs font-bold text-white">Seniors & Older Adults</h5>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {citizenAdvisory.vulnerableGroups.seniorsAndElderly.map((item, i) => (
                    <li key={i} className="leading-snug">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Respiratory & Asthmatic */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <HeartPulse className="w-4 h-4 text-rose-400" />
                  <h5 className="text-xs font-bold text-white">Asthma & Lung Patients</h5>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {citizenAdvisory.vulnerableGroups.respiratoryAndAsthma.map((item, i) => (
                    <li key={i} className="leading-snug">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outdoor Workers */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <HardHat className="w-4 h-4 text-blue-400" />
                  <h5 className="text-xs font-bold text-white">Outdoor Staff</h5>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {citizenAdvisory.vulnerableGroups.outdoorWorkers.map((item, i) => (
                    <li key={i} className="leading-snug">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Localized Hotspot Notice */}
          <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-200">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              {citizenAdvisory.neighborhoodAlert}
            </span>
            <button
              onClick={copyWhatsAppAdvisory}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold whitespace-nowrap"
            >
              {copied ? 'Copied' : 'Share to WhatsApp'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
