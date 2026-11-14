import { DeltaAnalysis, NormalizedRecord, Hotspot } from '@/types';

export function calculateDelta(
  currentRecords: NormalizedRecord[],
  currentHotspots: Hotspot[],
  previousAQI?: number,
  previousDate?: string
): DeltaAnalysis {
  if (!previousAQI || currentRecords.length === 0) {
    return {
      hasPrevious: false,
      aqiDeltaPercentage: 0,
      trendDirection: 'stable',
      primaryChangeDriver: 'Baseline observation established (no prior snapshot available)',
      newHotspots: currentHotspots.map((h) => h.location),
      resolvedHotspots: [],
      summaryText: 'Initial baseline briefing recorded. Continuous monitoring active.',
    };
  }

  // Calculate current average AQI (excluding negative or glitch values)
  const validRecords = currentRecords.filter((r) => !r.isFlagged || r.pm25 > 0);
  const currentAvgAQI =
    validRecords.length > 0
      ? Math.round(validRecords.reduce((sum, r) => sum + r.aqi, 0) / validRecords.length)
      : 200;

  const diff = currentAvgAQI - previousAQI;
  const percentage = Math.round((diff / previousAQI) * 1000) / 10;

  let trendDirection: 'worsening' | 'improving' | 'stable' = 'stable';
  if (percentage > 5) trendDirection = 'worsening';
  else if (percentage < -5) trendDirection = 'improving';

  // Driver detection based on peak locations and time
  const topHotspot = currentHotspots[0];
  let primaryChangeDriver = 'General atmospheric stagnation';
  if (topHotspot) {
    const loc = topHotspot.location.toLowerCase();
    if (loc.includes('construction') || loc.includes('excavation')) {
      primaryChangeDriver = 'Uncontrolled construction dust & heavy excavation activity';
    } else if (loc.includes('depot') || loc.includes('gate') || loc.includes('flyover') || loc.includes('bus')) {
      primaryChangeDriver = 'Morning vehicular idling, heavy diesel trucks & traffic congestion';
    } else if (loc.includes('basement') || loc.includes('dg set') || loc.includes('generator')) {
      primaryChangeDriver = 'Diesel generator (DG set) exhaust accumulation during grid outage';
    } else if (loc.includes('garden') || loc.includes('waste') || loc.includes('drain')) {
      primaryChangeDriver = 'Open biomass / garden waste burning and localized smoldering';
    }
  }

  // Peak time detection
  const peakRecord = [...currentRecords].sort((a, b) => b.aqi - a.aqi)[0];
  const peakTimeText = peakRecord ? `Peak AQI reached ${peakRecord.aqi} around ${peakRecord.timestamp}` : undefined;

  let summaryText = '';
  if (trendDirection === 'worsening') {
    summaryText = `Air quality worsened by ${Math.abs(percentage)}% compared to ${previousDate || 'yesterday'} (AQI shifted from ${previousAQI} to ${currentAvgAQI}). Major escalation driven by ${primaryChangeDriver}.`;
  } else if (trendDirection === 'improving') {
    summaryText = `Air quality improved by ${Math.abs(percentage)}% compared to ${previousDate || 'yesterday'} (AQI dropped from ${previousAQI} to ${currentAvgAQI}). Dispersion supported by meteorological clearing and local suppression.`;
  } else {
    summaryText = `Air quality remained relatively stable (AQI ${currentAvgAQI} vs prior ${previousAQI}, Δ ${percentage}%). Continuous monitoring required around ${topHotspot?.location || 'key transit zones'}.`;
  }

  return {
    hasPrevious: true,
    previousBriefDate: previousDate || 'Previous Cycle',
    aqiDeltaPercentage: percentage,
    trendDirection,
    primaryChangeDriver,
    newHotspots: currentHotspots.slice(0, 2).map((h) => h.location),
    resolvedHotspots: [],
    peakHourShift: peakTimeText,
    summaryText,
  };
}
