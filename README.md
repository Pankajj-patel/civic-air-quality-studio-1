# Civic Air Quality Briefing Studio
> **AI-Driven Civic Intelligence for Local Authorities, Housing Societies, and Schools**

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

An AI-driven civic intelligence application that enables municipal ward officers, resident welfare associations (RWAs), and school administrators to turn raw, messy air quality data into actionable, role-tailored local interventions.

Every finding is **verifiably grounded** in deterministic underlying sensor data, while data gaps and sensor hardware glitches are flagged with an automated **Data Quality Index (DQI)**.

---

## 🌟 Key Capabilities

### 1. Robust Messy Ingestion & Data Hygiene Engine
- **Handles Real-World Chaotic Data**: Ingests inconsistent delimiters (commas, pipes, tabs), mixed header naming conventions (`PM 2.5`, `pm25_ugm3`, `SensorNode`), and missing readings.
- **Sensor Glitch & Outlier Auditing**: Automatically flags diagnostic sensor error codes (e.g., negative values like `-999`), stuck sensors repeating flatlined values, and extreme physical spikes.
- **Data Quality Index (DQI)**: Generates a clear 0–100 health score summarizing missing readings, data imputation, and hardware reliability.

### 2. Deterministic Grounding & Traceability Inspector
- **Zero-Hallucination Architecture**: Numerical averages, AQI category mappings (CPCB / EPA breakpoints), and deltas are deterministically calculated.
- **Row-Level Provenance**: Every claim and action item in the briefing cites specific record IDs (`REC_001`, `REC_042`).
- **Interactive UI Highlighting**: Clicking any evidence badge highlights the underlying sensor row in the live Ingestion Ledger.

### 3. Role-Conditioned Prioritized Action Matrix
Actions are automatically tailored to the decision-making authority of who is asking:
- **Ward Officer / Civic Authority**: Street mist water tankers, anti-smog guns, mechanized sweeping, construction stop-work notices, and heavy diesel truck diversions.
- **Housing Society / RWA**: Diesel generator (DG set) runtime rationing, internal driveway wet-sweeping, children's park evening closures, and garden waste burning bans.
- **School Principal & Administration**: Moving physical education indoors, suspending morning outdoor assemblies, strict bus engine shut-off enforcement at gates, and classroom HEPA filtration.
- **Community Health Clinic**: Triage readiness for acute asthma, COPD patient SMS broadcasts, and N95 distribution alerts.

### 4. Temporal Delta & Trend Tracker ($T$ vs $T-1$)
- Compares new sensor batches against the previous briefing cycle.
- Quantifies $\Delta$ AQI percentage (+% worsening or -% improving), detects peak hour shifts, and flags newly emerging vs. resolved hotspots.

### 5. Dual-Output Synthesis Studio
- **Internal Operational Briefing Note**: Technical executive summary, DQI metrics, root-cause hypotheses, spatial hotspot breakdown, and time-bound action checklists (0–4h, 4–12h, 24–48h) with department assignees.
- **Citizen Public Advisory**: Plain-language civic communication with:
  - **Adjustable Reading Level**: Switch between *Elementary / Plain English* (5th-grade reading level) and *Standard Civic Notice*.
  - **Targeted High-Risk Cohort Guidance**: Dedicated alert cards for **Children & Schools**, **Seniors & Older Adults**, **Asthma & Respiratory Patients**, and **Outdoor Workers**.
  - **Multi-Lingual Localization**: Instant toggle between **English**, **Hindi (हिंदी)**, and **Spanish (Español)**.
  - **One-Click WhatsApp / SMS Broadcast**: Ready-to-send formatted bulletin with emojis and structured bullet points.

---

## 🛠️ Architecture & Tech Stack

```text
src/
├── app/
│   ├── api/analyze/route.ts    # REST endpoint for data ingestion & briefing synthesis
│   ├── globals.css             # Tailwind v4 styles & dark theme definitions
│   ├── layout.tsx              # Root HTML shell & meta information
│   └── page.tsx                # Primary interactive Studio dashboard
├── components/
│   ├── Header.tsx              # Civic branding & active persona selector
│   ├── DataIngestionPane.tsx   # Raw table upload, paste area & sample dataset selector
│   ├── DataQualityBanner.tsx   # DQI score gauge, sensor health badges & audit log
│   ├── DeltaComparisonCard.tsx # Temporal trend diff, delta percentage & hotspot alerts
│   ├── TraceableDataTable.tsx  # Ingestion ledger with interactive row citation glow
│   ├── BriefingStudio.tsx      # Dual tabs: Internal Note & Multilingual Citizen Advisory
│   └── ExportModal.tsx         # PDF print preview, WhatsApp blast & JSON export
├── lib/
│   ├── constants.ts            # Persona configurations & realistic messy test datasets
│   ├── parser.ts               # Tabular hygiene engine, unit converter & AQI calculation
│   ├── delta.ts                # Temporal comparator (Snapshot T vs T-1)
│   └── generator.ts            # Grounded civic intelligence & localized advisory engine
└── types/
    └── index.ts                # Strict TypeScript domain interfaces
```

- **Frontend**: Next.js 16+ (App Router), React 19, Tailwind CSS, Lucide React
- **Backend / Processing**: Next.js Server Handlers, TypeScript, strict deterministic statistics
- **AI Synthesis**: Grounded Civic Intelligence Engine with JSON schema validation and zero-hallucination guardrails

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Launch
```bash
# 1. Clone repository
git clone https://github.com/Pankajj-patel/civic-air-quality-studio.git
cd civic-air-quality-studio

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the studio.

---

## 🧪 Testing with Real-World Civic Scenarios

The studio comes pre-loaded with three realistic scenarios that can be loaded in one click:
1. **Ward 12 Municipal Corridor**: Messy table with missing timestamps, mixed column headers (`PM 2.5 (ug/m3)`), and a stuck sensor at Ring Road Junction.
2. **Greenwood Heights RWA**: Micro-sensors showing evening grid failure, diesel generator exhaust accumulation, and garden smoldering.
3. **St. Jude School Cluster**: School gate sensors capturing diesel bus queue emissions, unpaved sports ground dust, and classroom indoor air differences.

---

## 📄 License
This project is open-source under the MIT License.
