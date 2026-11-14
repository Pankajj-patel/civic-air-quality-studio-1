import { NextRequest, NextResponse } from 'next/server';
import { parseRawAirQualityData } from '@/lib/parser';
import { generateAirQualityBriefing } from '@/lib/generator';
import { PersonaId } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      rawText,
      persona = 'ward_officer',
      previousSnapshotAQI,
      previousSnapshotDate,
      readingLevel = 'standard',
      language = 'en',
    } = body;

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No air quality data provided. Please paste or upload a CSV or tabular dataset.' },
        { status: 400 }
      );
    }

    // 1. Deterministic Ingestion & Hygiene Parsing
    const { records, qualityReport } = parseRawAirQualityData(rawText);

    if (records.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to extract valid data records. Please ensure input has headers and tabular values.',
          qualityReport,
        },
        { status: 422 }
      );
    }

    // 2. Generate Grounded Briefing & Citizen Advisory
    const briefing = generateAirQualityBriefing(
      records,
      qualityReport,
      persona as PersonaId,
      previousSnapshotAQI ? Number(previousSnapshotAQI) : undefined,
      previousSnapshotDate,
      readingLevel as 'elementary' | 'standard',
      language
    );

    return NextResponse.json({
      success: true,
      briefing,
    });
  } catch (error: unknown) {
    console.error('Analysis error:', error);
    const errMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errMessage || 'Failed to process air quality data' },
      { status: 500 }
    );
  }
}
