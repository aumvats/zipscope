export interface ZipInfo {
  zip: string;
  city: string | null;
  state: string | null;
  stateFull: string | null;
  lat: number | null;
  lng: number | null;
}

export interface AgeGroup {
  label: string;
  value: number;
}

export interface EducationLevel {
  label: string;
  value: number;
}

export interface CensusData {
  totalPopulation: number;
  medianHouseholdIncome: number;
  maleTotal: number;
  femaleTotal: number;
  ageGroups: AgeGroup[];
  educationLevels: EducationLevel[];
  medianHomeValue: number;
  medianRent: number;
  employed: number;
  unemployed: number;
  employmentRate: number;
}

export interface Report {
  id: string;
  user_id: string;
  zip_code: string;
  city: string | null;
  state: string | null;
  data_snapshot: CensusData | ComparisonSnapshot;
  report_type: 'single' | 'comparison';
  created_at: string;
}

export interface ComparisonSnapshot {
  zip1: { zip: string; city: string | null; state: string | null; data: CensusData };
  zip2: { zip: string; city: string | null; state: string | null; data: CensusData };
}

export interface UsageRecord {
  count: number;
  limit: number;
  plan: 'free' | 'pro' | 'business';
}
