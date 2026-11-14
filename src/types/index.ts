export type PersonaId = 'ward_officer' | 'housing_society' | 'school_admin' | 'health_clinic';

export interface PersonaConfig {
  id: PersonaId;
  title: string;
  subtitle: string;
  iconName: string;
  badge: string;
  focusArea: string;
  primaryActionTypes: string[];
}

export type AQICategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe' | 'Hazardous';

export interface DataQualityIssue {
  id: string;
  type: 'missing_timestamp' | 'negative_value' | 'stuck_sensor' | 'extreme_spike' | 'unit_mismatch' | 'unknown_column';
  severity: 'low' | 'medium' | 'high' | 'critical';
  rowNumber: number;
  recordId: string;
  column: string;
  rawText: string;
  description: string;
  actionTaken: string;
}

export interface DataQualityReport {
  score: number; // 0 to 100
  totalRowsParsed: number;
  validRows: number;
  flaggedRows: number;
  issues: DataQualityIssue[];
  missingValuesCount: number;
  imputedValuesCount: number;
  unreliableSensors: string[];
}

export interface NormalizedRecord {
  id: string; // REC_001, REC_002
  rawRowIndex: number;
  location: string;
  timestamp: string; // ISO or formatted time
  timeHour?: number;
  pm25: number; // standardized to µg/m³
  pm10?: number;
  aqi: number;
  aqiCategory: AQICategory;
  temperature?: number;
  humidity?: number;
  sensorId: string;
  isFlagged: boolean;
  flagReason?: string;
  isImputed: boolean;
  originalUnits: Record<string, string>;
}

export interface Hotspot {
  location: string;
  sensorId: string;
  peakAQI: number;
  avgAQI: number;
  peakTime: string;
  primaryPollutant: string;
  severity: AQICategory;
  evidenceRecordIds: string[];
}

export interface ActionItem {
  id: string;
  priority: 'Immediate (0-4 hrs)' | 'Short-Term (4-12 hrs)' | 'Medium-Term (24-48 hrs)';
  action: string;
  rationale: string;
  ownerDepartment: string;
  expectedImpact: string;
  evidenceRecordIds: string[];
  isCompleted?: boolean;
}

export interface DeltaAnalysis {
  hasPrevious: boolean;
  previousBriefDate?: string;
  aqiDeltaPercentage: number; // e.g. +14.2% or -8.5%
  trendDirection: 'worsening' | 'improving' | 'stable';
  primaryChangeDriver: string;
  newHotspots: string[];
  resolvedHotspots: string[];
  peakHourShift?: string; // e.g. "Shifted from 07:00 to 09:30"
  summaryText: string;
}

export interface VulnerableGroupAdvisories {
  childrenAndSchools: string[];
  seniorsAndElderly: string[];
  respiratoryAndAsthma: string[];
  outdoorWorkers: string[];
}

export interface CitizenAdvisory {
  headline: string;
  overallStatus: string;
  readingLevel: 'elementary' | 'standard';
  language: string;
  plainLanguageSummary: string;
  doAndDonts: {
    dos: string[];
    donts: string[];
  };
  vulnerableGroups: VulnerableGroupAdvisories;
  neighborhoodAlert: string;
  evidenceRecordIds: string[];
}

export interface InternalBriefingNote {
  documentRef: string;
  generatedAt: string;
  authorPersona: PersonaId;
  executiveSummary: string;
  dataQualitySummary: string;
  rootCauseHypothesis: string;
  hotspots: Hotspot[];
  actions: ActionItem[];
  regulatoryComplianceNotice: string;
  evidenceRecordIds: string[];
}

export interface AirQualityBriefing {
  id: string;
  title: string;
  timestamp: string;
  persona: PersonaId;
  overallAQI: number;
  overallCategory: AQICategory;
  dataQuality: DataQualityReport;
  delta: DeltaAnalysis;
  internalNote: InternalBriefingNote;
  citizenAdvisory: CitizenAdvisory;
  records: NormalizedRecord[];
}

export interface PreloadedDataset {
  id: string;
  name: string;
  tag: string;
  personaRecommended: PersonaId;
  description: string;
  rawText: string;
  previousSnapshotAQI?: number;
  previousSnapshotDate?: string;
}
