'use client';

import React, { useState } from 'react';
import { AirQualityBriefing, PersonaConfig } from '@/types';
import {
  X,
  Printer,
  Share2,
  Download,
  FileCode,
  Check,
  Building,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: AirQualityBriefing;
  personaConfig: PersonaConfig;
}

export function ExportModal({
  isOpen,
  onClose,
  briefing,
  personaConfig,
}: ExportModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    const text = `🚨 *CIVIC AIR QUALITY ADVISORY* 🚨
📍 *Status:* ${briefing.citizenAdvisory.overallStatus}
📢 *Alert:* ${briefing.citizenAdvisory.headline}

${briefing.citizenAdvisory.plainLanguageSummary}

✅ *RECOMMENDED ACTIONS:*
${briefing.citizenAdvisory.doAndDonts.dos.map((d) => `• ${d}`).join('\n')}

❌ *AVOID:*
${briefing.citizenAdvisory.doAndDonts.donts.map((d) => `• ${d}`).join('\n')}

⚠️ *CHILDREN & SCHOOLS:*
${briefing.citizenAdvisory.vulnerableGroups.childrenAndSchools.map((d) => `• ${d}`).join('\n')}

⚠️ *SENIORS & ASTHMA PATIENTS:*
${briefing.citizenAdvisory.vulnerableGroups.seniorsAndElderly.map((d) => `• ${d}`).join('\n')}

🏢 _Issued by ${personaConfig.title} via Civic Air Quality Briefing Studio_`;

    navigator.clipboard.writeText(text);
    setCopiedType('whatsapp');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(briefing, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${briefing.internalNote.documentRef}_audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadMarkdown = () => {
    const md = `# ${briefing.title}
**Document Ref:** ${briefing.internalNote.documentRef}  
**Issued At:** ${briefing.internalNote.generatedAt}  
**Persona:** ${personaConfig.title}  
**Overall AQI:** ${briefing.overallAQI} (${briefing.overallCategory})  
**Data Quality Index (DQI):** ${briefing.dataQuality.score}/100  

## Executive Summary
${briefing.internalNote.executiveSummary}

## Root Cause & Meteorological Hypothesis
${briefing.internalNote.rootCauseHypothesis}

## Spatial Hotspots
${briefing.internalNote.hotspots.map(h => `- **${h.location}**: Peak AQI ${h.peakAQI} (${h.severity}) at ${h.peakTime}`).join('\n')}

## Prioritized Action Checklist
${briefing.internalNote.actions.map(a => `### [${a.priority}] ${a.action}
- **Department:** ${a.ownerDepartment}
- **Rationale:** ${a.rationale}
- **Expected Impact:** ${a.expectedImpact}
- **Evidence:** ${a.evidenceRecordIds.join(', ')}
`).join('\n')}

## Citizen Public Advisory
**Headline:** ${briefing.citizenAdvisory.headline}  
${briefing.citizenAdvisory.plainLanguageSummary}

### Dos:
${briefing.citizenAdvisory.doAndDonts.dos.map(d => `- ${d}`).join('\n')}

### Don'ts:
${briefing.citizenAdvisory.doAndDonts.donts.map(d => `- ${d}`).join('\n')}

---
*Grounded Civic AI Output with Deterministic Row Citations*
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `${briefing.internalNote.documentRef}_briefing.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Export Civic Briefing Package</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300">
            Share this briefing with municipal stakeholders, print an official directive, or broadcast an instant citizen advisory.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Print Official PDF */}
            <button
              onClick={handlePrint}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <Printer className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                <span className="text-[10px] uppercase font-bold text-slate-500">Official</span>
              </div>
              <h4 className="text-xs font-bold text-white">Print / Save as PDF</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Generates high-contrast printable municipal directive.
              </p>
            </button>

            {/* WhatsApp Broadcast */}
            <button
              onClick={handleCopyWhatsApp}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <Share2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  {copiedType === 'whatsapp' ? 'Copied!' : 'Instant'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">WhatsApp / SMS Blast</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Copies plain-language advisory formatted with emojis & bullet points.
              </p>
            </button>

            {/* Markdown Export */}
            <button
              onClick={handleDownloadMarkdown}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                <span className="text-[10px] uppercase font-bold text-slate-500">Markdown</span>
              </div>
              <h4 className="text-xs font-bold text-white">Download Markdown (.md)</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Full structured briefing for GitHub, Notion, or internal archives.
              </p>
            </button>

            {/* JSON Audit Trail */}
            <button
              onClick={handleDownloadJSON}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileCode className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                <span className="text-[10px] uppercase font-bold text-slate-500">Data API</span>
              </div>
              <h4 className="text-xs font-bold text-white">JSON Ingestion Audit Log</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Machine-readable schema with DQI score and row citations.
              </p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
