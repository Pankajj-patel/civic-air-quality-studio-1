import { PersonaConfig, PreloadedDataset } from '@/types';

export const PERSONAS: Record<string, PersonaConfig> = {
  ward_officer: {
    id: 'ward_officer',
    title: 'Ward Officer / Civic Authority',
    subtitle: 'Municipal enforcement, street management, dust suppression & public works',
    iconName: 'Landmark',
    badge: 'Municipal Authority',
    focusArea: 'Traffic diversion, anti-smog guns, construction dust bans, waste burning enforcement',
    primaryActionTypes: ['Enforcement', 'Infrastructure', 'Traffic Diversion', 'Sanitation'],
  },
  housing_society: {
    id: 'housing_society',
    title: 'Housing Society / RWA Board',
    subtitle: 'Gated community operations, residential health & localized emissions',
    iconName: 'Building2',
    badge: 'Resident Welfare Association',
    focusArea: 'Diesel generator runtime limits, driveway wet-sweeping, indoor air advisories, green waste ban',
    primaryActionTypes: ['DG Set Restriction', 'Wet Sweeping', 'Basement Ventilation', 'Resident Advisory'],
  },
  school_admin: {
    id: 'school_admin',
    title: 'School Principal & Administration',
    subtitle: 'Child safety, campus ventilation, outdoor sports & morning arrivals',
    iconName: 'School',
    badge: 'Educational Institution',
    focusArea: 'Indoor PE relocation, morning assembly suspension, bus bay idling rules, classroom filtration',
    primaryActionTypes: ['Schedule Adjustment', 'Indoor Sports', 'Pediatric Protection', 'Parent Alerts'],
  },
  health_clinic: {
    id: 'health_clinic',
    title: 'Community Health Officer',
    subtitle: 'Triage readiness, vulnerable patient outreach & clinical air warnings',
    iconName: 'Activity',
    badge: 'Public Health Clinic',
    focusArea: 'Nebulizer supplies, high-risk patient proactive calls, N95 distribution alerts',
    primaryActionTypes: ['Triage Readiness', 'Patient Outreach', 'Protective Masking', 'Emergency Triage'],
  },
};

export const PRELOADED_DATASETS: PreloadedDataset[] = [
  {
    id: 'ward_12_corridor',
    name: 'Ward 12 Municipal Corridor - Morning Thermal Inversion',
    tag: 'Civic Authority / High Hotspots',
    personaRecommended: 'ward_officer',
    previousSnapshotAQI: 235,
    previousSnapshotDate: 'Yesterday 18:00',
    description: 'Messy municipal sensor table with missing timestamps, mixed column headers ("PM 2.5", "ug/m3"), and a stuck sensor at Ring Road Junction.',
    rawText: `Location,Time_Stamp,PM 2.5 (ug/m3),PM10,Sensor_ID,Status
Ring Road Flyover,06:00,185,290,SEN-W12-01,ONLINE
Metro Gate 4,06:15,210,310,SEN-W12-02,ONLINE
Construction Zone 3,06:30,345,520,SEN-W12-03,HIGH_DUST
Civil Hospital Chowk,07:00,195,280,SEN-W12-04,ONLINE
Ring Road Flyover,07:30,285,410,SEN-W12-01,ONLINE
Metro Gate 4,07:45,295,430,SEN-W12-02,ONLINE
Construction Zone 3,08:00,390,580,SEN-W12-03,ALERT
Civil Hospital Chowk,,220,310,SEN-W12-04,ONLINE
Industrial Drain Corner,08:30,-999,440,SEN-W12-05,ERROR_SENSOR
Ring Road Flyover,09:00,285,410,SEN-W12-01,STUCK_SUSPECT
Metro Gate 4,09:15,310,460,SEN-W12-02,ONLINE
Construction Zone 3,09:30,425,640,SEN-W12-03,UNCONTROLLED_EXCAVATION
Civil Hospital Chowk,10:00,240,350,SEN-W12-04,ONLINE
Industrial Drain Corner,10:15,315,480,SEN-W12-05,RECOVERED
Bus Depot Terminal,10:30,360,510,SEN-W12-06,DIESEL_IDLING`,
  },
  {
    id: 'greenwood_rwa',
    name: 'Greenwood Heights RWA - Evening Grid Outage & DG Set Run',
    tag: 'Housing Society / Residential',
    personaRecommended: 'housing_society',
    previousSnapshotAQI: 160,
    previousSnapshotDate: 'Yesterday 20:00',
    description: 'Residential micro-sensors showing basement generator exhaust spikes, unpaved driveway dust, and terrace garden biomass burning.',
    rawText: `Zone | Time | PM2.5_ugm3 | Temperature_C | SensorNode | Notes
Basement Parking Tower A | 17:30 | 145 | 28.5 | RWA-NODE-01 | Normal power
Children Play Park | 17:45 | 115 | 29.0 | RWA-NODE-02 | Evening activity
Main Gate Driveway | 18:00 | 190 | 28.2 | RWA-NODE-03 | Peak vehicle entry
Clubhouse Outdoor Pool | 18:15 | 120 | 28.0 | RWA-NODE-04 | Clean
Basement Parking Tower A | 18:30 | 385 | 31.0 | RWA-NODE-01 | DG Set 1 & 2 Turned ON
Children Play Park | 18:45 | 245 | 27.8 | RWA-NODE-02 | Smoke drift reported
Main Gate Driveway | 19:00 | 230 | 27.5 | RWA-NODE-03 | Wet sweeping missed
Clubhouse Outdoor Pool | 19:15 | 180 | 27.0 | RWA-NODE-04 | Odor detected
Landscape Garden East | 19:30 | 320 | 26.5 | RWA-NODE-05 | Leaf composting smoke
Basement Parking Tower A | 20:00 | 410 | 32.5 | RWA-NODE-01 | Diesel exhaust accumulating
Children Play Park | 20:15 | 260 | 26.0 | RWA-NODE-02 | Outdoor court occupied`,
  },
  {
    id: 'school_campus_metro',
    name: 'St. Jude School Cluster - Morning Arrival & Dust Ingress',
    tag: 'School & Pediatric Safety',
    personaRecommended: 'school_admin',
    previousSnapshotAQI: 185,
    previousSnapshotDate: 'Yesterday 08:30',
    description: 'School perimeter sensors showing bus queue emissions, unpaved sports ground dust, and classroom indoor air quality differences.',
    rawText: `Campus Area,Time,PM2.5,Unit,Sensor,Remark
Main Gate & Bus Bay,07:00,165,ug/m3,SCH-G1,Buses arriving
Kindergarten Courtyard,07:15,110,ug/m3,SCH-K1,Protected area
Athletic Ground (Unpaved),07:30,220,ug/m3,SCH-SP1,Morning running
Classroom Block A (Floor 1),07:45,95,ug/m3,SCH-C1,Windows open
Main Gate & Bus Bay,08:00,340,ug/m3,SCH-G1,Heavy parent idling + 28 diesel buses
Athletic Ground (Unpaved),08:15,310,ug/m3,SCH-SP1,PE period scheduled
Kindergarten Courtyard,08:30,195,ug/m3,SCH-K1,Smoke drifting from gate
Classroom Block A (Floor 1),08:45,175,ug/m3,SCH-C1,Indoor accumulation
Senior Library (HEPA Area),09:00,45,ug/m3,SCH-LIB,Air purifier operating
Main Gate & Bus Bay,09:15,260,ug/m3,SCH-G1,Traffic thinning`,
  },
];
