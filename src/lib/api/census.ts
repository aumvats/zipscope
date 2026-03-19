import type { CensusData, AgeGroup, EducationLevel } from '@/lib/types';

// 24-hour cache for Census API responses
const cache = new Map<string, { data: CensusData; cachedAt: number }>();
const CACHE_TTL = 86400000; // 24 hours

// Census ACS 5-Year variable codes
const VARIABLES = [
  'B01003_001E', // total population
  'B19013_001E', // median household income
  'B01001_002E', // male total
  'B01001_026E', // female total
  'B25077_001E', // median home value
  'B25064_001E', // median gross rent
  'B23025_004E', // employed
  'B23025_005E', // unemployed
  // Education: no diploma, HS diploma, some college, bachelor's+
  'B15003_001E', // total population 25+ (for calculating education percentages)
  'B15003_017E', // HS diploma
  'B15003_018E', // GED
  'B15003_019E', // some college < 1yr
  'B15003_020E', // some college 1+ yr
  'B15003_021E', // associate's
  'B15003_022E', // bachelor's
  'B15003_023E', // master's
  'B15003_024E', // professional degree
  'B15003_025E', // doctorate
  // Age groups (male: 003-025, female: 027-049)
  'B01001_003E', 'B01001_004E', 'B01001_005E', 'B01001_006E', 'B01001_007E',
  'B01001_008E', 'B01001_009E', 'B01001_010E', 'B01001_011E', 'B01001_012E',
  'B01001_013E', 'B01001_014E', 'B01001_015E', 'B01001_016E', 'B01001_017E',
  'B01001_018E', 'B01001_019E', 'B01001_020E', 'B01001_021E', 'B01001_022E',
  'B01001_023E', 'B01001_024E', 'B01001_025E',
  'B01001_027E', 'B01001_028E', 'B01001_029E', 'B01001_030E', 'B01001_031E',
  'B01001_032E', 'B01001_033E', 'B01001_034E', 'B01001_035E', 'B01001_036E',
  'B01001_037E', 'B01001_038E', 'B01001_039E', 'B01001_040E', 'B01001_041E',
  'B01001_042E', 'B01001_043E', 'B01001_044E', 'B01001_045E', 'B01001_046E',
  'B01001_047E', 'B01001_048E', 'B01001_049E',
];

function num(val: string | null | undefined): number {
  const n = Number(val);
  return isNaN(n) || n < 0 ? 0 : n;
}

function buildAgeGroups(vars: Record<string, string>): AgeGroup[] {
  // Male age vars: B01001_003E (Under 5) through B01001_025E (85+)
  // Female age vars: B01001_027E (Under 5) through B01001_049E (85+)
  const maleKeys = Array.from({ length: 23 }, (_, i) => `B01001_${String(i + 3).padStart(3, '0')}E`);
  const femaleKeys = Array.from({ length: 23 }, (_, i) => `B01001_${String(i + 27).padStart(3, '0')}E`);

  // Consolidate into broader groups for display
  // Male and female use the same index offsets within their respective key arrays
  const groupDefs: { label: string; indices: number[] }[] = [
    { label: 'Under 18', indices: [0, 1, 2, 3] },
    { label: '18–24', indices: [4, 5, 6, 7] },
    { label: '25–34', indices: [8, 9] },
    { label: '35–44', indices: [10, 11] },
    { label: '45–54', indices: [12, 13] },
    { label: '55–64', indices: [14, 15, 16] },
    { label: '65–74', indices: [17, 18, 19] },
    { label: '75+', indices: [20, 21, 22] },
  ];

  return groupDefs.map(g => {
    const maleSum = g.indices.reduce((s, i) => s + num(vars[maleKeys[i]]), 0);
    const femaleSum = g.indices.reduce((s, i) => s + num(vars[femaleKeys[i]]), 0);
    return { label: g.label, value: maleSum + femaleSum };
  });
}

function buildEducationLevels(vars: Record<string, string>): EducationLevel[] {
  const total25Plus = num(vars['B15003_001E']);
  if (total25Plus === 0) {
    return [
      { label: 'No diploma', value: 0 },
      { label: 'High school', value: 0 },
      { label: 'Some college', value: 0 },
      { label: "Bachelor's+", value: 0 },
    ];
  }
  const hsDiploma = num(vars['B15003_017E']) + num(vars['B15003_018E']);
  const someCollege = num(vars['B15003_019E']) + num(vars['B15003_020E']) + num(vars['B15003_021E']);
  const bachelorsPlus = num(vars['B15003_022E']) + num(vars['B15003_023E']) + num(vars['B15003_024E']) + num(vars['B15003_025E']);
  const noDiploma = total25Plus - hsDiploma - someCollege - bachelorsPlus;

  return [
    { label: 'No diploma', value: Math.round((Math.max(0, noDiploma) / total25Plus) * 100) },
    { label: 'High school', value: Math.round((hsDiploma / total25Plus) * 100) },
    { label: 'Some college', value: Math.round((someCollege / total25Plus) * 100) },
    { label: "Bachelor's+", value: Math.round((bachelorsPlus / total25Plus) * 100) },
  ];
}

export async function fetchCensusData(zip: string): Promise<CensusData> {
  const cached = cache.get(zip);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return cached.data;
  }

  const apiKey = process.env.CENSUS_API_KEY;
  if (!apiKey) {
    throw new Error('CENSUS_API_KEY not configured');
  }

  const url = `https://api.census.gov/data/2022/acs/acs5?get=${VARIABLES.join(',')}&for=zip+code+tabulation+area:${zip}&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Census API error: ${res.status}`);
  }

  const json = await res.json();
  if (!json || json.length < 2) {
    throw new Error('No data found for this ZIP code');
  }

  const headers: string[] = json[0];
  const values: string[] = json[1];
  const vars: Record<string, string> = {};
  headers.forEach((h, i) => { vars[h] = values[i]; });

  const employed = num(vars['B23025_004E']);
  const unemployed = num(vars['B23025_005E']);
  const laborForce = employed + unemployed;

  const data: CensusData = {
    totalPopulation: num(vars['B01003_001E']),
    medianHouseholdIncome: num(vars['B19013_001E']),
    maleTotal: num(vars['B01001_002E']),
    femaleTotal: num(vars['B01001_026E']),
    ageGroups: buildAgeGroups(vars),
    educationLevels: buildEducationLevels(vars),
    medianHomeValue: num(vars['B25077_001E']),
    medianRent: num(vars['B25064_001E']),
    employed,
    unemployed,
    employmentRate: laborForce > 0 ? Math.round((employed / laborForce) * 1000) / 10 : 0,
  };

  cache.set(zip, { data, cachedAt: Date.now() });
  return data;
}
