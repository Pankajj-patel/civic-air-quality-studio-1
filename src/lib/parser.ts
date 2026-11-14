import {
  NormalizedRecord,
  DataQualityReport,
  DataQualityIssue,
  AQICategory,
} from '@/types';

// Standard AQI breakpoint calculation based on PM2.5 (µg/m³)
export function calculateAQIFromPM25(pm25: number): { aqi: number; category: AQICategory } {
  if (pm25 < 0) return { aqi: 0, category: 'Good' };

  // Breakpoints: [Clow, Chigh, Ilow, Ihigh]
  let aqi = 0;
  if (pm25 <= 30) {
    aqi = Math.round((50 / 30) * pm25);
  } else if (pm25 <= 60) {
    aqi = Math.round(50 + ((100 - 50) / (60 - 30)) * (pm25 - 30));
  } else if (pm25 <= 90) {
    aqi = Math.round(100 + ((200 - 100) / (90 - 60)) * (pm25 - 60));
  } else if (pm25 <= 120) {
    aqi = Math.round(200 + ((300 - 200) / (120 - 90)) * (pm25 - 90));
  } else if (pm25 <= 250) {
    aqi = Math.round(300 + ((400 - 300) / (250 - 120)) * (pm25 - 120));
  } else {
    aqi = Math.round(400 + ((500 - 400) / (380 - 250)) * Math.min(pm25 - 250, 130));
  }

  let category: AQICategory = 'Good';
  if (aqi <= 50) category = 'Good';
  else if (aqi <= 100) category = 'Satisfactory';
  else if (aqi <= 200) category = 'Moderate';
  else if (aqi <= 300) category = 'Poor';
  else if (aqi <= 400) category = 'Very Poor';
  else if (aqi <= 450) category = 'Severe';
  else category = 'Hazardous';

  return { aqi, category };
}

export function parseRawAirQualityData(rawInput: string): {
  records: NormalizedRecord[];
  qualityReport: DataQualityReport;
} {
  const lines = rawInput
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const issues: DataQualityIssue[] = [];
  const records: NormalizedRecord[] = [];
  const sensorHistory: Record<string, number[]> = {};

  if (lines.length < 2) {
    return {
      records: [],
      qualityReport: {
        score: 0,
        totalRowsParsed: lines.length,
        validRows: 0,
        flaggedRows: 0,
        issues: [
          {
            id: 'ISSUE_EMPTY',
            type: 'unknown_column',
            severity: 'critical',
            rowNumber: 1,
            recordId: 'REC_NONE',
            column: 'All',
            rawText: rawInput,
            description: 'Data input has fewer than 2 rows (header + at least one data row required).',
            actionTaken: 'Rejected batch',
          },
        ],
        missingValuesCount: 0,
        imputedValuesCount: 0,
        unreliableSensors: [],
      },
    };
  }

  // Sniff delimiter: check comma, pipe, tab, semicolon
  const headerLine = lines[0];
  let delimiter = ',';
  if (headerLine.includes('|')) delimiter = '|';
  else if (headerLine.includes('\t')) delimiter = '\t';
  else if (headerLine.includes(';') && !headerLine.includes(',')) delimiter = ';';

  const rawHeaders = headerLine.split(delimiter).map((h) => h.trim().toLowerCase());

  // Helper index lookups with fuzzy matching
  const findHeaderIndex = (keywords: string[]) => {
    return rawHeaders.findIndex((h) =>
      keywords.some((kw) => h.includes(kw) || kw.includes(h))
    );
  };

  const locIdx = findHeaderIndex(['location', 'zone', 'campus', 'site', 'area', 'station', 'place']);
  const timeIdx = findHeaderIndex(['time', 'stamp', 'timestamp', 'hour', 'date', 'datetime']);
  const pm25Idx = findHeaderIndex(['pm 2.5', 'pm2.5', 'pm25', 'pm_25', 'particulate']);
  const pm10Idx = findHeaderIndex(['pm10', 'pm 10', 'pm_10']);
  const sensorIdx = findHeaderIndex(['sensor', 'node', 'device', 'id']);
  const tempIdx = findHeaderIndex(['temp', 'temperature']);

  let missingValuesCount = 0;
  let imputedValuesCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cells = rawLine.split(delimiter).map((c) => c.trim());
    const recId = `REC_${String(i).padStart(3, '0')}`;
    let isFlagged = false;
    let flagReason: string | undefined = undefined;
    let isImputed = false;

    // Extract Location
    let location = locIdx !== -1 && cells[locIdx] ? cells[locIdx] : `Zone ${i}`;

    // Extract Timestamp
    let timestamp = timeIdx !== -1 && cells[timeIdx] ? cells[timeIdx] : '';
    if (!timestamp) {
      missingValuesCount++;
      // Impute timestamp based on previous row if available
      const prevRec = records[records.length - 1];
      if (prevRec && prevRec.timestamp) {
        timestamp = `${prevRec.timestamp} (approx +15m)`;
        isImputed = true;
        imputedValuesCount++;
        issues.push({
          id: `ISSUE_TIME_${i}`,
          type: 'missing_timestamp',
          severity: 'medium',
          rowNumber: i + 1,
          recordId: recId,
          column: 'Timestamp',
          rawText: rawLine,
          description: `Row ${i + 1} has missing timestamp. Imputed based on previous row.`,
          actionTaken: 'Imputed relative time',
        });
      } else {
        timestamp = `Reading #${i}`;
        issues.push({
          id: `ISSUE_TIME_UNK_${i}`,
          type: 'missing_timestamp',
          severity: 'high',
          rowNumber: i + 1,
          recordId: recId,
          column: 'Timestamp',
          rawText: rawLine,
          description: `Row ${i + 1} timestamp missing and could not be imputed.`,
          actionTaken: 'Flagged missing timestamp',
        });
      }
    }

    // Extract PM2.5
    let rawPm25Str = pm25Idx !== -1 && cells[pm25Idx] !== undefined ? cells[pm25Idx] : '';
    let pm25 = parseFloat(rawPm25Str);

    if (isNaN(pm25)) {
      missingValuesCount++;
      isFlagged = true;
      flagReason = 'Invalid/Non-numeric PM2.5 value';
      issues.push({
        id: `ISSUE_PM25_NAN_${i}`,
        type: 'unknown_column',
        severity: 'high',
        rowNumber: i + 1,
        recordId: recId,
        column: 'PM2.5',
        rawText: rawLine,
        description: `Invalid reading '${rawPm25Str}'. Set to median fallback.`,
        actionTaken: 'Excluded from primary average calculation',
      });
      pm25 = 150; // default safe baseline fallback
    } else if (pm25 < 0) {
      // Negative reading (-999, -1) sensor error code
      isFlagged = true;
      flagReason = `Negative sensor error code (${pm25})`;
      issues.push({
        id: `ISSUE_PM25_NEG_${i}`,
        type: 'negative_value',
        severity: 'critical',
        rowNumber: i + 1,
        recordId: recId,
        column: 'PM2.5',
        rawText: rawLine,
        description: `Negative sensor reading (${pm25}) indicates diagnostic error code.`,
        actionTaken: 'Flagged as sensor glitch',
      });
      pm25 = 0;
    } else if (pm25 > 800) {
      isFlagged = true;
      flagReason = `Extreme outlier spike (${pm25} µg/m³) - potential sensor saturation`;
      issues.push({
        id: `ISSUE_PM25_SPIKE_${i}`,
        type: 'extreme_spike',
        severity: 'medium',
        rowNumber: i + 1,
        recordId: recId,
        column: 'PM2.5',
        rawText: rawLine,
        description: `Extreme measurement spike of ${pm25} µg/m³ recorded.`,
        actionTaken: 'Retained for audit but flagged for human verification',
      });
    }

    // Extract Sensor ID
    const sensorId = sensorIdx !== -1 && cells[sensorIdx] ? cells[sensorIdx] : `NODE-${location.slice(0, 4).toUpperCase()}`;

    // Track stuck sensor (repeated identical readings)
    if (!sensorHistory[sensorId]) sensorHistory[sensorId] = [];
    sensorHistory[sensorId].push(pm25);

    if (sensorHistory[sensorId].length >= 3) {
      const recent = sensorHistory[sensorId].slice(-3);
      if (recent[0] === recent[1] && recent[1] === recent[2] && pm25 > 50) {
        isFlagged = true;
        flagReason = 'Sensor flatline / stuck reading detected across 3+ consecutive reports';
        issues.push({
          id: `ISSUE_STUCK_${sensorId}_${i}`,
          type: 'stuck_sensor',
          severity: 'high',
          rowNumber: i + 1,
          recordId: recId,
          column: 'Sensor_ID',
          rawText: rawLine,
          description: `Sensor ${sensorId} repeated identical value (${pm25} µg/m³) 3 times consecutively.`,
          actionTaken: 'Flagged for hardware recalibration',
        });
      }
    }

    // Extract PM10 if present
    let pm10: number | undefined = undefined;
    if (pm10Idx !== -1 && cells[pm10Idx]) {
      const val = parseFloat(cells[pm10Idx]);
      if (!isNaN(val) && val >= 0) pm10 = val;
    }

    // Extract Temperature if present
    let temperature: number | undefined = undefined;
    if (tempIdx !== -1 && cells[tempIdx]) {
      const val = parseFloat(cells[tempIdx]);
      if (!isNaN(val)) temperature = val;
    }

    const { aqi, category } = calculateAQIFromPM25(pm25);

    records.push({
      id: recId,
      rawRowIndex: i + 1,
      location,
      timestamp,
      pm25,
      pm10,
      aqi,
      aqiCategory: category,
      temperature,
      sensorId,
      isFlagged,
      flagReason,
      isImputed,
      originalUnits: { pm25: 'µg/m³' },
    });
  }

  // Calculate Data Quality Score
  const totalRows = lines.length - 1;
  const flaggedCount = records.filter((r) => r.isFlagged).length;
  const criticalCount = issues.filter((iss) => iss.severity === 'critical').length;
  const highCount = issues.filter((iss) => iss.severity === 'high').length;

  let score = 100;
  score -= criticalCount * 15;
  score -= highCount * 8;
  score -= missingValuesCount * 4;
  score = Math.max(10, Math.min(100, Math.round(score)));

  // Identify unreliable sensors
  const unreliableSensors = Array.from(
    new Set(
      issues
        .filter((iss) => iss.type === 'stuck_sensor' || iss.type === 'negative_value')
        .map((iss) => {
          const rec = records.find((r) => r.id === iss.recordId);
          return rec ? rec.sensorId : '';
        })
        .filter(Boolean)
    )
  );

  return {
    records,
    qualityReport: {
      score,
      totalRowsParsed: totalRows,
      validRows: totalRows - flaggedCount,
      flaggedRows: flaggedCount,
      issues,
      missingValuesCount,
      imputedValuesCount,
      unreliableSensors,
    },
  };
}
