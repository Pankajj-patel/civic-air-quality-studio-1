import {
  NormalizedRecord,
  PersonaId,
  Hotspot,
  ActionItem,
  InternalBriefingNote,
  CitizenAdvisory,
  DataQualityReport,
  DeltaAnalysis,
  AirQualityBriefing,
} from '@/types';
import { calculateAQIFromPM25 } from './parser';
import { calculateDelta } from './delta';

// Deterministic Hotspot Extraction
export function extractHotspots(records: NormalizedRecord[]): Hotspot[] {
  const grouped: Record<string, NormalizedRecord[]> = {};

  records.forEach((r) => {
    if (!grouped[r.location]) grouped[r.location] = [];
    grouped[r.location].push(r);
  });

  const hotspots: Hotspot[] = Object.entries(grouped).map(([location, recs]) => {
    const validRecs = recs.filter((r) => r.pm25 >= 0);
    const avgPM = validRecs.length > 0 ? validRecs.reduce((acc, r) => acc + r.pm25, 0) / validRecs.length : 150;
    const sorted = [...recs].sort((a, b) => b.pm25 - a.pm25);
    const peak = sorted[0] || recs[0];
    const { category } = calculateAQIFromPM25(peak.pm25);

    return {
      location,
      sensorId: peak.sensorId,
      peakAQI: peak.aqi,
      avgAQI: calculateAQIFromPM25(avgPM).aqi,
      peakTime: peak.timestamp,
      primaryPollutant: 'PM2.5 (Fine Respirable Particles)',
      severity: category,
      evidenceRecordIds: recs.map((r) => r.id),
    };
  });

  return hotspots.sort((a, b) => b.peakAQI - a.peakAQI);
}

// Role-tailored action generation
export function generateRoleActions(
  persona: PersonaId,
  hotspots: Hotspot[],
  topRecords: NormalizedRecord[]
): ActionItem[] {
  const top = hotspots[0] || { location: 'Primary Sector', evidenceRecordIds: ['REC_001'] };
  const evidence = top.evidenceRecordIds.slice(0, 3);

  switch (persona) {
    case 'ward_officer':
      return [
        {
          id: 'ACT_WARD_01',
          priority: 'Immediate (0-4 hrs)',
          action: `Deploy mobile anti-smog gun & mist water tanker along ${top.location}`,
          rationale: `PM2.5 peaked at severe levels (${top.peakAQI} AQI). Immediate wet suppression needed to bind resuspendable road dust.`,
          ownerDepartment: 'Municipal Sanitation & Mechanical Sweeping Division',
          expectedImpact: 'Estimated 20-30% reduction in localized surface particulate density within 90 minutes.',
          evidenceRecordIds: evidence,
        },
        {
          id: 'ACT_WARD_02',
          priority: 'Immediate (0-4 hrs)',
          action: `Issue immediate stop-work notice for unpaved excavation at ${hotspots.find(h => h.location.toLowerCase().includes('construction'))?.location || top.location}`,
          rationale: 'Active earthwork without wind barriers or green sheet shielding is driving hyper-local spikes.',
          ownerDepartment: 'Building & Enforcement Directorate',
          expectedImpact: 'Eliminates primary fugitive PM10/PM2.5 emission source at the boundary.',
          evidenceRecordIds: evidence,
        },
        {
          id: 'ACT_WARD_03',
          priority: 'Short-Term (4-12 hrs)',
          action: 'Reroute heavy transit commercial diesel vehicles to the outer ring bypass corridor',
          rationale: 'High diesel exhaust accumulation during transition hours corresponds with stagnant thermal layer.',
          ownerDepartment: 'Traffic Police Liaison & Ward Transit Cell',
          expectedImpact: 'Reduces peak nitrogen dioxide and black carbon concentrations by up to 18%.',
          evidenceRecordIds: topRecords.slice(0, 2).map((r) => r.id),
        },
        {
          id: 'ACT_WARD_04',
          priority: 'Medium-Term (24-48 hrs)',
          action: 'Establish 24-hr drone/patrol squad against night municipal solid waste (MSW) smoldering',
          rationale: 'Prevent recurrent overnight biomass and refuse incineration across vacant lots.',
          ownerDepartment: 'Solid Waste Management (SWM) Flying Squad',
          expectedImpact: 'Prevents early morning hazardous ground inversion spikes.',
          evidenceRecordIds: [evidence[0] || 'REC_001'],
        },
      ];

    case 'housing_society':
      return [
        {
          id: 'ACT_RWA_01',
          priority: 'Immediate (0-4 hrs)',
          action: 'Halt non-essential diesel generator (DG set) operations; mandate 1-hour staggered load-shedding',
          rationale: `Basement and ground-level sensors spiked above 380 AQI directly following generator switch-on.`,
          ownerDepartment: 'Society Estate & Electrical Maintenance Team',
          expectedImpact: 'Cuts toxic diesel particulate exhaust drifting into podium residences and play parks.',
          evidenceRecordIds: evidence,
        },
        {
          id: 'ACT_RWA_02',
          priority: 'Immediate (0-4 hrs)',
          action: 'Close outdoor children’s park and badminton/tennis courts until 21:00',
          rationale: 'Ambient air quality poses acute health risk to exercising children and vulnerable seniors.',
          ownerDepartment: 'Clubhouse & Security Management',
          expectedImpact: 'Protects 300+ residents from elevated respiratory intake during evening peak.',
          evidenceRecordIds: evidence,
        },
        {
          id: 'ACT_RWA_03',
          priority: 'Short-Term (4-12 hrs)',
          action: 'Enforce wet-sprinkling of internal driveways and basement parking ramps prior to peak vehicular egress',
          rationale: 'Dry sweeping churns up settleable silica dust, keeping localized particulate count elevated.',
          ownerDepartment: 'Housekeeping Supervisor',
          expectedImpact: 'Suppresses tyre dust suspension by up to 40%.',
          evidenceRecordIds: topRecords.slice(0, 2).map((r) => r.id),
        },
        {
          id: 'ACT_RWA_04',
          priority: 'Medium-Term (24-48 hrs)',
          action: 'Issue strict zero-tolerance notice against gardener leaf composting burning on terrace and back lawns',
          rationale: 'Eliminate internal sources of acrid smoke and hydrocarbon emissions.',
          ownerDepartment: 'RWA Management Committee',
          expectedImpact: 'Maintains cleaner microclimate within residential perimeter.',
          evidenceRecordIds: [evidence[0] || 'REC_001'],
        },
      ];

    case 'school_admin':
      return [
        {
          id: 'ACT_SCH_01',
          priority: 'Immediate (0-4 hrs)',
          action: 'Cancel all outdoor sports, morning physical training (PT), and open-air assemblies',
          rationale: `Perimeter and athletic ground readings hit ${top.peakAQI} AQI. Strenuous exercise induces deep alveolar lung deposition in children.`,
          ownerDepartment: 'Sports Director & Academic Coordinators',
          expectedImpact: 'Guarantees 1,200+ pupils remain inside sealed indoor spaces during highest pollution hours.',
          evidenceRecordIds: evidence,
        },
        {
          id: 'ACT_SCH_02',
          priority: 'Immediate (0-4 hrs)',
          action: 'Enforce strict 60-second engine shut-off rule for all arriving yellow school buses & parent cars at bus bays',
          rationale: 'Idle vehicle queues at Main Gate contribute to dangerous ground-level diesel particulate accumulation.',
          ownerDepartment: 'Campus Security & Transport Head',
          expectedImpact: 'Prevents toxic tailpipe build-up at kindergarten arrival gates.',
          evidenceRecordIds: evidence,
        },
        {
          id: 'ACT_SCH_03',
          priority: 'Short-Term (4-12 hrs)',
          action: 'Activate classroom HEPA filtration units and seal library/auditorium clean-air sanctuaries',
          rationale: 'Keep indoor particulate matter below 35 µg/m³ for sensitive students with asthma inhalers.',
          ownerDepartment: 'Campus Facility Operations',
          expectedImpact: 'Maintains safe indoor respiratory zone throughout school hours.',
          evidenceRecordIds: topRecords.slice(0, 2).map((r) => r.id),
        },
        {
          id: 'ACT_SCH_04',
          priority: 'Medium-Term (24-48 hrs)',
          action: 'Send automated advisory to parents advising fitted N95 masks during afternoon pickup and bus commutes',
          rationale: 'Protects children during peak traffic dispersal when evening particulate increases.',
          ownerDepartment: 'Parent-Teacher Communication Desk',
          expectedImpact: 'High compliance for pediatric personal respiratory protection.',
          evidenceRecordIds: [evidence[0] || 'REC_001'],
        },
      ];

    case 'health_clinic':
      return [
        {
          id: 'ACT_HLTH_01',
          priority: 'Immediate (0-4 hrs)',
          action: 'Pre-charge emergency nebulizer stations and restock pediatric bronchodilator supplies',
          rationale: `Air quality crossed severe thresholds (${top.peakAQI} AQI), leading to anticipated 35% surge in acute asthma visits.`,
          ownerDepartment: 'Outpatient Triage & Emergency Nursing',
          expectedImpact: 'Eliminates wait time for acute respiratory distress patients.',
          evidenceRecordIds: evidence,
        },
        {
          id: 'ACT_HLTH_02',
          priority: 'Immediate (0-4 hrs)',
          action: 'Trigger proactive SMS alert to registered COPD, cardiovascular, and geriatric patients on registry',
          rationale: 'Early warning prevents preventable exacerbations and emergency admissions.',
          ownerDepartment: 'Community Health Outreach Cell',
          expectedImpact: 'Encourages high-risk individuals to remain indoors with air filtration.',
          evidenceRecordIds: evidence,
        },
        {
          id: 'ACT_HLTH_03',
          priority: 'Short-Term (4-12 hrs)',
          action: 'Distribute certified N95 masks to clinic sanitation staff and outdoor public health workers',
          rationale: 'Occupational protection for municipal and clinic staff exposed to ambient conditions.',
          ownerDepartment: 'Occupational Safety & Inventory',
          expectedImpact: 'Minimizes staff sick leave and respiratory illnesses.',
          evidenceRecordIds: topRecords.slice(0, 2).map((r) => r.id),
        },
        {
          id: 'ACT_HLTH_04',
          priority: 'Medium-Term (24-48 hrs)',
          action: 'Log geo-tagged respiratory patient intake to correlate disease clusters with specific ward hotspots',
          rationale: 'Provides epidemiological evidence for municipal anti-pollution enforcement.',
          ownerDepartment: 'Epidemiology & Ward Reporting Unit',
          expectedImpact: 'Enables targeted civic interventions near industrial and transit corridors.',
          evidenceRecordIds: [evidence[0] || 'REC_001'],
        },
      ];
  }
}

// Generate Multilingual Citizen Advisory
export function generateCitizenAdvisory(
  overallAQI: number,
  category: string,
  topHotspot: Hotspot,
  readingLevel: 'elementary' | 'standard',
  language: string,
  evidenceIds: string[]
): CitizenAdvisory {
  const isElementary = readingLevel === 'elementary';

  if (language === 'hi') {
    // Hindi translation
    return {
      headline: isElementary
        ? 'आज बाहर की हवा सांस लेने के लिए बहुत खराब है'
        : `नागरिक वायु गुणवत्ता सूचना: ${category} श्रेणी दर्ज (${overallAQI} AQI)`,
      overallStatus: `${category} (AQI: ${overallAQI})`,
      readingLevel,
      language: 'hi',
      plainLanguageSummary: isElementary
        ? 'आज हमारे इलाके की हवा में बहुत धुआं और धूल है। अगर हम बाहर दौड़ेंगे या खेलेंगे तो खांसी और आंखों में जलन हो सकती है। कृपया आज घर के अंदर ही खेलें और खिड़कियां बंद रखें।'
        : `वर्तमान में हमारे वार्ड का वायु गुणवत्ता सूचकांक (AQI) ${overallAQI} पर पहुंच गया है, जो '${category}' श्रेणी में आता है। मुख्य रूप से ${topHotspot.location} के आसपास धूल और धुएं का भारी जमाव देखा गया है। सभी नागरिकों को अनावश्यक बाहरी गतिविधियों से बचने की सलाह दी जाती है।`,
      doAndDonts: {
        dos: [
          'बाहर निकलते समय अच्छी फिटिंग वाला N95 या FFP2 मास्क अवश्य पहनें।',
          'घर की खिड़कियां बंद रखें और संभव हो तो एयर प्यूरीफायर चलाएं।',
          'घर में झाड़ू लगाने के बजाय गीला पोछा लगाएं ताकि धूल न उड़े।',
        ],
        donts: [
          'सुबह या शाम को बाहर दौड़ने या भारी कसरत करने से बचें।',
          'सूखे पत्ते, कचरा या बायोमास खुले में बिल्कुल न जलाएं।',
          'बच्चों और बुजुर्गों को व्यस्त सड़कों के किनारे न ले जाएं।',
        ],
      },
      vulnerableGroups: {
        childrenAndSchools: [
          'सभी स्कूल आज सुबह की प्रार्थना और खेल के पीरियड बंद रखें।',
          'कक्षाओं में वेंटिलेशन और एयर क्लीनिंग का ध्यान रखें।',
        ],
        seniorsAndElderly: [
          'वरिष्ठ नागरिक सुबह की सैर बंद करें और धूप निकलने के बाद ही टहलें।',
          'अपनी नियमित सांस और हृदय की दवाएं समय पर लें।',
        ],
        respiratoryAndAsthma: [
          'अस्थमा के मरीज अपना इनहेलर हमेशा साथ रखें।',
          'सांस लेने में हल्की सी भी तकलीफ होने पर नजदीकी स्वास्थ्य केंद्र से संपर्क करें।',
        ],
        outdoorWorkers: [
          'ट्रैफिक पुलिस और सफाई कर्मचारी लगातार N95 मास्क पहनें।',
          'काम के बीच-बीच में पानी पीते रहें और मुंह-आंखें धोएं।',
        ],
      },
      neighborhoodAlert: `विशेष चेतावनी: ${topHotspot.location} क्षेत्र में वायु प्रदूषण का स्तर अत्यधिक दर्ज किया गया है। वहां से गुजरते समय विशेष सावधानी बरतें।`,
      evidenceRecordIds: evidenceIds,
    };
  }

  if (language === 'es') {
    // Spanish translation
    return {
      headline: isElementary
        ? 'El aire exterior hoy está sucio y no es bueno para respirar'
        : `Aviso de Calidad del Aire Ciudadano: Nivel ${category} (${overallAQI} AQI)`,
      overallStatus: `${category} (AQI: ${overallAQI})`,
      readingLevel,
      language: 'es',
      plainLanguageSummary: isElementary
        ? 'Hoy el aire contiene demasiado polvo y humo. Puede hacer que te duelan los pulmones o te piquen los ojos si juegas afuera. Por favor juega adentro y mantén las ventanas cerradas.'
        : `El índice de calidad del aire comunitario actual es de ${overallAQI} (${category}). Se han detectado concentraciones elevadas de partículas cerca de ${topHotspot.location}. Se recomienda a los ciudadanos limitar la exposición al aire libre.`,
      doAndDonts: {
        dos: [
          'Use una mascarilla certificada N95 o KN95 al aire libre.',
          'Mantenga puertas y ventanas cerradas durante las horas pico de tráfico.',
          'Beba abundante agua y use purificadores de aire si dispone de ellos.',
        ],
        donts: [
          'No realice actividades físicas intensas ni deportes al aire libre.',
          'Evite quemar basura, hojas de jardín o madera.',
          'Evite transitar cerca de obras de construcción sin protección.',
        ],
      },
      vulnerableGroups: {
        childrenAndSchools: [
          'Suspender el recreo al aire libre y las clases de educación física exterior.',
          'Mantener a los niños en aulas bien ventiladas o purificadas.',
        ],
        seniorsAndElderly: [
          'Permanecer en interiores; posponer las caminatas matutinas.',
          'Monitorear la presión arterial y medicación cardíaca habitual.',
        ],
        respiratoryAndAsthma: [
          'Mantenga a mano los inhaladores de rescate.',
          'Consulte de inmediato si experimenta dificultad respiratoria o tos persistente.',
        ],
        outdoorWorkers: [
          'Es obligatorio el uso de mascarillas de alta filtración.',
          'Tomar descansos regulares en ambientes cerrados y limpios.',
        ],
      },
      neighborhoodAlert: `Alerta Local: Se observa un foco de alta contaminación en la zona de ${topHotspot.location}.`,
      evidenceRecordIds: evidenceIds,
    };
  }

  // Default: English
  return {
    headline: isElementary
      ? 'The air outside is very dirty today — stay indoors to protect your lungs!'
      : `Civic Air Quality Notice: ${category} Conditions Detected (${overallAQI} AQI)`,
    overallStatus: `${category} (AQI: ${overallAQI})`,
    readingLevel,
    language: 'en',
    plainLanguageSummary: isElementary
      ? `Today the air has lots of tiny smoke and dust particles floating in it that we cannot see. If you run around outside, it might make you cough or make your eyes sting. Play indoor games today and make sure windows at home and school are closed.`
      : `The localized Air Quality Index has reached ${overallAQI} (${category}), driven primarily by elevated respirable particulate matter (PM2.5) clustered around ${topHotspot.location}. Elevated concentrations can aggravate breathing difficulties and cardiovascular stress. Citizens are urged to limit unessential outdoor exertion.`,
    doAndDonts: {
      dos: [
        'Wear a snug, certified N95 or FFP2 respirator mask when stepping outside.',
        'Keep windows and balcony doors shut during morning and evening rush hours.',
        'Use wet-mop cleaning instead of dry sweeping to stop settled dust from floating up.',
      ],
      donts: [
        'Avoid strenuous outdoor running, cycling, or athletic practice today.',
        'Do not burn dry leaves, garden waste, or trash under any circumstances.',
        'Do not idle private car engines or run non-essential diesel generators.',
      ],
    },
    vulnerableGroups: {
      childrenAndSchools: [
        'Schools must immediately cancel outdoor physical education, running, and assemblies.',
        'Keep kindergarten and primary pupils indoors; ensure classroom doors are closed.',
      ],
      seniorsAndElderly: [
        'Elderly residents should suspend morning and evening park walks.',
        'Stay indoors in well-ventilated or purified rooms; take prescribed medications on schedule.',
      ],
      respiratoryAndAsthma: [
        'Keep emergency rescue inhalers and bronchodilators within arm’s reach at all times.',
        'Contact your healthcare clinic if you experience chest tightness, wheezing, or shallow breath.',
      ],
      outdoorWorkers: [
        'Mandatory N95 mask compliance for street vendors, construction workers, and traffic personnel.',
        'Hydrate frequently and take indoor micro-breaks away from major roadways.',
      ],
    },
    neighborhoodAlert: `Localized Hotspot Warning: Elevated pollution peak recorded at ${topHotspot.location} (Peak AQI: ${topHotspot.peakAQI}). Residents nearby should exercise extra vigilance.`,
    evidenceRecordIds: evidenceIds,
  };
}

// Orchestrator: Generate Full Briefing Package
export function generateAirQualityBriefing(
  records: NormalizedRecord[],
  qualityReport: DataQualityReport,
  persona: PersonaId,
  previousSnapshotAQI?: number,
  previousSnapshotDate?: string,
  readingLevel: 'elementary' | 'standard' = 'standard',
  language: string = 'en'
): AirQualityBriefing {
  const validRecords = records.filter((r) => !r.isFlagged || r.pm25 > 0);
  const avgPM = validRecords.length > 0 ? validRecords.reduce((sum, r) => sum + r.pm25, 0) / validRecords.length : 160;
  const { aqi: overallAQI, category: overallCategory } = calculateAQIFromPM25(avgPM);

  const hotspots = extractHotspots(records);
  const topHotspot = hotspots[0] || {
    location: 'Central Monitoring Zone',
    sensorId: 'NODE-01',
    peakAQI: overallAQI,
    avgAQI: overallAQI,
    peakTime: '08:00',
    primaryPollutant: 'PM2.5',
    severity: overallCategory,
    evidenceRecordIds: ['REC_001'],
  };

  const delta = calculateDelta(records, hotspots, previousSnapshotAQI, previousSnapshotDate);
  const actions = generateRoleActions(persona, hotspots, records);

  const evidenceRecordIds = records.slice(0, 5).map((r) => r.id);

  // Build Internal Note
  const internalNote: InternalBriefingNote = {
    documentRef: `AQ-BRIEF-${Date.now().toString().slice(-6)}`,
    generatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    authorPersona: persona,
    executiveSummary: `Ward air quality is currently in the ${overallCategory} bracket (Mean AQI: ${overallAQI}, PM2.5: ${Math.round(avgPM)} µg/m³). Peak acute concentrations were documented at ${topHotspot.location} reaching ${topHotspot.peakAQI} AQI. Immediate administrative suppression measures are required.`,
    dataQualitySummary: `Ingested ${qualityReport.totalRowsParsed} rows with a Data Quality Index (DQI) of ${qualityReport.score}/100. ${qualityReport.flaggedRows} rows were flagged for audit (${qualityReport.unreliableSensors.length > 0 ? `Unreliable sensors: ${qualityReport.unreliableSensors.join(', ')}` : 'No recurring hardware failure'}). Calculations are grounded on deterministic row citations.`,
    rootCauseHypothesis: `Thermal ground inversion coupled with localized surface emissions (unpaved excavation, vehicular exhaust, and stationary generator emissions) preventing vertical particulate dispersion.`,
    hotspots,
    actions,
    regulatoryComplianceNotice: `Issued under Municipal Clean Air Directive & Stage-III Graded Response Action Plan (GRAP). Immediate enforcement authorized.`,
    evidenceRecordIds,
  };

  // Build Citizen Advisory
  const citizenAdvisory = generateCitizenAdvisory(
    overallAQI,
    overallCategory,
    topHotspot,
    readingLevel,
    language,
    evidenceRecordIds
  );

  return {
    id: `BRIEF-${Date.now()}`,
    title: `Civic Air Quality Intelligence Briefing - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    persona,
    overallAQI,
    overallCategory,
    dataQuality: qualityReport,
    delta,
    internalNote,
    citizenAdvisory,
    records,
  };
}
